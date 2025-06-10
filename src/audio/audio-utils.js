/**
 * Smoothly fades in a GainNode.
 * @param {GainNode} gainNode
 * @param {AudioContext} audioContext
 * @param {number} duration - seconds
 */
export function fadeInGain(gainNode, audioContext, duration = 0.05) {
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + duration);
  }
  
  /**
   * Smoothly fades out a GainNode and returns a Promise that resolves after the fade.
   * @param {GainNode} gainNode
   * @param {AudioContext} audioContext
   * @param {number} duration - seconds
   * @returns {Promise<void>}
   */
  export function fadeOutGain(gainNode, audioContext, duration = 0.5) {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    return new Promise(resolve => setTimeout(resolve, duration * 1000 + 20));
  }