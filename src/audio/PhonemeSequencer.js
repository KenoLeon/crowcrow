import { phonemeMap } from '../state/phonemeMap.js';

export class PhonemeSequencer {
  constructor(setParameters) {
    this.setParameters = setParameters;
    this.timeout = null;
    this.sequenceTimeouts = [];
  }
   
  triggerPhoneme(name) {
    // Normalize name (strip slashes if present)
    const key = name.replace(/\//g, '');
    const phoneme = phonemeMap[key];
    if (!phoneme) {
      console.warn(`Phoneme "${name}" not found in phonemeMap.`);
      return;
    }

    // --- Affricate logic ---
    if (phoneme.type === "affricate" && Array.isArray(phoneme.components)) {
      const [plosiveId, fricativeId] = phoneme.components;
      const plosive = phonemeMap[plosiveId];
      const fricative = phonemeMap[fricativeId];
      if (!plosive || !fricative) {
        console.warn(`Affricate components not found for "${name}"`);
        return;
      }
      const totalDuration = phoneme.duration ?? 0.18;
      const plosiveDuration = totalDuration * 0.4;
      const fricativeDuration = totalDuration * 0.6;

      // Play plosive
      this.setParameters({ ...plosive, duration: plosiveDuration });
      if (this.timeout) clearTimeout(this.timeout);

      // After plosive, play fricative
      this.timeout = setTimeout(() => {
        this.setParameters({ ...fricative, duration: fricativeDuration });
        // Optionally, clear or fade out after fricative
      }, plosiveDuration * 1000);
      return;
    }

    // --- Default: single phoneme ---
    this.setParameters(phoneme);

    // Optionally, reset or fade out after duration
    if (phoneme.duration) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // Optionally: reset parameters or fade out here
      }, phoneme.duration * 1000);
    }
  }
}