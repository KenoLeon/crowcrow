import { drawTract } from './tractViewer.js';
import { updateParameterDisplay } from './parameterPanel.js';

// Exported utility for use elsewhere
export function getZoneValuesFromSliders(tractSliders) {
  return tractSliders.map(slider => parseFloat(slider.value));
}

// Utility to set all slider values from a zones array
export function setSlidersFromZones(tractSliders, zones) {
  zones.forEach((value, i) => {
    if (tractSliders[i]) tractSliders[i].value = value;
  });
}

// Main setup function
export function setupTractSliders(tractNode, audioContext, tractSliders) {
  tractSliders.forEach((slider, i) => {
    slider.oninput = null;
    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);

      // Update tract visualization
      drawTract(getZoneValuesFromSliders(tractSliders));

      // Update parameter panel
      updateParameterDisplay(`zone${i}`, value.toFixed(2));

      // --- NEW: Update the synth tract node if available ---
      if (tractNode && tractNode.parameters) {
        const param = tractNode.parameters.get(`zone${i}`);
        if (param && audioContext) {
          param.setValueAtTime(value, audioContext.currentTime);
        }
      }
    });
  });
}