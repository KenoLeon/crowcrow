function setNoiseParams(phoneme, noiseNode, noiseTypeMap, audioContext) {
  if (noiseNode) {
    const noiseTypeValue = noiseTypeMap[phoneme.noiseType] ?? noiseTypeMap.simplex;
    noiseNode.parameters.get('noiseType').setValueAtTime(noiseTypeValue, audioContext.currentTime);
  }
}

function setNoiseFilterParams(phoneme, noiseFilterNode, audioContext) {
  if (noiseFilterNode && phoneme.filterType) {
    noiseFilterNode.type = phoneme.filterType;
    noiseFilterNode.frequency.setValueAtTime(phoneme.filterFrequency ?? 1000, audioContext.currentTime);
    noiseFilterNode.Q.setValueAtTime(phoneme.filterQ ?? 1, audioContext.currentTime);
  } else if (noiseFilterNode) {
    noiseFilterNode.type = 'allpass';
    noiseFilterNode.frequency.setValueAtTime(1000, audioContext.currentTime);
    noiseFilterNode.Q.setValueAtTime(1, audioContext.currentTime);
  }
}

function setGlottalStop(phoneme, glottisNode, audioContext) {
  if (glottisNode && phoneme.hasOwnProperty('glottalClosure')) {
    glottisNode.parameters.get('glottalClosure').setValueAtTime(phoneme.glottalClosure, audioContext.currentTime);
  } else if (glottisNode) {
    glottisNode.parameters.get('glottalClosure').setValueAtTime(0, audioContext.currentTime);
  }
}

function setVoicedGating(phoneme, glottisNode, audioContext, updateVoicedIndicator) {
  if (glottisNode && phoneme.hasOwnProperty('voiced')) {
    glottisNode.parameters.get('voiced').setValueAtTime(phoneme.voiced ? 1 : 0, audioContext.currentTime);
    updateVoicedIndicator(phoneme.voiced);
  }
}

function setNasalOralControl(phoneme, nasalNode, tractNode, audioContext) {
  if (phoneme.isNasal) {
    if (nasalNode) {
      nasalNode.parameters.get('nasalCoupling').setValueAtTime(phoneme.nasalCoupling ?? 1.0, audioContext.currentTime);
    }
    if (tractNode) {
      tractNode.parameters.get('oralClosureZone').setValueAtTime(phoneme.oralClosureZone ?? -1, audioContext.currentTime);
    }
  } else {
    if (nasalNode) {
      nasalNode.parameters.get('nasalCoupling').setValueAtTime(0, audioContext.currentTime);
    }
    if (tractNode) {
      tractNode.parameters.get('oralClosureZone').setValueAtTime(
        phoneme.oralClosureZone !== undefined ? phoneme.oralClosureZone : -1,
        audioContext.currentTime
      );
    }
  }
}

function setLateralControl(phoneme, tractNode, audioContext) {
  if (tractNode && tractNode.parameters.has('isLateral')) {
    tractNode.parameters.get('isLateral').setValueAtTime(phoneme.isLateral ? 1 : 0, audioContext.currentTime);
    console.log(`Setting lateral control for phoneme to ${phoneme.isLateral ? 'lateral' : 'non-lateral'}`);
  }
}

function setRhoticControl(phoneme, tractNode, audioContext) {
  if (tractNode && tractNode.parameters.has('isRhotic')) {
    tractNode.parameters.get('isRhotic').setValueAtTime(phoneme.isRhotic ? 1 : 0, audioContext.currentTime);
    console.log(`Setting rhotic control for phoneme to ${phoneme.isRhotic ? 'rhotic' : 'non-rhotic'}`);
  }
}

function setPlosiveBurst(phoneme, transientNode) {
  if (phoneme.type === 'plosive' && transientNode) {
    transientNode.port.postMessage({
      type: 'burst',
      noiseInjectionZone: phoneme.noiseInjectionZone,
      duration: phoneme.burstDuration,
      sharpness: phoneme.burstSharpness,
      gain: phoneme.burstGain
    });
    console.log(`Triggering plosive burst for phoneme with noiseInjectionZone ${phoneme.noiseInjectionZone}, duration ${phoneme.burstDuration}, sharpness ${phoneme.burstSharpness}, gain ${phoneme.burstGain}`);
  }
}

function setFricativeNoiseParams(phoneme, tractNode, currentIntensity, audioContext) {
  if (phoneme.type === 'fricative' && tractNode) {
    tractNode.parameters.get('noiseInjectionZone').setValueAtTime(phoneme.noiseInjectionZone ?? -1, audioContext.currentTime);
    const modulatedEffort = (phoneme.effort ?? 0) * (currentIntensity ?? 1);
    tractNode.parameters.get('fricativeEffort').setValueAtTime(modulatedEffort, audioContext.currentTime);
  } else if (tractNode) {
    tractNode.parameters.get('noiseInjectionZone').setValueAtTime(-1, audioContext.currentTime);
    tractNode.parameters.get('fricativeEffort').setValueAtTime(0, audioContext.currentTime);
  }
}

function getEffectiveGlideDuration(phoneme, globalGlide) {
  return (phoneme && typeof phoneme.glideDuration === 'number') ? phoneme.glideDuration : globalGlide;
}


export {
  setNoiseParams,
  setNoiseFilterParams,
  setGlottalStop,
  setVoicedGating,
  setNasalOralControl,
  setLateralControl,
  setRhoticControl,
  setPlosiveBurst,
  setFricativeNoiseParams,
  getEffectiveGlideDuration
};