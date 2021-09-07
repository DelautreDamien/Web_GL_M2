// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var alpha = 1.0;
var posTab=[0.0, 0.1, 0.2, 0.3];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
var FcolVecTab;
var FcolTab = [];
var FcolSeuils = [0.0, 102.0, 127.5, 153.0, 178.5, 204.0, 229.5, 255.0];
var pathTab = [];
var seriesTab = [];
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
	initFCol();	
	loadShaders('shaderFC');
	seriesTab.push(new serie);
	Tango = seriesTab.length-1;
	seriesTab[Tango].quads.set("draw", true);
	//Serie 1 DICOM
	for (let index = 0; index < 10; index++) {
		pathTab.push("image-0000"+index+".jpg");
		seriesTab[0].quads.set(pathTab[index-1]);
	} 
	for (let index = 10; index < 100; index++) {
		pathTab.push("image-000"+index+".jpg");
		seriesTab[0].quads.set(pathTab[index-1]);
	} 
	for (let index = 100; index < 361; index++) {
		pathTab.push("image-00"+index+".jpg");
		seriesTab[0].quads.set(pathTab[index-1]);
	}
	/* //Serie 1
	seriesTab.push(new Map);
	Tango = seriesTab.length-1;
	seriesTab[Tango].quads.set("draw", true); 
	
	for (let index = 1; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
	}
	for (let index = 10; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
	} */

	/* 
	//Serie 2
	seriesTab.push(new Map);
	Tango = seriesTab.length-1;
	seriesTab[Tango].set("draw", true);
	for (let index = 2; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
	}
	for (let index = 11; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
	} */ 
	
	/*
	//Serie 3
	seriesTab.push(new Map);
	Tango = seriesTab.length-1;
	seriesTab[Tango].set("draw", true);
	 for (let index = 3; index < 10; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-0"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
	}
	for (let index = 12; index < 34; index+=3) {
		pathTab.push("imagesCoupes\16HBE_SERCA_NT_0001-"+index+".jpg");
		seriesTab[Tango].quads.set(pathTab[index-1]); 
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

// --------------------------------------------
function initFCol(){
	X_ray=0;
	for (let index = 0; index < 255; index++) {
		FcolTab.push((index-FcolSeuils[X_ray])/(FcolSeuils[X_ray+1]-FcolSeuils[X_ray]));//*((FcolSeuils[X_ray+1]-FcolSeuils[X_ray])/2.0)
		if (index >= FcolSeuils[X_ray+1]) {
 			X_ray++;
		}
	}
	var stockImage = new Image();
		//stockImage.src = pathTab[index];
		FcolVecTab= gl.createTexture();
		FcolVecTab.image = stockImage;
		
		stockImage.onload = function () {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, FcolVecTab);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, FcolVecTab.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.uniform1i(shaderProgram.samplerUniform, 1);
			gl.activeTexture(gl.TEXTURE1);
		}
}

// --------------------------------------------
function reSetFCol(){
	X_ray=0;
	for (let index = 0; index < FcolTab.length; index++) {
		FcolTab[index]=(index-FcolSeuils[X_ray])/(FcolSeuils[X_ray+1]-FcolSeuils[X_ray]);
		if (index >= FcolSeuils[X_ray+1]) {
			X_ray++;
		}
	}
	var stockImage = new Image();
		//stockImage.src = pathTab[index];
		FcolVecTab= gl.createTexture();
		FcolVecTab.image = stockImage;
		
		stockImage.onload = function () {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, FcolVecTab);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, FcolVecTab.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.uniform1i(shaderProgram.samplerUniform, 1);
			gl.activeTexture(gl.TEXTURE1);
		}
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

	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uGradient");

	shaderProgram.fCol1 = gl.getUniformLocation(shaderProgram, "fCol1");
	gl.uniform4fv(shaderProgram.fCol1, [1.0, 1.0, 1.0, 0.9]);

	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");
	gl.uniform1f(shaderProgram.alpha, alpha);

	shaderProgram.fCol = [];
	/* shaderProgram.fCol[0] = gl.getUniformLocation(shaderProgram, "colors[0]")
	gl.uniform1f(shaderProgram.fCol[0], Number(FcolTab[0].toFixed(1))); */

	for (let index = 0; index < FcolTab.length; index++) {
		//statement
		shaderProgram.fCol[index] = gl.getUniformLocation(shaderProgram, "colors["+index+"]")
		gl.uniform1f(shaderProgram.fCol[index], Number(FcolTab[index].toFixed(1)));
	}
	


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