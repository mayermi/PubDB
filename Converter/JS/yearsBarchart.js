$(document).ready(function() {
  var start = new Date();
  var publicationsJSON = []
  authorsJSON = [];
  var author = "Florian Alt";
  
  // create a new pubDB json object
  var converter = new pubDB.json();
 
  // initialize -> get a jQuery object of html contents in callback function
  converter.init(function(dbObject) {
    // pass dbObject to buildJSON method -> get a json object back (<- created on client side)
    converter.buildPublicationJSON(dbObject, function(pubData) {
      publicationsJSON = pubData;
      //console.log(JSON.stringify(publicationsJSON));

      converter.buildAuthorJSON(pubData, function(authorData) {
        authorsJSON = authorData;

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

        console.log(publicationyears);
        yeardata = countyears(publicationyears);
        console.log(yeardata);



      //Width and height
      var w = 500;
      var h = 100;
      var barPadding = 1;
      
      //Create SVG element
      var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      svg.selectAll("rect")
         .data(yeardata)
         .enter()
         .append("rect")
         .attr("fill", "teal")
         .attr("x", function(d, i) {
            return i * (w / yeardata.length);
         })
         .attr("y", function(d) {
            return h - (d * 4);
         })
         .attr("width", w / yeardata.length - barPadding)
         .attr("height", function(d) {
            return d * 4;
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
          //return [a, b];
          return b;
        }

});