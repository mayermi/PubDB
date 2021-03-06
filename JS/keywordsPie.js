(function() {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
	var correctAuthor;

    // get url info
    var query = window.location.search.substring(1);
    //var authorname = query.split("=")[1];
	var serachString = query.split("=")[1];
	var name1 = serachString.split("+")[0];
	var name2 = serachString.split("+")[1];
	
	if (name2 !== undefined) {
	authorname = name1 + " " + name2;
	}else{
		authorname = name1;
	}
    var author = authorname.replace(/%20/g, ' ');
	
  
    // create a new pubDB json object
    var converter = new pubDB.json();
 
    // initialize -> get a jQuery object of html contents in callback function
    converter.init(function(dbObject) {
      // pass dbObject to buildJSON method -> get a json object back (<- created on client side)
      converter.buildPublicationJSON(dbObject, function(pubData) {
        publicationsJSON = pubData;

        converter.buildAuthorJSON(pubData, function(authorData) {
          authorsJSON = authorData;
	

			  for (var p = 0, q = authorsJSON.length; p < q; p += 1) {
				if(authorsJSON[p].name === author) {
				  correctAuthor = true;
				}
			  }

			  if (correctAuthor) {
				$('#authortitle').text(author);
			  } else {
				$('#authortitle').text('No author with this name is in our dataset. Please try again.');
			  }

			  var countAward = 0;
			  var countNoAward = 0;
			  var w = 150;
			  var h = 150;
			  var r = h/2;
			  var color = ['rgb(0,170,170)', 'rgb(0,120,120)'];
			  
			  $('img').hide();

			  for (var i = 0, l = publicationsJSON.length; i < l; i += 1) {
				for (var j = 0, m = publicationsJSON[i].authors.length; j < m; j += 1) {
				  if(publicationsJSON[i].authors[j].name === author) {
					if(publicationsJSON[i].award){
					  countAward++;
					} else {
					  countNoAward++;
					}
				  }
				}
			  }

			  var awardData = [{"label":"yes", "value":countAward},
							   {"label":"no", "value":countNoAward}];

			  var vis = d3.select('#chart').append("svg:svg").data([awardData]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
			  var pie = d3.layout.pie().value(function(d){return d.value;});

			  // declare an arc generator function
			  var arc = d3.svg.arc().outerRadius(r);

			  // select paths, use arc generator to draw
			  var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
			  arcs.append("svg:path")
				  .attr("fill", function(d, i){
					return color[i];
				  })
				  .attr("d", function (d) {
					return arc(d);
				  });

			  // add the text
			  arcs.append("svg:text")
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")
				.attr("fill", "white")
				.attr("transform", function(d){
				  d.innerRadius = 0;
				  d.outerRadius = r;
				  return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
				  return awardData[i].label;}
				);

        });
      });
    });
  });
})();