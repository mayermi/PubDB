
(function() {
	
	//piehart	
		
	var w = 960;	//width
	var h = 500;	//height
	radius = Math.min(w, h) / 2; 
	
	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		
	var arc = d3.svg.arc()		//arc = Kreisbogen
		.outerRadius (radius - 10)
		.innerRadius(0);
		
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.population;		//d from svg file
			});
			
	var svg = d3.select("body").append("svg")
		.attr("width", w)
		.attr("height", h)
		.append("g")
		.attr("transform", "translate(" + w/2 + "," + h/2  + ")");
		
	d3.csv("../DATA/data.csv", function(error, data) {
	
		data.forEach(function(d) {
			d.population = +d.population;
		});
		
		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");
			
		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) {
				return color(d.data.age);
				});
				
		g.append("text")
			.attr("transform", function(d) {
				return "translate (" + arc.centroid(d) + ")"; 
				})
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.data.age;
				});
	});
	})();	