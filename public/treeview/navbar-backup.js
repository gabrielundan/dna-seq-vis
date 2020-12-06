document.body.onload = loadTree;

var currentlyActiveSpecies = [];

function loadTree () { 

	jQuery.get('treeview/sequences_tax_mapping.txt', function(data) {
		do_something_with(data)
	 }, 'text');
	addCheckBox("Alpha");
	addCheckBox("Beta");
	addCheckBox("Charlie");

}

function getCurrentSpecies() {
	return currentlyActiveSpecies;
}

function addCheckBox(name, parent) {
  // create a new div element 
  const newDiv = document.createElement("div"); 
  
  // and give it some content 
  const newContent = document.createTextNode(name); 
  const newCheckbox = document.createElement("INPUT");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("value", name);
  newCheckbox.onclick = function() {checkboxClick(newCheckbox.value, newCheckbox.checked)}
  
  // add the text node to the newly created div
  newDiv.appendChild(newContent);  
  newDiv.appendChild(newCheckbox);

  parent.appendChild(newDiv);
}

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

}

function createNewParentDiv(name, parent) {
    const newDiv = document.createElement("div"); 
    const newContent = document.createTextNode(name);
    newDiv.appendChild(newContent);

    parent.appendChild(newDiv);
}

function insertToTreeDiv(newDiv) {
	const currentDiv = document.getElementById("tree"); 
	currentDiv.appendChild(newDiv);
}

function do_something_with(data) {
	var lines = data.split("\n");
	var species = [];
	lines.forEach(element => {

		if (element.includes("|") && element.includes(".")) {
			var half1 = element.split("|");
			var half2 = half1[1].split(".");
			if (!species.includes(half2[0])) 
                {species.push(half2[0])}
            var parents = half2.split("\t");
            var currentParent = document.getElementById("tree"); 
            parents.forEach(parent => {
                if (parent == half2[0]) {
                    break;
                }

            })







		}

	});
	species.forEach(element => addCheckBox(element));
	console.log(species.length);
}