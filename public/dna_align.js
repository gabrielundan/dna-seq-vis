async function getData() {
    return await fetch("data/aligned_unenrolled.faa", { method: "GET" });
}

async function decodeText(response) {
    let reader = response.body.getReader();
    let utf8Decoder = new TextDecoder();
    let nextChunk;

    let resultStr = '';

    while (!(nextChunk = await reader.read()).done) {
        let partialData = nextChunk.value;
        resultStr += utf8Decoder.decode(partialData);
    }

    return resultStr;
}

(async () => {
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 30, left: 30 };
    var width = 25;
    var height = 25;


    var svg = d3.select("#dna_align")
        .attr("viewbox", `0 0  ${width} ${height}`)
        .attr("width", "80%")
        .attr("height", "60%")
        .attr("easypz", '{"applyTransformTo": ".transform"}')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = 0;

    var y = 0;

    var cell = svg.append("g");

    const response = await getData();
    const text = await decodeText(response);
    const lines = text.split("\n");

    for (line of lines) {
        const row = cell.append("g");

        var source = line.substring(40);
        if (source != "") {
            for (amino of source) {

                var box = row.append("g");

                box.append("rect")
                    .attr("x", x * width)
                    .attr("y", y * height)
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "red");

                box.append("text")
                    .attr("x", x * width + (width / 3))
                    .attr("y", y * height + (height * 2 / 3))
                    .text(amino)
                    .attr("width", width)
                    .attr("height", height);

                x++;
            }
            y++;
            x = 0;
        }

        if (y > 2) {
            break;
        }
    }
})();