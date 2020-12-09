/*
* init the MSAViwer
*/
var m = msa({
    el: document.getElementById("msa"),
    colorscheme: { "scheme": "hydro" },
    conf: {
        registerMouseHover: false,
        registerMouseClicks: true,
        eventBus: true,
        alphabetSize: 20,
        dropImport: false,
        debug: false,
        hasRef: false, // hasReference,
        bootstrapMenu: false,
    },
    vis: {
        sequences: true,
        markers: true,
        metacell: false,
        conserv: false,
        overviewbox: true,
        seqlogo: false,
        gapHeader: false,
        leftHeader: true,

        // about the labels
        labels: true,
        labelName: true,
        labelId: false,
        labelPartition: false,
        labelCheckbox: false,

        // meta stuff
        metaGaps: true,
        metaIdentity: true,
        metaLinks: true
    },
    zoomer: {
        // general
        alignmentWidth: "auto",
        alignmentHeight: 500,
        columnWidth: 15,
        rowHeight: 15,
        autoResize: true, // only for the width

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
        overviewboxPaddingTop: 2,
        overviewboxWidth: "auto",

        // meta cell
        metaGapWidth: 35,
        metaIdentWidth: 40,
        metaLinksWidth: 25
    },
    visorder: {
        alignmenBody: 1,
        overviewBox: -1,
    }
});

console.log(m);

// handle event when row clicked
m.g.on("row:click", function (data) {
    console.log(data);
});

async function updateMSAViewer(taxonList) {
    let data = ""

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
