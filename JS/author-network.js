(function() {
	$(document).ready(function() {

		 var color = d3.scale.category20();    //different colours
		 var publicationsJSON = []
			authorsJSON = [];
		var nodes = [];
		var authorDouble = false;

		function myGraph(el){
	
			//Add an remove elements on the graph object
			this.addNode = function(id) {
				nodes.push({"id":id})
				update();
			}
			
			this.removeNode = function(id) {
				var i = 0;
				var n = findNode(id);
				while (i < links.length) {
					if((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
					else i++;
				}
				var idex = findNodeIndex(id);
				if(index !== undefined) {
						nodes.splice(index, 1);
						update();
				}
			}
			
			this.addLink = function (sourceId, targetId, group) {
				var sourceNode = findNode(sourceId);
				var targetNode = findNode(targetId);
				
				if ((sourceNode !== undefined) && (targetNode !== undefined)) {
					links.push({"source": sourceNode, "target": targetNode, "group": group});
					update();
				}
			}
			
			var findNode = function(id) {
				for (var i=0; i < nodes.length; i++) {
					if (nodes[i].id === id)
						return nodes[i]
				};
			}
			
			//set up the D3 visualisation in the specified element
			var w = $(el).innerWidth(),
				h = $(el).innerHeight();
				
				
			var vis = this.vis = d3.select(el).append("svg:svg")
				.attr("width", w)
				.attr("height", h);

				
			var force = d3.layout.force()
				.gravity(.05)
				.distance(100)
				.charge(-100)
				.size([w, h]);
				
			var nodes = force.nodes()
				links = force.links();
				
			var update = function () {

				var link = vis.selectAll("line.link")
					.data(links, function(d) {return d.source.id + "-" + d.target.id;})
					.style("fill", function(d) {
						return color(d.group);
					});
					
				link.enter().insert("line")
					.attr("class", "link");
					
					
				link.exit().remove();
			
			var node = vis.selectAll("g.node")
				.data(nodes, function(d) {return d.id;})
				.on("mouseup", function(d) {return authorClicked(d.id);});
				
			var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				.call(force.drag)
				.append("a")
            	.attr("xlink:href", function(d) {return "author.html?name=" + d.id});
				
				
			nodeEnter.append("circle")
				.attr("class", "circle")
				.attr("r", 5)
				.attr("x", "-8px")
				.attr("y", "-8px")
				.attr("width", "16px")
				.attr("height", "16px")
				.style("fill", "black");
				
			nodeEnter.append("text")
				.attr("class", "nodetext")
				.attr("dx", 12)
				.attr("dy", ".35em")
				.text(function(d) {return d.id});
			
			node.exit().remove();
			
			force.on("tick", function() {
			
				link.attr("x1", function(d) {return d.source.x;})
					.attr("y1", function(d) {return d.source.y;})
					.attr("x2", function(d) {return d.target.x;})
					.attr("y2", function(d) {return d.target.y;});
					
				node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});
			
				});
			
			//Restart the force layout.
			force.start();
			
			}
		
		//Make it all go
		update();
		}
		
		function authorClicked (id) {
				// FEHLT: Übertragung welcher Autor geladen wird! -> Id wird übergeben!
				location.replace("../HTML/author.html");
		};
	
		graph = new myGraph("#graph");
		
		// create a new pubDB json object
		var converter = new pubDB.json();

		// initialize -> get a jQuery object of html contents in callback function
		converter.init(function(dbObject) {
			// pass dbObject to buildJSON method -> get a json object back (<- created on client side)
			converter.buildPublicationJSON(dbObject, function(pubData) {
				publicationsJSON = pubData;

				converter.buildAuthorJSON(pubData, function(authorData) {
					authorsJSON = authorData;

		  
					for (var i = 0, l = publicationsJSON.length; i < l; i += 1) {
						for (var j = 0, m = publicationsJSON[i].authors.length; j < m; j += 1) {
							
							//add Nodes
							node = publicationsJSON[i].authors[j].name;

								for(var k=0; k<=nodes.length; k++) {
									if(node == nodes[i]) {					
									authorDouble = true;
									}
								}
								
								if (authorDouble !== true) {

									nodes.push(node);
									graph.addNode(node);
									authorDouble = false;
								}
								
								//add links
								if (j == 0) {
									var link1 = node;
								} else {	
									var link2 = node;
									graph.addLink(link1, link2, i);
								} 
						}			  
					}
					doAutocomplete(nodes);
				});
			});
		 });	

	});
})();