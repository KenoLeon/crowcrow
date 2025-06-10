/**
 * Maps high-level articulator parameters to 8 tract zone values.
 * @param {Object} articulators - The articulator object from phonemeMap.
 * @returns {number[]} Array of 8 zone values (0–1).
 */
export function articulatorsToZones(articulators) {
  if (!articulators) return [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5]; // fallback

  // Example linear mapping (tweak as needed for realism)
  const {
    tongueTipX = 0.5, tongueTipY = 0.5,
    tongueBodyX = 0.5, tongueBodyY = 0.5,
    tongueLateral = 0,
    lipRound = 0, lipProtrude = 0, lipClosure = 0,
    jawHeight = 0.5,
    velumOpen = 0,    
  } = articulators;

  // Simple illustrative mapping (customize for your model!)
  return [
    // zone0: lips/front
    1 - lipClosure + 0.2 * lipRound + 0.1 * lipProtrude,
    // zone1: alveolar ridge (tongue tip)
    1 - tongueTipY + 0.2 * tongueTipX,
    // zone2: post-alveolar (tongue tip/body)
    1 - tongueTipY + 0.3 * tongueBodyX,
    // zone3: palatal (tongue body)
    1 - tongueBodyY + 0.2 * tongueBodyX,
    // zone4: velar (tongue body/back)
    1 - tongueBodyY + 0.5 * tongueBodyX,
    // zone5: velar/uvular (tongue back)
    1 - tongueBodyY + 0.7 * tongueBodyX,
    // zone6: pharyngeal
    1 - jawHeight,
    // zone7: glottal
    1 - jawHeight
  ].map(v => Math.max(0, Math.min(1, v))); // clamp to [0,1]
}

