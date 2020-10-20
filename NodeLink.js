// dimensions
var width = 1000;
var height = 1000;

var margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
}

// create an svg to draw in
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .attr('transform', 'translate(' + margin.top + ',' + margin.left + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.name;
    })
        .strength(0.025))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("collide", d3.forceCollide().radius(12))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("soc.json", function(error, graph) {
    var nodes = graph.nodes;
    var links = graph.links;

    console.log("Nodes : ",nodes);
    console.log("Links : ",links);
    var edge = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr('stroke', function(d){
            return "#ddd";
        });

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")

    node.append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .attr("fill", function(d) {
            return d.colour;
        })
        .on("mouseover", mouseOver(.2))
        .on("mouseout", mouseOut);

    node.append("title")
        .text(function(d) {
            return d.twitter;
        });

    // labeling
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name;
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("fill", function(d) {
            return d.colour;
        });

    // Heading
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Force directed layout Node Link diagram");

    //Total number of nodes in the graph
    var totalNodes = nodes.length;

    svg.append("text")
        .attr("x", width-40)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Total nodes : "+totalNodes);

    //Total number of edges in the graph
    var totalEdges = links.length;

    svg.append("text")
        .attr("x", width-35)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Total edges : "+totalEdges);

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(links);

    function ticked() {
        edge.attr("d", positionLink);
        node.attr("transform", positionNode);
    }

    function positionLink(d) {
        var offset = 30;

        var midpoint_x = (d.source.x + d.target.x) / 2;
        var midpoint_y = (d.source.y + d.target.y) / 2;

        var dx = (d.target.x - d.source.x);
        var dy = (d.target.y - d.source.y);

        var normalise = Math.sqrt((dx * dx) + (dy * dy));

        var offSetX = midpoint_x + offset*(dy/normalise);
        var offSetY = midpoint_y - offset*(dx/normalise);

        return "M" + d.source.x + "," + d.source.y +
            "S" + offSetX + "," + offSetY +
            " " + d.target.x + "," + d.target.y;
    }

    function positionNode(d) {
        if (d.x < 0) {
            d.x = 0
        };
        if (d.y < 0) {
            d.y = 0
        };
        if (d.x > width) {
            d.x = width
        };
        if (d.y > height) {
            d.y = height
        };
        return "translate(" + d.x + "," + d.y + ")";
    }

    var linkedByIndex = {};
    links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function mouseOver(opacity) {
        return function(d) {
            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            node.style("fill-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            // also style link accordingly
            edge.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            edge.style("stroke", function(o){
                return o.source === d || o.target === d ? o.source.colour : "#ddd";
            });
        };
    }

    function mouseOut() {
        node.style("stroke-opacity", 1);
        node.style("fill-opacity", 1);
        edge.style("stroke-opacity", 1);
        edge.style("stroke", "#ddd");
    }

});