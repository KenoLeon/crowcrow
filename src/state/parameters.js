// NOTE: These parameter descriptors must be kept in sync manually with the
// corresponding parameterDescriptors in GlottisProcessor.js, SubglottalProcessor.js, etc.
// Changes here do NOT automatically update the processor defaults.

// parameters.js
export const glottisParameterDescriptors = [
  { name: 'frequency', defaultValue: 120, minValue: 50, maxValue: 400, automationRate: 'a-rate' },
  { name: 'tenseness', defaultValue: 0.6, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
];

export const subglottalParameterDescriptors = [
  { name: 'breathCycleRate', defaultValue: 0.2, minValue: 0.05, maxValue: 1.0, automationRate: 'a-rate' },
  { name: 'effort', defaultValue: 0.8, minValue: 0, maxValue: 1, automationRate: 'a-rate' }
];

export const tractParameterDescriptors = [
  { name: 'zone0', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone1', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone2', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone3', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone4', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone5', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone6', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
  { name: 'zone7', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' }
];