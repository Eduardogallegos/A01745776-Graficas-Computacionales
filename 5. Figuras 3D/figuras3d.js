let mat4 = glMatrix.mat4;

let projectionMatrix, shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, 
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function main(){
    let canvas = document.getElementById("canvas");
    let gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    // let pyramid = createPyramid(gl, [-5, 0, -7], [0.1, 1.0, 0.2]);
    let octahedron = createOctahedron(gl,[5, 0, -6], [0, 1, 0]);
    let dodecahedron = createDodecahedron(gl,[0, 0, -6],[[-0.4, 1.0, 0.1], [0, 1, 0]]);
    
    initShader(gl);
    run(gl, [ octahedron,dodecahedron]);
}


function initWebGL(canvas) {
  let gl = null;
  let msg =
    "Your browser does not support WebGL, " +
    "or it is not enabled by default.";
  try {
    gl = canvas.getContext("experimental-webgl");
  } catch (e) {
    msg = "Error creating WebGL Context!: " + e.toString();
  }

  if (!gl) {
    alert(msg);
    throw new Error(msg);
  }

  return gl;
}

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-colored cube
function createPyramid(gl, translation, rotationAxis)
{    
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
     let verts = [
      //TriangleBase1
      0,1,0,
      -1* Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
      - 1*Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      //TriangleBase2
      0,1,0,
      - Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
     

      //TriangleBase3
      0,1,0,
      Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
    //Face1
      0,1,0,
      -1* Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
      0,0,2,
      //Face2
      0,1,0,
      Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
      0,0,2,

      //Face3
      Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
      0,0,2,

      //Face4
      - 1*Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      0,0,2,
      //Face5
      - 1*Math.sin((4*Math.PI)/5), - Math.cos((Math.PI)/5),0,
      -1* Math.sin((2*Math.PI)/5), Math.cos((2*Math.PI)/5), 0,
      0,0,2
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.0, 1.0, 0.0, 1.0], // Pentagon
        [0.0, 1.0, 0.0, 1.0], // Pentagon
        [0.0, 1.0, 0.0, 1.0], // Pentagon

        [1.0, 1.0, 0.0, 1.0], // Triangle 1
        [1.0, 0.0, 1.0, 1.0], // Triangle 2
        [0.0, 1.0, 1.0, 1.0],  // Triangle 3
        [0.0, 0.5, 1.0, 1.0], //Triangle 4
        [0.5, 0.5, 0.5, 1.0] //Trinagle 5
        

    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        //BasePentagon
       0, 1,2, 3,4,5, 
       6,7,8,    
          
       //Faces
       9,10,11, 12, 13, 14,
       15,16,17,18,19,20,
       21,22,23


    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let pyramid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:verts.length, colorSize:4, nColors: 24, nIndices:cubeIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return pyramid;
}
// Create the vertex, color and index data for a multi-colored cube
function createOctahedron(gl, translation, rotationAxis)
{    
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
     let verts = [
      //Cara1
    0, 1, 0,
    -1, 0, 0, 
    0, 0, 1,
    //Cara2
    0, 1, 0,
    1, 0, 0, 
    0, 0, 1,
    //Cara3
    0, 1, 0,
    -1, 0, 0, 
    0, 0, -1, 
    //Cara4
    0, 1, 0,
    1, 0, 0, 
    0, 0, -1,
    //Cara5
    0, -1, 0,
    -1, 0, 0, 
    0, 0, 1,
    //Cara6
    0, -1, 0,
    1, 0, 0, 
    0, 0, 1,
    //Cara7
    0, -1, 0,
    -1, 0, 0, 
    0, 0, -1, 
    //Cara8
    0, -1, 0,
    1, 0, 0, 
    0, 0, -1
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        

        [1.0, 1.0, 0.0, 1.0], // Triangle 1
        [1.0, 0.0, 1.0, 1.0], // Triangle 2
        [0.0, 1.0, 1.0, 1.0],  // Triangle 3
        [0.0, 0.5, 1.0, 1.0], //Triangle 4
        [0.5, 0.5, 0.5, 1.0], //Trinagle 5
        [0, 0.5, 0.5, 1],  // Triangle 6
        [0, 0, 0.8, 1], //Triangle 7
        [0, 0.6, 0.5, 0.3], //Trinagle 8
       
        

    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        //Faces2
        0, 1, 2, 3,4,5,
        6,7,8,9,10,11,
        12,13,14,15,16,17,18,19,20,21,22,23
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let octahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:verts.length, colorSize:4, nColors: 24, nIndices:cubeIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);
    let down=true;
    
    octahedron.update = function()
   
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        if(down){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix,[0,-6*fract,0])
            if(this.modelViewMatrix[13]<-4){
                down=false;
            }
        }
        else{
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix,[0,+6*fract,0])
            if(this.modelViewMatrix[13]>3){
                down=true;  
        }
    }
    };
    
    return octahedron;
}

function createDodecahedron(gl, translation, rotationAxis)
{  
    let phi=(1+Math.sqrt(5))/2 // 1.6180339  
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
        // Cara1
        1,1,1, //m
        0,1/phi,phi, //i
        0,-1/phi,phi, //l
        1,-1,1, //n
        phi,0,1/phi, //a

        // Cara2
        1,1,-1, //r
        1/phi,phi,0, //e
        1,1,1, //m
        phi,0,1/phi, //a
        phi,0,-1/phi,//d

        // Cara 3
        1,1,1,
        1/phi,phi,0, //e
        -1/phi,phi,0,// h
        -1,1,1,// p
        0,1/phi,phi, //i

        // Cara 4
        1/phi,phi,0, // e
        1,1,-1, // r
        0,1/phi,-phi,// j
        -1,1,-1,// q
        -1/phi,phi,0, // h

        // Cara 5
        phi,0,1/phi,// a
        1,-1,1,// n
        1/phi,-phi,0,// f
        1,-1,-1,// s
        phi,0,-1/phi,// d

        // Cara 6
        phi,0,-1/phi,// d
        1,-1,-1,// s
        0,-1/phi,-phi,// k
        0,1/phi,-phi,// j
        1,1,-1,// r

        // Cara 7
        -1,-1,-1, //t
        0,-1/phi,-phi, //k
        0,1/phi,-phi, //j
        -1,1,-1, //q
        -phi,0,-1/phi, //c

        // Cara 8
        -1,-1,1, //r
        -1/phi,-phi,0, //e
        -1,-1,-1, //m
        -phi,0,-1/phi, //a
        -phi,0,1/phi,//d

        // Cara 9
        -1,-1,-1,
        -1/phi,-phi,0, //e
        1/phi,-phi,0,// h
        1,-1,-1,// p
        0,-1/phi,-phi, //i

        // Cara 10
        -1/phi,-phi,0, // e
        -1,-1,1, // r
        0,-1/phi,phi,// j
        1,-1,1,// q
        1/phi,-phi,0, // h

        // Cara 11
        -phi,0,-1/phi,// a
        -1,1,-1,// n
        -1/phi,phi,0,// f
        -1,1,1,// s
        -phi,0,1/phi,// d

        // Cara 12
        -phi,0,1/phi,// d
        -1,1,1,// s
        0,1/phi,phi,// k
        0,-1/phi,phi,// j
        -1,-1,1,// o
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [];
    for(let index=0; index < 36; index++){
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

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0,1,2,      0,2,3,      0,3,4, // Cara 1
        5,6,7,      5,7,8,      5,8,9, // Cara 2
        10,11,12,   10,12,13,   10,13,14, // Cara 3
        15,16,17,   15,17,18,   15,18,19, // Cara 4
        20,21,22,   20,22,23,   20,23,24, // Cara 5
        25,26,27,   25,27,28,   25,28,29, // Cara 6
        30,31,32,   30,32,33,   30,33,34, // Cara 7
        35,36,37,   35,37,38,   35,38,39, // Cara 8
        40,41,42,   40,42,43,   40,43,44, // Cara 9
        45,46,47,   45,47,48,   45,48,49, // Cara 10
        50,51,52,   50,52,53,   50,53,54, // Cara 11
        55,56,57,   55,57,58,   55,58,59, // Cara 12
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let dodecahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:verts.length, colorSize:4, nColors: 24, nIndices:cubeIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);
    
    dodecahedron.update = function(){
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[1]);

    };
    
    return dodecahedron;
}

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

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i<objs.length; i++)objs[i].update();
}
