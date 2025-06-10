class ChestinessProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'chestiness', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' }
    ];
  }

  constructor() {
    super();
    this.prev1 = 0;
    this.prev2 = 0;
    this.prevOut1 = 0;
    this.prevOut2 = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0][0];
    const output = outputs[0][0];
    if (!input || !output) return true;

    // Map chestiness [0,1] to frequency/Q
    const chestiness = parameters.chestiness.length > 0 ? parameters.chestiness[0] : 0.5;
    // Example: 300 Hz (dark) to 700 Hz (bright)
    const freq = 300 + 400 * chestiness;
    // Example: Q from 0.5 (broad) to 2 (narrow)
    const Q = 0.5 + 1.5 * chestiness;

    // Biquad bandpass coefficients (Direct Form I, simple, not perfect)
    // For production, use a library or more accurate calc!
    const w0 = 2 * Math.PI * freq / sampleRate;
    const alpha = Math.sin(w0) / (2 * Q);
    const b0 = alpha;
    const b1 = 0;
    const b2 = -alpha;
    const a0 = 1 + alpha;
    const a1 = -2 * Math.cos(w0);
    const a2 = 1 - alpha;

    for (let i = 0; i < input.length; i++) {
      const x = input[i];
      const y = (b0/a0)*x + (b1/a0)*this.prev1 + (b2/a0)*this.prev2
                - (a1/a0)*this.prevOut1 - (a2/a0)*this.prevOut2;
      output[i] = y;
      this.prev2 = this.prev1;
      this.prev1 = x;
      this.prevOut2 = this.prevOut1;
      this.prevOut1 = y;
    }
    return true;
  }
}
registerProcessor('chestiness-processor', ChestinessProcessor);