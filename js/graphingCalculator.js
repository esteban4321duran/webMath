"use strict";

const subscribeEventListeners = function () {
  InputRangeScale.addEventListener("change", scaleChanged);
  document.addEventListener("keydown", enterPressed);
  graph.addEventListener("click", graphPressed);
  for (let i = 0; i < graphs.length; i++) {
    graphs[i].type.addEventListener("change", updateGraphInputControls);
  }
};

//EVENT_LISTENER
const scaleChanged = function () {
  scale = InputRangeScale.value;
  render();
};

const updateScaleLabel = function (value) {
  LabelScaleValue.textContent = value;
};

const render = function () {
  disposeCanvas();
  resizeCanvas();
  updateCanvasInfo();
  resetCanvasContainerScroll();
  drawGrid();
  drawXAxis();
  drawYAxis();
  drawHorizontalAxis();
  drawVerticalAxis();
  graphFunctions();
  updateScaleLabel(scale);
};

const disposeCanvas = function () {
  ctx.clearRect(0, 0, width, height);
};

const resizeCanvas = function () {
  canvas.width = 100 * scale;
  canvas.height = 100 * scale;
};

const resetCanvasContainerScroll = function () {
  canvasContainer.scrollTop = canvas.height / 2 - canvasContainer.height / 2;
  canvasContainer.scrollLeft = canvas.width / 2 - canvasContainer.width / 2;
};

const updateCanvasInfo = function () {
  ctx = canvas.getContext("2d");
  height = canvas.height;
  width = canvas.width;
  centerY = height / 2;
  centerX = width / 2;
};

const drawGrid = function () {
  //the scale used for the grid is a unit per scale amount of pixels
  drawXAxis();
  drawYAxis();
  let axisAmount = centerX / scale;
  //vertical axis to the left
  for (let a = axisAmount; a >= 0; a--) {
    drawVerticalAxis(a * scale);
  }
  //vertical axis to the right
  for (let a = axisAmount; a < 2 * axisAmount; a++) {
    drawVerticalAxis(a * scale);
  }

  axisAmount = centerY / scale;
  //horizontal axis on the upper part
  for (let a = axisAmount; a >= 0; a--) {
    drawHorizontalAxis(a * scale);
  }
  //horizontal axis on the botton part
  for (let a = axisAmount; a < 2 * axisAmount; a++) {
    drawHorizontalAxis(a * scale);
  }
};

const drawXAxis = function () {
  const y = height / 2;
  const x = 0;

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.closePath();
};

const drawYAxis = function () {
  const x = width / 2;
  const y = 0;

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.stroke();
  ctx.closePath();
};

const drawVerticalAxis = function (x) {
  ctx.strokeStyle = "rbga(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
  ctx.closePath();
};

const drawHorizontalAxis = function (y) {
  ctx.strokeStyle = "rbga(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.closePath();
};

//EVENT_LISTENER
const graphPressed = function () {
  render();
};
const enterPressed = function (e) {
  if (e.keyCode === 13) render();
};

const graphFunctions = function () {
  for (let i = 0; i < graphs.length; i++) {
    if (graphs[i].type.value !== "none") {
      switch (graphs[i].type.value) {
        case "linear":
          graphLinearFunction(graphs[i]);
          break;
        case "cuadratic":
          graphCuadraticFunction(graphs[i]);
          break;
      }
    }
  }
};

const updateGraphInputControls = function () {
  for (let i = 0; i < graphs.length; i++) {
    switch (graphs[i].type.value) {
      case "none":
        hideFunctionInputControls(graphs[i]);
        break;
      case "linear":
        showLinearFunctionInputControls(graphs[i]);
        break;
      case "cuadratic":
        showCuadraticFunctionInputControls(graphs[i]);
        break;
    }
  }
};

const hideFunctionInputControls = function (graph) {
  graph.label1.textContent = "";
  graph.label2.textContent = "";
  if (!graph.in0.classList.contains("hidden"))
    graph.in0.classList.add("hidden");
  if (!graph.label1.classList.contains("hidden"))
    graph.label1.classList.add("hidden");
  if (!graph.in1.classList.contains("hidden"))
    graph.in1.classList.add("hidden");
  if (!graph.label2.classList.contains("hidden"))
    graph.label2.classList.add("hidden");
  if (!graph.in2.classList.contains("hidden"))
    graph.in2.classList.add("hidden");
};

const showLinearFunctionInputControls = function (graph) {
  graph.label1.textContent = " x + ";
  graph.label2.textContent = "";

  if (graph.in0.classList.contains("hidden"))
    graph.in0.classList.remove("hidden");
  if (graph.label1.classList.contains("hidden"))
    graph.label1.classList.remove("hidden");
  if (graph.in1.classList.contains("hidden"))
    graph.in1.classList.remove("hidden");
  if (!graph.label2.classList.contains("hidden"))
    graph.label2.classList.add("hidden");
  if (!graph.in2.classList.contains("hidden"))
    graph.in2.classList.add("hidden");
};

const showCuadraticFunctionInputControls = function (graph) {
  graph.label1.textContent = " x^2 + ";
  graph.label2.textContent = " x + ";

  if (graph.in0.classList.contains("hidden"))
    graph.in0.classList.remove("hidden");
  if (graph.label1.classList.contains("hidden"))
    graph.label1.classList.remove("hidden");
  if (graph.in1.classList.contains("hidden"))
    graph.in1.classList.remove("hidden");
  if (graph.label2.classList.contains("hidden"))
    graph.label2.classList.remove("hidden");
  if (graph.in2.classList.contains("hidden"))
    graph.in2.classList.remove("hidden");
};

const graphLinearFunction = function (graph) {
  let y = 0;
  let lastPointX, lastPointY;
  let newPointX, newPointY;
  let firstPoint = true;
  const m = Number(graph.in0.value);
  const b = Number(graph.in1.value);
  const color = graph.color.value;
  const weight = Number(graph.weight.value);

  for (let x = 0; x < width; x++) {
    y = getImageY(m * scale * (x - centerX) + b * scale ** 2); //Multiply b by the scale to signify that it is measured in units
    if (!firstPoint) {
      lastPointX = newPointX;
      lastPointY = newPointY;
    }
    newPointX = x;
    newPointY = y;
    if (firstPoint) {
      //Do not draw if this is the first point in the curve
      lastPointX = newPointX;
      lastPointY = newPointY;
      firstPoint = false;
      continue;
    }
    // console.log(`startX:${lastPointX} startY:${lastPointY} EndX${newPointX}`);
    plot(lastPointX, lastPointY, newPointX, newPointY, color, weight);
  }
};

const graphCuadraticFunction = function (graph) {
  let y;
  let lastPointX, lastPointY;
  let newPointX, newPointY;
  let firstPoint = true;
  const a = Number(graph.in0.value);
  const b = Number(graph.in1.value);
  const c = Number(graph.in2.value);
  const color = graph.color.value;
  const weight = Number(graph.weight.value);

  for (let x = 0; x < width; x++) {
    y = getImageY(
      a * (x - centerX) ** 2 + b * scale * (x - centerX) + c * scale ** 2
    );
    if (!firstPoint) {
      lastPointX = newPointX;
      lastPointY = newPointY;
    }
    newPointX = x;
    newPointY = y;
    if (firstPoint) {
      //Do not draw if this is the first point in the curve
      lastPointX = newPointX;
      lastPointY = newPointY;
      firstPoint = false;
      continue;
    }
    // console.log(`startX:${lastPointX} startY:${lastPointY} EndX${newPointX}`);
    plot(lastPointX, lastPointY, newPointX, newPointY, color, weight);
    // if (x >= 140) debugger;
  }
};

const getImageY = function (expression) {
  return -expression / scale + centerY;
};

const plot = function (startX, startY, endX, endY, color, weight) {
  // const lineLength = Math.sqrt((endX-startX)**2+(endY-startY)**2); //distance between the 2 plot points
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.closePath();
  ctx.stroke();
};

//Canvas properties
const canvas = document.getElementById("canvasFunctionGraph");
let ctx = canvas.getContext("2d");
let height = canvas.height;
let width = canvas.width;
let centerY = height / 2;
let centerX = width / 2;
let scale = 50;

//UI components
const canvasContainer = document.querySelector(".canvasContainer");
canvasContainer.width = 540;
canvasContainer.height = 540;
const InputRangeScale = document.getElementById("scale");
const LabelScaleValue = document.getElementById("scaleValue");
const buttonGraph = document.getElementById("graph");

//Graphs info
const graph0 = {
  type: document.getElementById("0-type"),
  label0: document.getElementById("0-0"),
  in0: document.getElementById("0-1"),
  label1: document.getElementById("0-2"),
  in1: document.getElementById("0-3"),
  label2: document.getElementById("0-4"),
  in2: document.getElementById("0-5"),
  color: document.getElementById("0-color"),
  weight: document.getElementById("0-weight"),
};
const graph1 = {
  type: document.getElementById("1-type"),
  label0: document.getElementById("1-0"),
  in0: document.getElementById("1-1"),
  label1: document.getElementById("1-2"),
  in1: document.getElementById("1-3"),
  label2: document.getElementById("1-4"),
  in2: document.getElementById("1-5"),
  color: document.getElementById("1-color"),
  weight: document.getElementById("1-weight"),
};
const graph2 = {
  type: document.getElementById("2-type"),
  label0: document.getElementById("2-0"),
  in0: document.getElementById("2-1"),
  label1: document.getElementById("2-2"),
  in1: document.getElementById("2-3"),
  label2: document.getElementById("2-4"),
  in2: document.getElementById("2-5"),
  color: document.getElementById("2-color"),
  weight: document.getElementById("2-weight"),
};

const graphs = [];
graphs.push(graph0);
graphs.push(graph1);
graphs.push(graph2);

subscribeEventListeners();
render();
