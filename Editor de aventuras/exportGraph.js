let downloadButton = document.getElementById("graph-output");
downloadButton.addEventListener("click", function () {

    if (network !== null && network !== undefined) {
        let dataJSON = []

        let allNodes = nodes.get({returnType: "Object"})
        
        for(nodeID in allNodes){
            let advInfo = allNodes[nodeID].adventureInfo
            dataJSON.push({id: parseInt(nodeID), options: [], text: advInfo.text, types_scenes: advInfo.types_scenes})
        }
        
        let allEdges = edges.get({returnType: "Object"})
        
        for(edgeID in allEdges){
            let advInfo = allEdges[edgeID].adventureInfo
            let nodeFrom = allEdges[edgeID].from
            let nodeTo = allEdges[edgeID].to
            // Isso funciona porque dataJSON é um objeto
            dataJSON[nodeFrom].options.push({id: nodeTo, text: advInfo.text})
        }


        let jsonString = JSON.stringify(dataJSON, null, 2);
        let blob = new Blob([jsonString], {type: 'application/json'})
        // Âncora temporária para fazer o download do .json
        let anchor = document.createElement("a")
        anchor.href = URL.createObjectURL(blob)
        anchor.download = "grafo.json"
        anchor.click()

        URL.revokeObjectURL(anchor.href)
    }
    else{
        alert("Nenhum grafo detectado");
    }

    
})
