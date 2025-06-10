/**
 * Handles click phonemes: sets tract shape, triggers click, animates tract.
 */
export function handleClickPhoneme(phoneme, id, context) {
  const { tractNode, audioContext, clickNode, gateMasterGain, animateMasterGainSlider, drawTract, getTractLength } = context;

  if (phoneme.tractLeft && phoneme.tractRight && tractNode && tractNode.parameters) {
    for (let i = 0; i < 8; i++) {
      const leftParam = tractNode.parameters.get(`tractLeft${i}`);
      const rightParam = tractNode.parameters.get(`tractRight${i}`);
      if (leftParam) leftParam.setValueAtTime(phoneme.tractLeft[i], audioContext.currentTime);
      if (rightParam) rightParam.setValueAtTime(phoneme.tractRight[i], audioContext.currentTime);
    }
  }

  if (clickNode) {
    clickNode.parameters.get('clickType').setValueAtTime(phoneme.clickType || 0, audioContext.currentTime);
    clickNode.parameters.get('burstZone').setValueAtTime(phoneme.burstZone || 1, audioContext.currentTime);
    clickNode.parameters.get('burstDuration').setValueAtTime(phoneme.burstDuration || 0.018, audioContext.currentTime);
    clickNode.parameters.get('burstSharpness').setValueAtTime(phoneme.burstSharpness || 0.95, audioContext.currentTime);
    clickNode.parameters.get('burstGain').setValueAtTime(phoneme.burstGain || 1.2, audioContext.currentTime);
    clickNode.parameters.get('trigger').setValueAtTime(1, audioContext.currentTime);
    clickNode.parameters.get('trigger').setValueAtTime(0, audioContext.currentTime + 0.01);
  }

  if (phoneme.duration) {
    gateMasterGain(phoneme.duration);
    animateMasterGainSlider(phoneme.duration);
  }

  if (phoneme.burstZone !== undefined) {
    const zones = Array(8).fill(0.5);
    zones[phoneme.burstZone] = 1.0;
    drawTract(zones, getTractLength());
    setTimeout(() => {
      zones[phoneme.burstZone] = 0.5;
      drawTract(zones, getTractLength());
    }, 80);
  }
}

/**
 * Handles tap phonemes: sets tract shape, triggers tap, animates tract.
 */
export function handleTapPhoneme(phoneme, id, context) {
  const { tractNode, audioContext, tapNode, gateMasterGain, animateMasterGainSlider, drawTract, getTractLength } = context;

  if (phoneme.tractLeft && phoneme.tractRight && tractNode && tractNode.parameters) {
    for (let i = 0; i < 8; i++) {
      const leftParam = tractNode.parameters.get(`tractLeft${i}`);
      const rightParam = tractNode.parameters.get(`tractRight${i}`);
      if (leftParam) leftParam.setValueAtTime(phoneme.tractLeft[i], audioContext.currentTime);
      if (rightParam) rightParam.setValueAtTime(phoneme.tractRight[i], audioContext.currentTime);
    }
  }

  if (tapNode) {
    tapNode.parameters.get('tapZone').setValueAtTime(phoneme.tapZone || 2, audioContext.currentTime);
    tapNode.parameters.get('tapDuration').setValueAtTime(phoneme.tapDuration || 0.025, audioContext.currentTime);
    tapNode.parameters.get('tapGain').setValueAtTime(phoneme.tapGain || 1.0, audioContext.currentTime);
    tapNode.parameters.get('trigger').setValueAtTime(1, audioContext.currentTime);
    tapNode.parameters.get('trigger').setValueAtTime(0, audioContext.currentTime + 0.01);
  }

  if (phoneme.duration) {
    gateMasterGain(phoneme.duration);
    animateMasterGainSlider(phoneme.duration);
  }

  if (phoneme.tapZone !== undefined) {
    const zones = Array(8).fill(0.5);
    zones[phoneme.tapZone] = 1.0;
    drawTract(zones, getTractLength());
    setTimeout(() => {
      zones[phoneme.tapZone] = 0.5;
      drawTract(zones, getTractLength());
    }, 40);
  }
}

/**
 * Handles trill phonemes: triggers trill, animates tract.
 */
export function handleTrillPhoneme(phoneme, id, context) {
  const { trillNode, audioContext, gateMasterGain, animateMasterGainSlider, drawTract, getTractLength } = context;

  if (trillNode) {
    trillNode.parameters.get('trillZone').setValueAtTime(phoneme.trillZone || 2, audioContext.currentTime);
    trillNode.parameters.get('trillCycles').setValueAtTime(phoneme.trillCycles || 3, audioContext.currentTime);
    trillNode.parameters.get('trillRate').setValueAtTime(phoneme.trillRate || 20, audioContext.currentTime);
    trillNode.parameters.get('trillGain').setValueAtTime(phoneme.trillGain || 1.0, audioContext.currentTime);
    trillNode.parameters.get('trigger').setValueAtTime(1, audioContext.currentTime);
    trillNode.parameters.get('trigger').setValueAtTime(0, audioContext.currentTime + 0.01);
  }

  if (phoneme.duration) {
    gateMasterGain(phoneme.duration);
    animateMasterGainSlider(phoneme.duration);
  }

  if (phoneme.trillZone !== undefined) {
    const zones = Array(8).fill(0.5);
    let cycle = 0;
    const cycles = phoneme.trillCycles || 3;
    const rate = phoneme.trillRate || 20;
    const period = 1000 / rate;
    function animateTrill() {
      if (cycle >= cycles) return;
      zones[phoneme.trillZone] = 1.0;
      drawTract(zones, getTractLength());
      setTimeout(() => {
        zones[phoneme.trillZone] = 0.5;
        drawTract(zones, getTractLength());
        cycle++;
        setTimeout(animateTrill, period);
      }, period * 0.2);
    }
    animateTrill();
  }
}



