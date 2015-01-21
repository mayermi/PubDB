$(document).ready(function() {
  var start = new Date();
  var publicationsJSON = []
  authorsJSON = [];
  
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

        var years = [];
        var yeardata = [];
        var publicationyears = [];

        $('img').hide();
        $('span').text(new Date() - start + "ms");

        $('h2').show();
        $('#publications').val(JSON.stringify(publicationsJSON, null, 2)).show();
        $('#authors').val(JSON.stringify(authorsJSON, null, 2)).show();

        for (var i = 0, l = authorsJSON.length; i < l; i += 1) {
          if(authorsJSON[i].name === author){
            var publications = authorsJSON[i].publications; // Array with all publications
            for (var j = 0, m = publications.length; j < m; j += 1) {
              for (var k = 0, n = publicationsJSON.length; k < n; k += 1) {
                if(publicationsJSON[k].id === publications[j]) {
                  publicationyears.push(publicationsJSON[k].year);
                }
              }
            }
          }
        }

        years = countyears(publicationyears)[0];
        yeardata = countyears(publicationyears)[1];

        $("#publicationyears").text(years[0] + " - " + years[years.length-1]);

        //Width and height
        var w = 500;
        var h = 150;
        var barPadding = 1;

        //Create SVG element
        var svg = d3.select("#barchart")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

        svg.selectAll("rect")
          .data(yeardata)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {
              return i * (w / yeardata.length);
          })
          .attr("y", function(d) {
              return h - (d * 4) - 24;
          })
          .attr("width", w / yeardata.length - barPadding)
          .attr("height", function(d) {
              return d * 4;
          })
          .attr("fill", function(d) {
            return "rgb(0, " + (d * 10) + ", " + (d * 10) + ")";
          });

        svg.selectAll("text")
          .data(yeardata)
          .enter()
          .append("text")
          .text(function(d) {
            return d;
          })
          .attr("text-anchor", "middle")
          .attr("x", function(d, i) {
              return i * (w / yeardata.length) + (w / yeardata.length - barPadding) / 2;
          })
          .attr("y", function(d) {
              return h - (d * 4) - 28;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "black");

          
      //Create scale functions
      var xScale = d3.scale.linear()
                 .domain([d3.min(years, function(d) { return d; }), d3.max(years, function(d) { return d; })])
                 .range([(w / yeardata.length - barPadding)/2, w - (w / yeardata.length - barPadding)/2]);

      
      //Define X axis
      var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(years.length <= 10 ? years.length: 10)
                .tickFormat(function(d) {
                  return d;
                });;
      
      
      //Create X axis
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - 18) +  ")")
        .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .call(xAxis);
     
      });
    });
  });

  
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

});