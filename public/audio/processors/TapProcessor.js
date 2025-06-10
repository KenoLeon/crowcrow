class TapProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'tapZone', defaultValue: 2, minValue: 0, maxValue: 7, automationRate: 'k-rate' },
      { name: 'tapDuration', defaultValue: 0.025, minValue: 0.005, maxValue: 0.1, automationRate: 'k-rate' },
      { name: 'tapGain', defaultValue: 1.0, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      { name: 'trigger', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
    ];
  }

  constructor() {
    super();
    this.active = false;
    this.tapSampleCounter = 0;
    this.tapSamples = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    const tapDuration = parameters.tapDuration[0];
    const tapGain = parameters.tapGain[0];
    const trigger = parameters.trigger[0];

    // Start tap on trigger
    if (trigger > 0 && !this.active) {
      this.active = true;
      this.tapSampleCounter = 0;
      this.tapSamples = Math.floor(tapDuration * sampleRate);      
    }

    for (let i = 0; i < output.length; i++) {
      let burst = 0;
      if (this.active && this.tapSampleCounter < this.tapSamples) {
        // Simple short burst (white noise envelope)
        burst = tapGain * Math.exp(-8 * this.tapSampleCounter / this.tapSamples) * (Math.random() * 2 - 1);
        this.tapSampleCounter++;
      } else if (this.active) {
        this.active = false;
      }
      output[i] = burst;
    }
    return true;
  }
}

registerProcessor('tap-processor', TapProcessor);