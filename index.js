// import the GraphClass definiton from GraphClass.js
import GraphClass from './GraphClass.js'; 

/*
    Given some JSON data representing a graph, render it with D3
*/
function renderSecondGraph(graphData) {
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();

    if (simulation) {
        simulation = null;
    }

    d3.select("svg").remove();

    var nodes = graphData["nodes"]
    var links = graphData["edges"];
    var width = window.innerWidth;
    var height = window.innerHeight;

    var tooltip = null;

    svg = d3.select("#graphviz")
        .append("svg")
        .attr("width", width-100)
        .attr("height", height-200);
    svg.append("rect")
        .attr("width", width-100)
        .attr("height", height-200)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");
    
    graphGroup = svg.append("g").attr("id", "g");


    function zoomed(e) {
        graphGroup.attr("transform", e.transform);
    }
    
    var zoom = d3.zoom()
        .scaleExtent([0.1,5])
        .on("zoom", zoomed);
    svg.call(zoom)

   
    var x = d3.scalePoint()
        .range([0, 1500])
        .domain(nodes);

    var size = d3.scaleLinear()
        .domain([1,10])
        .range([0.5,8]);

    var link = graphGroup.selectAll(".links")
        .data(links)
        .enter()
        .append("path")
        .attr("d", function(d) {
            var start = x(d.source)
            var end = x(d.target)
            return ['M', start, 700,    
            'A',                            
            (start - end)/2, ',',    
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', 700] 
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "grey")
        .style("stroke-width", 1);
    
    var node = graphGroup.selectAll(".nodes")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("cx", d => x(d))
            .attr("cy", 700)
            .attr("r", 4)
            .attr("id", function(d) {return d.id})
            .attr("stroke", "white")
            .on("click", clickNode);;

    var label = graphGroup.selectAll(".labels")
        .data(nodes)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("id", function(d) {return d.id})
            .attr("transform", function(d) {return( "translate(" + (x(d)) + "," + 720 + ")rotate(-45)")})
            .text(function(d) {return determineLabel(d);})
            .style("text-anchor", "end")
            .style("font-size", 5);

    node.on("mouseover", function(event, d) {
        node.style("fill", "grey");
        d3.select(this).style("fill", "red").attr("r", 8);


        link
            .style("stroke", a => (a.source.id == d.id || a.target.id == d.id) ? "red": "grey")
            .style("stroke-opacity", a => (a.source.id == d.id || a.target.id == d.id) ? 1: .2)
            .style("stroke-width", a => (a.source.id == d.id || a.target.id == d.id) ? 4: 1);

        label
            .style("font-size", b => b.id == d.id ? 18.9: 5)
            .attr("y", b => b.id == d.id ? 10: 0);


            svg.append("rect")
            .attr("width", 250)
            .attr("height", 600)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "white");
            svg.append("text")
                .text("Movie name: " + d.name)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 10);
            svg.append("text")
                .text("Movie ID: " + d.id)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 20);
            svg.append("text")
                .text("Movie rank: " + d.rank)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 30);
            svg.append("text")
                .text("Release year: " + d.year)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 40);
            svg.append("text")
                .text("IMDB rating: " + d.imdb_rating)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 50);
            svg.append("text")
                .text("Duration: " + d.duration)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 60);
            svg.append("text")
                .text("Genre: " + d.genre)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 70);
            svg.append("text")
                .text("Director name: " + d.director_name)
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", 10)
                .attr("y", 80);
            
            if (!tooltip) {
                
                var imageLink;
                for (var index in imgData) {
                    if (imgData[index].id == d.id) {
                        imageLink = imgData[index].large_img_link;
                    }
                }
    
            
                tooltip = d3.select("#tooltip")
                    .attr("id", "tooltip")
                    .style("width", "250px")
                    .style("height", "350px")
                    .style("position", "absolute")
                    .style("left", "40px")
                    .style("top", "175px");
                    
    
                tooltip.append("img")
                    .attr("id", "img")
                    .attr("width", "250px")
                    .attr("height", "500px")
                    .attr("src", imageLink);
    
                
            }
            else {
                var imageLink;
                for (var index in imgData) {
                    if (imgData[index].id == d.id) {
                        imageLink = imgData[index].large_img_link;
                    }
                }
    
                tooltip.select("img").attr("src", imageLink);
            }

    })
    .on("mouseout", function(event, d) {
        node.style("fill", "red")
            .attr("r", 4);

        link.style("stroke", "grey")
            .style("stroke-width", "1")
            .style("stroke-opacity", "1");

        label
            .style("font-size", 5)
            .attr("y", 0);
    });

    var sourceNode = null
    function clickNode(event, d) {
        if (!sourceNode) {
            sourceNode = d;
        }
        else {
            var newLink = {source: sourceNode.id, target: d.id};
            if (simulation) {
                simulation.stop();
            }
            
            graphObj.addEdge(newLink);
            if (graphNum == 1) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(graphObj.graph);
            }
            sourceNode = null;
        }
    }
    


}

function renderFirstGraph(graphData) {
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();
    if (simulation) {
        simulation = null;
    }

    d3.select("svg").remove();

    var nodes = graphData["nodes"];
    var links = graphData["edges"];
    var width = window.innerWidth;
    var height = window.innerHeight;
    var tooltip = null;

    svg = d3.select("#graphviz")
        .append("svg")
        .attr('width', width-100)
        .attr('height', height-200);
    svg.append("rect")
        .attr("width", width - 100)
        .attr("height", height - 200)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");


    var graphGroup = svg.append("g").attr("id", "g");

    function zoomed(e) {
        graphGroup.attr("transform", e.transform);
    }
    
    var zoom = d3.zoom()
        .scaleExtent([0.1,5])
        .on("zoom", zoomed);
    svg.call(zoom)

    
    simulation = d3.forceSimulation()
        .nodes(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(100))
        .force("charge", d3.forceManyBody().strength(0))
        .force("center", d3.forceCenter((width-100)/2,(height-200)/2))
        .force("collide", d3.forceCollide().radius(3))
        .force("gravity", d3.forceManyBody().strength(-0.001));


    var link = graphGroup.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke-width", 0.4)
        .attr("stroke", "grey");


    var node = graphGroup.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d) {return d.id;})
        .attr("r", 3)
        .attr("fill", "red")
        .on("click", clickNode);

    node.on("mouseover", function(d, i) {
        graphGroup.selectAll(".node").attr("r", 3).attr("fill", "red");
        graphGroup.select("g").selectAll(".text").remove();
        svg.append("rect")
        .attr("width", 250)
        .attr("height", 600)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");
        svg.append("text")
            .text("Movie name: " + i.name)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 10);
        svg.append("text")
            .text("Movie ID: " + i.id)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 20);
        svg.append("text")
            .text("Movie rank: " + i.rank)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 30);
        svg.append("text")
            .text("Release year: " + i.year)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 40);
        svg.append("text")
            .text("IMDB rating: " + i.imdb_rating)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 50);
        svg.append("text")
            .text("Duration: " + i.duration)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 60);
        svg.append("text")
            .text("Genre: " + i.genre)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 70);
        svg.append("text")
            .text("Director name: " + i.director_name)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("x", 10)
            .attr("y", 80);
        
        if (!tooltip) {
            
            var imageLink;
            for (var index in imgData) {
                if (imgData[index].id == i.id) {
                    imageLink = imgData[index].large_img_link;
                }
            }

        
            tooltip = d3.select("#tooltip")
                .attr("id", "tooltip")
                .style("width", "250px")
                .style("height", "350px")
                .style("position", "absolute")
                .style("left", "40px")
                .style("top", "175px");
                

            tooltip.append("img")
                .attr("id", "img")
                .attr("width", "250px")
                .attr("height", "500px")
                .attr("src", imageLink);

            
        }
        else {
            var imageLink;
            for (var index in imgData) {
                if (imgData[index].id == i.id) {
                    imageLink = imgData[index].large_img_link;
                }
            }

            tooltip.select("img").attr("src", imageLink);
        }
        
        graphGroup
            .append("text")
            .text(determineLabel(i))
            .attr("id", i.id)
            .attr("x", i.x-5)
            .attr("y", i.y-8)
            .attr("font-size", "10px")
            .attr("fill", "blue")
            .style("display", "block");
            
        
    });

    node.on("mouseout", function(d, i) {
        graphGroup.selectAll("text")
            .style("display", "none");
    });



    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    

    var sourceNode = null
    function clickNode(event, d) {
        if (!sourceNode) {
            sourceNode = d;
        }
        else {
            var newLink = {source: sourceNode.id, target: d.id};
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.addEdge(newLink);
            }
            else {
                largestComponent.addEdge(newLink);
            }
            if (document.querySelector("#img")) {
                document.querySelector("#img").remove();
            }  
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
            sourceNode = null;
        }
    }

    

    simulation.on("tick", ticked);

    
}

function highlightNode(id) {
    var search = id
    svg.select("g").selectAll(".node").attr("r", 3).attr("fill", "red");
    svg.select("g").selectAll(".text").remove();

    if (graphObj.graph.nodes.some(node => node.id === search)) {
        var node = document.getElementById(id);
        node.setAttribute("r", 10);
        inNode.setAttribute("fill", "green")
        svg.select("g").append("text")
            .text(determineLabel(inNode))
            .attr("class", "text")
            .attr("x", inNode.cx.baseVal.value-5)
            .attr("y", inNode.cy.baseVal.value-8)
            .attr("font-size", "20px")
            .attr("fill", "blue")
            .style("display", "block");

    }
    else if (graphObj.graph.nodes.some(node => node.rank === search)) {
        var nodeId = "";
        for (var index in graphObj.graph.nodes) {
            if (graphObj.graph.nodes[index].rank == search) {
                nodeId = graphObj.graph.nodes[index].id;
            }
        }
        var inNode = document.getElementById(nodeId);
        inNode.setAttribute("r", 10);
        inNode.setAttribute("fill", "green")
        svg.select("g").append("text")
            .text(determineLabel(inNode))
            .attr("class", "text")
            .attr("x", inNode.cx.baseVal.value-5)
            .attr("y", inNode.cy.baseVal.value-8)
            .attr("font-size", "20px")
            .attr("fill", "blue")
            .style("display", "block");
    }
    else if (graphObj.graph.nodes.some(node => node.name === search)) {
        var nodeId = "";
        for (var index in graphObj.graph.nodes) {
            if (graphObj.graph.nodes[index].name == search) {
                nodeId = graphObj.graph.nodes[index].id;
            }
        }
        var inNode = document.getElementById(nodeId);
        inNode.setAttribute("r", 10);
        inNode.setAttribute("fill", "green")
        svg.select("g").append("text")
            .text(determineLabel(inNode))
            .attr("class", "text")
            .attr("x", inNode.cx.baseVal.value-5)
            .attr("y", inNode.cy.baseVal.value-8)
            .attr("font-size", "20px")
            .attr("fill", "blue")
            .style("display", "block");
    }
    else if (graphObj.graph.nodes.some(node => node.genre.split(",").includes(search))) {
        for (var index in graphObj.graph.nodes) {
            var nodeId = "";
            var genres = graphObj.graph.nodes[index].genre.split(",");
            for (var genreIndex in genres) {
                var genre = genres[genreIndex];
                if (genre == search) {
                    nodeId = graphObj.graph.nodes[index].id;
                    var inNode = document.getElementById(nodeId);
                    inNode.setAttribute("r", 10);
                    inNode.setAttribute("fill", "green")
                    svg.select("g").append("text")
                        .text(determineLabel(inNode))
                        .attr("class", "text")
                        .attr("x", inNode.cx.baseVal.value-5)
                        .attr("y", inNode.cy.baseVal.value-8)
                        .attr("font-size", "20px")
                        .attr("fill", "blue")
                        .style("display", "block");
                }
            }
        }
    }
    else if (graphObj.graph.nodes.some(node => node.cast_name.split(",").includes(search))) {
        for (var index in graphObj.graph.nodes) {
            var nodeId = "";
            var cast_names = graphObj.graph.nodes[index].cast_name.split(",");
            for (var castIndex in cast_names) {
                var cast_name = cast_names[castIndex];
                if (cast_name == search) {
                    nodeId = graphObj.graph.nodes[index].id;
                    var inNode = document.getElementById(nodeId);
                    inNode.setAttribute("r", 10);
                    inNode.setAttribute("fill", "green")
                    svg.select("g").append("text")
                        .text(determineLabel(inNode))
                        .attr("class", "text")
                        .attr("x", inNode.cx.baseVal.value-5)
                        .attr("y", inNode.cy.baseVal.value-8)
                        .attr("font-size", "20px")
                        .attr("fill", "blue")
                        .style("display", "block");
                }
            }
        }
    }
    else if (graphObj.graph.nodes.some(node => node.director_name.split(",").includes(search))) {
        for (var index in graphObj.graph.nodes) {
            var nodeId = "";
            var director_names = graphObj.graph.nodes[index].director_name.split(",");
            for (var directorIndex in director_names) {
                var director_name = director_names[directorIndex];
                if (director_name == search) {
                    nodeId = graphObj.graph.nodes[index].id;
                    var inNode = document.getElementById(nodeId);
                    inNode.setAttribute("r", 10);
                    inNode.setAttribute("fill", "green")
                    svg.select("g").append("text")
                        .text(determineLabel(inNode))
                        .attr("class", "text")
                        .attr("x", inNode.cx.baseVal.value-5)
                        .attr("y", inNode.cy.baseVal.value-8)
                        .attr("font-size", "20px")
                        .attr("fill", "blue")
                        .style("display", "block");
                }
            }
        }
    }
    else if (graphObj.graph.nodes.some(node => node.writter_name.split(",").includes(search))) {
        for (var index in graphObj.graph.nodes) {
            var nodeId = "";
            var writer_names = graphObj.graph.nodes[index].writter_name.split(",");
            for (var writerIndex in writer_names) {
                var writer_name = writer_names[writerIndex];
                if (writer_name == search) {
                    nodeId = graphObj.graph.nodes[index].id;
                    var inNode = document.getElementById(nodeId);
                    inNode.setAttribute("r", 10);
                    inNode.setAttribute("fill", "green")
                    svg.select("g").append("text")
                        .text(determineLabel(inNode))
                        .attr("class", "text")
                        .attr("x", inNode.cx.baseVal.value-5)
                        .attr("y", inNode.cy.baseVal.value-8)
                        .attr("font-size", "20px")
                        .attr("fill", "blue")
                        .style("display", "block");
                }
            }
        }
    }
/*
    if (contains) {
        var node = document.getElementById(id);
        node.setAttribute("r", 10);

        
    }*/
    else {
        if (document.querySelector("#img")) {
            document.querySelector("#img").remove();
        }  
        if (graphNum == 1) {
            if (checked == 0) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderFirstGraph(largestComponent.graph);
            }
            
        }
        else {
            if (checked == 0) {
                renderSecondGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(largestComponent.graph);
            }
            
        }
    }
}

/*
    Function to fetch the JSON data from output_graph.json & call the renderGraph() method
    to visualize this data
*/
function loadAndRenderGraph(fileName, imgName) {
    fetch("./"+imgName).then(response => {
        return response.json();
    })
    .then (data => {
        imgData = data;
    });
    

    fetch("./"+fileName).then(response => {
        return response.json();
    })
    .then(data => {
        graphObj.graph = data;
        renderFirstGraph(graphObj.graph);
        displayGraphStatistics(graphObj);
        setUpExtras(graphObj);
    });
}

/*
    A method to compute and display graph statistics
*/
function displayGraphStatistics(graphObj) {
    largestComponent = graphObj.myFindLargestConnectedComponent();
    var diameter = largestComponent.myFindGraphDiameter();
    var toggle = document.querySelector("#switch");
    toggle.addEventListener("change", function() {
        if (document.querySelector("#img")) {
            document.querySelector("#img").remove();
        }  
        if (this.checked) {
            checked = 1;
            if (graphNum == 1) {
                renderFirstGraph(largestComponent.graph);
            }
            else {
                renderSecondGraph(largestComponent.graph);
            }
        }
        else {
            checked = 0;
            if (graphNum == 1) {
                renderFirstGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(graphObj.graph);
            }
        }
    })

    var button = document.querySelector("#computeStats");
    button.addEventListener("click", function() {
        if (checked == 0) {
            var average = graphObj.computeAverageNodeDegree();
            document.querySelector("#avgDegree").innerText=average;
            var components = graphObj.computeConnectedComponents();
            document.querySelector("#numComponents").innerText = components;
            var density = graphObj.computeGraphDensity();
            document.querySelector("#graphDensity").innerText = density;
            var apl = graphObj.computeMyAPL();
            document.querySelector("#apl").innerText = apl;
        }
        else {
            var average = largestComponent.computeAverageNodeDegree();
            document.querySelector("#avgDegree").innerText=average;
            var components = largestComponent.computeConnectedComponents();
            document.querySelector("#numComponents").innerText = components;
            var density = largestComponent.computeGraphDensity();
            document.querySelector("#graphDensity").innerText = density;
        }
        document.querySelector("#diameter").innerText = diameter;
    })
}

function setUpExtras(graphObj) {
    var nodeButton = document.querySelector("#addNode");
    nodeButton.addEventListener("click", function() {
        var id = prompt("Enter new node id:\nNote: You may have to zoom out to see new node");
        if (id != null && id != "") {
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.addNode(id);
            }
            else {
                largestComponent.addNode(id);
            }
            if (document.querySelector("#img")) {
                document.querySelector("#img").remove();
            }  
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
        }
    });

    var edgeButton = document.querySelector("#addEdge");
    edgeButton.addEventListener("click", function() {
        alert("Click on a source node then a target node to add an edge");
    });

    var editButton = document.querySelector("#editNode");
    editButton.addEventListener("click", function() {
        var id = prompt("Enter id of node you want to edit: \n");
        if (id != null && id != "") {
            var node;
            for (var index in graphObj.graph.nodes) {
                if (graphObj.graph.nodes[index].id == id) {
                    node = graphObj.graph.nodes[index];
                }
            }
            var newRank = prompt("Edit rank?", node.rank);
            var newId = prompt("Edit id?", node.id);
            var newName = prompt("Edit name?", node.name);
            var newYear = prompt("Edit year?", node.year);
            var newImdbVotes = prompt("Edit IMDB votes?", node.imdb_vote);
            var newImdbRating = prompt("Edit IMDB rating?", node.imdb_rating);
            var newCertificate = prompt("Edit certificate?", node.certificate);
            var newDuration = prompt("Edit duration?", node.duration);
            var newGenre = prompt("Edit genre?", node.genre);
            var newCastId = prompt("Edit cast ids?", node.cast_id);
            var newCastName = prompt("Edit cast names?", node.cast_name);
            var newDirectorId = prompt("Edit director id?", node.director_id);
            var newDirectorName = prompt("Edit director name?", node.director_name);
            var newWriterName = prompt("Edit writer name?", node.writter_name);
            var newWriterId = prompt("Edit writer id?", node.writter_id);
            
            

            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.editNode(id, newRank, newId, newName, newYear, newImdbVotes, newImdbRating, newCertificate, newDuration, newGenre, newCastId,
                    newCastName, newDirectorId, newDirectorName, newWriterName, newWriterId);
            }
            else {
                largestComponent.editNode(id, newRank, newId, newName, newYear, newImdbVotes, newImdbRating, newCertificate, newDuration, newGenre, newCastId,
                    newCastName, newDirectorId, newDirectorName, newWriterName, newWriterId);
            }
            if (document.querySelector("#img")) {
                document.querySelector("#img").remove();
            }  
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
        }
    });

    var deleteNode = document.querySelector("#deleteNode");
    deleteNode.addEventListener("click", function() {
        var id = prompt("Enter id of node you want to delete: \n");
        if (id != null && id != "") {
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.removeNode(id);
            }
            else {
                laragestComponent.removeNode(id);
            }
            if (document.querySelector("#img")) {
                document.querySelector("#img").remove();
            }  
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
        }
    });

    var deleteEdge = document.querySelector("#deleteEdge");
    deleteEdge.addEventListener("click", function() {
        var id1 = prompt("Enter id of source node: \n");
        var id2 = prompt("Enter id of target node: \n");
        if (id1 != null && id2 != null) {
            if (simulation) {
                simulation.stop();
            }
            if (checked == 0) {
                graphObj.removeEdge(id1, id2);
            }
            else {
                largestComponent.removeEdge(id1, id2);
            }
            if (document.querySelector("#img")) {
                document.querySelector("#img").remove();
            }  
            if (graphNum == 1) {
                if (checked == 0) {
                    renderFirstGraph(graphObj.graph);
                }
                else {
                    renderFirstGraph(largestComponent.graph);
                }
                
            }
            else {
                if (checked == 0) {
                    renderSecondGraph(graphObj.graph);
                }
                else {
                    renderSecondGraph(largestComponent.graph);
                }
                
            }
        }
    }); 

    var firstButton = document.querySelector("#graph1");
    firstButton.addEventListener("click", function() {
        
        if (document.querySelector("#img")) {
            document.querySelector("#img").remove();
        }   
        if (simulation) {
            simulation.stop();
        }
        graphNum = 1;
        if (checked == 0) {
            renderFirstGraph(graphObj.graph);
        }
        else {
            renderFirstGraph(largestComponent.graph);
        }
        
    });

    var secondButton = document.querySelector("#graph2");
    secondButton.addEventListener("click", function() {
        if (document.querySelector("#img")) {
            document.querySelector("#img").remove();
        }  

        if (simulation) {
            simulation.stop();
        }
        graphNum = 2;
        if (checked == 0) {
            renderSecondGraph(graphObj.graph);
        }
        else {
            renderSecondGraph(largestComponent.graph);
        }
        
    });

    var search = document.querySelector("#searchInput");
    search.addEventListener("keyup", function() {
        var id = document.getElementById("searchInput").value;
        highlightNode(id);
    });


    var dropdown = document.querySelector("#nodeLabels");
    dropdown.addEventListener("change", function() {
        selectedIndex = dropdown.selectedIndex;
        if (graphNum == 2) {
            if (checked == 0) {
                renderSecondGraph(graphObj.graph);
            }
            else {
                renderSecondGraph(largestComponent.graph);
            }
        }
    });
    
   
}


function determineLabel(i) {
    if (selectedIndex == 0) {
        return i.id;
    }
    else if (selectedIndex == 1) {
        return i.name;
    }
    else if (selectedIndex == 2) {
        return i.genre
    }
    else {
        return i.director_name;
    }
}

// instantiate an object of GraphClass
let graphObj = new GraphClass();
let largestComponent = new GraphClass();

// your saved graph file from Homework 1
let fileName="output_graph.json"
let imgName="movie-img_links.json"

let simulation;
let svg;
let graphNum = 1;
let checked = 0;
let selectedIndex = 0;
let imgData;
let graphGroup;

// render the graph in the browser
loadAndRenderGraph(fileName, imgName);

// compute and display simple statistics on the gra