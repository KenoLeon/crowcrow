class TransientProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.burstBuffer = null;
    this.burstIndex = 0;
    this.burstLength = 256;
    this.burstSharpness = 0.8;
    this.burstGain = 1.0;
    this.burstActive = false;
    this.burstZone = 2;
    this.noiseInput = null; // Store latest noise input buffer
    this.port.onmessage = (event) => {
      if (event.data && event.data.type === 'burst') {
        const { noiseInjectionZone = 2, duration = 0.03, sharpness = 0.8, gain = 1.0 } = event.data;
        this.burstLength = Math.floor(duration * sampleRate);
        this.burstSharpness = sharpness;
        this.burstGain = gain;
        this.prepareBurst(noiseInjectionZone, this.noiseInput);
      }
    };
  }

  prepareBurst(noiseInjectionZone, noiseInput) {
    if (!noiseInput || noiseInput.length === 0) {
      throw new Error('Noise input missing in TransientProcessor!');
    }
    this.burstBuffer = new Float32Array(this.burstLength);
    for (let i = 0; i < this.burstLength; i++) {
      let noiseSample = noiseInput[i % noiseInput.length];
      let sample = noiseSample * this.burstGain;
      // Optionally shape burst based on noiseInjectionZone here
      this.burstBuffer[i] = sample;
    }
    this.burstIndex = 0;
    this.burstActive = true;
    this.burstZone = noiseInjectionZone;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const noiseInput = inputs[1] && inputs[1][0] ? inputs[1][0] : null;
    this.noiseInput = noiseInput; // Store for use in prepareBurst

    const output = outputs[0];
    if (!output) return true;

    for (let channel = 0; channel < output.length; channel++) {
      const inputChannel = input[channel] || input[0] || [];
      const outputChannel = output[channel];
      for (let i = 0; i < outputChannel.length; i++) {
        let sample = inputChannel[i] || 0;
        // Inject burst if active
        if (this.burstActive && this.burstBuffer && this.burstIndex < this.burstLength) {
          sample += this.burstBuffer[this.burstIndex++];
          if (this.burstIndex >= this.burstLength) {
            this.burstActive = false;
          }
        }
        outputChannel[i] = sample;
      }
    }
    return true;
  }
}

registerProcessor('transient-processor', TransientProcessor);