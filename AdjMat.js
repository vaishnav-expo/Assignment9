function adjacency() {

    var svg = d3.select("svg"),
        margin = {top: 100, right: 80, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;
    d3.json("soc.json", function(error, graph) {

        var nodes = graph.nodes;
        var links = graph.links;
        createAdjacencyMatrix(nodes, links);

        function createAdjacencyMatrix(nodes,edges) {
            var edgeHash = {};
            for (x in edges) {
                var id = edges[x].source + "-" + edges[x].target;
                edgeHash[id] = edges[x];
            }
            matrix = [];
            //create all possible edges
            for (a in nodes) {
                for (b in nodes) {
                    var grid = {id: nodes[a].name + "-" + nodes[b].name, x: b, y: a, weight: 0};
                    if (edgeHash[grid.id]) {
                        grid.weight = edgeHash[grid.id].weight;
                    }
                    matrix.push(grid);
                }
            }
            console.log("Edges : ",edges)
            console.log("Edges : ",edgeHash)
            console.log("Matrix : ",matrix)

            // Heading
            svg.append("text")
                .attr("x", width/2)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Adjacency Matrix representation");

            //Total number of nodes in the graph
            var totalNodes = nodes.length;

            svg.append("text")
                .attr("x", width-20)
                .attr("y", 55)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Total nodes : "+totalNodes);

            //Total number of edges in the graph
            var totalEdges = links.length;

            svg.append("text")
                .attr("x", width-15)
                .attr("y", 80)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Total edges : "+totalEdges);

            d3.select("svg")
                .append("g")
                .attr("transform", "translate(50,50)")
                .attr("id", "adjacencyG")
                .selectAll("rect")
                .data(matrix)
                .enter()
                .append("rect")
                .attr("width", 25)
                .attr("height", 25)
                .attr("x", function (d) {return d.x * 25})
                .attr("y", function (d) {return d.y * 25})
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", "red")
                .style("fill-opacity", function (d) {return d.weight * .2})
                .on("mouseover", gridOver)

            var scaleSize = nodes.length * 25;
            var yScale = d3.scaleBand()
                .domain(nodes.map(function (el) {
                    return el.name
                }))
                .rangeRound([0,scaleSize],1);

            var xScale = d3.scaleBand()
                .domain(nodes.map(function (el) {
                    return el.name
                }))
                .rangeRound([0,scaleSize],1);

            var xAxis = d3.axisTop()
                .scale(xScale);

            var yAxis = d3.axisLeft()
                .scale(yScale);

            d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
            d3.select("#adjacencyG").append("g").call(yAxis);

            function gridOver(d,i) {
                d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
            }

        }

    });
}
adjacency();