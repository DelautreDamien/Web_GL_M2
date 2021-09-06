
precision mediump float;

varying vec2 tCoords;

uniform sampler2D uSampler;

void main(void) {

	vec4 col;
	col[0]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
	col[1]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).g;
	col[2]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).b;
	col[0]=col[0]+col[1];
	col[0]=col[0]+col[2];
	col[0]=(col[0]/3.0);
	//col[0]=col[0]*(-1.0);
	//col[0]=col[0]+1.0;
	col[1]=0.0;
	col[2]=col[1];
	col[3]=col[0];
	gl_FragColor = col;

	//gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));

	
}

