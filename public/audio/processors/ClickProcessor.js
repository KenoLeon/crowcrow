class ClickProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'clickType', defaultValue: 0, minValue: 0, maxValue: 7, automationRate: 'k-rate' },
      { name: 'burstDuration', defaultValue: 0.018, minValue: 0.005, maxValue: 0.05, automationRate: 'k-rate' },
      { name: 'burstSharpness', defaultValue: 0.95, minValue: 0.5, maxValue: 1.0, automationRate: 'k-rate' },
      { name: 'burstGain', defaultValue: 1.2, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      { name: 'burstZone', defaultValue: 1, minValue: 0, maxValue: 7, automationRate: 'k-rate' },
      { name: 'trigger', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
    ];
  }

  constructor() {
    super();
    this.burstSampleCounter = 0;
    this.burstSamples = 0;
    this.active = false;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    const input = inputs[0][0] || new Float32Array(output.length);
    const trigger = parameters.trigger[0];
    const burstDuration = parameters.burstDuration[0];
    const burstSharpness = parameters.burstSharpness[0];
    const burstGain = parameters.burstGain[0];

    if (trigger > 0.5 && !this.active) {
      this.active = true;
      this.burstSampleCounter = 0;
      this.burstSamples = Math.floor(burstDuration * sampleRate);
    }

    for (let i = 0; i < output.length; i++) {
      let burst = 0;
      if (this.active && this.burstSampleCounter < this.burstSamples) {
        // Simple sharp burst: exponential decay
        const t = this.burstSampleCounter / this.burstSamples;
        burst = burstGain * Math.pow(1 - t, burstSharpness * 8) * (Math.random() * 2 - 1);
        this.burstSampleCounter++;
      } else if (this.active) {
        this.active = false;
      }
      output[i] = input[i] + burst;
    }
    return true;
  }
}

registerProcessor('click-processor', ClickProcessor);