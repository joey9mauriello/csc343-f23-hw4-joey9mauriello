export default class GraphClass {
    constructor() {
      this.graph = {
        nodes: [],
        edges: [],
        nodeDegrees: {}
      };
    }

    addNode(node) {
      if (!this.graph.nodes.includes(node)) {
        this.graph.nodes.push({id:node});
        this.graph.nodeDegrees[node] = 0;
      }
    
    }

    removeNode(id) {
      for (var index in this.graph.nodes) {
        var node = this.graph.nodes[index];
        if (node.id == id) {
          this.graph.nodes.splice(index, 1);
          //remove edges
          for (var edgeIndex in this.graph.edges) {
            var edge = this.graph.edges[edgeIndex];
            if (edge.source.id == id || edge.target.id == id) {
              this.removeEdge(edge.source.id, edge.target.id);
            }
  
          }
        }
        
      }
    }

    editNode(id, newRank, newId, newName, newYear, newImdbVotes, newImdbRating, newCertificate, newDuration, newGenre, newCastId,
      newCastName, newDirectorId, newDirectorName, newWriterName, newWriterId) {
        for (var index in this.graph.nodes) {
          var node = this.graph.nodes[index];
          if (node.id == id) {
            node.rank = newRank;
            node.id = newId;
            node.name = newName;
            node.year = newYear;
            node.imdb_votes = newImdbVotes;
            node.imdb_rating = newImdbRating;
            node.certificate = newCertificate;
            node.duration = newDuration;
            node.genre = newGenre;
            node.cast_id = newCastId;
            node.cast_name = newCastName;
            node.director_id = newDirectorId;
            node.director_name = newDirectorName;
            node.writter_name = newWriterName;
            node.writter_id = newWriterId;
          }
        }
      }
tt0060827
    addEdge(link) {
      if (link["source"] == link["target"]) {
        alert("Invalid self loop!");
        return;
      }
      for (var edge in this.graph.edges) {
        if (edge["source"] == link["source"] && edge["target"] == link["target"]) {
          alert("Invalid edge. Already exists");
          return;
        }
        else if (edge["source"] == link["target"] && edge["target"] == link["source"]) {
          alert("Invalid edge. Already exists");
          return;
        }
      }
      this.graph["edges"].push(link);
    
      
    }

    removeEdge(source, target) {
      for (var index in this.graph.edges) {
        var edge = this.graph.edges[index];
        if ((edge.source.id == source && edge.target.id == target) || (edge.source.id == target && edge.target.id == source)) {
          this.graph.edges.splice(index, 1);
        }
      }
    }

    // Problem 2) Find Largest Connected Component
    findLargestConnectedComponent() {
      var visited = new Set();
      var largest = new GraphClass();
      var largestSize = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i].id;
        if (!visited.has(node)) {
          var current = new GraphClass();
          this.dfs(node, visited, current);

          if (current.graph.nodes.length > largestSize) {
            largestSize = current.graph.nodes.length;
            largest = current;
          }
        }
      }

      return largest.graph;
    }

    myFindLargestConnectedComponent() {
      var visited = new Set();
      var largest = new GraphClass();
      var largestSize = 0;

      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i];
        if (!visited.has(node.id)) {
          var current = new GraphClass();
          this.myDfs(node, visited, current);

          if (current.graph.nodes.length > largestSize) {
            largestSize = current.graph.nodes.length;
            largest = current;
          }
        }
      }
      return largest;
    }

    dfs(node, visited, current) {
      visited.add(node);
      current.addNode(node);
      for (var i = 0; i < this.graph.edges.length; i++) {
        var edge = this.graph.edges[i];
        if (edge.source == node && !visited.has(edge.target)) {
          current.addEdge(edge);
          this.dfs(edge.target, visited, current);
        }
        else if (edge.target == node && !visited.has(edge.source)) {
          current.addEdge(edge);
          this.dfs(edge.source, visited, current);
        }
      }
    }

    myDfs(node, visited, current) {
      visited.add(node.id);
      current.graph.nodes.push(node);
      for (var i = 0; i < this.graph.edges.length; i++) {
        var edge = this.graph.edges[i];
        if (edge.source.id == node.id && !visited.has(edge.target.id)) {
          current.addEdge(edge);
          this.myDfs(edge.target, visited, current);
        }
        else if (edge.target.id == node.id && !visited.has(edge.source.id)) {
          current.addEdge(edge);
          this.myDfs(edge.source, visited, current);
        }
      }
    }

    // Problem 3) Compute Graph Diameter
    findGraphDiameter() {
      var finalDiameter = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i].id;
        var diameter = this.bfs(node);
        if (diameter > finalDiameter) {
          finalDiameter = diameter;
        }
      }

      return finalDiameter;
    }

    myFindGraphDiameter() {
      var finalDiameter = 0;
      for (var i = 0; i < this.graph.nodes.length; i++) {
        var node = this.graph.nodes[i];
        var diameter = this.myBfs(node);
        if (diameter > finalDiameter) {
          finalDiameter = diameter;
        }
      }
      return finalDiameter;
    }

    bfs(node) {
      var visited = new Set();
      var queue = [];
      visited.add(node);
      var maxDistance = 0;

      queue.push({node, distance: 0});

      while (queue.length > 0) {
        
        var {node, distance} = queue.shift();
        maxDistance = distance;

        for (var i = 0; i < this.graph.edges.length; i++) {
          var edge = this.graph.edges[i];
          if (edge["source"] == node && !visited.has(edge["target"])) {
            visited.add(edge["target"]);
            queue.push({node: edge["target"], distance: distance+1});
          }
          else if (edge["target"] == node && !visited.has(edge["source"])) {
            visited.add(edge["source"]);
            queue.push({node: edge["source"], distance: distance+1});
          }
        }
      }
      return maxDistance;
    }

    myBfs(node) {
      var visited = new Set();
      var queue = [];
      visited.add(node.id);
      var maxDistance = 0;
      queue.push({node, distance:0});
      while (queue.length > 0) {
        var {node, distance} = queue.shift();
        maxDistance = distance;

        for (var i = 0; i < this.graph.edges.length; i++) {
          var edge = this.graph.edges[i];
          if (edge.source.id == node.id && !visited.has(edge.target.id)) {
            visited.add(edge.target.id);
            queue.push({node: edge.target, distance: distance+1});
          }
          else if (edge.target.id == node.id && !visited.has(edge.source.id)) {
            visited.add(edge.source.id);
            queue.push({node: edge.source, distance: distance+1});
          }
        }
      }
      return maxDistance;

    }

    computeAverageNodeDegree() {
      var sum = 0;
      for (var key in this.graph.nodeDegrees) {
        sum += this.graph.nodeDegrees[key];
      }
      return sum/Object.entries(this.graph.nodeDegrees).length;
    }

    computeConnectedComponents() {
      function DFS(id, visited, edges) {
        visited[id] = true;
        for (var i = 0; i < edges.length; i++) {
          var connection = edges[i];
          
          if (connection["source"] == id) {
            
            if (visited[connection["target"]] == false) {
              DFS(connection["target"], visited, edges);
            }
          }
          
        }
  
      
  
      }

      var visited = {};

      for (var node in this.graph.nodes) {
        visited[this.graph.nodes[node].id] = false;
      }

      var count = 0;
      for (var node in this.graph.nodes) {
        if (visited[this.graph.nodes[node].id] == false) {
          DFS(this.graph.nodes[node].id, visited, this.graph.edges);
          
          count += 1;
        }

      }
      return count
    }

    computeGraphDensity() {
      var v = this.graph.nodes.length;
      var e = this.graph.edges.length;
      return (2*e)/(v*(v-1));
    }
    
    shortestPathLength(start, end) {
      var queue = [{node: start, distance: 0}];
      var visited = new Set();

      while (queue.length > 0) {
        var {node, distance} = queue.shift();
        if (node == end) {
          return distance;
        }

        if (!visited.has(node)) {
          visited.add(node);
          var neighbors = []
          for (var edge of this.graph.edges) {
            if (edge.target == node || edge.source == node) {
              neighbors.push(edge);
            }
          }
          for (var neighbor of neighbors) {
            var nextNode = neighbor.source === node ? neighbor.target : neighbor.source;
            queue.push({node: nextNode, distance: distance+1});
          }
        }
      }
      return -1;
    }

    computeAPL() {
      let totalShortestPathLength = 0;
      let numPairs = 0;

      var seen = new Set()
      this.graph.nodes.forEach(startNode => {
        seen.add(startNode);
          this.graph.nodes.forEach(endNode => {
              if (startNode !== endNode) {
                if (!seen.has(endNode)) {
                  if (this.shortestPathLength(startNode.id, endNode.id) != -1) {
                    totalShortestPathLength += this.shortestPathLength(startNode.id, endNode.id);
                    numPairs++;
                  }
                }
              }
          });
      });
      return totalShortestPathLength / numPairs;
      
    }

    computeMyAPL() {
      let totalShortestPathLength = 0;
      let numPairs = 0;

      var seen = new Set()
      this.graph.nodes.forEach(startNode => {
        seen.add(startNode);
          this.graph.nodes.forEach(endNode => {
              if (startNode !== endNode) {
                if (!seen.has(endNode)) {
                  if (this.myShortestPathLength(startNode.id, endNode.id) != -1) {
                    totalShortestPathLength += this.myShortestPathLength(startNode.id, endNode.id);
                    numPairs++;
                  }
                }
              }
          });
      });
      return totalShortestPathLength / numPairs;
      
    }

    myShortestPathLength(start, end) {
      var queue = [{node: start, distance: 0}];
      var visited = new Set();

      while (queue.length > 0) {
        var {node, distance} = queue.shift();
        if (node == end) {
          return distance;
        }

        if (!visited.has(node)) {
          visited.add(node);
          var neighbors = []
          for (var edge of this.graph.edges) {
            if (edge.target.id == node || edge.source.id == node) {
              neighbors.push(edge);
            }
          }
          
          for (var neighbor of neighbors) {
            var nextNode = neighbor.source.id === node ? neighbor.target.id : neighbor.source.id;
            queue.push({node: nextNode, distance: distance+1});
          }
        }
      }
      return -1;
    }

    


  }


