    
    var map = new Datamap({
        element: document.getElementById('container'),
         scope: 'world',
        //    height: 500,
           projection: 'mercator', //equirectangular',
          geographyConfig: {
                highlightOnHover: true,
                borderWidth: .5,
                borderColor: '#696969',
                borderOpacity: 3,
                highlightBorderWidth: 0.7,
                highlightBorderOpacity: 1,
                highlightBorderColor: '#6F6F6F',
                highlightFillColor: '#F1EBD1',
                popupOnHover: true
        },
        responsive: true,
    //    fills: {'pnt': 'orange','pnt2': 'black','pnt3': 'blue', defaultFill: '#E4ECCF'},
        fills: {'pnt': 'orange','pnt2': 'green','pnt3': 'blue', defaultFill: '#F3F1ED'},
         
  done: function(datamap) {
           datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
           

           function redraw() {
               datamap.svg.select('g')
        .selectAll('path')
        .style('vector-effect', 'non-scaling-stroke');

               datamap.svg.selectAll("g:not(.pins)").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
               datamap.svg.selectAll("g.pins").attr("transform", "translate(" + d3.event.translate + ")");
             
      rescaleBubbles(datamap);
           }

           

            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                
                console.log(geography);
            });
        }

    });



function rescaleBubbles(datamap) {
  var bubbleRadius = 6;

  datamap.svg
    .selectAll('.cityPoint')
    .attr('r', bubbleRadius / d3.event.scale)
  
}


    var points=[
            {name: 'PUNE',"radius": 6, "fillKey": "pnt", "latitude": 18.5204, "longitude": 73.8567,country: 'IND',},
            {name: 'USA',"radius": 6, "fillKey": "pnt2", "latitude": 40.113, "longitude": -88.261},
            {name: 'USA',"radius": 6, "fillKey": "pnt3", "latitude": 25.7877, "longitude": -80.2241}
    ]

    
      map.bubbles(points, {
            borderWidth: 1,
            class:"cityPoint",
            popupOnHover: true,
            highlightOnHover: false,
            popupTemplate: function(geo, data) {
         return "<div class='hoverinfo'>It is " + data.name + "</div>";
       }
        })
// var colors = d3.scale.category10();
//          map.updateChoropleth({
//     USA: colors(Math.random() * 10),
//     RUS: colors(Math.random() * 100),
//     AUS: { fillKey: 'authorHasTraveledTo' },
//     BRA: colors(Math.random() * 50),
//     CAN: colors(Math.random() * 50),
//     ZAF: colors(Math.random() * 50),
//     IND: colors(Math.random() * 50),
//   });

        d3.selectAll('.cityPoint').on('click', function(info) {
            console.log("hello",info)
            console.log(d3.event.pageY)
          var bubbly = $("#map-bubble");      
          bubbly.css({
              position:"absolute", 
              top: d3.event.pageY, 
              left: d3.event.pageX 
          });
          console.log(bubbly)
          bubbly.fadeIn("slow");
            // do something
        });

          d3.select(window).on('resize', function() {
        map.resize();
    });
    //  map.bubbles([
    //    {name: 'Hot', latitude: 21.32, longitude: 5.32, radius: 10, fillKey: 'gt50'},
    //    {name: 'Chilly', latitude: -25.32, longitude: 120.32, radius: 18, fillKey: 'lt50'},
    //    {name: 'Hot again', latitude: 21.32, longitude: -84.32, radius: 8, fillKey: 'gt50'},

    //  ], {
    //    popupTemplate: function(geo, data) {
    //      return "<div class='hoverinfo'>It is " + data.name + "</div>";
    //    }
    //  });



