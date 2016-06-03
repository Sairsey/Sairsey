/**
 * Created by VP1 on 03.06.2016.
 */

var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, path, type) {

    str = readFile(path);

    var shader;
    if (type == "frag") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vert") {
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


var shaderProgram;
var shaderProgram2;
var num2 = 2;
var num = 25;
var iterations = 2;
var deltawheel = 0.25;
var OldMouseX = 0.0
var OldMouseY = 0.0;
var posX = 5.0;
var posY = 0.0;
var L = -2.0;
var R = 1.0;
var T = 1.5;
var B = -1.5;
var W;
var H;

function initShaders() {
    var fragmentShader = getShader(gl, "shader.frag", "frag");
    var vertexShader = getShader(gl, "shader.vert", "vert");
    var fragmentShader2 = getShader(gl, "cube.frag", "frag");
    var vertexShader2 = getShader(gl, "cube.vert", "vert");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, fragmentShader);
    gl.attachShader(shaderProgram, vertexShader);
    gl.linkProgram(shaderProgram);


    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shader 1");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    shaderProgram2 = gl.createProgram();
    gl.attachShader(shaderProgram2, fragmentShader2);
    gl.attachShader(shaderProgram2, vertexShader2);
    gl.linkProgram(shaderProgram2);


    if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
        alert("Could not initialise shader 2 ");
    }

    gl.useProgram(shaderProgram2);

    shaderProgram2.vertexPositionAttribute = gl.getAttribLocation(shaderProgram2, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram2.vertexPositionAttribute);

    shaderProgram2.textureCoordAttribute = gl.getAttribLocation(shaderProgram2, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram2.textureCoordAttribute);

    shaderProgram2.pMatrixUniform = gl.getUniformLocation(shaderProgram2, "uPMatrix");
    shaderProgram2.mvMatrixUniform = gl.getUniformLocation(shaderProgram2, "uMVMatrix");
    shaderProgram2.samplerUniform = gl.getUniformLocation(shaderProgram2, "uSampler");
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setAllUniforms(num) {
    var OldMouseX, OldMouseY;
    if (OldMouseX != posX || OldMouseY != posY) {
        OldMouseX = posX;
        OldMouseY = posY;
    }

    gl.uniform1i(gl.getUniformLocation(shaderProgram, "size"), num);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "size2"), num2);
    gl.uniform2f(gl.getUniformLocation(shaderProgram, "DeltaMouse"), DposX / 1000.0, DposY / 1000.0);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "L"), L);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "R"), R);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "T"), T);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "B"), B);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var neheTexture;

function initTexture() {
    neheTexture = gl.createTexture();
    neheTexture.image = new Image();
    neheTexture.image.onload = function () {
        handleLoadedTexture(neheTexture)
    }

    neheTexture.image.src = "images.jpg";
}

var squareVertexPositionBuffer;

var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;


function initBuffers() {
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    var vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11,  // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;

}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var flagi = 0;

function drawScene(num) {
    var date = new Date();
    var i = 0, flag = 1;
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer[0]);
    gl.useProgram(shaderProgram);

    gl.viewport(0, 0, rttFramebuffer[0].width, rttFramebuffer[0].height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, neheTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setAllUniforms(num);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

    gl.bindTexture(gl.TEXTURE_2D, rttTexture[0]);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.useProgram(shaderProgram2);

    while (i < iterations)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer[flag]);
        gl.viewport(0, 0, rttFramebuffer[flag].width, rttFramebuffer[flag].height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.perspective(45, 1.66, 0.1, 100.0, pMatrix);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [0, 0.0, -5.0]);
        mat4.rotate(mvMatrix, degToRad(date.getTime() / 50.0), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(date.getTime() / 50.0), [0, 1, 0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram2.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram2.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rttTexture[1 - flag]);
        gl.uniform1i(shaderProgram2.samplerUniform, 0);

        gl.uniformMatrix4fv(shaderProgram2.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram2.mvMatrixUniform, false, mvMatrix);
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        gl.bindTexture(gl.TEXTURE_2D, rttTexture[flag]);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        flag = 1 - flag;
        i++;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0, 0.0, -5.0]);
    mat4.rotate(mvMatrix, degToRad(date.getTime() / 50.0), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(date.getTime() / 50.0), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram2.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram2.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rttTexture[flag]);
    gl.uniform1i(shaderProgram2.samplerUniform, 0);

    gl.uniformMatrix4fv(shaderProgram2.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram2.mvMatrixUniform, false, mvMatrix);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function readFile(path) {
    var File = new XMLHttpRequest();
    var txt = "";
    File.open("GET", path, false);
    File.send(null);
    txt = File.responseText;
    return txt;
}

var rttFramebuffer = [];
var rttTexture = [];

function initTextureFramebuffer() {
    rttFramebuffer[0] = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer[0]);
    rttFramebuffer[0].width = 512;
    rttFramebuffer[0].height = 512;

    rttTexture[0] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rttTexture[0]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer[0].width, rttFramebuffer[0].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer[0].width, rttFramebuffer[0].height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture[0], 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    rttFramebuffer[1] = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer[1]);
    rttFramebuffer[1].width = 512;
    rttFramebuffer[1].height = 512;

    rttTexture[1] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rttTexture[1]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer[1].width, rttFramebuffer[1].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var renderbuffer2 = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer2);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer[1].width, rttFramebuffer[1].height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture[1], 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer[1]);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initTextureFramebuffer();
    initShaders();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene(5.0);
    tick();
}

function getkey() {
    num = document.getElementById("Space").value;
}
function getkey2() {
    num2 = document.getElementById("Space2").value;
}

function getkey3() {
    iterations = document.getElementById("Space3").value;
}

function tick() {
    window.requestAnimationFrame(tick);
    drawScene(num);
}

function wheel() {
    var evt = window.event || e;
    var rect = document.getElementById('canvas');
    var delta = ((((event.wheelDelta) ? event.wheelDelta / 120 : event.detail / -3) || false) > 0) ? (9.0 / 10.0) : (10.0 / 9.0);
    posX = evt.clientX - rect.getBoundingClientRect().left;
    posY = evt.clientY - rect.getBoundingClientRect().top;
    W = R - L;
    H = T - B;
    L = L + posX / rect.width * W * (1 - delta);
    R = L + W * delta;
    B = B + posY / rect.height * H * (1 - delta);
    T = B + H * delta;
}

function mouse_position() {
    var e = window.event;

    posX = e.clientX;
    posY = e.clientY;
}

var IsDrag = 0;
function dragStart() {
    IsDrag = 1;
}

function dragEnd() {
    IsDrag = 0;
}

var DposY = 0.0;
var DposX = 0.0;

function dragNow() {
    var e = window.event;
    var rect = document.getElementById('canvas').getBoundingClientRect();
    if (IsDrag) {
        var deltaX, deltaY;
        deltaX = e.clientX - rect.left - posX;
        deltaY = e.clientY - rect.top - posY;
        L -= deltaX / (rect.width / (R - L));
        R -= deltaX / (rect.width / (R - L));
        B -= deltaY / (rect.height / (T - B));
        T -= deltaY / (rect.height / (T - B));
    }
    posX = e.clientX - rect.left;
    posY = e.clientY - rect.top;
}

