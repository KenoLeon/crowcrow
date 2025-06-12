# CrowCrow: Parametric Articulatory Voice Synth (Experimental)

[![CrowCrow UI Screenshot](public/screenshots/ui-overview.png)](public/screenshots/ui-overview.png)
*CrowCrow main UI (click to enlarge)*

---

**CrowCrow** is an experimental, browser-based parametric articulatory speech synthesizer.  
This branch is not under active development, but is preserved as an artifact for reference, inspiration, or further research.

---

## Features

- Real-time articulatory speech synthesis in the browser (Web Audio API + AudioWorklet)
- Modular, extensible audio engine (Glottis, Tract, Nasal, Click, Tap, Trill, etc.)
- Partial IPA phoneme coverage (vowels, plosives, fricatives, nasals, clicks, trills, taps, etc.)
- Interactive UI: phoneme buttons, tract visualizer, oscilloscope, parameter sliders
- Phoneme text input and sequencer for custom utterances
- Designed for research, education, and creative coding

---

## Live Demo

👉 [Try CrowCrow on GitHub Pages](https://kenoleon.github.io/crowcrow/)

---

## Screenshots

- **Full UI:**  
  ![CrowCrow UI](public/screenshots/ui-overview.png)

- **Phoneme Text Input:**  
  ![Phoneme Text Input](public/screenshots/phoneme-input.png)

- **Tract Visualizer & Oscilloscope:**  
  ![Tract and Oscilloscope](public/screenshots/tract-oscilloscope.png)

---

## Getting Started

### Online

Just visit: [https://kenoleon.github.io/crowcrow/](https://kenoleon.github.io/crowcrow/)

### Local

```sh
git clone https://github.com/kenoleon/crowcrow.git
cd crowcrow
npm install
npm run build
npm start
# Then open http://localhost:8080/
```

---

## Usage

- **Start Synth** else you wont hear a thing.
- **Click phoneme buttons** to hear individual sounds.
- **Move the master Gain** to hear a continuous waveform.  
- **Adjust sliders** for pitch, tenseness, tract shape, etc.
- **Enter a sequence** in the phoneme text input and press "Play" to synthesize custom utterances.
- **Watch the tract visualizer and oscilloscope** update in real time.

---

## Architecture

- **Audio Signal Chain:**
  Subglottal → Glottis → Chestiness → Transient → Tract/Nasal/Click/Tap/Trill → Summing → Gain → Master Gain → Analyser → Output

- **Processors:**  
  - `public/audio/processors/`: AudioWorkletProcessors for each stage
  - `src/main.js`: Main controller, node creation, UI, parameter flow
  - `src/state/phonemeMap.js`: Phoneme definitions and parameters

---

## Phoneme Map

- All phonemes are defined in [`src/state/phonemeMap.js`](src/state/phonemeMap.js) using articulator parameters.
- You can add or modify phonemes by editing this file and the UI.

---

## Development

- **Build:** `npm run build`
- **Dev server:** `npm start`
- **Deploy:** Push to `main` branch; GitHub Actions will auto-deploy to Pages.

---

## License

MIT License (see [LICENSE](LICENSE))

---

## Credits

- Created by Keno Leon
- Inspired by Pink Trombone and other open-source speech synthesis projects

---

## Status

**This branch is experimental and will not be developed further.**  
It is preserved as a reference artifact for the community.

---

## Roadmap / Ideas (Not Planned)

- Coarticulation and expressive prosody
- Voice customization and presets
- AI-driven parameterization
- Improved UI/UX and accessibility

---

*Feel free to fork or reference for your own projects!*
