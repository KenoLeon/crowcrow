import { renderParameterList, updateParameterDisplay } from './ui/parameterPanel.js';
import { setupTractSliders, getZoneValuesFromSliders, s, setSlidersFromZones } from './ui/tractSliders.js';
import { drawTract } from './ui/tractViewer.js';
import { drawOscilloscope } from './ui/oscilloscope.js';
import { glottisParameterDescriptors, subglottalParameterDescriptors, tractParameterDescriptors } from './state/parameters.js';
import { fadeInGain, fadeOutGain } from './audio/audio-utils.js';
import { updateFrequency, updateTenseness, updateBreathCycleRate, updateEffort, setParameters } from './audio/parameterSetters.js';
import { PhonemeSequencer } from './audio/PhonemeSequencer.js';
import { phonemeMap } from './state/phonemeMap.js';
import {
  setNoiseParams,
  setNoiseFilterParams,
  setGlottalStop,
  setVoicedGating,
  setNasalOralControl,
  setLateralControl,
  setRhoticControl,
  setPlosiveBurst,
  setFricativeNoiseParams,
  getEffectiveGlideDuration
} from './ui/phonemeButtonHelpers.js';
import { articulatorsToZones } from './audio/articulatorMapper.js';
import { handleClickPhoneme, handleTapPhoneme, handleTrillPhoneme } from './ui/phonemeTypeHandlers.js';
import { wordPhonemeMap } from './state/wordPhonemeMap.js';


// --- Global State ---
let audioContext = null;
let noiseNode = null;
let subglottalNode = null;
let glottisNode = null;
let chestinessNode = null;
let tractNode = null;
let transientNode = null;
let nasalNode = null;
let analyserNode = null;
let isPlaying = false;
let gainNode = null;
let phonemeSequencer = null;
let masterGainNode = null;
let masterGainAnimationFrame = null;
let summingNode = null;
let currentIntensity = 1;
let noiseFilterNode = null;
let glideDuration = 0.04;
let clickNode = null;
let tapNode = null;
let trillNode = null;
let lastTractLeft = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
let lastTractRight = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
const ANALYSER_FFT_SIZE = 2048;
const noiseTypeMap = { white: 0, pink: 1, simplex: 2 };

function getTractLength() {
  const slider = document.getElementById('tractLengthSlider');
  return slider ? parseFloat(slider.value) || 1.0 : 1.0;
}



// --- Synth Initialization ---
async function startSynth() {
  if (isPlaying) return;
  audioContext = new AudioContext();

  // Load processors
  await audioContext.audioWorklet.addModule('/audio/processors/NoiseProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/SubglottalProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/GlottisProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/TransientProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/ChestinessProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/TractProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/NasalProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/SummingProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/ClickProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/TapProcessor.js');
  await audioContext.audioWorklet.addModule('/audio/processors/TrillProcessor.js');


  // Create nodes
  subglottalNode = new AudioWorkletNode(audioContext, 'subglottal-processor', { outputChannelCount: [2] });
  noiseNode = new AudioWorkletNode(audioContext, 'noise-processor');
  glottisNode = new AudioWorkletNode(audioContext, 'glottis-processor', { numberOfInputs: 2 });
  transientNode = new AudioWorkletNode(audioContext, 'transient-processor', { numberOfInputs: 2 });
  chestinessNode = new AudioWorkletNode(audioContext, 'chestiness-processor');
  tractNode = new AudioWorkletNode(audioContext, 'tract-processor', { numberOfInputs: 2 });
  clickNode = new AudioWorkletNode(audioContext, 'click-processor');
  tapNode = new AudioWorkletNode(audioContext, 'tap-processor');
  trillNode = new AudioWorkletNode(audioContext, 'trill-processor');
  noiseFilterNode = audioContext.createBiquadFilter();
  nasalNode = new AudioWorkletNode(audioContext, 'nasal-processor');
  summingNode = new AudioWorkletNode(audioContext, 'summing-processor', { numberOfInputs: 5, numberOfOutputs: 1 });
  gainNode = audioContext.createGain();
  masterGainNode = audioContext.createGain();
  masterGainNode.gain.value = 1;
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = ANALYSER_FFT_SIZE;

  console.log('AudioWorklet modules loaded & nodes created');


  /**
   * Audio Graph Topology:
   *
   *   [subglottalNode]
   *         │
   *   [noiseNode]─────┐
   *         │         │
   *     [glottisNode] │
   *         │         │
   *   [chestinessNode]│
   *         │         │
   *   [transientNode] │
   *       │     │     │
   *       │     └─────────────┐
   *       │                   │
   *   [tractNode]         [nasalNode]
   *       │                   │
   *       └─────┬─────┬───────┘
   *             │     │
   *      [clickNode]  │
   *      [tapNode]    │
   *      [trillNode]  │
   *             │     │
   *         [summingNode]
   *               │
   *           [gainNode]
   *               │
   *       [masterGainNode]
   *               │
   *         [analyserNode]
   *               │
   *   [audioContext.destination]
   *
   * - subglottalNode: Simulates subglottal pressure.
   * - noiseNode: Generates noise for fricatives, aspiration, etc.
   * - glottisNode: Simulates vocal fold vibration and voicing.
   * - chestinessNode: Adds chest resonance.
   * - transientNode: Handles plosive bursts and transients.
   * - tractNode: Main vocal tract filter (8 zones, 44 segments).
   * - nasalNode: Simulates nasal tract coupling.
   * - clickNode/tapNode/trillNode: Special consonant bursts.
   * - summingNode: Sums oral, nasal, click, tap, trill outputs.
   * - gainNode/masterGainNode: Output gain control.
   * - analyserNode: For oscilloscope/visualization.
   */

  // Audio graph connections
  subglottalNode.connect(glottisNode);
  noiseNode.connect(glottisNode, 0, 1);
  glottisNode.connect(chestinessNode);
  chestinessNode.connect(transientNode);
  noiseNode.connect(transientNode, 0, 1);
  transientNode.connect(tractNode);
  transientNode.connect(nasalNode);
  noiseNode.connect(noiseFilterNode);
  noiseFilterNode.connect(tractNode, 0, 1);
  tractNode.connect(summingNode, 0, 0);
  nasalNode.connect(summingNode, 0, 1);
  clickNode.connect(summingNode, 0, 2);
  tapNode.connect(summingNode, 0, 3);
  trillNode.connect(summingNode, 0, 4);
  summingNode.connect(gainNode);
  gainNode.connect(masterGainNode);
  masterGainNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);

  // Fade in for smooth start
  fadeInGain(masterGainNode, audioContext, 0.05);

  // Set up initial chestiness node parameters
  chestinessNode.parameters.get('chestiness').setValueAtTime(
    parseFloat(document.getElementById('chestinessSlider').value), audioContext.currentTime
  );// Set up analyser node

  // Set initial Glottis parameters
  glottisParameterDescriptors.forEach(desc => {
    let value = desc.defaultValue;
    if (desc.name === 'frequency') {
      value = parseFloat(document.getElementById('frequencySlider').value);
    }
    glottisNode.parameters.get(desc.name).setValueAtTime(value, audioContext.currentTime);
  });

  // Set initial Subglottal parameters
  subglottalParameterDescriptors.forEach(desc => {
    let value = desc.defaultValue;
    if (desc.name === 'breathCycleRate') {
      value = parseFloat(document.getElementById('breathCycleRateSlider').value);
    }
    if (desc.name === 'effort') {
      value = parseFloat(document.getElementById('effortSlider').value);
    }
    subglottalNode.parameters.get(desc.name).setValueAtTime(value, audioContext.currentTime);
  });

  // Receive control signals from SubglottalProcessor
  subglottalNode.port.onmessage = (event) => {
    const { intensity, loudness } = event.data;
    currentIntensity = intensity;
    if (glottisNode && audioContext && audioContext.state === 'running') {
      glottisNode.parameters.get('intensity').setValueAtTime(intensity, audioContext.currentTime);
      glottisNode.parameters.get('loudness').setValueAtTime(loudness, audioContext.currentTime);
    }
  };

  // Start oscilloscope
  const canvas = document.getElementById('oscilloscope');
  drawOscilloscope(analyserNode, canvas);

  await audioContext.resume();
  document.getElementById('startButton').textContent = 'Stop Synth';
  isPlaying = true;

  // Set up tract sliders (after tractNode is ready)
  setupTractSliders(tractNode, audioContext, tractSliders);

  // Set up phoneme sequencer
  const setAllParameters = (params) => setParameters(
    params,
    glottisNode,
    subglottalNode,
    tractNode,
    tractSliders,
    audioContext,
    updateParameterDisplay,
    drawTract,
    getZoneValuesFromSliders,
    glideDuration
  );
  if (!phonemeSequencer) {
    phonemeSequencer = new PhonemeSequencer(setAllParameters);
  }
}

// --- Synth Teardown ---
async function stopSynth() {
  if (masterGainNode && audioContext) {
    await fadeOutGain(masterGainNode, audioContext, 0.3);
  }
  if (glottisNode) glottisNode.disconnect();
  if (subglottalNode) subglottalNode.disconnect();
  if (tractNode) tractNode.disconnect();
  if (gainNode) gainNode.disconnect();
  if (masterGainNode) masterGainNode.disconnect();
  if (audioContext) audioContext.close();

  gainNode = null;
  masterGainNode = null;
  glottisNode = null;
  subglottalNode = null;
  tractNode = null;
  audioContext = null;
  analyserNode = null;

  document.getElementById('startButton').textContent = 'Start Synth';
  isPlaying = false;
}

// Listener helpers ( see phonemeTypeHandlers.js for click, tap, trill handlers ) 


function handleRegularPhoneme(phoneme, id) {
  // 1. Compute tract zones (asymmetric or mono)
  let zones;
  if (phoneme.tractLeft && phoneme.tractRight) {
    // Visualize the average for tract viewer
    zones = phoneme.tractLeft.map((v, i) => (v + phoneme.tractRight[i]) / 2);
    // Set tract processor parameters



    if (phoneme.tractLeft && phoneme.tractRight && tractNode && tractNode.parameters) {
      const now = audioContext.currentTime;
      for (let i = 0; i < 8; i++) {
        const leftParam = tractNode.parameters.get(`tractLeft${i}`);
        const rightParam = tractNode.parameters.get(`tractRight${i}`);
        if (leftParam) {
          leftParam.cancelScheduledValues(now);
          leftParam.setValueAtTime(lastTractLeft[i], now); // start from previous
          leftParam.linearRampToValueAtTime(phoneme.tractLeft[i], now + glideDuration);
        }
        if (rightParam) {
          rightParam.cancelScheduledValues(now);
          rightParam.setValueAtTime(lastTractRight[i], now);
          rightParam.linearRampToValueAtTime(phoneme.tractRight[i], now + glideDuration);
        }
      }
      // Update for next phoneme
      lastTractLeft = phoneme.tractLeft.slice();
      lastTractRight = phoneme.tractRight.slice();
    }




  } else if (phoneme.articulators) {
    zones = articulatorsToZones(phoneme.articulators);
  } else if (phoneme.zones) {
    zones = phoneme.zones;
  } else {
    zones = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]; // fallback: neutral tract
  }

  // 2. Update tract visualization and UI
  drawTract(zones, getTractLength());
  updateParameterDisplay('zones', zones.join(', '));
  setSlidersFromZones(tractSliders, zones);
  zones.forEach((value, i) => updateParameterDisplay(`zone${i}`, value.toFixed(2)));

  // 3. Set all relevant parameters for synthesis
  setNoiseParams(phoneme, noiseNode, noiseTypeMap, audioContext);
  setNoiseFilterParams(phoneme, noiseFilterNode, audioContext);
  setGlottalStop(phoneme, glottisNode, audioContext);
  setVoicedGating(phoneme, glottisNode, audioContext, updateVoicedIndicator);
  setNasalOralControl(phoneme, nasalNode, tractNode, audioContext);
  setLateralControl(phoneme, tractNode, audioContext);
  setRhoticControl(phoneme, tractNode, audioContext);
  setPlosiveBurst(phoneme, transientNode);
  setFricativeNoiseParams(phoneme, tractNode, currentIntensity, audioContext);

  // 4. Glide duration and sequencer
  glideDuration = getEffectiveGlideDuration(phoneme, parseFloat(document.getElementById('glideSlider').value));
  console.log(`Setting glide duration for phoneme ${id} to ${glideDuration} seconds`);
  phonemeSequencer.triggerPhoneme(id);

  // 5. Gain gating and animation
  if (phoneme.duration) {
    gateMasterGain(phoneme.duration);
    animateMasterGainSlider(phoneme.duration);
  }
}



// --- UI Event Listeners ---
function setupEventListeners() {


  document.getElementById('glideSlider').addEventListener('input', (event) => {
    glideDuration = parseFloat(event.target.value);
    updateParameterDisplay('glideDuration', glideDuration);
    console.log(`Glide duration set to ${glideDuration} seconds`);
  });

  document.getElementById('startButton').addEventListener('click', () => {
    isPlaying ? stopSynth() : startSynth();
  });
  document.getElementById('frequencySlider').addEventListener('input', (event) => {
    updateFrequency(glottisNode, audioContext, event.target.value);
    updateParameterDisplay('frequency', event.target.value);
  });
  document.getElementById('tensenessSlider').addEventListener('input', (event) => {
    updateTenseness(glottisNode, audioContext, event.target.value);
    updateParameterDisplay('tenseness', event.target.value);
  });
  document.getElementById('breathCycleRateSlider').addEventListener('input', (event) => {
    updateBreathCycleRate(subglottalNode, audioContext, event.target.value);
    updateParameterDisplay('breathCycleRate', event.target.value);
  });
  document.getElementById('effortSlider').addEventListener('input', (event) => {
    updateEffort(subglottalNode, audioContext, event.target.value);
    updateParameterDisplay('effort', event.target.value);
  });
  document.getElementById('masterGainSlider').addEventListener('input', (event) => {
    const value = parseFloat(event.target.value);
    if (masterGainNode) masterGainNode.gain.value = value;
    updateParameterDisplay('masterGain', value);
  });

  document.getElementById('tractLengthSlider').addEventListener('input', (event) => {
    const value = parseFloat(event.target.value);
    // Update the tract processor node if available
    if (tractNode && tractNode.parameters && tractNode.parameters.get('tractLength')) {
      tractNode.parameters.get('tractLength').setValueAtTime(value, audioContext.currentTime);
      glottisNode.parameters.get('tractLength').setValueAtTime(value, audioContext.currentTime);
    }
    // Redraw tract with new length
    const zones = getZoneValuesFromSliders(tractSliders);
    drawTract(zones, value);

  });

  document.getElementById('chestinessSlider').addEventListener('input', (event) => {
    const value = 1 - parseFloat(event.target.value); // reversed
    if (chestinessNode && chestinessNode.parameters && chestinessNode.parameters.get('chestiness')) {
      chestinessNode.parameters.get('chestiness').setValueAtTime(value, audioContext.currentTime);
    }
    updateParameterDisplay('chestiness', value);
  });


  // --- Unified Phoneme Buttons Listener ---
  const allPhonemeIds = [
    // Vowels
    'a', 'i', 'u',
    // Plosives
    'p', 't', 'k', 'b', 'd', 'g',
    // Nasals
    'm', 'n', 'ng',
    // Approximants
    'l', 'ɹ', 'j', 'w',
    // Fricatives
    'f', 'v', 's', 'z', 'sh', 'zh', 'h', 'ɦ',
    // Specials
    'ʔ',
    // Affricates
    'tʃ', 'dʒ', 'ts', 'dz',
    // Laterals
    'ɬ', 'ɮ',
    // Clicks
    'ǀ', 'ǃ', 'ǂ', 'ǁ',
    // Taps
    'ɾ', 'ɽ', 'ɺ',
    // Trills
    'r', 'ʙ', 'ʀ'
  ];


  allPhonemeIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        if (!isPlaying || !audioContext || !phonemeSequencer) return;
        const phoneme = phonemeMap[id];
        if (!phoneme) {
          console.warn(`No phoneme found for id: ${id}`);
          return;
        }

        const context = {
          tractNode,
          audioContext,
          clickNode,
          tapNode,
          trillNode,
          gateMasterGain,
          animateMasterGainSlider,
          drawTract,
          getTractLength
        };

        switch (phoneme.type) {
          case "click":
            handleClickPhoneme(phoneme, id, context);
            break;
          case "tap":
            handleTapPhoneme(phoneme, id, context);
            break;
          case "trill":
            handleTrillPhoneme(phoneme, id, context);
            break;
          default:
            handleRegularPhoneme(phoneme, id);
        }
      });
    }
  });

}

// --- Tract Sliders Array ---
const tractSliders = [
  document.getElementById('tractSlider0'),
  document.getElementById('tractSlider1'),
  document.getElementById('tractSlider2'),
  document.getElementById('tractSlider3'),
  document.getElementById('tractSlider4'),
  document.getElementById('tractSlider5'),
  document.getElementById('tractSlider6'),
  document.getElementById('tractSlider7')
];

// --- Gain Gating and Animation ---
function gateMasterGain(duration) {
  if (!masterGainNode || !audioContext) return;
  const now = audioContext.currentTime;
  masterGainNode.gain.cancelScheduledValues(now);
  masterGainNode.gain.setValueAtTime(0, now);
  masterGainNode.gain.setValueAtTime(1, now);
  masterGainNode.gain.linearRampToValueAtTime(0, now + duration);
}

function updateVoicedIndicator(isVoiced) {
  const indicator = document.getElementById('voiced-indicator');
  if (!indicator) return;
  indicator.style.background = isVoiced ? '#7cff89' : '#ff7c7c';
  indicator.title = isVoiced ? 'Voiced' : 'Unvoiced';
}


function animateMasterGainSlider(duration) {
  const slider = document.getElementById('masterGainSlider');
  if (!slider || !masterGainNode || !audioContext) return;
  const start = audioContext.currentTime;
  const end = start + duration;
  if (masterGainAnimationFrame) {
    cancelAnimationFrame(masterGainAnimationFrame);
    masterGainAnimationFrame = null;
  }
  slider.value = 1;
  updateParameterDisplay('masterGain', 1);
  function update() {
    if (!audioContext || !masterGainNode) return;
    const now = audioContext.currentTime;
    let value = 1;
    if (now >= end) {
      value = 0;
    } else if (now > start) {
      value = 1 - ((now - start) / duration);
    }
    slider.value = value;
    updateParameterDisplay('masterGain', value);
    if (now < end && value > 0.001) {
      masterGainAnimationFrame = requestAnimationFrame(update);
    } else {
      slider.value = 0;
      updateParameterDisplay('masterGain', 0);
      masterGainAnimationFrame = null;
    }
  }
  update();
}

function playFromText(input, spacing = 0.02) {
  let phonemeString = wordPhonemeMap[input.toLowerCase()] || input;
  const tokens = phonemeString.trim().split(/\s+/);
  console.log('Sequencing:', tokens);

  let time = 0;
  tokens.forEach((token, i) => {
    const phoneme = phonemeMap[token.replace(/\//g, '')];
    if (!phoneme) {
      console.warn(`Phoneme "${token}" not found in phonemeMap.`);
      return;
    }
    setTimeout(() => {
      const context = {
        tractNode,
        audioContext,
        clickNode,
        tapNode,
        trillNode,
        gateMasterGain,
        animateMasterGainSlider,
        drawTract,
        getTractLength
      };
      switch (phoneme.type) {
        case "click":
          handleClickPhoneme(phoneme, token, context);
          break;
        case "tap":
          handleTapPhoneme(phoneme, token, context);
          break;
        case "trill":
          handleTrillPhoneme(phoneme, token, context);
          break;
        default:
          handleRegularPhoneme(phoneme, token);
      }
    }, time * 1000);
    const duration = phoneme.duration || 0.15;
    time += duration + spacing;
  });
}


function setupWordPhonemeInputListener() {
  const playBtn = document.getElementById('playWordPhonemeBtn');
  const inputBox = document.getElementById('wordPhonemeInput');
  if (playBtn && inputBox) {
    playBtn.addEventListener('click', () => {
      const input = inputBox.value.trim();
      if (input.length > 0) {
        console.log('[Word/Phoneme Play] Input:', input);
        playFromText(input);
        // Future: pass to sequencer or lookup map
      }
    });
    // Optional: allow pressing Enter to trigger play
    inputBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') playBtn.click();
    });
  }
}

// --- UI Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupTractSliders(null, null, tractSliders);
  setupEventListeners();
  setupWordPhonemeInputListener();
  const defaultTractRadii = tractParameterDescriptors.map(desc => desc.defaultValue);
  drawTract(defaultTractRadii, getTractLength());
  renderParameterList(glottisParameterDescriptors, subglottalParameterDescriptors, tractParameterDescriptors);
  updateParameterDisplay('masterGain', document.getElementById('masterGainSlider').value);
});