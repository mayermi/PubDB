(function(location) {
  $(document).ready(function() {
    var start = new Date();
    var publicationsJSON = []
    authorsJSON = [];
    var author = "Heinrich Hussmann";
  
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
          var authorgroups = [];
          var authororder = [];
          var dataset = [];
          var data = [];
          var publicationauthors = [];

          for (var i = 0, l = publicationsJSON.length; i < l; i += 1) {
            publicationauthors.push([publicationsJSON.id, publicationsJSON.authors]);
          };



          for (var i = 0, l = authorsJSON.length; i < l; i += 1) {
            //if(authorsJSON[i].name === author){
              var publications = authorsJSON[i].publications; // Array with all publications
              for (var j = 0, m = publications.length; j < m; j += 1) {
                for (var k = 0, n = publicationsJSON.length; k < n; k += 1) {
                  if(publicationsJSON[k].id === publications[j]) {
                    var year = Number(publicationsJSON[k].year);
                    years.push(year);
                    dataset.push([year, publicationsJSON[k].authors.length, authorsJSON[i].name]);
                  }
                }
              }
            //}
          }

          //Width and height
          var w = 500;
          var h = 200;
          var barPadding = 20;

          years = countyears(years)[0];
            var yearsdiff = years[years.length-1] - years[0];
            var yearsscale = (w-2*barPadding)/yearsdiff;

          //Create SVG element
          var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

          svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("a")
            // !!!!! nächste 2 Zeilen für Link!!!!!
            .attr("xlink:href", function(d) {return "author.html?name=" + d[2]})
            .append("circle")
            .attr("cx", function(d) {
              return (d[0] - years[0]) * yearsscale + barPadding ;
            })
            .attr("cy", function(d) {
              return d[1]* 12;
            })
            .attr("r", 5);

          // svg.selectAll("circle")
          //   .data(years)
          //   .enter()
          //   .append("circle")
          //   .attr("cx", function(d) {
          //     return (d - years[0]) * yearsscale + barPadding ;
          //   })
          //   .attr("cy", function(d) {
          //     return 15;
          //   })
          //   .attr("r", 2);

          //Create scale functions
          var xScale = d3.scale.linear()
            .domain([d3.min(years, function(d) { return d; }), d3.max(years, function(d) { return d; })])
            .range([barPadding, w - barPadding]);

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
        });
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
})(window.location);