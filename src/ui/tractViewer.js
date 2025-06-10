export function drawTract(zones, tractLength = 1.0) {
  // Expect zones.length === 8
  const canvas = document.getElementById('tract-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;

  const numZones = zones.length;
  const centerX = canvas.width / 2;
  // const totalHeight = canvas.height * 0.8; // leave some margin
  const totalHeight = canvas.height * 0.8 * tractLength;
  const baseY = (canvas.height - totalHeight) / 2;
  // const spacing = totalHeight / (numZones - 1);
  const spacing = totalHeight / (numZones - 1);

  // Store left, right, and center points for profile lines
  const leftPoints = [];
  const rightPoints = [];
  const centerPoints = [];
  const ellipseTops = [];
  const ellipseBottoms = [];

  for (let i = 0; i < numZones; i++) {
    const r = zones[i];
    const radiusX = (r * canvas.width) / 4;
    const radiusY = spacing / 3;
    const y = baseY + i * spacing;

    // Draw ellipse for each zone
    ctx.beginPath();
    ctx.ellipse(centerX, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Store left, right, and center points
    leftPoints.push({ x: centerX - radiusX, y });
    rightPoints.push({ x: centerX + radiusX, y });
    centerPoints.push({ x: centerX, y });
    ellipseTops.push({ x: centerX, y: y - radiusY });
    ellipseBottoms.push({ x: centerX, y: y + radiusY });
  }

  // Draw left profile line
  ctx.beginPath();
  ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
  for (let i = 1; i < leftPoints.length; i++) {
    ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
  }
  ctx.stroke();

  // Draw right profile line
  ctx.beginPath();
  ctx.moveTo(rightPoints[0].x, rightPoints[0].y);
  for (let i = 1; i < rightPoints.length; i++) {
    ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
  }
  ctx.stroke();

  // Draw center vertical line (from top of first ellipse to bottom of last)
  ctx.beginPath();
  ctx.moveTo(ellipseTops[0].x, ellipseTops[0].y);
  ctx.lineTo(ellipseBottoms[ellipseBottoms.length - 1].x, ellipseBottoms[ellipseBottoms.length - 1].y);
  ctx.stroke();
}