/**
 * PhonemeMap: Articulator-Based Abstraction
 *
 * This file defines all phonemes using high-level articulator parameters
 * (tongue, lips, velum, etc.) instead of the legacy "zones" system.
 * The articulators object for each phoneme is mapped directly to the vocal tract
 * shape (44 segments) for synthesis. The "zones" abstraction has been removed
 * for clarity, maintainability, and directness.
 *
 * If you are extending or modifying this file, use the articulators object
 * for all new phonemes. See the project README for more details.
 *
 * Legacy note: Previously, phonemes could be defined with a "zones" array, e.g.:
 *   zones: [0, 0, 0.2, 0.8, 1, 0.8, 0.2, 0, 0, ...]
 * This approach is now deprecated in favor of articulator-based definitions.
 */

export const phonemeMap = {
  a: {
    symbol: "a",
    type: "vowel",
    frequency: 130,
    tenseness: 0.6,
    effort: 0.7,
    duration: 0.3,
    voiced: true,
    articulators: {
      tongueTipX: 0.5,    // mid
      tongueTipY: 0.2,    // low
      tongueBodyX: 0.5,   // mid
      tongueBodyY: 0.2,   // low
      tongueLateral: 0,   // not lateral
      lipRound: 0.1,      // unrounded
      lipProtrude: 0.1,   // neutral
      lipClosure: 0,      // open
      jawHeight: 1.0,     // open jaw
      velumOpen: 0,       // oral
      tractLength: 1.0    // default
    }
  },

  i: {
    symbol: "i",
    type: "vowel",
    frequency: 200,
    tenseness: 0.8,
    effort: 0.5,
    duration: 0.25,
    voiced: true,
    articulators: {
      tongueTipX: 0.2,    // front
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.2,   // front
      tongueBodyY: 0.9,   // high
      tongueLateral: 0,
      lipRound: 0.0,      // unrounded
      lipProtrude: 0.0,   // not protruded
      lipClosure: 0,
      jawHeight: 0.3,     // fairly closed
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  u: {
    symbol: "u",
    type: "vowel",
    frequency: 160,
    tenseness: 0.5,
    effort: 0.6,
    duration: 0.3,
    voiced: true,
    articulators: {
      tongueTipX: 0.8,    // back
      tongueTipY: 0.8,    // high
      tongueBodyX: 0.8,   // back
      tongueBodyY: 0.8,   // high
      tongueLateral: 0,
      lipRound: 1.0,      // fully rounded
      lipProtrude: 0.8,   // strongly protruded
      lipClosure: 0,
      jawHeight: 0.3,     // fairly closed
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  p: {
    symbol: "p",
    type: "plosive",
    frequency: 0,
    tenseness: 0.4,
    effort: 0.8,
    duration: 0.15,
    isPlosive: true,
    noiseType: "white",
    noiseInjectionZone: 0, // labial
    burstDuration: 0.03,      // 30ms
    burstSharpness: 0.8,      // fairly sharp
    burstGain: 1.0,
    oralClosureZone: 0,
    voiced: false,
    articulators: {
      tongueTipX: 0.0,    // lips
      tongueTipY: 0.5,    // neutral
      tongueBodyX: 0.0,   // lips
      tongueBodyY: 0.5,   // neutral
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.2,
      lipClosure: 1.0,    // closed lips
      jawHeight: 0.2,     // closed jaw
      velumOpen: 0,       // oral
      tractLength: 1.0
    }
  },

  t: {
    symbol: "t",
    type: "plosive",
    frequency: 0,
    tenseness: 0.5,
    effort: 0.8,
    duration: 0.14,
    isPlosive: true,
    noiseType: "white",
    noiseInjectionZone: 2, // alveolar
    burstDuration: 0.025,     // slightly shorter
    burstSharpness: 0.9,      // very sharp
    burstGain: 1.1,
    oralClosureZone: 2,
    voiced: false,
    articulators: {
      tongueTipX: 0.3,    // alveolar ridge
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  k: {
    symbol: "k",
    type: "plosive",
    frequency: 0,
    tenseness: 0.5,
    effort: 0.9,
    duration: 0.16,
    isPlosive: true,
    noiseType: "white",
    noiseInjectionZone: 5, // velar
    burstDuration: 0.035,     // slightly longer
    burstSharpness: 0.7,      // less sharp
    burstGain: 1.2,
    oralClosureZone: 5, // tongue back/velar    
    voiced: false,
    articulators: {
      tongueTipX: 0.8,    // back
      tongueTipY: 0.5,    // neutral
      tongueBodyX: 0.8,   // back
      tongueBodyY: 0.9,   // high
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  g: {
    symbol: "g",
    type: "plosive",
    frequency: 120,
    tenseness: 0.6,
    effort: 0.85,
    duration: 0.15,
    isPlosive: true,
    noiseType: "pink",
    noiseInjectionZone: 5, // velar 
    burstDuration: 0.035,
    burstSharpness: 0.7,
    burstGain: 1.2,
    oralClosureZone: 5, // tongue rear/velar    
    voiced: true,
    articulators: {
      tongueTipX: 0.8,
      tongueTipY: 0.5,
      tongueBodyX: 0.8,
      tongueBodyY: 0.9,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  b: {
    symbol: "b",
    type: "plosive",
    frequency: 120,
    tenseness: 0.6,
    effort: 0.85,
    duration: 0.15,
    isPlosive: true,
    noiseType: "pink",
    noiseInjectionZone: 0, // labial
    burstDuration: 0.03,
    burstSharpness: 0.8,
    burstGain: 1.0,
    oralClosureZone: 0,
    voiced: true,
    articulators: {
      tongueTipX: 0.0,
      tongueTipY: 0.5,
      tongueBodyX: 0.0,
      tongueBodyY: 0.5,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.2,
      lipClosure: 1.0,
      jawHeight: 0.2,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  d: {
    symbol: "d",
    type: "plosive",
    frequency: 120,
    tenseness: 0.6,
    effort: 0.85,
    duration: 0.15,
    isPlosive: true,
    noiseType: "pink",
    noiseInjectionZone: 2, // alveolar ridge
    burstDuration: 0.025,
    burstSharpness: 0.9,
    burstGain: 1.1,
    oralClosureZone: 2, // tongue tip/alveolar    
    voiced: true,
    articulators: {
      tongueTipX: 0.3,
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  m: {
    symbol: "m",
    type: "nasal",
    frequency: 110,
    tenseness: 0.5,
    effort: 0.7,
    duration: 0.25,
    isNasal: true,
    nasalCoupling: 1.0,          // full nasal flow (0–1)
    oralClosureZone: 0,          // front (lips)    
    voiced: true,
    articulators: {
      tongueTipX: 0.0,    // lips
      tongueTipY: 0.5,    // neutral
      tongueBodyX: 0.0,   // lips
      tongueBodyY: 0.5,   // neutral
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.2,
      lipClosure: 1.0,    // closed lips
      jawHeight: 0.2,     // closed jaw
      velumOpen: 1.0,     // nasal
      tractLength: 1.0
    }
  },

  n: {
    symbol: "n",
    type: "nasal",
    frequency: 120,
    tenseness: 0.6,
    effort: 0.6,
    duration: 0.2,
    isNasal: true,
    nasalCoupling: 1.0,
    oralClosureZone: 2,          // mid (alveolar ridge)    
    voiced: true,
    articulators: {
      tongueTipX: 0.3,    // alveolar ridge
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 1.0,     // nasal
      tractLength: 1.0
    }
  },

  ng: {
    symbol: "ŋ",
    type: "nasal",
    frequency: 100,
    tenseness: 0.5,
    effort: 0.65,
    duration: 0.3,
    isNasal: true,
    nasalCoupling: 1.0,
    oralClosureZone: 5,          // back (velar region)    
    voiced: true,
    articulators: {
      tongueTipX: 0.8,    // back
      tongueTipY: 0.5,    // neutral
      tongueBodyX: 0.8,   // back
      tongueBodyY: 0.9,   // high
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 1.0,     // nasal
      tractLength: 1.0
    }
  },
  l: {
    symbol: "l",
    type: "approximant",
    frequency: 120,
    tenseness: 0.5,
    effort: 0.6,
    duration: 0.2,
    isApproximant: true,
    isLateral: true,
    oralClosureZone: 2, // tongue tip/alveolar    
    voiced: true,
    tractLeft: [1, 1, 1, 0.2, 0.5, 0.5, 0.5, 0.5],
    tractRight: [1, 1, 1, 0.2, 0.5, 0.5, 0.5, 0.5],
    articulators: {
      tongueTipX: 0.3,    // alveolar ridge
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 1.0, // full lateral airflow
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  ɹ: {
    symbol: "ɹ",
    type: "approximant",
    frequency: 120,
    tenseness: 0.5,
    effort: 0.6,
    duration: 0.2,
    isApproximant: true,
    isRhotic: true,
    voiced: true,
    articulators: {
      tongueTipX: 0.4,    // postalveolar/retroflex
      tongueTipY: 0.7,    // slightly raised
      tongueBodyX: 0.5,
      tongueBodyY: 0.6,
      tongueLateral: 0.2, // slight lateral airflow
      lipRound: 0.1,
      lipProtrude: 0.1,
      lipClosure: 0.0,
      jawHeight: 0.5,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  j: {
    symbol: "j",
    type: "approximant",
    frequency: 200,
    tenseness: 0.5,
    effort: 0.5,
    duration: 0.2,
    isApproximant: true,
    glideDuration: 0.08,
    voiced: true,
    articulators: {
      tongueTipX: 0.2,    // front
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.2,   // front
      tongueBodyY: 0.9,   // high
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  w: {
    symbol: "w",
    type: "approximant",
    frequency: 120,
    tenseness: 0.5,
    effort: 0.5,
    duration: 0.2,
    isApproximant: true,
    glideDuration: 0.09,
    voiced: true,
    articulators: {
      tongueTipX: 0.8,    // back
      tongueTipY: 0.8,    // high
      tongueBodyX: 0.8,   // back
      tongueBodyY: 0.8,   // high
      tongueLateral: 0,
      lipRound: 1.0,      // fully rounded
      lipProtrude: 0.8,   // strongly protruded
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  f: {
    symbol: "f",
    type: "fricative",
    frequency: 0,
    tenseness: 0.5,
    effort: 0.7,
    duration: 0.18,
    noiseType: "white",
    noiseInjectionZone: 0, // labiodental/front        
    voiced: false,
    filterType: "highpass",
    filterFrequency: 4000,
    filterQ: 6,
    articulators: {
      tongueTipX: 0.1,    // near front
      tongueTipY: 0.5,    // neutral
      tongueBodyX: 0.1,
      tongueBodyY: 0.5,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.2,
      lipClosure: 0.5,    // partial closure (labiodental)
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  v: {
    symbol: "v",
    type: "fricative",
    frequency: 120,
    tenseness: 0.5,
    effort: 0.7,
    duration: 0.18,
    noiseType: "pink",
    noiseInjectionZone: 0, // labiodental/front    
    voiced: true,
    filterType: "bandpass",
    filterFrequency: 1500,
    filterQ: 4,
    articulators: {
      tongueTipX: 0.1,
      tongueTipY: 0.5,
      tongueBodyX: 0.1,
      tongueBodyY: 0.5,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.2,
      lipClosure: 0.5,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  s: {
    symbol: "s",
    type: "fricative",
    frequency: 0,
    tenseness: 0.7,
    effort: 0.8,
    duration: 0.16,
    noiseType: "white",
    noiseInjectionZone: 2, // alveolar        
    voiced: false,
    filterType: "highpass",
    filterFrequency: 6000,
    filterQ: 8,
    articulators: {
      tongueTipX: 0.3,    // alveolar
      tongueTipY: 0.9,    // high
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  z: {
    symbol: "z",
    type: "fricative",
    frequency: 120,
    tenseness: 0.7,
    effort: 0.8,
    duration: 0.16,
    noiseType: "pink",
    noiseInjectionZone: 2, // alveolar    
    voiced: true,
    filterType: "highpass",
    filterFrequency: 6000,
    filterQ: 8,
    articulators: {
      tongueTipX: 0.3,
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  sh: {
    symbol: "ʃ",
    type: "fricative",
    frequency: 0,
    tenseness: 0.6,
    effort: 0.8,
    duration: 0.18,
    noiseType: "white",
    noiseInjectionZone: 3, // postalveolar        
    voiced: false,
    filterType: "bandpass",
    filterFrequency: 2500,
    filterQ: 5,
    articulators: {
      tongueTipX: 0.4,    // postalveolar
      tongueTipY: 0.8,    // high
      tongueBodyX: 0.4,
      tongueBodyY: 0.8,
      tongueLateral: 0,
      lipRound: 0.1,
      lipProtrude: 0.1,
      lipClosure: 0.0,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  zh: {
    symbol: "ʒ",
    type: "fricative",
    frequency: 120,
    tenseness: 0.6,
    effort: 0.8,
    duration: 0.18,
    noiseType: "pink",
    noiseInjectionZone: 3, // postalveolar        
    voiced: true,
    filterType: "bandpass",
    filterFrequency: 2000,
    filterQ: 5,
    articulators: {
      tongueTipX: 0.4,
      tongueTipY: 0.8,
      tongueBodyX: 0.4,
      tongueBodyY: 0.8,
      tongueLateral: 0,
      lipRound: 0.1,
      lipProtrude: 0.1,
      lipClosure: 0.0,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  h: {
    symbol: "h",
    type: "fricative",
    frequency: 0,
    tenseness: 0.5,
    effort: 0.7,
    duration: 0.15,
    noiseType: "simplex",
    noiseInjectionZone: 7, // glottal (end of tract)     
    voiced: false, // <-- standard voiceless /h/
    filterType: "lowpass",
    filterFrequency: 3000,
    filterQ: 1,
    articulators: {
      tongueTipX: 0.5,    // neutral
      tongueTipY: 0.5,
      tongueBodyX: 0.5,
      tongueBodyY: 0.5,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.5,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  ɦ: {
    symbol: "ɦ",
    type: "fricative",
    frequency: 120,
    tenseness: 0.5,
    effort: 0.7,
    duration: 0.15,
    noiseType: "simplex",
    noiseInjectionZone: 7, // glottal (end of tract)    
    voiced: true, // <-- voiced glottal fricative
    filterType: "lowpass",
    filterFrequency: 3000,
    filterQ: 1,
    articulators: {
      tongueTipX: 0.5,
      tongueTipY: 0.5,
      tongueBodyX: 0.5,
      tongueBodyY: 0.5,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.5,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  ʔ: {
    symbol: "ʔ",
    type: "glottal_stop",
    frequency: 0,
    tenseness: 1.0,
    effort: 1.0,
    duration: 0.08, // typical glottal stop is short
    voiced: false,
    glottalClosure: 1.0 // custom parameter to indicate full closure
  },
  tʃ: {
    symbol: "tʃ",
    type: "affricate",
    components: ["t", "sh"], // plosive, then fricative
    duration: 0.18, // total duration in seconds
    articulators: {
      tongueTipX: 0.35,    // postalveolar
      tongueTipY: 0.85,
      tongueBodyX: 0.35,
      tongueBodyY: 0.8,
      tongueLateral: 0,
      lipRound: 0.1,
      lipProtrude: 0.1,
      lipClosure: 0.0,
      jawHeight: 0.35,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  dʒ: {
    symbol: "dʒ",
    type: "affricate",
    components: ["d", "zh"],
    duration: 0.18,
    articulators: {
      tongueTipX: 0.35,    // postalveolar
      tongueTipY: 0.85,
      tongueBodyX: 0.35,
      tongueBodyY: 0.8,
      tongueLateral: 0,
      lipRound: 0.1,
      lipProtrude: 0.1,
      lipClosure: 0.0,
      jawHeight: 0.35,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  ts: {
    symbol: "ts",
    type: "affricate",
    components: ["t", "s"],
    duration: 0.16,
    articulators: {
      tongueTipX: 0.3,    // alveolar
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  dz: {
    symbol: "dz",
    type: "affricate",
    components: ["d", "z"],
    duration: 0.16,
    articulators: {
      tongueTipX: 0.3,    // alveolar
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 0,
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.3,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  ɬ: {
    symbol: "ɬ",
    type: "fricative",
    frequency: 0,
    tenseness: 0.7,
    effort: 0.8,
    duration: 0.18,
    isLateral: true,
    noiseType: "white",
    noiseInjectionZone: 2, // alveolar    
    voiced: false,
    filterType: "bandpass",
    filterFrequency: 4000,
    filterQ: 7,
    tractLeft: [1, 1, 0.7, 0.2, 0.5, 0.5, 0.5, 0.5], // partial closure at alveolar
    tractRight: [1, 1, 0.7, 0.2, 0.5, 0.5, 0.5, 0.5],
    articulators: {
      tongueTipX: 0.3,    // alveolar
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 1.0, // full lateral airflow
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },

  ɮ: {
    symbol: "ɮ",
    type: "fricative",
    frequency: 120,
    tenseness: 0.7,
    effort: 0.8,
    duration: 0.18,
    isLateral: true,
    noiseType: "pink",
    noiseInjectionZone: 2, // alveolar    
    voiced: true,
    filterType: "bandpass",
    filterFrequency: 3000,
    filterQ: 7,
    tractLeft: [1, 1, 0.7, 0.2, 0.5, 0.5, 0.5, 0.5],
    tractRight: [1, 1, 0.7, 0.2, 0.5, 0.5, 0.5, 0.5],
    articulators: {
      tongueTipX: 0.3,    // alveolar
      tongueTipY: 0.9,
      tongueBodyX: 0.3,
      tongueBodyY: 0.7,
      tongueLateral: 1.0, // full lateral airflow
      lipRound: 0.0,
      lipProtrude: 0.0,
      lipClosure: 0.0,
      jawHeight: 0.4,
      velumOpen: 0,
      tractLength: 1.0
    }
  },
  "ǀ": {
    symbol: "ǀ",
    type: "click",
    duration: 0.12,
    burstZone: 1,         // where to inject the burst (tract zone index)
    burstDuration: 0.018, // seconds
    burstSharpness: 0.95, // envelope sharpness
    burstGain: 1.2,       // amplitude
    clickType: 0,         // (optional) for future: 0=dental, 1=alveolar, etc.
    voiced: false
  },

  "ǃ": {
    symbol: "ǃ",
    type: "click",
    duration: 0.12,
    burstZone: 2,
    burstDuration: 0.018,
    burstSharpness: 0.95,
    burstGain: 1.2,
    clickType: 1,
    voiced: false
  },

  "ǂ": {
    symbol: "ǂ",
    type: "click",
    duration: 0.12,
    burstZone: 3,
    burstDuration: 0.018,
    burstSharpness: 0.95,
    burstGain: 1.2,
    clickType: 2,
    voiced: false
  },

  "ǁ": {
    symbol: "ǁ",
    type: "click",
    duration: 0.13,
    burstZone: 3, // lateral burst (postalveolar/palatal)
    burstDuration: 0.018,
    burstSharpness: 0.95,
    burstGain: 1.3,
    clickType: 3, // 3 = lateral
    voiced: false,
    tractLeft: [1, 1, 0, 0, 1, 1, 1, 1], // closure at lateral zones (2,3)
    tractRight: [1, 1, 1, 0, 0, 1, 1, 1]  // closure at lateral zones (3,4)
  },


  // Taps
  "ɾ": {
    symbol: "ɾ",
    type: "tap",
    tapZone: 2,           // alveolar
    tapDuration: 0.025,   // seconds
    tapGain: 0.5,
    duration: 0.05,       // for envelope/gating
    voiced: true
  },
  "ɽ": {
    symbol: "ɽ",
    type: "tap",
    tapZone: 4,           // retroflex (postalveolar/palatal)
    tapDuration: 0.025,
    tapGain: 0.5,
    duration: 0.05,
    voiced: true
  },
  "ɺ": {
    symbol: "ɺ",
    type: "tap",
    tapZone: 2,           // lateral tap, still alveolar-ish
    tapDuration: 0.025,
    tapGain: 0.5,
    duration: 0.05,
    voiced: true,
    tractLeft: [1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5],
    tractRight: [1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5],
  },

  // Trills
  "r": {
    symbol: "r",
    type: "trill",
    trillZone: 2,         // alveolar
    trillCycles: 4,       // typical for [r]
    trillRate: 28,        // Hz (cycles per second)
    trillGain: 1.0,
    duration: 0.12,       // total trill duration (seconds)
    voiced: true
  },
  "ʙ": {
    symbol: "ʙ",
    type: "trill",
    trillZone: 0,         // bilabial
    trillCycles: 3,
    trillRate: 20,
    trillGain: 1.0,
    duration: 0.15,
    voiced: true
  },
  "ʀ": {
    symbol: "ʀ",
    type: "trill",
    trillZone: 6,         // uvular
    trillCycles: 3,
    trillRate: 22,
    trillGain: 1.0,
    duration: 0.13,
    voiced: true
  }

};
