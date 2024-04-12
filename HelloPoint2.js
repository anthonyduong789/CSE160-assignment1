// HelloPoint1.js
// Vertex shader program
// the main point of this progam is that is shows how we can pass the position of
// a point to the vertex shader
// a_Position is the name of the attribute variable
// called a storage qualifier as the variable must be declared as a
// global variables as data is passed to it form outsidfe the shader

// declares variable then assigns it to eh gl_position`
// a_Position represents the position of a point x y z
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  " gl_Position = a_Position;\n" +
  " gl_PointSize = 10.0;\n" +
  "}\n";
// Fragment shader program
var FSHADER_SOURCE =
  "void main() {\n" +
  " gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n" + // Set the color
  "}\n";

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  // Get the storage location of attribute variable
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Set vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}
