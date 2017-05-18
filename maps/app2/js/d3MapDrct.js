'use strict';

d3DemoApp.directive('d3map', function ($timeout, D3ChartSizer) {



    return {
        restrict: 'A',
        scope: {
        },
        link: function ($scope, $element, attrs) {

            var m_width = $($element).width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection2 = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path3 = d3.geo.path()
                .projection(projection2);

            var tooltip = d3.select("#containerw").append("div").attr("class", "tooltip hidden");

            function click() {
                var latlon = projection2.invert(d3.mouse(this));
                console.log(latlon);
            }
            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 9])
                .on("zoom", move);

            var svg = d3.select("#d3map").append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width)
                .call(zoom)
                .on("click", click);

            svg.append("rect")
                .attr("class", "background")
                .attr("width", width)
                .attr("height", height)
                .on("click", country_clicked);

            var g = svg.append("g");

            d3.json("../app/d3map/countries-top.json", function (error, us) {
                g.append("g")
                    .attr("id", "countries")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.countries).features)
                    .enter()
                    .append("path")
                    .attr("id", function (d) { return d.id; })
                    .attr("d", path3)
                    .on("click", country_clicked);
            });


            function move() {

                var t = d3.event.translate;
                var s = d3.event.scale;
                // zscale = s;
                var h = height / 4;


                t[0] = Math.min(
                    (width / height) * (s - 1),
                    Math.max(width * (1 - s), t[0])
                );

                t[1] = Math.min(
                    h * (s - 1) + h * s,
                    Math.max(height * (1 - s) - h * s, t[1])
                );

                zoom.translate(t);
                g.attr("transform", "translate(" + t + ")scale(" + s + ")");

                //adjust the country hover stroke width based on zoom level
                d3.selectAll(".country").style("stroke-width", 1.5 / s);

            }

            function get_xyz(d) {
                var bounds = path3.bounds(d);
                var w_scale = (bounds[1][0] - bounds[0][0]) / width;
                var h_scale = (bounds[1][1] - bounds[0][1]) / height;
                var z = .96 / Math.max(w_scale, h_scale);
                var x = (bounds[1][0] + bounds[0][0]) / 2;
                var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
                return [x, y, z];
            }

            function country_clicked(d) {
                g.selectAll(["#states", "#cities"]).remove();
                state = null;

                if (country) {
                    g.selectAll("#" + country.id).style('display', null);
                }

                if (d && country !== d) {
                    var xyz = get_xyz(d);
                    country = d;

                    // zoom(xyz);
                } else {
                    var xyz = [width / 2, height / 1.5, 1];
                    country = null;
                    // zoom(xyz);
                }
            }


            $(window).resize(function () {
                var w = $("#d3map").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });


        }

    };
});