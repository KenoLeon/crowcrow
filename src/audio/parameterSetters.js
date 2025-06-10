export function updateFrequency(glottisNode, audioContext, value) {
  if (glottisNode && audioContext && audioContext.state === 'running') {
    const freq = parseFloat(value);
    glottisNode.parameters.get('frequency').setValueAtTime(freq, audioContext.currentTime);
  }
}

export function updateTenseness(glottisNode, audioContext, value) {
  if (glottisNode && audioContext && audioContext.state === 'running') {
    glottisNode.parameters.get('tenseness').setValueAtTime(parseFloat(value), audioContext.currentTime);
  }
}

export function updateBreathCycleRate(subglottalNode, audioContext, value) {
  if (subglottalNode && audioContext && audioContext.state === 'running') {
    subglottalNode.parameters.get('breathCycleRate').setValueAtTime(parseFloat(value), audioContext.currentTime);
  }
}

export function updateEffort(subglottalNode, audioContext, value) {
  if (subglottalNode && audioContext && audioContext.state === 'running') {
    subglottalNode.parameters.get('effort').setValueAtTime(parseFloat(value), audioContext.currentTime);
  }
}


export function setParameters(
  params,
  glottisNode,
  subglottalNode,
  tractNode,
  tractSliders,
  audioContext,
  updateParameterDisplay,
  drawTract,
  getZoneValuesFromSliders,
  glideDuration = 0.04 // <-- NEW PARAM
) {
  // Glottis
  if (glottisNode && glottisNode.parameters) {
    Object.entries(params).forEach(([key, value]) => {
      if (glottisNode.parameters.has(key)) {
        glottisNode.parameters.get(key).setValueAtTime(value, audioContext.currentTime);
        updateParameterDisplay(key, value);
        const slider = document.getElementById(key + 'Slider');
        if (slider) slider.value = value;
      }
    });
  }
  // Subglottal
  if (subglottalNode && subglottalNode.parameters) {
    Object.entries(params).forEach(([key, value]) => {
      if (subglottalNode.parameters.has(key)) {
        subglottalNode.parameters.get(key).setValueAtTime(value, audioContext.currentTime);
        updateParameterDisplay(key, value);
        const slider = document.getElementById(key + 'Slider');
        if (slider) slider.value = value;
      }
    });
  }
  // Tract (zones with glide)
  if (tractNode && tractNode.parameters && params.zones && Array.isArray(params.zones)) {
    let tractChanged = false;
    const now = audioContext.currentTime;
    params.zones.forEach((value, idx) => {
      const paramName = `zone${idx}`;
      if (tractNode.parameters.has(paramName)) {
        const param = tractNode.parameters.get(paramName);
        param.cancelScheduledValues(now);
        param.setValueAtTime(param.value, now); // start from current value
        param.linearRampToValueAtTime(value, now + glideDuration);
        updateParameterDisplay(paramName, value);
        if (tractSliders && tractSliders[idx]) {
          tractSliders[idx].value = value;
        }
        tractChanged = true;
      }
    });
    if (tractChanged && drawTract && tractSliders) {
      drawTract(params.zones);
    }
  }
  // Tract (other parameters, set instantly)
  ['isLateral', 'isRhotic', 'oralClosureZone', 'noiseInjectionZone', 'fricativeEffort'].forEach(key => {
    if (tractNode && tractNode.parameters && params.hasOwnProperty(key)) {
      tractNode.parameters.get(key).setValueAtTime(params[key], audioContext.currentTime);
      updateParameterDisplay(key, params[key]);
    }
  });
}