
var window = document.defaultView;
    
var infobox = document.getElementById("infobox-text");
var saveButton = document.getElementById("save-infobox")

var selectedNode = null;
var selectedNodeData = null;

var selectedEdge = null;
var selectedEdgeData = null;


// Declarados em createGraph: 
// nodes, edges


// Funções Auxiliares ================================================================================================================== 

function editingNode(nodeData) {
    
    if (selectedNode !== null) {
        var infobox = document.getElementById("infobox-text");
        //selectedNode.adventureInfo = JSON.parse(infobox.value);
        nodes.updateOnly({"id": selectedNode.id, "adventureInfo": JSON.parse(infobox.value)})
        console.log("Salvando: ", infobox.value);
           
    }
    
}

function editingEdge(edgeData){
    if (selectedEdge !== null) {
        var infobox = document.getElementById("infobox-text");
        
        var notUndefined = selectedEdge['adventureInfo'] !== undefined
        var notNull = selectedEdge['adventureInfo'] !== null
        if (notUndefined && notNull) {
            selectedEdge.adventureInfo = JSON.parse(infobox.value);
            selectedEdge.adventureInfo.id = selectedEdge.to;
        }

        

        var edgeId = edgeData.id
        var edge = edges.get(edgeId);


        // Não tá fazendo muito agora 
        // Era uma tentativa de trocar para onde a aresta apontava pela caixa de informações
        if (edge['adventureInfo'] !== undefined && edge['adventureInfo'] !== null ) {
            edge.adventureInfo.id = edgeData.to;
            if (edgeData.to !== null) {
                edge.adventureInfo.id = edgeData.to;

                console.log("Salvando em aresta: ", edgeData.to);
                console.log("\n");
                
                infobox.value = JSON.stringify(edge.adventureInfo, null, 4);
            }
            
        }
        
    }
}

// ================================================================================================================== Funções Auxiliares 



function startEvents(graph, options){
    
    var infobox = document.getElementById("infobox-text");
    var saveButton = document.getElementById("save-infobox")
    
    var colorSelector = document.getElementById("color-node");
    var labelInput = document.getElementById("label-node");
    var imageInput = document.getElementById("image-node");


    graph.enableEditMode();
    
    graph.on("selectNode", function (nodeData) {
        var advInfo = null;
        // Selecionar o primeiro nó do array de seleções
        var nodeId = nodeData.nodes[0];
        
        // Se são vários nós agrupados (Cluster)
        if (graph.isCluster(nodeId)) {
            console.log("Cluster selecionado:");
            console.log(nodeData.nodes[0]);
            selectedNode = graph.body.nodes[nodeId];
            
        }
        else{
            //selectedNode = graph.body.data.nodes.get(nodeId);
            selectedNode = nodes.get(nodeId)
            selectedNodeData = nodeData;
            console.log("Nó selecionado:");
            console.log(selectedNode);
            
            // Atualizar a Caixa de Informações
            labelInput.value = selectedNode.label
            colorSelector.value = selectedNode.color
            if (selectedNode.shape === "image") {
                imageInput.value = selectedNode.image;
            }

            infobox.value = ""
            //'adventureInfo' in nodeData
            var notUndefined = selectedNode['adventureInfo'] !== undefined
            var notNull = selectedNode['adventureInfo'] !== null
            //console.log("tem advInfo", notUndefined, notNull);
            //console.log(selectedNode['adventureInfo']);
            
            if (notUndefined && notNull) {
                advInfo = selectedNode.adventureInfo;
                infobox.value += JSON.stringify(advInfo, null, 4);
                
            }else{
                infobox.value += "Nó sem dados"
            }
        }
        
        

    })

    graph.on("deselectNode", function () {
        infobox.value = " ";
        selectedNode = null
        selectedNodeData = null

        console.log("=============================");
        
    })

    graph.on("selectEdge", function (edgeData) {
        // Evitar conflitos, pois ao selecionar um nó, ele também seleciona as suas arestas
        if (selectedNode === null && selectedNodeData === null) {
            var advInfo = null;
            // Selecionar a primeira aresta do array de seleções
            var edgeId = edgeData.edges[0];
            
            console.log("Aresta selecionada: ");
            //console.log(edgeData);
            //console.log(selectedNode);
            
            console.log("é de cluster?", graph.isCluster(edgeId));
            
            
            selectedEdge = graph.body.data.edges.get(edgeId);
            console.log(graph.body.data.edges.get(edgeId));
            console.log(edges.get(edgeId));
            
            selectedEdgeData = edgeData;
            console.log(graph);
            

            infobox.value = " "
            var notUndefined = selectedEdge['adventureInfo'] !== undefined
            var notNull = selectedEdge['adventureInfo'] !== null
            
            if (notUndefined && notNull) {
                advInfo = selectedEdge.adventureInfo;
                infobox.value += JSON.stringify(advInfo, null, 4);
            }else{
                infobox.value += "Aresta sem dados"
            }
        }
    })

    graph.on("deselectEdge", function(){
        infobox.value = " ";
        selectedEdge = null;
        selectedEdgeData = null;
    })
    
    saveButton.addEventListener("click", function () {
        if (selectedNode !== null && selectedNodeData !== null){
            graph.editNode(selectedNode);
            //edit(selectedNodeData, graph);
            selectedNode.image("sans.png");
        }

        if (selectedEdge !== null && selectedEdgeData !== null) {
            editingEdge(selectedEdgeData);
            
        }
    })


    let configButton = document.getElementById("button-config");
    let configs = document.getElementById("config")

    configButton.addEventListener("click", function () {
        options['configure']['enabled'] = !options['configure']['enabled']
        graph.setOptions(options);

        //graph.
        
        //graph.configurator.options.enabled = !graph.configurator.options.enabled;
    })

    let selectButton = document.getElementById("button-select");
    selectButton.addEventListener("click", function () {
        options['interaction']['multiselect'] = !options['interaction']['multiselect'];
        console.log("Multiselect: ", options['interaction']['multiselect']);
        graph.setOptions(options);
    })

    let clusterButton = document.getElementById("button-cluster");
    clusterButton.addEventListener("click", function () {
        console.log("aaaaaaaaaa");
        console.log(graph.getSelection().nodes);
        

        graph.clustering.cluster({joinCondition: function (nodeOptions) {
            
            return graph.getSelectedNodes().includes(nodeOptions.id)
        }})
    })
    

    colorSelector.addEventListener("input", function (event) {
        if (selectedNode !== null){
            let newColor = event.target.value
            nodes.update({
                id: selectedNode.id,
                color: {
                    background: newColor,
                    highlight: {
                        background: newColor
                    }
                }
            })
        }
    })

    labelInput.addEventListener("change", function (event) {
        if (selectedNode !== null) {
            nodes.update({
                id: selectedNode.id,
                label: event.target.value
            })
        }        
    })

    imageInput.addEventListener("change", function (event) {
        if (selectedNode !== null) {
            // Permitir o usuário dar upload em imagens
            // criando um URL para a imagem não ser bloqueada pelo navegador
            let file = imageInput.files[0];
            let imageURL = URL.createObjectURL(file);
            // Atualizar o dataset
            nodes.update({
                id: selectedNode.id,
                shape: 'circularImage',
                image: imageURL
            })
            console.log(event.target.value);
            
        }
    })

    let imageRemover = document.getElementById("image-remover");
    imageRemover.addEventListener("click", function () {
        if (selectedNode !== null) {
            nodes.update({
                id: selectedNode.id,
                shape: 'dot',
                image: undefined
            })
        }
    })
}



