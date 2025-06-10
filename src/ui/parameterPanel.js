export function renderParameterList(glottisParameterDescriptors, subglottalParameterDescriptors, tractParameterDescriptors) {
  const paramList = document.getElementById('parameter-list');
  if (!paramList) return;

  const allParams = [
    ...glottisParameterDescriptors,
    ...subglottalParameterDescriptors,
    ...tractParameterDescriptors,
    { name: 'masterGain', defaultValue: 1 }
  ];

  paramList.innerHTML = allParams.map(desc =>
    `<li><strong>${desc.name}</strong>: <span id="param-${desc.name}">${desc.defaultValue}</span></li>`
  ).join('');
}

export function updateParameterDisplay(name, value) {
  const el = document.getElementById(`param-${name}`);
  if (el) el.textContent = value;
}

