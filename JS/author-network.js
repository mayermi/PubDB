(function() {
  var w = 960;    //width
  var h = 500     //height
  
  var color = d3.scale.category20();    //different colours
  
  var force = d3.layout.force()     //force-directed layout
    .charge(-120)           //charge-strength
    .linkDistance(30)         //target distance between linked nodes
    .size([w, h]);            //layout size
    
  var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);
    
  d3.json("./DATA/authorsTest.json", function (error, graph) { //get data from "authorsTest.json"
    force                       //callback?
      .nodes(graph.nodes)
      .links(graph.links)
      .start();           //start or restart the simulation when the nodes change
      
    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "classLink")
      .style("stroke-width", 2);
        
    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "nodes")
      .attr("r", 5)
      .style("fill", function(d) {
        return color(d.group);
        })
      .call(force.drag);
      
    node.append("title")
      .text(function (d) {
        return d.name;
        });
        
    force.on("tick", function() {   //listen to updates in the computed layout positions
      link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.source.x; })
      .attr("y2", function (d) {return d.source.y });
      
    node.attr("cx", function (d) {return d.x;})
      .attr("cy", function (d) {return d.y});
      });
  });
})();