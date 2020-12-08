/**
 * "public" array currentlyActiveSpecies- contains all currently active species as strings. Ex: ["Polydesmus", "Somethus", "Glomeris"]
 */
var currentlyActiveSpecies = [];

/**
 * "public" Bool to clamp the size of dataset. Should be false almost always.
 */
var testingMode = false;

/**
 * "public" key-value pair map of scores. two-letter String-> int. Example. "AA" -> 4
 */
var scoreMap = new Map();

/**
 * Outside functions should be put in here. pingChange is called every time a change occurs in the currentlyActiveSpecies[]
 */
function pingChange() 
{
	console.log("active species updated!");
	console.log(currentlyActiveSpecies);
	//todo: put outside references here
}

/**
 * Simple getter for currentlyActiveSpecies[]
 */
function getCurrentSpecies() 
{
	return currentlyActiveSpecies;
}

/**
 * Map of taxonomy ID to sequence.
 * Example: "AACTA2215-20":"<Corresponding 3406-char DNA sequence>"
 */
var taxonomyIdMap = new Map();

/**
 * Map of species to array of Taxonomy IDs that belong to that species.
 * Example "Clerarcha":["WALPB3746-14", "WALPB3748-14", "WALPB4400-14", "WALPB5132-14"]
 */
var speciesMap = new Map();

/**
 * 
 * 
 * BEGIN OBSCURE NONSENSE. BEWARE YE ALL WHO VENTURE PAST THIS POINT
 * 
 * 
 */

 
//function called on page load
document.body.onload = loadTree;

function loadTree () { 

	jQuery.get('https://raw.githubusercontent.com/gabrielundan/dna-seq-vis-data/master/matrix.txt', function(matrix) {
		jQuery.get('https://raw.githubusercontent.com/gabrielundan/dna-seq-vis-data/master/sequences_tax_mapping_cleaned.txt', function(data) {
            do_something_with(data, matrix);
            mapSpecies(data);
		 }, 'text');
	 }, 'text');
	
	jQuery.get('https://raw.githubusercontent.com/gabrielundan/dna-seq-vis-data/master/aligned_unenrolled.faa', function(data) {
		readSequences(data);
	});
}

function addCheckBox(name, parent = document.getElementById("tree")) {
	if(document.getElementsByClassName(name.split(" ").join("")).length > 0) {return document.getElementsByClassName(name.split(" ").join(""))[0];}
  // create a new div element 
  const newDiv = document.createElement("div"); 
  
  // and give it some content 
  newDiv.style.marginLeft = "25px";
  const newContent = document.createTextNode("  " + name); 
  const newCheckbox = document.createElement("INPUT");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("value", name);
  newCheckbox.classList.add("checkbox");
  newCheckbox.onclick = function() {checkboxClick(newCheckbox.value, newCheckbox.checked); checkAbove(newDiv);}
  
  // add the text node to the newly created div
  newDiv.classList.add(name.split(" ").join(""));
  newDiv.appendChild(newCheckbox);
  newDiv.appendChild(newContent);  

  newDiv.style.paddingLeft = "20px";
  newDiv.classList.add("nested");
  //newDiv.classList.add("active");

  parent.appendChild(newDiv);
}

function checkAbove(element) {
	console.log("checking elements above!");
	var parent = element.parentElement;
	if (parent == document.getElementById("tree")) {
		return;
	}
	var checkbox = parent.querySelector(".checkbox");

	var allAreEnabled = true;
	var allAreDisabled = true;

	var childCheckboxes = parent.querySelectorAll(".checkbox");
	console.log(childCheckboxes.length);

	childCheckboxes.forEach(childbox => {
		if (!allAreDisabled && !allAreEnabled) {
			return;
		}
		if (childbox != checkbox) {
			if(childbox.checked) {
				allAreDisabled = false;
			} else {
				allAreEnabled = false;
			}
		}
	})

	if (allAreEnabled) {
		checkbox.checked = true;
		checkbox.indeterminate = false;
		console.log("all are enabled!");
	} 
	else if (allAreDisabled) {
		checkbox.checked = false;
		checkbox.indeterminate = false;
		console.log("disabled!");
	} else {
		checkbox.checked = true;
		checkbox.indeterminate = true;
		console.log("indeterm!");
	}

	checkAbove(parent);
}
function propogateBelow(element, checked) {
	console.log("propogating elements below with " + checked);
	var childCheckboxes = element.querySelectorAll(".checkbox");

	var changedBoxes = [];
	childCheckboxes.forEach(childbox => {
		childbox.checked = checked;
		childbox.indeterminate = false;
		if (childbox.value != "on") {
			checkboxClick(childbox.value, checked, false)
			
		}
	})
}
//Calls every time a checkbox value toggles
function checkboxClick(value, nowChecked, pingC = true) {
	if (nowChecked) {
		console.log(value + " added to active!");
		if (!currentlyActiveSpecies.includes(value)) {
			currentlyActiveSpecies.push(value);
		}
	} else {
		console.log(value + " removed from active!");
		if (currentlyActiveSpecies.includes(value)) {
			var index = currentlyActiveSpecies.indexOf(value);
			currentlyActiveSpecies.splice(index, 1);
		}
	}
	if (pingC) {
		pingChange();
	}
}

function createNewParentDiv(name, parent = document.getElementById("tree")) {
	if(document.getElementsByClassName(name.split(" ").join("")).length > 0 || (name.length < 2)) { return document.getElementsByClassName(name.split(" ").join(""))[0];}
    const newDiv = document.createElement("div"); 
	const newContent = document.createElement("div");
	const newCheckbox = document.createElement("INPUT");
	newCheckbox.setAttribute("type", "checkbox");
	newCheckbox.classList.add("checkbox");
	newContent.appendChild(newCheckbox);
	newContent.appendChild(document.createTextNode("  " + name));
	newContent.style.cursor = "pointer";
	newContent.style.userSelect = "none";
	newDiv.style.backgroundColor = "lightblue";

	newContent.addEventListener("click", function() {
		var children = this.parentElement.querySelectorAll(".nested");

		children.forEach(child => {
			if (child.parentElement == newDiv) {
				child.classList.toggle("active")
			}
		})
		newContent.classList.toggle("collapsed");
		
		console.log("clicked one!");
	});
	newCheckbox.addEventListener("click", function(event) {
		event.stopPropagation();
		propogateBelow(newDiv, newCheckbox.checked);
		checkAbove(newDiv);
		pingChange();
	})

	newDiv.appendChild(newContent);
	newDiv.style.paddingLeft = "20px";
	newDiv.className = name.split(" ").join("");
	newContent.classList.add("collapses");
	if (parent == document.getElementById("tree")) {
		newDiv.classList.add("active");
	}

	newDiv.classList.add("nested");
	//newDiv.classList.add("active");

    parent.appendChild(newDiv);
    return newDiv;
}

function insertToTreeDiv(newDiv) {
	const currentDiv = document.getElementById("tree"); 
	currentDiv.appendChild(newDiv);
}

function do_something_with(data, matrix) {
		
	var scorelines = matrix.split("\n");
	var xletters = [];
	scorelines.forEach(element => {
		if (element == scorelines[0]) {
			letters = element.split(" ");
			letters.forEach(letter => {
				if (letter != "") {
					xletters.push(letter);
				}
		
			});
		} else {
			var scores = element.split(" ");
			var yLetter = "";
			var xPos = 0;
			scores.forEach(digit => {
				if (digit != "") {
					if (yLetter == "") {yLetter = digit;}
					else {
						var intdigit = parseInt(digit);
						var key = yLetter + xletters[xPos];
						scoreMap.set(key, intdigit);
						xPos += 1;
					}
				}
		
			});
		}

	});

	if (testingMode ) {	var lines = data.split("\n", 400);}
	else {	var lines = data.split("\n");}

	var species = [];
	lines.forEach(element => {

		if (element.includes("|") && element.includes(".")) {
			var half1 = element.split("|"); // cut off the | before name
			var half2 = half1[1].split("."); //cut off the . after name
			half2[0] = half2[0].replace(/(\r\n|\n|\r)/gm, "");
			if (!species.includes(half2[0])) 
                {species.push(half2[0])} //add the species name to the list of species
            var parents = half2[1].split("\t"); //split the remainder into a list of parent names
			var currentParent = document.getElementById("tree"); //set first parent to the root node
			var pleaseBreak = false; //workaround to "break" in foreach
			parents.forEach(parent => { //build a tree of parents, if they don't already exist
			parent = parent.replace(/(\r\n|\n|\r)/gm, ""); //removing bs invisible characters
                if (parent === half2[0]) { //if the name of the next parent is the name of the species, end treebuilding.
					pleaseBreak = true;
				}
				if (!pleaseBreak) {
					currentParent = createNewParentDiv(parent, currentParent); //create current parent, and update tracked current parent
				
				}
            })
            addCheckBox(half2[0], currentParent); //add the current species to the bottom of the parent tree
		}
	});
}

/**
 * Populates taxonomyIdMap, a map where each key is a taxonomyId whose value is the corresponding DNA sequence.
 * @param {string} text Text content read from the *.faa file containing DNA sequences
 */
function readSequences(text) {
	let lines = text.split("\n");
	lines.forEach((line) => {
		if (line.length != 0) {
			let taxonomyId = line.substring(1, line.indexOf("|"));
			let sequence = line.substring(40);
			taxonomyIdMap.set(taxonomyId, sequence);
		}
	});
}

/**
 * Computes individual score, rounded to 2 decimal places
 * @param {string} query A single letter to score
 * @param {Array.string} refs Array of string to compare query against 
 * @return {number} Score of the individual query letter
 */
function computeScore(query, refs) {
	let score = 0;
	let multiplier = 2 / refs.length;
	refs.forEach((letter) => {
		score += scoreMap.get(`${query}${letter}`) * multiplier;
	});
	return Number(score.toFixed(2));
}

/**
 * Returns a map where each key is a taxonomyId that holds an array containing it's scores
 * @param {Array.string} taxonomyIds Array of taxonomy IDs to score
 * @param {Array.string} compareIds Array of taxonomy IDs to fetch from
 * @return {Map} Each key is a taxonomyId (ex. "AACTA2215-20") that holds an array of integers representing the
 * score for each character in its sequence (ex. [2.12, 5.29, ...]).
 */
function computeEntryScores(taxonomyIds, compareIds) {
	let scoreMap = new Map();
	Array(taxonomyIds).forEach((id) => {
		let sequence = taxonomyIdMap.get(id);
		let scores = [];
		for (let i = 0; i < sequence.length; i++) {
			let query = sequence.charAt(i);
			let refs = getRefsByIndex(i, compareIds);
			scores.push(computeScore(query, refs));
		}
		scoreMap.set(id, scores);
	});
	return scoreMap;
}

/**
 * Creates an array containing the letters of each sequence at a given index
 * @param {number} sequenceIndex Integer Index of DNA sequence to grab
 * @param {Array.string} compareIds Array of taxonomy IDs to fetch from
 * @return {Array} Array containing the letters of each sequence at provided index
 */
function getRefsByIndex(sequenceIndex, compareIds) {
	let refs = [];
	compareIds.forEach((value) => {
		refs.push(taxonomyIdMap.get(value).charAt(sequenceIndex));
	});
	return refs;
}

/**
 * Populates speciesMap, a map where each key is a species whose value an array of Taxonomy IDs belonging to that species.
 * @param {string} text Text content read from the *.faa file containing DNA sequences
 */
function mapSpecies(text) {
	let lines = text.split("\n");
	lines.forEach((line) => {
		if (line.length > 0) {
			let pipeSplit = line.split("|");
			let taxId = pipeSplit[0];
			let species = pipeSplit[1].substring(0, pipeSplit[1].indexOf("."));
			if (speciesMap.has(species)) {
				let taxIdArr = speciesMap.get(species);
				taxIdArr.push(taxId);
				speciesMap.set(species, taxIdArr);
			} else {
				speciesMap.set(species, [taxId]);
			}
		}
	});
}

/**
 * @return {Array.string} Array of strings where each element is a Taxonomy ID that needs to be drawn
 */
function getCurrentlyActiveTaxIds() {
	let taxIdArr = [];
	currentlyActiveSpecies.forEach((species) => {
		taxIdArr = taxIdArr.concat(speciesMap.get(species));
	});
	return taxIdArr;
}