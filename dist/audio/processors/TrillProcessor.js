class TrillProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'trillZone', defaultValue: 2, minValue: 0, maxValue: 7, automationRate: 'k-rate' },
      { name: 'trillCycles', defaultValue: 3, minValue: 1, maxValue: 10, automationRate: 'k-rate' },
      { name: 'trillRate', defaultValue: 28, minValue: 10, maxValue: 50, automationRate: 'k-rate' }, // Hz
      { name: 'trillGain', defaultValue: 1.0, minValue: 0, maxValue: 2, automationRate: 'k-rate' },
      { name: 'trigger', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
    ];
  }

  constructor() {
    super();
    this.active = false;
    this.trillSampleCounter = 0;
    this.trillSamples = 0;
    this.trillCycleSamples = 0;
    this.trillCyclesDone = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    const trillRate = parameters.trillRate[0];
    const trillCycles = parameters.trillCycles[0];
    const trillGain = parameters.trillGain[0];
    const trigger = parameters.trigger[0];

    // Each cycle = open+close, so one period per cycle
    const cycleSamples = Math.floor(sampleRate / trillRate);
    const totalSamples = cycleSamples * trillCycles;

    if (trigger > 0 && !this.active) {
      this.active = true;
      this.trillSampleCounter = 0;
      this.trillCyclesDone = 0;
      this.trillSamples = totalSamples;
      this.trillCycleSamples = cycleSamples;
    }

    for (let i = 0; i < output.length; i++) {
      let burst = 0;
      if (this.active && this.trillSampleCounter < this.trillSamples) {
        // Simulate closure burst at start of each cycle
        const inCycle = this.trillSampleCounter % this.trillCycleSamples;
        // Closure burst: first 10% of cycle
        if (inCycle < this.trillCycleSamples * 0.1) {
          burst = trillGain * Math.exp(-10 * inCycle / this.trillCycleSamples) * (Math.random() * 2 - 1);
        }
        this.trillSampleCounter++;
      } else if (this.active) {
        this.active = false;
      }
      output[i] = burst;
    }
    return true;
  }
}

registerProcessor('trill-processor', TrillProcessor);