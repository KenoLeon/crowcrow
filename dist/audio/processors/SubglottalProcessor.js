class SubglottalProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'breathCycleRate', defaultValue: 0.2, minValue: 0.05, maxValue: 1.0, automationRate: 'a-rate' },
      { name: 'effort', defaultValue: 0.8, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
    ];
  }

  constructor() {
    super();
    this.time = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const intensityChannel = output[0];
    const loudnessChannel = output[1];
    const breathCycleRateArr = parameters.breathCycleRate;
    const effortArr = parameters.effort;

    let lastIntensity = 0.8;
    let lastLoudness = 0.8;

    for (let i = 0; i < intensityChannel.length; i++) {
      const breathCycleRate = breathCycleRateArr.length > 1 ? breathCycleRateArr[i] : breathCycleRateArr[0];
      const effort = effortArr.length > 1 ? effortArr[i] : effortArr[0];

      const pressure = 0.5 + 0.5 * Math.sin(2 * Math.PI * breathCycleRate * this.time);
      const intensity = 0.6 + (pressure * effort) * 0.4;
      const loudness = 0.4 + (pressure * effort) * 0.6;

      intensityChannel[i] = intensity;
      loudnessChannel[i] = loudness;

      lastIntensity = intensity;
      lastLoudness = loudness;

      this.time += 1 / sampleRate;
    }

    // Send the last values to the main thread
    this.port.postMessage({ intensity: lastIntensity, loudness: lastLoudness });

    return true;
  }
}


registerProcessor('subglottal-processor', SubglottalProcessor);