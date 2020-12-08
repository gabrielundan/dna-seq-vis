async function getData(link) {
    return await fetch(link, { method: "GET" });
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
