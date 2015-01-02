(function() {
  function test(){
  //console.log("testAnfang");
  
  d3.select("body").selectAll("p")
    .data([4, 8, 15, 16, 23, 42])
    .enter().append("p")
    .text(function(d) {return "I'm number " + d + "!";});
    d3.select("body").transition()
    .style("background-color", "green");
  }
  //barchart
  
  var w = 500; //widht
  var h = 100; //height
  var barPadding = 1; //distance between rects
  
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
    
  var dataset = [25, 7, 26, 11, 5, 25, 14, 31, 19, 2, 12, 12, 34, 56, 23, 12, 4, 9, 17]
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function(d) { //y = position on the y-axis
      return h - (d*2); //h (height), d (dataset) -> positioning all rects on the same height
      })
    .attr("width", w/dataset.length - barPadding) //compute width dynamically
    .attr("height", function(d) {
      return d * 4  //data * 4 -> to distinguish the data better
      })
    .attr("x", function (d, i) {
      return i * (w/dataset.length); //i = index, count i + 1 at each data
      })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + (d * 10) + ")"; //color of the rects, the higher the value, the intensive the color
      });
      
  //generate legend
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d){
      return d;
      })
    .attr("x", function(d, i) {
      return i * (w/dataset.length) + (w / dataset.length - barPadding) / 2; //compute the exact position to show the value on the right position
      })
    .attr("y", function (d) {
      return h - (d * 2) + 14; //text will be a little bit under the rect
      })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");
})();