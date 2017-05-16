// Map configuration
var width  = 820;
var height = 620;
var rScale = d3.scale.sqrt();
var peoplePerPixel = 50000;
var max_population = [];
// Configuration for the spinning effect
var time = Date.now();
var rotate = [0, 0];
var velocity = [.015, -0];
// set projection type and paremetes
var projection = d3.geo.orthographic()
   .scale(300)
   .translate([(width / 2) + 100, height / 2])
   .clipAngle(90)
   .precision(0.3);
// create path variable, empty svg element and group container
var path = d3.geo.path()
   .projection(projection);
var svg = d3.select("svg");
var g = svg.append("g");
// drawing dark grey spehere as landmass
g.append("path")
   .datum({type: "Sphere"})
   .attr("class", "sphere")
   .attr("d", path)
   .attr("fill", "#0D0D0D");
// loading city locations from geoJSON
// d3.json("globe/world-110m.json", function(error, data) {
//          // Handle errors getting and parsing the data
//          if (error) { return error; }
//          // setting the circle size (not radius!) according to the number of inhabitants per city
//          population_array = [];
//          for (i = 0; i < data.features.length; i++) {
//             population_array.push(data.features[i].properties.population);
//          }
//          max_population = population_array.sort(d3.descending)[0]
//          var rMin = 0;
//          var rMax = Math.sqrt(max_population / (peoplePerPixel * Math.PI));
//          rScale.domain([0, max_population]);
//          rScale.range([rMin, rMax]);
//          path.pointRadius(function(d) {
//             return d.properties ? rScale(d.properties.population) : 1;
//          });
//          // Drawing transparent circle markers for cities
//          g.selectAll("path.cities").data(data.features)
//             .enter().append("path")
//             .attr("class", "cities")
//             .attr("d", path)
//             .attr("fill", "#ffba00")
//             .attr("fill-opacity", 0.3);
//          // start spinning!
//          spinning_globe();
// });
function spinning_globe(){
   d3.timer(function() {
      // get current time
      var dt = Date.now() - time;
      // get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
      // update cities position = redraw
      svg.selectAll("path.cities").attr("d", path);
   });
}
// Events for sliders and button
document.getElementById("rotation").addEventListener("change", function() {
   var new_speed = this.value;
   velocity[0] = new_speed
});
document.getElementById("glow").addEventListener("change", function() {
   var new_glow = this.value;
   g.selectAll("path.cities")
   .attr("fill-opacity", new_glow);
});
document.getElementById("marker_size").addEventListener("change", function() {
   var new_marker_size = 1 / this.value ;
   peoplePerPixel = new_marker_size * 100000;
   var rMin = 0;
   var rMax = Math.sqrt(max_population / (peoplePerPixel * Math.PI));
   rScale.range([rMin, rMax]);
});
document.getElementById("color").addEventListener("change", function() {
   var new_color = this.value;
   g.selectAll("path.cities")
   .attr("fill", new_color);
});
// hackish approach to get bl.ocks.org to display individual height
d3.select(self.frameElement).style("height", height + "px");
