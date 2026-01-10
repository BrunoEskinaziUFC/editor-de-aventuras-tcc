var network
var nodes
var edges
var options, data


function createGraph(jsonInput) {
    var container = document.getElementById('mynetwork');

    console.log("Criando grafo com o input: ");
    console.log(jsonInput);
    console.log("========================================================");

    nodes = new vis.DataSet();
    edges = new vis.DataSet();

    var color = "#97c2fc"
    for (let i = 0; i < jsonInput.length; i++) {
        let newNode = jsonInput[i];
        //console.log("Nó: ", newNode);
        // Nós ======================================================================================
        nodes.add({"id": newNode.id, "label": String(newNode.id), "color": color,  "shape": "dot", "size": 10, "adventureInfo": {"text": newNode.text, "types_scenes": newNode.types_scenes}});
        
        // Caso existam arestas no nó, iterar por elas e adicioná-las à
        //console.log(newNode.options !== undefined, newNode.options !== null);
        // ARESTAS =================================================================
        if (newNode.options !== undefined && newNode.options !== null) {
            for (let k = 0; k < newNode.options.length; k++) {
                // Cada option é uma edge (aresta) do grafo
                let edgeOption = newNode.options[k]
                let newEdge = {"from": newNode.id, "to": edgeOption.id, adventureInfo: {"id": edgeOption.id, "text": edgeOption.text} }
                edges.add(newEdge);
                
            }
        }
    }

    
    var nodeColors = {};
    var allNodes = nodes.get({ returnType: "Object" });
    for (nodeId in allNodes) {
        nodeColors[nodeId] = allNodes[nodeId].color;
    }
    var allEdges = edges.get({ returnType: "Object" });

    // adding nodes and edges to the graph
    data = {nodes: nodes, edges: edges};

    options = {
        "locale": 'pt' ,
        "configure": {
            "enabled": true
        },
        "nodes":{
            "color":{
                "background": "#D2E5FF"
            }
        },
        "edges": {
            "color": {
                "inherit": true
            },
            "smooth": {
                "enabled": true,
                "type": "dynamic"
            }
        },
        "interaction": {
            "dragNodes": true,
            "hideEdgesOnDrag": false,
            "hideNodesOnDrag": false
        },
        "physics": {
            "enabled": true,
            "stabilization": {
                "enabled": true,
                "fit": true,
                "iterations": 1000,
                "onlyDynamicEdges": false,
                "updateInterval": 50
            }
        }
    };
    // Ativar modo de edição
    options.manipulation = {
        'enabled': true,
        'addNode': function(nodeData, callback){
            nodeData.label = "novo!";
            callback(nodeData)
        },
        'editNode': function(nodeData, callback) {
            editingNode(nodeData)
            //console.log("No listener: ", nodes.get(nodeData.id));
            
            // Não estava atualizando os dados por algum motivo 
            // Colocando null parece fazer funcionar
            callback(null)
            
        },
        'editEdge': function (edgeData, callback) {
            console.log("edgeData:", edgeData);
            
            editingEdge(edgeData)
            callback(edgeData);
        }
    }
    options.edges = {'arrows': {'to': {'enabled': true}} }


    
    // if this network requires displaying the configure window,
    // put it in its div
    options.configure["container"] = document.getElementById("config");
    
    
    network = new vis.Network(container, data, options);


    return [network, options];
    //*/
}




var form = document.getElementById("graph-input");
                
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    submitGraph(event);
})

async function submitGraph(event) {
    //var file = document.getElementById("file-graph-input");
    var fileInput = event.target.fileInput;
    var file = fileInput.files[0];
    
    if (!file){return;}

    try {
        var text = await file.text();
        var textJSON = JSON.parse(text);

        //console.log(textJSON);
        
    } catch (error) {
        alert("Erro ao carregar o arquivo JSON")
        
    }
    
    alert("Grafo importado!");

    var net;
    
    try {
        
        net = createGraph(textJSON);
        startEvents(net[0], net[1]);
    } catch (error) {
        console.log(error);
        
    }
}
