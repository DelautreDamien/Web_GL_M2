




precision mediump float;

varying vec2 tCoords;
uniform float alpha;
uniform sampler2D uSampler;
uniform sampler2D uGradient;
const int a = 1; 

uniform vec4 fCol1;
uniform vec4 fCol2;
uniform vec4 fCol3;
uniform vec4 fCol4;
uniform vec4 fCol5;
uniform vec4 fCol6;
uniform vec4 fCol7;
// --------------------------------------------
float gradient ( float x, float YB, float YA, float XB, float XA){
	float res = (YB-YA);
	float inter = (XB-XA);
	res = res/inter;
	inter = (x-XA);
	res = res*inter;
	res +=YA;
	return(res);
} 



void main(void) {
	vec4 col;
	col[0]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
	/* col[1]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).g;
	col[2]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).b; */
	col[3]=col[0];

	 if (col[3]>=fCol2[3]  && (col[3]<fCol1[3])){
		 col[0]=gradient ( col[3], fCol2[0], fCol1[0], fCol2[3], fCol1[3]);
		 col[1]=gradient ( col[3], fCol2[1], fCol1[1], fCol2[3], fCol1[3]);
		 col[2]=gradient ( col[3], fCol2[2], fCol1[2], fCol2[3], fCol1[3]);
		 col[3]= col[3]*alpha;
	} 
	else if (col[3]>=fCol3[3]  && (col[3]<fCol2[3])){
		 col[0]=gradient ( col[3], fCol3[0], fCol2[0], fCol3[3], fCol2[3]);
		 col[1]=gradient ( col[3], fCol3[1], fCol2[1], fCol3[3], fCol2[3]);
		 col[2]=gradient ( col[3], fCol3[2], fCol2[2], fCol3[3], fCol2[3]);
		 col[3]= col[3]*alpha;
	}
	else if (col[3]>=fCol4[3]  && (col[3]<fCol3[3])){
		 col[0]=gradient ( col[3], fCol4[0], fCol3[0], fCol4[3], fCol3[3]);
		 col[1]=gradient ( col[3], fCol4[1], fCol3[1], fCol4[3], fCol3[3]);
		 col[2]=gradient ( col[3], fCol4[2], fCol3[2], fCol4[3], fCol3[3]);
		 col[3]= col[3]*alpha;
	}
	else if (col[3]>=fCol5[3]  && (col[3]<fCol4[3])){
		 col[0]=gradient ( col[3], fCol5[0], fCol4[0], fCol5[3], fCol4[3]);
		 col[1]=gradient ( col[3], fCol5[1], fCol4[1], fCol5[3], fCol4[3]);
		 col[2]=gradient ( col[3], fCol5[2], fCol4[2], fCol5[3], fCol4[3]);
		 col[3]= col[3]*alpha;
	}
	else if (col[3]>=fCol6[3]  && (col[3]<fCol5[3])){
		 col[0]=gradient ( col[3], fCol6[0], fCol5[0], fCol6[3], fCol5[3]);
		 col[1]=gradient ( col[3], fCol6[1], fCol5[1], fCol6[3], fCol5[3]);
		 col[2]=gradient ( col[3], fCol6[2], fCol5[2], fCol6[3], fCol5[3]);
		 col[3]= col[3]*alpha;
	}
	else if (col[3]>=fCol7[3]  && (col[3]<fCol6[3])){
		 col[0]=gradient ( col[3], fCol7[0], fCol6[0], fCol7[3], fCol6[3]);
		 col[1]=gradient ( col[3], fCol7[1], fCol6[1], fCol7[3], fCol6[3]);
		 col[2]=gradient ( col[3], fCol7[2], fCol6[2], fCol7[3], fCol6[3]);
		 col[3]= col[3]*alpha;
	}/*
	else if(colors[255]>0.0){
		col = vec4(col[3],col[3],0.0,alpha) ;
	} */
	else{
		col = vec4(0.0) ;
	}

	//col[3]=max(col[3],0.0);


	gl_FragColor = col;

	//gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));  

	
}

