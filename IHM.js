var color = ["#e66465"];

// ==============================================================
// =====CLASSES==================================================
// ==============================================================

class quad {
	constructor(zPos, tex){
		this.zPos=zPos;
		this.tex=tex;
		this.charCol=[0.0,0.0,0.0]

	}

	// TODO
	modifyPosition (value) {
	}
}

class serie {
	constructor() {
		this.serie = serie;
		this.faussecouleur = true;
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

/**
 * transformer une expression hexadécimale en RGB
 * @param hex
 * @returns {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

/**
 * afficher ou non un block
 * @param name
 * @param display
 */
function displayOrNot(name, display){
	if(display) {
		document.getElementById(name).style.display = "block";
	}
	else {
		document.getElementById(name).style.display = "none";
	}
}

/**
 * pour le bouton checkbox qui gère les fausses couleurs
 */
function onoffFC() {
	var isChecked = document.getElementById("myCheckbox").checked;
	console.log(isChecked);
	if (isChecked) {
		console.log("off");
		serie.faussecouleur = false;
		loadShaders("shaderSC");
		displayOrNot("color", false);
		displayOrNot("transparency", true);
	}
	else {
		console.log("on");
		serie.faussecouleur = true;
		loadShaders("shaderFC");
		displayOrNot("color", true);
		displayOrNot("transparency", false);
	}
}

/**
 * changer la couleur des fausses couleurs
 * @param target
 * @param vec
 */
function changeColor(target, vec) {
	target.nextElementSibling.value = target.value;
	var rgb = hexToRgb(target.value)
	fColorTab[vec][0] = rgb.r/255;
	fColorTab[vec][1] = rgb.g/255;
	fColorTab[vec][2] = rgb.b/255;
}

/**
 * afficher ou non la couleur
 */
function onoffColorTransparency() {

}

/**
 * gère la transparence des quads
 * @param value
 */
function transparence(target) {
	target.nextElementSibling.value = target.value;
	alpha = target.value;
}

/**
 * pour le bouton checkbox qui gère le frame 3D ou 2D
 */
function onoffFrame() {
	var isChecked = document.getElementById("myCheckbox2").checked;
	console.log(isChecked);
	if (isChecked) {
		console.log("off");
		soloFrame = true;
		displayOrNot("sliderSoloFrame", true);
		displayOrNot("nbrFrame", false);
	}
	else {
		console.log("on");
		soloFrame = false;
		displayOrNot("sliderSoloFrame", false);
		displayOrNot("nbrFrame", true);
	}
}

/**
 * si le checkbox Frame est à ON, donne la frame à afficher
 * @param value
 */
function singleFrame(target) {
	target.nextElementSibling.value = target.value;
	single = target.value;
}

/**
 * change la frame min à afficher
 * @param target
 */
function frameMinimum(target) {
	target.nextElementSibling.value = target.value;
	if (target.valueAsNumber < end) {
		start = target.valueAsNumber-1;
	}
	else {
		alert("min must be lower than max  ")
	}
}

/**
 * change le frame maximum à afficher
 * @param target
 */
function frameMaximum(target) {
	target.nextElementSibling.value = target.value;
	if (start < target.valueAsNumber) {
 		end = target.valueAsNumber;
	} else {
		alert("max must be higher than min")
	}
	
}


// --------------------------------------------
function loadAShaders(){
	if (serie.faussecouleur) {
		loadShaders("shaderFC");
	}
	else {
		loadShaders("shaderSC");
	}
}

