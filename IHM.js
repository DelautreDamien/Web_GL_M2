var color09;
var color08;
var color07;
var color06;
var color05;
var color04;
//var defaultColor = "#999896";
var isPlaying=false;
window.addEventListener("load", startup, false);

// ==============================================================
// =====CLASSES==================================================
// ==============================================================

class quad {
	constructor(zPos, tex){
		this.zPos=zPos;
		this.tex=tex;
		this.charCol="r"
	}

	// TODO
	modifyPosition (value) {
	}
}

class serie {
	constructor() {
		this.faussecouleur=false;
		this.col = [1.0, 1.0, 1.0];
		this.quads= new Map;
	}

}

class IHM {
	constructor () {
		// statement
	}

	// =====================================================
	addSlider (obj, rangeIdd, varIdd, param, min, max, value) {
		obj.sliders.push(new IHMSlider (obj, rangeIdd, varIdd, param));
		var newSlider = document.createElement("INPUT");
		newSlider.setAttribute("type", "range");
		newSlider.setAttribute("min", min);
		newSlider.setAttribute("max", max);
		newSlider.setAttribute("value", 100*value);
		newSlider.setAttribute("step","1");
		newSlider.setAttribute("class","slider");
		newSlider.setAttribute("id",rangeIdd);
		newSlider.setAttribute("oninput","OBJS["+obj.num+"].sliders["+(obj.sliders.length-1)+"].react(this.value)");
		return newSlider;
	}

	// =====================================================
	addOutput (varIdd) {
		var sliderNameOutput = document.createTextNode("Value: ");
		var sliderTitleOutput = document.createElement("p");
		sliderTitleOutput.appendChild(sliderNameOutput);
		var newSliderOutput = document.createElement("span");
		newSliderOutput.setAttribute("id", varIdd);
		sliderTitleOutput.appendChild(newSliderOutput);
		return sliderTitleOutput;
	}

	// =====================================================
	newIhmTitle () {
		var interFaceTitle = document.createElement("h1");
		var objFrontName = document.createTextNode("objet "+String(OBJS.length));
		interFaceTitle.appendChild(objFrontName);
		return interFaceTitle;
	}

	// =====================================================
	newTitle (titre, childID) {
		var title = document.createElement("p");
		var sectionName = document.createTextNode(titre);
		title.setAttribute("onmouseover", "DisplayOrNot(\""+childID+"\")");
		title.appendChild(sectionName);
		return title
	}

	// =====================================================
	newName (Name) {
		var title = document.createElement("p");
		var sectionName = document.createTextNode(Name);
		title.appendChild(sectionName);
		return title
	}
}

/**
 * ColorChanger
 * pour les changement de couleur des quad !!!
 * option pas encore implémenté !!!
 */
class IHMColorChanger {

	// --------------------------------------------
	constructor (obj, idd) {
		this.idd= idd;
		this.colortester = document.getElementById(idd);
		this.owner = obj;
	}

	// --------------------------------------------
	resetColors (hex) {
		var res = this.hexToRgb(hex);
		this.owner.setR(res.r/255);
		this.owner.setG(res.g/255);
		this.owner.setB(res.b/255);
	}

	// --------------------------------------------
	hexToRgb (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
}

/**
 * Slider
 * pour les variations des paramètres des objets !!!
 * option pas encore implémenté !!!
 */
class IHMSlider {

	// --------------------------------------------
	constructor (obj, rangeIdd, varIdd, param) {
		this.rangeName = rangeIdd;
		this.varName = varIdd;
		this.slider = document.getElementById(rangeIdd);
		this.output = document.getElementById(varIdd);
		this.owner = obj;
		this.pset = param;
	}

	// --------------------------------------------
	getRangeName () {
		return(this.rangeName)
	}

	// --------------------------------------------
	react (val) {
		this.slider.value=val;
		this.output.innerHTML = this.slider.value/100;
		switch(this.pset) {
			case "alpha":
				this.owner.setalpha(this.slider.value/100);
				break;
			case "X":
				this.owner.setPosX(this.slider.value/100);
				break;
			case "Y":
				this.owner.setPosY(this.slider.value/100);
				break;
			case "Ks":
				this.owner.setKs(this.slider.value/100);
				break;
			case "rotX":
				this.owner.setRotX(this.slider.value/100);
				console.log("Alpha");
				break;
			case "rotY":
				this.owner.setRotY(this.slider.value/100);
				console.log("Bravo");
				break;
			default :
				this.owner.setalpha(this.slider.value/100);
				console.log("Charlie");
				break;
		}
	}

	reset () {
		this.slider = document.getElementById(this.rangeName);
		this.output = document.getElementById(this.varName);
		this.output.innerHTML = this.slider.value/100;
	}
}


// ==============================================================
// =====FUNCTIONS================================================
// ==============================================================

// TODO
function startup() {
	color09 = document.querySelector("#color09");
	color09.value = hexToRgb("#e66465");
	color09.addEventListener("input", updateFirst, false);
	color09.select();

	color08 = document.querySelector("#color08");
	color08.value = hexToRgb("#e66465");
	color08.addEventListener("input", updateFirst, false);
	color08.select();

	color07 = document.querySelector("#color07");
	color07.value = hexToRgb("#e66465");
	color07.addEventListener("input", updateFirst, false);
	color07.select();

	color06 = document.querySelector("#color06");
	color06.value = hexToRgb("#e66465");
	color06.addEventListener("input", updateFirst, false);
	color06.select();

	color05 = document.querySelector("#color05");
	color05.value = hexToRgb("#e66465");
	color05.addEventListener("input", updateFirst, false);
	color05.select();

	color04 = document.querySelector("#color04");
	color04.value = hexToRgb("#e66465");
	color04.addEventListener("input", updateFirst, false);
	color04.select();

}

/**
 * pour le bouton radio qui gère les fausses couleurs
 */
// TODO
function onoff() {
	var $this = $(this);
	var color;
	if(isPlaying) {
		isPlaying=false;
		console.log("off");
		serie[SELECTION].faussecouleur = false;
		initShaders("shaderSC");
		displayOrNot(color, false);
	}
	else {
		console.log("on");
		isPlaying=true;
		serie[SELECTION].faussecouleur = true;
		initShaders("shaderFC");
		displayOrNot(color, true);
	}
}

/**
 * selection d'un série ou de toutes les séries
 * @param value
 */
// TODO
function selectSerie(value) {
	if (value === "s1") {
		startup();
		console.log("Série 1");
		SELECTION = 0; // Objet 0 du tableau OBJS
	}
	else if (value === "s2") {
		startup();
		console.log("Série 2");
		SELECTION = 1; // Objet 1 du tableau OBJS
	}
	else if (value === "s3") {
		startup();
		console.log("Série 3");
		SELECTION = 2; // Objet 2 du tableau OBJS
	}
	else if (value === "s123") {
		startup();
		console.log("Série 1, 2 et 3");
		SELECTION = 3; // Objet 3 du tableau OBJS
	}
}

function updateFirst(event) {
 	if (SELECTION !== -1) {
		result = hexToRgb(event.target.value);
		OBJS[SELECTION].r = result.r/255;
	    OBJS[SELECTION].g = result.g/255;
	    OBJS[SELECTION].b = result.b/255;
	}
} 

function hexToRgb(hex) {
  	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  	return result ? {
    	r: parseInt(result[1], 16),
    	g: parseInt(result[2], 16),
    	b: parseInt(result[3], 16)
  	} : null;
}

function displayOrNot(name, display){
	if(display){
		document.getElementById(name).style.display = "block";
	}
	else{
		document.getElementById(name).style.display = "none";
	}
}


//FONCTION TRANSPARENCE //////////////////////////////////////////////////
// TODO
function transparence() {
	var handle = $( "#custom-handle" );
	$( "#slider" ).slider( {
		create: function() {
			handle.text( $( this ).slider( "value" ) );
		},
		slide: function( event, ui ) {
			handle.text( ui.value/100 );
			if (SELECTION != -1) {
				OBJS[SELECTION].alpha = ui.value/100;
			}			
		}
	});
};




