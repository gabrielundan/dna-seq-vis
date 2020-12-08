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
        bootstrapMenu: true,
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
        overviewboxWidth: "fitted",

        // meta cell
        metaGapWidth: 35,
        metaIdentWidth: 40,
        metaLinksWidth: 25
    }
});

(async () => {
    // get the data
    const response = await getData();

    //get the text from the response
    const text = await decodeText(response);

    //split up the sequences
    const lines = text.split("\n");

    //data to be parsed by the MSAViewer
    let data = "";

    var i = 0

    for (line of lines) {
        if (line != "") {
            var id = line.substr(0, 40).trim();
            var seq = line.substr(40).trim();
            // adding data while removing unused identifiers except the taxonomy id
            data += id.split("|")[0] + "\n" + seq + "\n";
            i++;
        }

        // only load 100 for now
        if (i > 100) {
            break;
        }
    }

    // give the new data to MSAViwer
    m.seqs.reset(msa.io.fasta.parse(data));

    // rerender
    m.render();
})();