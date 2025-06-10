class SimplexNoise {
  constructor(seed = 0) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    for (let i = 255; i > 0; i--) {
      const n = Math.floor((seed = (seed * 9301 + 49297) % 233280) / 233280 * (i + 1));
      [this.p[i], this.p[n]] = [this.p[n], this.p[i]];
    }
  }
  grad(hash, x) {
    return (hash & 1 ? -x : x);
  }
  noise1D(x) {
    const i0 = Math.floor(x), i1 = i0 + 1;
    const x0 = x - i0, x1 = x0 - 1;
    const t0 = 1 - x0 * x0, t1 = 1 - x1 * x1;
    const h0 = this.p[i0 & 255], h1 = this.p[i1 & 255];
    let n0 = t0 > 0 ? t0 * t0 * this.grad(h0, x0) : 0;
    let n1 = t1 > 0 ? t1 * t1 * this.grad(h1, x1) : 0;
    return 0.395 * (n0 + n1); // scale to roughly [-1,1]
  }
}

class NoiseProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'noiseType',
        defaultValue: 0, // 0: white, 1: pink, 2: simplex
        minValue: 0,
        maxValue: 2,
        automationRate: 'k-rate'
      }
    ];
  }

  constructor() {
    super();
    this.simplex = new SimplexNoise(Math.random() * 10000);
    this.simplexPhase = 0;
    // Pink noise state
    this.pink_b0 = this.pink_b1 = this.pink_b2 = 0;
  }

  // White noise: random [-1, 1]
  white() {
    return Math.random() * 2 - 1;
  }

  // Pink noise: simple 3-pole filter
  pink() {
    const white = this.white();
    this.pink_b0 = 0.99765 * this.pink_b0 + white * 0.0990460;
    this.pink_b1 = 0.96300 * this.pink_b1 + white * 0.2965164;
    this.pink_b2 = 0.57000 * this.pink_b2 + white * 1.0526913;
    return this.pink_b0 + this.pink_b1 + this.pink_b2 + white * 0.1848;
  }

  // Simplex noise: smooth
  simplexNoise() {
    this.simplexPhase += 0.01;
    return this.simplex.noise1D(this.simplexPhase);
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const noiseType = parameters.noiseType[0] | 0;

    for (let channel = 0; channel < output.length; channel++) {
      const outputChannel = output[channel];
      for (let i = 0; i < outputChannel.length; i++) {
        let sample = 0;
        if (noiseType === 0) {
          sample = this.white();
        } else if (noiseType === 1) {
          sample = this.pink();
        } else if (noiseType === 2) {
          sample = this.simplexNoise();
        }
        outputChannel[i] = sample;
      }
    }
    return true;
  }
}

registerProcessor('noise-processor', NoiseProcessor);