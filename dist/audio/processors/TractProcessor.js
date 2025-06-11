class TractProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'zone0', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone1', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone2', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone3', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone4', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone5', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone6', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'zone7', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft0', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft1', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft2', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft3', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft4', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft5', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft6', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLeft7', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight0', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight1', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight2', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight3', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight4', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight5', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight6', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractRight7', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'oralClosureZone', defaultValue: -1, minValue: -1, maxValue: 7, automationRate: 'k-rate' },      
      { name: 'noiseInjectionZone', defaultValue: -1, minValue: -1, maxValue: 7, automationRate: 'k-rate' },
      { name: 'fricativeEffort', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'isLateral', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'isRhotic', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'tractLength', defaultValue: 1.0, minValue: 0.0, maxValue: 2.0, automationRate: 'k-rate' }
    ];
  }

  constructor() {
    super();
    this.numSegments = 44;
    this.numZones = 8;
    this.radii = new Float32Array(this.numSegments);
    this.segmentDelay = new Float32Array(this.numSegments);
  }


  // Interpolate zone values across the 44 segments, scaling by tractLength
  interpolateZones(parameters) {
    const tractLength = parameters.tractLength ? parameters.tractLength[0] : 1.0;
    // Check if tractLeft/tractRight are present and used (e.g. for laterals)
    let useAsymmetry = false;
    const left = [], right = [];
    for (let z = 0; z < this.numZones; z++) {
      left.push(parameters[`tractLeft${z}`][0]);
      right.push(parameters[`tractRight${z}`][0]);
      // If any left/right value differs, enable asymmetry
      if (Math.abs(left[z] - right[z]) > 0.001) useAsymmetry = true;
    }
    // If both arrays are present and not identical, use their average for mono tract
    let zones = [];
    if (useAsymmetry) {
      for (let z = 0; z < this.numZones; z++) {
        zones[z] = 0.5 * (left[z] + right[z]);
      }
    } else {
      // Fallback to mono zone parameters
      for (let z = 0; z < this.numZones; z++) {
        zones[z] = parameters[`zone${z}`][0];
      }
    }
    const boundaries = [0, 5, 11, 17, 23, 29, 35, 39, 44];
    for (let z = 0; z < this.numZones; z++) {
      const start = boundaries[z];
      const end = boundaries[z + 1];
      const v0 = zones[z];
      const v1 = zones[Math.min(z + 1, this.numZones - 1)];
      const len = end - start;
      for (let s = start; s < end; s++) {
        let t = len > 1 ? (s - start) / (len - 1) : 0;
        let scaledT = t * tractLength;
        scaledT = Math.max(0, Math.min(1, scaledT));
        this.radii[s] = v0 + (v1 - v0) * scaledT;
      }
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const noiseInput = inputs[1] && inputs[1][0] ? inputs[1][0] : null;
    const output = outputs[0];
    if (!input || input.length === 0 || !output || output.length === 0) return true;

    const inputChannel = input[0];
    const outputGain = 2.0;

    this.interpolateZones(parameters);

    // --- Rhotic Shaping ---
    const isRhotic = parameters.isRhotic ? parameters.isRhotic[0] > 0.5 : false;
    if (isRhotic) {
      const boundaries = [0, 5, 11, 17, 23, 29, 35, 39, 44];
      for (let s = boundaries[3]; s < boundaries[4]; s++) {
        this.radii[s] *= 0.5;
      }
      for (let s = boundaries[6]; s < boundaries[7]; s++) {
        this.radii[s] *= 0.7;
      }
    }

    // --- Oral Closure Logic ---
    const oralClosureZone = parameters.oralClosureZone ? parameters.oralClosureZone[0] : -1;
    const isLateral = parameters.isLateral ? parameters.isLateral[0] > 0.5 : false;
    if (oralClosureZone >= 0 && oralClosureZone < this.numZones) {
      const boundaries = [0, 5, 11, 17, 23, 29, 35, 39, 44];
      const start = boundaries[oralClosureZone];
      const end = boundaries[oralClosureZone + 1];
      if (isLateral) {
        const center = Math.floor((start + end) / 2);
        for (let s = start; s < end; s++) {
          this.radii[s] = (s === center) ? 0.01 : this.radii[s];
        }
      } else {
        for (let s = start; s < end; s++) {
          this.radii[s] = 0.01;
        }
      }
    }

  

    // --- Fricative Noise Injection ---
    const noiseInjectionZone = parameters.noiseInjectionZone ? parameters.noiseInjectionZone[0] : -1;
    const fricativeEffort = parameters.fricativeEffort ? parameters.fricativeEffort[0] : 0;
    let noiseSegment = -1;
    if (noiseInjectionZone >= 0 && noiseInjectionZone < this.numZones && fricativeEffort > 0.01) {
      const boundaries = [0, 5, 11, 17, 23, 29, 35, 39, 44];
      const start = boundaries[noiseInjectionZone];
      const end = boundaries[noiseInjectionZone + 1];
      noiseSegment = Math.floor((start + end) / 2);
    }

    // --- Per-segment update ---
    for (let channel = 0; channel < output.length; channel++) {
      const outputChannel = output[channel];
      if (!outputChannel) continue;

      for (let i = 0; i < inputChannel.length; i++) {
        let sample = inputChannel[i];

        // Inject fricative noise at the correct segment using noise input
        if (noiseSegment >= 0 && noiseInput) {
          const noise = noiseInput[i % noiseInput.length] * fricativeEffort * 0.5;
          this.segmentDelay[noiseSegment] += noise;
        }


        // Minimal per-segment update
        for (let s = 0; s < this.numSegments; s++) {
          const radius = this.radii[s];
          const damping = 0.1 + 0.9 * (1 - radius);
          const delayed = this.segmentDelay[s];
          this.segmentDelay[s] = sample;
          sample = sample * damping + delayed * (1 - damping);
        }

        if (!this.prevSample) this.prevSample = new Float32Array(output.length);
        if (!this.prevOutput) this.prevOutput = new Float32Array(output.length);
        const R = 0.95;
        let rawSample = sample * outputGain;
        let lipRadiated = rawSample - this.prevSample[channel] + R * this.prevOutput[channel];
        this.prevSample[channel] = rawSample;
        this.prevOutput[channel] = lipRadiated;
        outputChannel[i] = lipRadiated;
      }
    }
    return true;
  }
}

registerProcessor('tract-processor', TractProcessor);