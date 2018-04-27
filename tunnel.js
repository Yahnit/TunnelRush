function Tunnel(gl, flag, pos, body, translate, breadth, len) {

	// Create a buffer for the cube's vertex positions.

	this.pos = pos,this.len = len;
	this.breadth = breadth,this.translate = translate,this.body = body;
	var a = 0.0,b=1.0,c=1.1;
	text_ind = [a,a,b,a,a,b,c,c];

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.

	const matrix_pos = [];
	text_cords = [];
	var ang = 22.5;
	var index = 0,iter,i;
	angle = -ang;

	for(i=0;i<8;i++)
		text_cords = text_cords.concat(text_ind);

		const textureCoordBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_cords),
	    gl.STATIC_DRAW);

	for(iter=0;iter<8;iter++) {
		matrix_pos[iter*12+2] = 0;
		matrix_pos[iter*12+5] = -len;
		matrix_pos[iter*12+8] = 0;
		matrix_pos[iter*12+11] = -len;
	}

	const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

	for(iter=0;iter<8;iter++) {
		rot = angle*Math.PI/180;
		matrix_pos[index] = Math.cos(rot)*breadth;
		index++;
		matrix_pos[index] = Math.sin(rot)*breadth;
		index+=2;

		matrix_pos[index] = Math.cos(rot)*breadth + translate;
		index++;
		matrix_pos[index] = Math.sin(rot)*breadth;
		index+=2;

		angle += 2*ang;
		rot = angle*Math.PI/180;
		matrix_pos[index] = Math.cos(rot)*breadth;
		index++;
		matrix_pos[index] = Math.sin(rot)*breadth;
		index+=2;

		matrix_pos[index] = Math.cos(rot)*breadth+translate;
		index++;
		matrix_pos[index] = Math.sin(rot)*breadth;
		index+=2;
	}
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(matrix_pos), gl.STATIC_DRAW);

	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.

		const indices = [
			0,1,2,1,2,3,
			4,5,6,5,6,7,
			8,9,10,9,10,11,
			12,13,14,13,14,15,
			16,17,18,17,18,19,
			20,21,22,21,22,23,
			24,25,26,25,26,27,
			28,29,30,29,30,31
		];

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);


		const normalBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			var root2 = 1.414;
			const vertexNormals = [
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     1.0 / root2,  1.0 / root2,  0.0,
			     1.0 / root2,  1.0 / root2,  0.0,
			     1.0 / root2,  1.0 / root2,  0.0,
			     1.0 / root2,  1.0 / root2,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0 / root2,  - 1.0 / root2,  0.0,
			     1.0 / root2,   - 1.0 / root2,  0.0,
			     1.0 / root2,  - 1.0 / root2,  0.0,
			     1.0 / root2,  - 1.0 / root2,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     -1.0 / root2,  -1.0 / root2,  0.0,
			     -1.0 / root2,  -1.0 / root2,  0.0,
			     -1.0 / root2,  -1.0 / root2,  0.0,
			     -1.0 / root2,  -1.0 / root2,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			     - 1.0 / root2,  1.0 / root2,  0.0,
			      - 1.0 / root2,  1.0 / root2,  0.0,
			      - 1.0 / root2,  1.0 / root2,  0.0,
			      - 1.0 / root2,  1.0 / root2,  0.0,
			  ];

				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);


	  this.buffers = {
	    position: positionBuffer,
	    color: colorBuffer,
			normal: normalBuffer,
	    indices: indexBuffer,
	    textureCoord: textureCoordBuffer,
	  };
}

Tunnel.prototype.draw = function(gl, programInfo, projectionMatrix, viewMatrix) {
  	const modelViewMatrix = mat4.create();

	mat4.translate(modelViewMatrix,modelViewMatrix,this.pos);
    mat4.multiply(modelViewMatrix,viewMatrix,modelViewMatrix);

	// VertexPosition
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Textures
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32 bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

		// Indices
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

	  // Program
	  gl.useProgram(programInfo.program);

	  // Shader uniforms
	  gl.uniformMatrix4fv(
	      programInfo.uniformLocations.projectionMatrix,
	      false,
	      projectionMatrix);
	  gl.uniformMatrix4fv(
	      programInfo.uniformLocations.modelViewMatrix,
	      false,
	      modelViewMatrix);

				// Tell WebGL we want to affect texture unit 0
		    gl.activeTexture(gl.TEXTURE0);

		    // Bind the texture to texture unit 0
		    gl.bindTexture(gl.TEXTURE_2D, texture[this.body]);

		    // Tell the shader we bound the texture to texture unit 0
		    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

				{
				    const numComponents = 3;
				    const type = gl.FLOAT;
				    const normalize = false;
				    const stride = 0;
				    const offset = 0;
				    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
				    gl.vertexAttribPointer(
				        programInfo.attribLocations.vertexNormal,
				        numComponents,
				        type,
				        normalize,
				        stride,
				        offset);
				    gl.enableVertexAttribArray(
				        programInfo.attribLocations.vertexNormal);
				  }
					const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);


  gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);

	{
		const vertexCount = 48;
	    const type = gl.UNSIGNED_SHORT;
	    const offset = 0;
	    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  	}
}
