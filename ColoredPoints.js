// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "uniform float u_Size;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "  gl_PointSize = u_Size;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "uniform vec4 u_FragColor;\n" + // uniform変数
  "void main() {\n" +
  "  gl_FragColor = u_FragColor;\n" +
  "}\n";
// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }
  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, "u_Size");
}

// Global variables related to the color and size of the points
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let selectedSize = 5;
let g_selectedShape;
function addActionsForHtmlUI() {
  // this function get the color from the sliders to be used in the drawing
  document.querySelector("#redSlide").addEventListener("mouseup", function () {
    g_selectedColor[0] = this.value / 100;
  });
  document
    .querySelector("#greenSlide")
    .addEventListener("mouseup", function () {
      g_selectedColor[1] = this.value / 100;
    });
  document.querySelector("#blueSlide").addEventListener("mouseup", function () {
    g_selectedColor[2] = this.value / 100;
  });
  // size of the slider
  document.getElementById("shapeSize").addEventListener("mouseup", function () {
    selectedSize = this.value;
  });
  document.getElementById("clearButton").addEventListener("click", function () {
    g_shapeLists = [];
    renderAllShapes();
  });
  document
    .getElementById("turnOnSquare")
    .addEventListener("click", function () {
      g_selectedShape = "square";
    });
  document
    .getElementById("turnOnTriangle")
    .addEventListener("click", function () {
      g_selectedShape = "triangle";
    });
  document
    .getElementById("turnOnCircle")
    .addEventListener("click", function () {
      g_selectedShape = "circle";
    });
}
function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // sets up the shadow programs and also the
  connectVariablesToGLSL();
  // register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // checks to see if the button was being pressed while the mouse was moving
  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) click(ev);
  };
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  addActionsForHtmlUI();

  // // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_shapeLists = [];
// var g_points = []; // The array for the position of a mouse press
// var g_colors = []; // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point
function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);
  let point;
  if (g_selectedShape == "square") {
    point = new Square();
  } else if (g_selectedShape == "triangle") {
    point = new Triangle();
  } else if (g_selectedShape == "circle") {
    point = new Circle();
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = selectedSize;
  g_shapeLists.push(point);
  // console.log(g_shapeLists);
  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // g_colors.push(g_selectedColor.slice());
  // // console.log(g_selectedColor);
  // g_sizes.push(selectedSize);
  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {
  // First quadrant
  // g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
  // } else if (x < 0.0 && y < 0.0) {
  // // Third quadrant
  // g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
  // } else {
  // // Others
  // g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
  // }
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}
// this function draws all the shaepes
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapeLists.length;
  for (var i = 0; i < len; i++) {
    g_shapeLists[i].render();
  }
}
