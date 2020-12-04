// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

// Build X scales and axis:
var x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.01);

var axisX = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
    .range([height, 0])
    .domain(myVars)
    .padding(0.01);

var axisY = svg.append("g")
    .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([1, 100])

var cell = svg.append("g")

// create a tooltip
var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", (d) => {
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function () {
        tooltip.style("opacity", 1)
    }

    function mousemove(event) {
        tooltip
            .html("The exact value of<br>this cell is: " + d.value)
            .style("left", (event.layerX + 45) + "px")
            .style("top", (event.layerY) + "px")
    }

    var mouseleave = function () {
        tooltip.style("opacity", 0)
    }

    var box = svg.append("g");

    var posX = x(d.group);

    var posY = y(d.variable);

    var width = x.bandwidth();

    var height = y.bandwidth();

    box.append("rect")
        .attr("x", posX)
        .attr("y", posY)
        .attr("width", width)
        .attr("height", height)
        .style("fill", myColor(d.value))
        .on("mouseover", mouseover)
        .on("mousemove", (event) => mousemove(event))
        .on("mouseleave", mouseleave);

    box.append("text")
        .attr("x", posX + (width / 3))
        .attr("y", posY + (height * 2 / 3))
        .text(d.group)
        .attr("width", width)
        .attr("height", height);
})