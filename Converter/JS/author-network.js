(function() {
	$(document).ready(function() {
	
		var publicationsJSON = []
		authorsJSON = [];
	
		// create a new pubDB json object
		var converter = new pubDB.json();
 
		// initialize -> get a jQuery object of html contents in callback function
		converter.init(function(dbObject) {
		// pass dbObject to buildJSON method -> get a json object back (<- created on client side)
			converter.buildPublicationJSON(dbObject, function(pubData) {
			publicationsJSON = pubData;

			converter.buildAuthorJSON(pubData, function(authorData) {
			authorsJSON = authorData;
	
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
			  .attr("class", "link")
			  .style("stroke-width", function (d){return Math.sqrt(d.value); });
				
			var node = svg.selectAll(".node")
			  .data(graph.nodes)
			  .enter().append("circle")
			  .attr("class", "nodes")
			  .attr("r", 5)
			  .on("mouseup", authorClicked)
			  .style("fill", function(d) {
				return color(d.group);
				})
			  .call(force.drag);
			  
			node.append("title")
			  .text(function (d) {return d.name;});
				
				
			force.on("tick", function() {   //listen to updates in the computed layout positions
			  link.attr("x1", function (d) { return d.source.x; })
			  .attr("y1", function (d) { return d.source.y; })
			  .attr("x2", function (d) { return d.target.x; })
			  .attr("y2", function (d) {return d.target.y });
			  
			node.attr("cx", function (d) {return d.x;})
			  .attr("cy", function (d) {return d.y});
			  });
			  
			  
			 //fisheye
		  
			var fisheye = d3.fisheye.circular()
			  .radius(120)
			  .distortion(2);
			  
			svg.on("mousemove", function(){
				fisheye.focus(d3.mouse(this));
				
				node.each(function(d) { d.fisheye = fisheye(d); })
				.attr("cx", function(d) { return d.fisheye.x; })
				.attr("cy", function(d) { return d.fisheye.y; })
				.attr("r", function(d) { return d.fisheye.z * 4.5; });

				link.attr("x1", function(d) { return d.source.fisheye.x; })
				.attr("y1", function(d) { return d.source.fisheye.y; })
				.attr("x2", function(d) { return d.target.fisheye.x; })
				.attr("y2", function(d) { return d.target.fisheye.y; });
			});
			  
			  
		  });
		  
		  function authorClicked () {
				// FEHLT: Übertragung welcher Autor geladen wird!
				location.replace("HTML/author.html");
			  };
		  
	        });
      });
    });
	});
})();