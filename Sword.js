class Sword {
  constructor() {
    this.type = "sword";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);
    drawTriangle([
      [0, -1],
      [0, -0.9],
      [0.1, -0.9],
    ]);
  }
}

function intilizedSwordDrawing() {
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  let y = -1;
  let y1 = -1;
  let fraction = 1 / 5;
  let yellow = [1, 0.824, 0.125, 1];
  let grey = [0.62, 0.612, 0.588, 1];
  let baige = [0.788, 0.624, 0.51, 1];
  // topright right angle

  let middleSection = [
    [
      -fraction - fraction / 2,
      y + fraction * 3,

      -fraction / 2,
      y + fraction * 4,

      -fraction / 2,
      y + fraction * 3,
    ],
    [
      fraction + fraction / 2,
      y + fraction * 3,

      fraction + fraction / 2,
      y + fraction * 4,

      fraction / 2,
      y + fraction * 3,
    ],
    [
      fraction + fraction / 2,
      y + fraction * 3,
      fraction + fraction / 2,
      y + fraction * 4,
      fraction / 2 + 2 * fraction,
      y + fraction * 3,
    ],
    [
      -fraction / 2,
      y + fraction * 3,
      -fraction / 2,
      y + fraction * 4,
      fraction / 2,
      y + fraction * 3,
    ],
    [
      0 + fraction / 2,
      0 + y + fraction + fraction * 3,
      0 + fraction / 2,
      0 + y + fraction * 3,
      (3 * fraction) / 2,
      fraction + y + fraction * 3,
    ],
    [
      -fraction / 2,
      0 + y + fraction + fraction * 3,
      fraction / 2,
      0 + y + fraction * 3,
      fraction / 2,
      fraction + y + fraction * 3,
    ],
  ];

  for (let i = 0; i < middleSection.length; i++) {
    initVertexBuffers(gl, middleSection[i], yellow);
  }
  console.log(middleSection.length);

  for (let i = 0; i < 8; i++) {
    if (i != 3) {
      n = initVertexBuffers(
        gl,
        [0, y1 + fraction, 0, y1, fraction, y1 + fraction],
        grey
      );
    }
    y1 += fraction;
  }

  y += fraction;
  for (let i = 0; i < 8; i++) {
    var n;

    if (i != 2) {
      n = initVertexBuffers(
        gl,
        [0, 0 + y, fraction, 0 + y, fraction, fraction + y],
        baige
      );

      if (n < 0) {
        console.og("Failed to set the positions of the vertices");
        return;
      }
    }

    y += fraction;
  }
}

function initVertexBuffers(gl, coordinates, color) {
  var vertices = new Float32Array(coordinates);
  // var vertices = new Float32Array([0, 0, 0, -fraction, 0.1, 0]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  return n;
}
