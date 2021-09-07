
precision mediump float;

varying vec2 tCoords;

uniform sampler2D uSampler;

const int a = 1; 

uniform vec4 fCol1;
uniform float colors[256];
// --------------------------------------------
float gradient ( float pix, float refB, float refH){
	return((pix-refB)/(refH-refB));
} 



void main(void) {
	vec4 col;
	col[0]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
	col[1]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).g;
	col[2]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).b;
	col[3]=col[0];

	 if (col[3]>=fCol1[3]  && (col[3]<1.0)){

		col = vec4(vec3(fCol1[0],fCol1[1],fCol1[2])*vec3(gradient(col[0],fCol1[3],1.0)),col[3]) ;
	}
	else if (col[3]>=0.8 && (col[3]<0.9)){
		col = vec4(vec3(0.0,0.0,col[3])*vec3(gradient(col[0],0.8,0.9)),col[3]) ;
	}
	else if(col[3]>=0.7 && (col[3]<0.8)){
		col = vec4(0.0,col[3],0.0,col[3]) ;
	}
	else if(col[3]>=0.6 && (col[3]<0.7)){
		col = vec4(0.0,col[3],col[3],col[3]) ;
	}
	else if((col[3]>=0.5) && (col[3]<0.6) ){
		col = vec4(col[3],0.0,col[3],col[3]) ;
	}
	else if((col[3]>=0.4) && (col[3]<0.5) ){
		col = vec4(col[3],col[3],0.0,col[3]) ;
	}
	else if(colors[255]>0.0){
		col = vec4(col[3],col[3],0.0,col[3]) ;
	}
	else{
		col = vec4(0.0) ;
	}

	//col[3]=max(col[3],0.0);


	gl_FragColor = col;

	//gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));  

	
}

