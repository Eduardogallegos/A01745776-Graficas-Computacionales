let projectionMatrix = null, shaderProgram = null;

let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;

let vec3 = glMatrix.vec3;
let mat4 = glMatrix.mat4;

let duration = 10000;

let vertexShaderSource = `
attribute vec3 vertexPos;
attribute vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}`;

let fragmentShaderSource = `
    precision lowp float;
    varying vec4 vColor;

    void main(void) {
    // Return the pixel color: always output white
    gl_FragColor = vColor;
}
`;

function createShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
}

function initViewport(gl, canvas)
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, 0]);
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(obj of objs){
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
      gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
      gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

      gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
      gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

      gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function getNewCoords(v1, v2){
  const newX = (v1.x + v2.x) / 2;
  const newY = (v1.y + v2.y) / 2;
  const newZ = (v1.z + v2.z) / 2;
  return {
    x:newX,
    y:newY,
    z:newZ
  }
};

function createPyramid(gl, division, translation, rotationAxis) 
{
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = []
    let triangleVerts = [
        {
          x:1,
          y:-1/Math.sqrt(3),
          z:-1/Math.sqrt(6)
        },
        {
            x:-1,
            y:-1/Math.sqrt(3),
            z:-1/Math.sqrt(6)
        },
        {
            x:0,
            y:2/Math.sqrt(3),
            z:-1/Math.sqrt(6)
        },
        {
            x:0,
            y:0,
            z:3/Math.sqrt(6)
        },
    ]
    getTrianglesCoords(
      division,
      triangleVerts[0],
      triangleVerts[1],
      triangleVerts[2]
    )
    getTrianglesCoords(
      division,
      triangleVerts[0],
      triangleVerts[2],
      triangleVerts[3]
    )
    getTrianglesCoords(
      division,
      triangleVerts[0],
      triangleVerts[1],
      triangleVerts[3]
    )
    getTrianglesCoords(
      division,
      triangleVerts[1],
      triangleVerts[2],
      triangleVerts[3]
    )

    function getTrianglesCoords(subdivs, v1, v2, v3){
      if(subdivs>1){
          const newSubdivs = --subdivs;
          const newV1 = getNewCoords(v2, v3);
          const newV2 = getNewCoords (v1, v3);
          const newV3 = getNewCoords (v1, v2);
          getTrianglesCoords(newSubdivs, v1, newV2, newV3);
          getTrianglesCoords(newSubdivs, newV1, v2, newV3);
          getTrianglesCoords( newSubdivs, newV1, newV2, v3);
      }else{
        const verts2 = [v1,v2,v3]
        verts2.forEach(vert=>{
          verts.push(vert.x)
          verts.push(vert.y)
          verts.push(vert.z)
        })
      }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [];
    for (let i = 0; i < verts.length/3; i++){
        let r = Math.random();
        let g = Math.random();
        let b = Math.random();
        faceColors.push([r, g, b, 1.0]);
    }

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    faceColors.forEach(color =>{
      for (let j=0; j < 3; j++)
        vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let indices = []
    for(let index = 0; index < verts.length/3; index++){
      indices.push(index)
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    let pyramid = {
        buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
        vertSize:3, nVerts:verts.length, colorSize:4, nColors: 24, nIndices:indices.length,
        primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
    };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
	};
    
    return pyramid;
}

function update(gl, objs){
	requestAnimationFrame(()=> { update(gl, objs); });
  draw(gl, objs);
  for(i = 0; i<objs.length; i++)objs[i].update();
}

function main(){
  let canvas = document.getElementById("pyramidCanvas");
  let glCtx = initWebGL(canvas);

  initViewport(glCtx, canvas);
  initGL(glCtx, canvas);

  let pyramid = createPyramid(glCtx, 4, [0, 0, -3], [0, 1, 0]);
  initShader(glCtx, vertexShaderSource, fragmentShaderSource);
  update(glCtx, [pyramid]);
}