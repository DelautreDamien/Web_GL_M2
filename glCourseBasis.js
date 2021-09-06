// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var posTab=[0.0, 0.1, 0.2, 0.3];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();

var pathTab = [];

var quadTab = [];
var texTab = [];
mat4.identity(objMatrix);

// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);
	initBuffers();
	initTexture();
	loadShaders('shader');
	//Serie 1 DICOM
	for (let index = 0; index < 10; index++) {
		pathTab.push("image-0000"+index+".jpg");
	} 
	for (let index = 10; index < 100; index++) {
		pathTab.push("image-000"+index+".jpg");
	} 
	for (let index = 100; index < 361; index++) {
		pathTab.push("image-00"+index+".jpg");
	} 
	//Serie 1
	/* for (let index = 1; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
	}
	for (let index = 10; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
	} */
	//Serie 2
	/* for (let index = 2; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
	}
	for (let index = 11; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
	} */ 
	//Serie 3
	/* for (let index = 3; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
	}
	for (let index = 12; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
	}*/

	initTexture();
	stackSize = texTab.length-1;
	Sierra = 0;//to indicate the texture to use 
	for (let index = -0.3; Sierra <= stackSize; index += 0.6/stackSize) {
		quadTab.push(new quad(index, Sierra%(texTab.length)));//not out of texTab
		Sierra++;
	}

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST);

//	drawScene();
	tick();
}

// =====================================================
function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================
function initBuffers() {
	// Vertices (array)
	vertices = [
		-0.3, -0.3, 0.0,
		-0.3,  0.3, 0.0,
		 0.3,  0.3, 0.0,
		 0.3, -0.3, 0.0
	];
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 4;
		
	// Texture coords (array)
	texcoords = [ 
		  0.0, 0.0,
		  0.0, 1.0,
		  1.0, 1.0,
		  1.0, 0.0
	];
	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4;
	
	// Index buffer (array)
	var indices = [0, 1, 2, 0, 2, 3];

	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indices.length;
}


// =====================================================
function initTexture() {
	for (let index = 0; index < pathTab.length; index++) {
		var texImage = new Image();
		texImage.src = pathTab[index];
		texTab.push( gl.createTexture());
		texTab[index].image = texImage;
		
		texImage.onload = function () {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texTab[index]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texTab[index].image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.uniform1i(shaderProgram.samplerUniform, 0);
			gl.activeTexture(gl.TEXTURE0);
		}
	}
}


// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext == '.vs') {
				vertShaderTxt = xhttp.responseText; shadersLoaded ++;
			}
			if(ext == '.fs') {
				fragShaderTxt = xhttp.responseText; shadersLoaded ++;
			}
			if(shadersLoaded == 2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    	}
  	}
  	xhttp.open("GET", filename+ext, true);
  	xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords");
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texCoordsAttribute,
      	texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	}
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	for (let index = 0; index < quadTab.length; index++) {
		if(shaderProgram != null) {
			gl.bindTexture(gl.TEXTURE_2D, texTab[quadTab[index].tex]);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
			mat4.multiply(mvMatrix, objMatrix);
			mat4.translate(mvMatrix, [0.0, 0.0, quadTab[index].zPos]);
			setMatrixUniforms();
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			//gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexBuffer.numItems);
		}
	}
}