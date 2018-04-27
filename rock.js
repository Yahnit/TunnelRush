function Rock(velocity,gl,body,pos, angle, breadth, len,type) {
	this.pos = pos,this.breadth = breadth,this.angle = angle;
	this.len = len,this.velocity = velocity,this.body = body;

	factr = 1;
	var s = factr*breadth/2,l = factr*len/2;
	var a = 0,b = 1,t=360;
	text_ind = [a,a,b,a,b,b,a,b,a,a,b,a,b,b,a,b,
		a,a,b,a,b,b,a,b,a,a,b,a,b,b,a,b,a,a,b,a,b,b,a,b,a,a,b,a,b,b,a,b,
	];

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	var i,j;
	matrix_pos = [];
	for(i=0;i<72;i++)
		matrix_pos[i] = 0;
	console.log(matrix_pos);
	for(i=0;i<6;i++){
		for(j=0;j<12;j+=3)
			matrix_pos[6*i+j] = s;
		for(j=1;j<12;j+=3)
			matrix_pos[6*i+j] = l;
		for(j=2;j<12;j+=3)
			matrix_pos[6*i+j] = s;
	}

	for(i=0;i<6;i++){
		if(i==0){
			matrix_pos[i*6+0]*=-1,matrix_pos[i*6+1]*=-1;
			matrix_pos[i*6+4]*=-1,matrix_pos[i*6+9]*=-1;
		}
		if(i==1){
			matrix_pos[i*6+0]*=-1,matrix_pos[i*6+1]*=-1;
			matrix_pos[i*6+2]*=-1,matrix_pos[i*6+3]*=-1;
			matrix_pos[i*6+5]*=-1,matrix_pos[i*6+8]*=-1;
			matrix_pos[i*6+10]*=-1,matrix_pos[i*6+11]*=-1;
		}
		if(i==2){
			matrix_pos[i*6+0]*=-1,matrix_pos[i*6+2]*=-1;
			matrix_pos[i*6+3]*=-1,matrix_pos[i*6+11]*=-1;
		}
		if(i==3){
			matrix_pos[i*6+0]*=-1,matrix_pos[i*6+1]*=-1;
			matrix_pos[i*6+2]*=-1,matrix_pos[i*6+4]*=-1;
			matrix_pos[i*6+5]*=-1,matrix_pos[i*6+7]*=-1;
			matrix_pos[i*6+9]*=-1,matrix_pos[i*6+10]*=-1;
		}
		if(i==4){
			matrix_pos[i*6+1]*=-1,matrix_pos[i*6+2]*=-1;
			matrix_pos[i*6+5]*=-1,matrix_pos[i*6+10]*=-1;
		}
		if(i==5){
			matrix_pos[i*6+0]*=-1,matrix_pos[i*6+1]*=-1;
			matrix_pos[i*6+2]*=-1,matrix_pos[i*6+3]*=-1;
			matrix_pos[i*6+4]*=-1,matrix_pos[i*6+6]*=-1;
			matrix_pos[i*6+9]*=-1,matrix_pos[i*6+11]*=-1;
		}
	}
	console.log(matrix_pos);

	// Positions Buffer
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(matrix_pos), gl.STATIC_DRAW);

	// Textures Buffer
	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_ind),
		gl.STATIC_DRAW);

	indices = [];
	var i,j;
	for(i=0;i<21;i+=4){
		for(j=0;j<3;j++)
			indices.push(i+j);
		indices.push(i);
		for(j=2;j<4;j++)
		indices.push(i+j);
	}

	// Index Buffer
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

	// Color Buffer
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

	this.buffers = {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
    textureCoord: textureCoordBuffer,
  };
}

Rock.prototype.tick = function()
	this.angle = this.angle+this.velocity;


Rock.prototype.draw = function(gl, programInfo, projectionMatrix, viewMatrix) {
  	const modelViewMatrix = mat4.create();

	mat4.translate(modelViewMatrix,modelViewMatrix,this.pos);
	mat4.rotate(modelViewMatrix,modelViewMatrix,this.angle*Math.PI/180,[0, 0, 1]);
    mat4.multiply(modelViewMatrix,viewMatrix,modelViewMatrix);

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
		const vertexCount = 36;
	    const type = gl.UNSIGNED_SHORT;
	    const offset = 0;
	    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  	}
}

Rock.prototype.detect_collision = function(pos, angle, velocity) {

	var clearance = 20,boundary=[];
	var cord_z = this.pos[2], wdth = this.breadth/2;
	var front_face = cord_z+wdth, back_face =cord_z-wdth,tp=360;
    if(angle >= 0) angle -= Math.floor(angle/tp)*tp;
    else angle += (Math.floor(-angle/tp)+1)*tp;

		for(let i=0;i<5;i++) {
			var bound1 = [i*tp/2-clearance+this.angle,i*tp/2+clearance+this.angle];
			var bound2 = [-i*tp/2-clearance+this.angle,-i*tp/2+clearance+this.angle];
			boundary.push(bound1);
			boundary.push(bound2);
		}

col_1 = 0, col_2 = 0, col_3 = 0;
if(front_face>pos-velocity)
	if(pos>front_face)
		col_1 = 1;
if(back_face>pos-velocity)
	if(pos>back_face)
		col_2=1;
if(pos>back_face)
	if(front_face > pos)
		col_3 = 1;

	if(col_1 || col_2 || col_3)
		for(let i=0;i<10;i++)
			if(angle < boundary[i][1])
				if(boundary[i][0] < angle)
					return 1;
	return 0;
}
