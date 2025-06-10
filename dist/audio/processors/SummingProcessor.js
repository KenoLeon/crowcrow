
/**
 * SummingProcessor
 * 
 * This AudioWorkletProcessor sums all available input channels sample-wise and outputs the result.
 * It is designed to combine multiple parallel sources (e.g., oral, nasal, click, or future processors)
 * into a single output stream for further processing or playback.
 * 
 * Each input is expected to be mono (single channel). The processor is robust to any number of inputs.
 */

class SummingProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const output = outputs[0][0];
    for (let i = 0; i < output.length; i++) {
      let sum = 0;
      for (let j = 0; j < inputs.length; j++) {
        const input = inputs[j][0];
        if (input) sum += input[i] || 0;
      }
      output[i] = sum;
    }
    return true;
  }
}
registerProcessor('summing-processor', SummingProcessor);