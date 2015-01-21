(function(location) {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
    //var author = "Heinrich Hussmann";
    // get url info
    var query = window.location.search.substring(1);
    var authorname = query.split("=")[1];
	
	if (authorname !== undefined){
    var author = authorname.replace(/\+/g, ' ');
	}else{
		var author = "Heinrich Hussmann"
	}

    $('#please').hide();
  
    // create a new pubDB json object
    var converter = new pubDB.json();
 
    // initialize -> get a jQuery object of html contents in callback function
    converter.init(function(dbObject) {
      // pass dbObject to buildJSON method -> get a json object back (<- created on client side)
      converter.buildPublicationJSON(dbObject, function(pubData) {
        publicationsJSON = pubData;

        converter.buildAuthorJSON(pubData, function(authorData) {
          authorsJSON = authorData;

          var years = [];
          var dataset = [];
          var coauthors = [];
          var correctAuthor = false;
		  var names = [];

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

          for (var i = 0, l = publicationsJSON.length; i < l; i += 1) {
            for (var j = 0, k = publicationsJSON[i].authors.length; j < k; j += 1) {
			
				names.push(publicationsJSON[i].authors[j].name);

				if(publicationsJSON[i].authors[j].name === author){
					var year = Number(publicationsJSON[i].year);
					years.push(year);
					coauthors.push([year, publicationsJSON[i].authors, publicationsJSON[i].award]);
				}
            }
          }
		  
			//autocomplete-function
			doAutocomplete(names);

          // get info for circle x and y
          var data = addupyears(coauthors);
          newdata = allauthorslisted(data);

          years = countyears(years)[0];

          //Set placeholders yearfilters
          $('#begininyear').attr('placeholder',years[0]);
          $('#endinyear').attr('placeholder',years[years.length-1]);

          //Width and height
          var w = years.length * 100 + 100;
          var h = getheight(data) * 26;

          //Create SVG element
          var svg = d3.select("#timeline")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
          buildSVG(svg, w, h, years, newdata, author);

          $('#wonaward').click(function(){
            if($('#wonaward').is(':checked')) {
              var a = [];

              for (var i = 0, l = coauthors.length; i < l; i += 1) {
                if(coauthors[i][2]) {
                  a.push(coauthors[i]);
                }
              }
              var filtereddata = addupyears(a);
              newfiltereddata = allauthorslisted(filtereddata);
              svg.selectAll("*").remove();
              buildSVG(svg, w, h, years, newfiltereddata, author);

            } else {
              svg.selectAll("*").remove();
              buildSVG(svg, w, h, years, newdata, author);
            }
          });

          $('#beginyearbutton').click(function(){
              var newyears = [], newfiltereddata = [];
              var input = $('#begininyear').val();
              console.log(input);
              for (var i = 0, l = years.length; i < l; i += 1) {
                if(years[i] >= input) {
                  newyears.push(years[i]);
                }
              }
              for (var i = 0, l = newdata.length; i < l; i += 1) {
                if(newdata[i][0] >= input) {
                  newfiltereddata.push(newdata[i]);
                }
              }
              svg.selectAll("*").remove();
              var w = newyears.length * 100 + 100;
              var h = getheight(newfiltereddata) * 26;
              buildSVG(svg, w, h, newyears, newfiltereddata, author);
          });

          $('#endyearbutton').click(function(){
              var newyears = [], newfiltereddata = [];
              var input = $('#endinyear').val();
              console.log(input);
              for (var i = 0, l = years.length; i < l; i += 1) {
                if(years[i] <= input) {
                  newyears.push(years[i]);
                }
              }
              for (var i = 0, l = newdata.length; i < l; i += 1) {
                if(newdata[i][0] <= input) {
                  newfiltereddata.push(newdata[i]);
                }
              }
              svg.selectAll("*").remove();
              var w = newyears.length * 100 + 100;
              var h = getheight(newfiltereddata) * 26;
              svg.attr('width', w);
              svg.attr('height', h)
              buildSVG(svg, w, h, newyears, newfiltereddata, author);
          });
        });
      });
    });
  });

  function addupyears(arr) {
    var a = [], b = [], c = 0, prev;


    for(var i = 0; i < arr.length; i++) {
      if(arr[i][0] !== prev ) {
        c = 1;
        a.push([parseInt(arr[i][0]), c, arr[i][1]]);
      } else {
        c++;
        a.push([parseInt(arr[i][0]), c, arr[i][1]]);
      }
      prev = arr[i][0];
    }

    return a;
  }

  function allauthorslisted(arr) {     
    var a = [];

    for(var i = 0; i < arr.length; i++) {
      for(var j = 0; j < arr[i][2].length; j++) {
        a.push([arr[i][0], arr[i][1], arr[i][2][j].name, arr[i][2].length, j]);
      }
    }

    return a;
  }

  function buildSVG(svg, w, h, years, data, author) {
          var barPadding = 20;
    
          // create relative scale
          var yearsdiff = years[years.length-1] - years[0];
          var yearsscale = ((w-100)-2*barPadding)/yearsdiff;

          data.forEach(function(entry){
            svg.append("line")
              .attr("x1", (entry[0] - years[0]) * yearsscale + barPadding)
              .attr("y1", 0 + 10)
              .attr("x2", (entry[0] - years[0]) * yearsscale + barPadding)
              .attr("y2", h - 18)
              .style("stroke-width", 2)
              .style("stroke", "rgb(0,120,120)")
              .style("fill", "none");
          });

          svg.selectAll("circle")
            .data(data)
            .enter()
            .append("a")
            .attr("xlink:href", function(d) {
              if(d[3] > 5 && d[4] > 5) {
                return "timeline.html";
              } else {
                return "author.html?name=" + d[2];
              }
              })
            .append("circle")
            .attr("cx", function(d) {
              if(d[3] > 5 && d[4] > 5) {
                return (d[0] - years[0]) * yearsscale + barPadding + 10*6.5 ;
              } else {
                return (d[0] - years[0]) * yearsscale + barPadding + 10*d[4] ;
              }
            })
            .attr("cy", function(d) {
              return d[1] * 14;
            })
            .attr("r", function(d) {
              if(d[3] > 5 && d[4] > 5) {
                return 7;
              } else {
                return 5;
              }
            })
            .attr("fill", function(d, i){
              if(d[3] > 5 && d[4] > 5) {
                return "rgb(0,170,170)";
              } else if(d[2] === author) {
                return "rgb(170,0,170)";
              }
               else {
                return "rgb(0,0,0)";
              }
            });

          //Create scale functions
          var xScale = d3.scale.linear()
            .domain([d3.min(years, function(d) { return d; }), d3.max(years, function(d) { return d; })])
            .range([barPadding, (w-100) - barPadding]);

          //Define X axis
          var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(years.length <= 10 ? years.length: 10)
            .tickFormat(function(d) {
              return d;
            });
      
          //Create X axis
          svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - 18) +  ")")
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .call(xAxis);
  }

  function countyears(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] !== prev ) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length-1]++;
      }
      prev = arr[i];
    }
    var c = a.map(Number);

    var array = [a, b];
    return array;
  }

  function getheight(arr) {
    var a = [];
    for(var i = 0; i < arr.length; i++) {
      a.push(arr[i][1]);
    }
    return Math.max.apply(null, a);
  }
})(window.location);