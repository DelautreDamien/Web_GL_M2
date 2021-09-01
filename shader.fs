
precision mediump float;

varying vec2 tCoords;
varying vec4 col;
uniform sampler2D uSampler;

void main(void) {

	// col=texture2D(uSampler, vec2(tCoords.s, tCoords.t));
	// col[0]=(col[0]+col[1]+col[2])3;
	// col[1]=col[0];
	// col[2]=col[1];
	//gl_FragColor = col;
	gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
}

