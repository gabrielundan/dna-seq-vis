document.body.onload = loadTree;

var currentlyActiveSpecies = []; //Reference this or getCurrentSpecies for a list of all checked species

var testingMode = true; //HARD-CAPS NUM LINES READ TO 400

var scoreMap = new Map(); //key-value pair map of scores. String-> int. Example. "AA" -> 4

function loadTree () { 

	jQuery.get('treeview/matrix.txt', function(matrix) {
		jQuery.get('treeview/sequences_tax_mapping.txt', function(data) {
			do_something_with(data, matrix)
		 }, 'text');
	 }, 'text');

	addCheckBox("Alpha", );
	addCheckBox("Beta");
	addCheckBox("Delta");

}

function getCurrentSpecies() {
	return currentlyActiveSpecies;
}

function addCheckBox(name, parent = document.getElementById("tree")) {
	if(document.getElementsByClassName(name.split(" ").join("")).length > 0) {return document.getElementsByClassName(name.split(" ").join(""))[0];}
  // create a new div element 
  const newDiv = document.createElement("div"); 
  
  // and give it some content 
  const newContent = document.createTextNode(name); 
  const newCheckbox = document.createElement("INPUT");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("value", name);
  newCheckbox.onclick = function() {checkboxClick(newCheckbox.value, newCheckbox.checked)}
  
  // add the text node to the newly created div
  newDiv.classList.add(name.split(" ").join(""));
  newDiv.appendChild(newContent);  
  newDiv.appendChild(newCheckbox);
  newDiv.style.paddingLeft = "20px";

  if (parent != document.getElementById("tree")) {
}

  parent.appendChild(newDiv);
}

//Calls every time a checkbox value toggles
function checkboxClick(value, nowChecked) {
	if (nowChecked) {
		console.log(value + " added to active!");
		if (!currentlyActiveSpecies.includes(value)) {
			currentlyActiveSpecies.push(value);
		}
		console.log(currentlyActiveSpecies);
	} else {
		console.log(value + " removed from active!");
		if (currentlyActiveSpecies.includes(value)) {
			var index = currentlyActiveSpecies.indexOf(value);
			currentlyActiveSpecies.splice(index, 1);
		}
		console.log(currentlyActiveSpecies);
	}

	//

}

function createNewParentDiv(name, parent = document.getElementById("tree")) {
	if(document.getElementsByClassName(name.split(" ").join("")).length > 0 || (name.length < 2)) { return document.getElementsByClassName(name.split(" ").join(""))[0];}
    const newDiv = document.createElement("div"); 
	const newContent = document.createTextNode(name);
	newDiv.appendChild(newContent);
	newDiv.style.paddingLeft = "20px";
	newDiv.className = name.split(" ").join(""); //crashes if name is passed to classlist...
	newDiv.classList.add("collapses");
	if (parent != document.getElementById("tree")) {
	}
	newDiv.addEventListener("click", function() {
		this.querySelector(".nested").classList.toggle("active");
		console.log("clicked one!");
	});

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

	
	console.log(scoreMap);

	if (testingMode ) {	var lines = data.split("\n", 400);}
	else {	var lines = data.split("\n");}

	var species = [];
	lines.forEach(element => {

		if (element.includes("|") && element.includes(".")) {
			var half1 = element.split("|"); // cut off the | before name
			var half2 = half1[1].split("."); //cut off the . after name
			if (!species.includes(half2[0])) 
                {species.push(half2[0])} //add the species name to the list of species
            var parents = half2[1].split("\t"); //split the remainder into a list of parent names
			var currentParent = document.getElementById("tree"); //set first parent to the root node
			var pleaseBreak = false; //workaround to "break" in foreach
            parents.forEach(parent => { //build a tree of parents, if they don't already exist
                if (parent == half2[0]) { //if the name of the next parent is the name of the species, end treebuilding.
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