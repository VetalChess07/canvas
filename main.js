const canvas = document.getElementById("polygonCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const polygonAreaDiv = document.getElementById("polygon-area");

let isDrawing = false;
let points = [];
let isDragging = false;
let currentLine = null;

function startDrawing() {
  clearCanvas();
  isDrawing = true;
  startButton.disabled = true;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  polygonAreaDiv.textContent = "";
  points = [];
  currentLine = null;
}

function addPoint(x, y) {
  points.push({ x, y });
  drawPoint(x, y);
  drawLineToCurrentPoint(x, y);
}

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
}

function drawLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLineToCurrentPoint(x, y) {
  if (points.length > 1) {
    const lastPoint = points[points.length - 2];
    drawLine(lastPoint, { x, y });
  }
}

function drawAllElements() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    drawPoint(point.x, point.y);

    if (i > 0) {
      drawLine(points[i - 1], point);
    }
  }
}

function finishPolygon() {
  if (points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  const area = calculatePolygonArea(points);
  polygonAreaDiv.textContent = `Площадь многоугольника: ${area} кв. ед.`;

  isDrawing = false;
  points = [];
  startButton.disabled = false;
}

function calculatePolygonArea(points) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;
  return area.toFixed(2);
}

function isNear(point1, point2) {
  return Math.abs(point1.x - point2.x) < 8 && Math.abs(point1.y - point2.y) < 8;
}

function handleMouseDown(event) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (points.length > 0 && isNear({ x, y }, points[0])) {
    finishPolygon();
  } else {
    addPoint(x, y);
    isDragging = true;
  }
}

function handleMouseMove(event) {
  if (!isDrawing || !isDragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  drawAllElements();

  if (points.length > 0) {
    drawLine(points[points.length - 1], { x, y });
  }
}

function handleMouseUp() {
  if (isDragging) {
    isDragging = false;
  }
}

startButton.addEventListener("click", startDrawing);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
