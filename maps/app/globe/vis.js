 var width = 600,
      height = 500,
      sens = 0.25,
      focused;

  var world;
     var cityPoints ;
    var enableRotation = true;
    var rotate = [.001, 0],
      velocity = [.018, 0],
      time = Date.now();
      var savedT;

    var centroid = d3.geo.path()
      .projection(function(d) {
        return d;
      })
      .centroid;

    //Setting projection

    var projection = d3.geo.orthographic()
      .scale(245)
      .rotate([0, 0])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    var path = d3.geo.path()
      .projection(projection)
        .pointRadius(6);

  var circle = d3.geo.circle()
      .origin([-30,40]);

    var graticule = d3.geo.graticule()
      .extent([
        [-180, -90],
        [180 - .1, 90 - .1]
      ]);


    //svg2 container

    var svg2 =  d3.select(worldmap)
      .attr("width", width)
      .attr("height", height);

      svg2.on("mousemove", function(d) {
             
          redraw();
            
        })

    

    var graticuleLine = svg2.append("path")
      .attr("class", "graticule")
      .attr("d", path);
    svg2.append("circle")
      .attr("class", "graticule-outline")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale())
      //Adding water

    svg2.append("path")
      .datum({
        type: "Sphere"
      })
      .attr("class", "water")
      .attr("d", path)
      .call(d3.behavior.drag()
        .origin(function() {
          var r = projection.rotate();
          return {
            x: r[0] / sens,
            y: -r[1] / sens
          };
        })
        .on("drag", function() {
          var rotate = projection.rotate();
          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svg2.selectAll("path.land").attr("d", path);
          svg2.selectAll(".focused").classed("focused", focused = false);
        }));


    var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");
      // countryList = d3.select("body").append("select").attr("name", "countries");


    d3.json("globe/world-110m.json",function(a,b,c){
      ready(a,b,c)
    });
    // queue()
    //   .defer(d3.json, "world-110m.json")
    //   // .defer(d3.tsv, "names.tsv")
    //   .await(ready);


    function createCities() {
      var cities = [{
        "type": "Feature",
        "properties": {
          "name": "Munich"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [11.581981, 48.135125]
        }
      }, {
        "type": "Feature",
        "properties": {
          "name": "San Antonio"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-98.5, 29.4167]
        }
      }, {
        "type": "Feature",
        "properties": {
          "name": "Melbourne"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [144.963056, -37.813611, ]
        }
      }];
      return cities;
    }


    //Main function

    function ready(error, worlds, countryData) {

      var countryById = {},
        countries = topojson.feature(worlds, worlds.objects.countries).features;
      d3.json("d3map/countries-top.json", function(error, countryData) {

          countryData.objects.countries.geometries.forEach(function(d) {
        countryById[d.id] = d.properties.name;
        // option = countryList.append("option");
        // option.text(d.properties.name);
        // option.property("value", d.id);
      });
      });

      //Adding countries to select

      // countryData.forEach(function(d) {
      //   countryById[d.id] = d.name;
      //   option = countryList.append("option");
      //   option.text(d.name);
      //   option.property("value", d.id);
      // });




      //Drawing countries on the globe

       world = svg2.selectAll("path.land")
        .data(countries)
        .enter().append("path")
        .attr("class", "land")
        .attr("d", path)

      //Drag event

      .call(d3.behavior.drag()
        .origin(function() {
          var r = projection.rotate();
          return {
            x: r[0] / sens,
            y: -r[1] / sens
          };
        })
        .on("drag", function() {
          var rotate = projection.rotate();
          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svg2.selectAll("path.land").attr("d", path);
          svg2.selectAll(".focused").classed("focused", focused = false);
          redraw();
        }))

      //Mouse events

      .on("mouseover", function(d) {
          countryTooltip.text(countryById[d.id])
            .style("left", (d3.event.pageX + 7) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("display", "block")
            .style("opacity", 1);
             
        })
        .on("mouseout", function(d) {
          countryTooltip.style("opacity", 0)
            .style("display", "none");
        })
        .on("mousemove", function(d) {
             
          countryTooltip.style("left", (d3.event.pageX + 7) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
            
        })
        .on("click", function(d) {
          enableRotation = !enableRotation;
        });
      var cities = createCities();
    
        
      cityPoints = svg2.append("g").attr("class", "points")
        .selectAll("path").data(cities)
        .enter().append("path")
        .attr("class", "cityPoint")
        .attr("d", path);

      

      svg2.append("g")
        .attr("class", "label_background")
        .selectAll("rect").data(cities)
        .enter().append("rect")
        .attr("class", "label")
        .attr({
          x: 0,
          y: -11,
          height: 12
        })
        
        .style("opacity", 0.5);

      svg2.append("g").attr("class", "labels")
        .selectAll("text").data(cities)
        .enter().append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .text(function(d) {
          return d.properties.name
        })

      position_labels();
      rotateGlobe();

      //Country focus on option select

     d3.select("select").on("change", function() {
      var rotate = projection.rotate(),
      focusedCountry = country(countries, this),
      p = d3.geo.centroid(focusedCountry);

      svg2.selectAll(".focused").classed("focused", focused = false);

    //Globe rotating
console.log(p)
    (function transition() {
      d3.transition()
      .duration(2500)
      .tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svg2.selectAll("path").attr("d", path)
          .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
        };
      })
      })();
    });

      function country(cnt, sel) {
        for (var i = 0, l = cnt.length; i < l; i++) {
          if (cnt[i].id == sel.value) {
            return cnt[i];
          }
        }
      };


   

      function rotateGlobe() {

        d3.timer(function() {
          var dt = Date.now() - time; ;
          if (!enableRotation) {          
            savedT = Date.now() - time;
            return;
          }
          dt=savedT?savedT:dt;
          savedT=null;
          projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
          redraw();
        });
      }

      

    };
       function position_labels() {
        var centerPos = projection.invert([width / 2, height / 2]);
        var arc = d3.geo.greatArc();
        svg2.selectAll(".label")
          .attr("transform", function(d) {
            var loc = projection(d.geometry.coordinates),
              x = loc[0],
              y = loc[1];
            var offset = 5;
            return "translate(" + (x + offset) + "," + (y - 2) + ")"
          })
          .style("display", function(d) {
            var d = arc.distance({
              source: d.geometry.coordinates,
              target: centerPos
            });
            return (d > 1.57) ? 'none' : 'inline';
          });
      }
    function redraw() {
      if(world){
        world.attr("d", path);
        graticuleLine.attr("d", path);
        cityPoints.attr("d", path);        
        position_labels();
      }
      }