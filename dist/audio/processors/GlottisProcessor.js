class GlottisProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 120, minValue: 50, maxValue: 400, automationRate: 'a-rate' },
      { name: 'tractLength', defaultValue: 1.0, minValue: 0.7, maxValue: 1.5, automationRate: 'k-rate' },
      { name: 'tenseness', defaultValue: 0.6, minValue: 0, maxValue: 1, automationRate: 'a-rate' },
      { name: 'intensity', defaultValue: 0.8, minValue: 0, maxValue: 1, automationRate: 'a-rate' },
      { name: 'loudness', defaultValue: 0.8, minValue: 0, maxValue: 1, automationRate: 'a-rate' },
      { name: 'voiced', defaultValue: 1, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
       { name: 'glottalClosure', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' }
    ];
  }

  constructor() {
    super();
    this.phase = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    const noiseInput = inputs[1] && inputs[1][0] ? inputs[1][0] : null;
    const glottalClosure = parameters.glottalClosure ? parameters.glottalClosure[0] : 0;
    const freqArr = parameters.frequency;
    const tensenessArr = parameters.tenseness;
    const intensityArr = parameters.intensity;
    const loudnessArr = parameters.loudness;
    const voicedArr = parameters.voiced;

    // --- Glottal Stop: mute output if closure is set ---
    if (glottalClosure >= 0.99) {
      output.fill(0);
      return true;
    }

    for (let i = 0; i < output.length; i++) {
      const tractLengthArr = parameters.tractLength;
      const tractLength = tractLengthArr && tractLengthArr.length > 0 ? tractLengthArr[0] : 1.0;
      const freqRaw = freqArr.length > 1 ? freqArr[i] : freqArr[0];
      const freq = freqRaw / tractLength; // <-- Use division for realistic scaling
      const tenseness = tensenessArr.length > 1 ? tensenessArr[i] : tensenessArr[0];
      const intensity = intensityArr.length > 1 ? intensityArr[i] : intensityArr[0];
      const loudness = loudnessArr.length > 1 ? loudnessArr[i] : loudnessArr[0];
      const voiced = voicedArr && voicedArr.length > 0 ? (voicedArr.length > 1 ? voicedArr[i] : voicedArr[0]) : 1;

      let sample = 0;
      let noiseSample = noiseInput ? noiseInput[i % noiseInput.length] : 0;

      if (voiced >= 0.5) {
        // Glottal pulse: Rosenberg shape
        this.phase += (2 * Math.PI * freq) / sampleRate;
        if (this.phase > 2 * Math.PI) this.phase -= 2 * Math.PI;

        let t = this.phase / (2 * Math.PI);
        let openPhase = 0.6 + 0.3 * (1 - tenseness);
        let voice;
        if (t < openPhase) {
          voice = Math.sin(Math.PI * t / openPhase);
        } else {
          voice = 0;
        }
        voice *= intensity * loudness;

        // Breath noise, modulated by tenseness/intensity
        let noiseAmount = (1 - tenseness) * (1 - intensity) * 0.3 + 0.05;
        let noise = noiseSample * noiseAmount;

        sample = voice + noise;
      } else {
        // Unvoiced: only noise
        let noiseAmount = (1 - tenseness) * (1 - intensity) * 0.3 + 0.05;
        sample = noiseSample * noiseAmount;
      }

      output[i] = sample;
    }
    return true;
  }
}

registerProcessor('glottis-processor', GlottisProcessor);