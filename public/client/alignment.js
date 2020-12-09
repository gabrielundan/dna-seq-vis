/**
 * Track of highlighted index
 */

let prevHighlightIndex = 0;

/**
 * Track the scores and sequences
 */
let scores = [];
let sequences = [];

/*
* init the MSAViwer
*/
var m = msa({
    el: document.getElementById("msa"),
    colorscheme: { "scheme": "hydro" },
    conf: {
        registerMouseHover: true,
        registerMouseClicks: true,
        eventBus: true,
        alphabetSize: 20,
        dropImport: false,
        debug: false,
        hasRef: true, // hasReference,
        bootstrapMenu: false,
    },
    vis: {
        conserv: true,
        sequences: true,
        markers: true,
        overviewbox: true,
        leftHeader: true,

        // about the labels
        labels: true,
        labelName: true,
        labelId: false,
        labelPartition: false,
        labelCheckbox: false,
    },
    zoomer: {
        // general
        alignmentWidth: "auto",
        alignmentHeight: 500,
        columnWidth: 15,
        rowHeight: 15,

        // labels
        textVisible: true,
        labelIdLength: 30,
        labelNameLength: 100,
        labelPartLength: 15,
        labelCheckLength: 15,
        labelFontsize: 13,
        labelLineHeight: "13px",

        // marker
        markerFontsize: "10px",
        stepSize: 1,
        markerStepSize: 2,
        markerHeight: 20,

        // canvas
        residueFont: "13", //in px
        canvasEventScale: 1,

        // overview box
        boxRectHeight: 1,
        boxRectWidth: 1,
        overviewboxWidth: "auto",
    },
    visorder: {
        overviewBox: 2,
        alignmentBody: 1,
    }
});

// console.log(m);

// handle event when residue is clicked
m.g.on("residue:click", function (data) {
    console.log(data);
    let seq = m.seqs.models[data.seqId];
    let letter = seq.attributes.seq;
    console.log(letter.charAt(data.rowPos));
    // tooltip displays info on the clicked reside
});

// handle event when row clicked
m.g.on("row:click", function (data) {
    let line = d3.select('#seq-' + data.seqId + '-line-graph');

    if (prevHighlightIndex != data.seqId) {
        console.log("not previous index");
        d3.select('#seq-' + prevHighlightIndex + '-line-graph').style("stroke-width", 2).attr('opacity', '0.5');
        prevHighlightIndex = data.seqId;
    }

    if (line._groups.length == 1) {
        // console.log(line);

        let strokeAttr = line._groups[0][0].attributes.getNamedItem("stroke-width");

        // console.log(strokeAttr);
        // console.log(strokeAttr.value == 2);

        if (strokeAttr.value == 2) {
            line.style("stroke-width", 4).attr('opacity', '1').moveToFront();
        } else {
            line.style("stroke-width", 2).attr('opacity', '0.5');
        }

        // console.log(strokeAttr.value);
    }
});

async function updateMSAViewer(taxonList) {
    let data = ""

    sequences = [];

    for (let i = 0; i < taxonList.length; i++) {
        let currTaxonId = taxonList[i];

        let currSeq = taxonomyIdMap.get(currTaxonId);

        data += ">" + currTaxonId + "\n" + currSeq + "\n";
    }

    // give the new data to MSAViwer
    m.seqs.reset(msa.io.fasta.parse(data));

    // rerender
    m.render();
}
