class NasalProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'nasalCoupling',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: 'k-rate'
      }
    ];
  }

  constructor() {
    super();
    this.prevSample = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const nasalCoupling = parameters.nasalCoupling[0] || 0;

    for (let ch = 0; ch < output.length; ch++) {
      const inCh = input[ch] || input[0] || [];
      const outCh = output[ch];
      for (let i = 0; i < outCh.length; i++) {
        // Simple nasal formant: 1-pole lowpass
        let sample = inCh[i] || 0;
        sample = 0.7 * this.prevSample + 0.3 * sample;
        this.prevSample = sample;
        outCh[i] = sample * nasalCoupling;
      }
    }
    return true;
  }
}

registerProcessor('nasal-processor', NasalProcessor);