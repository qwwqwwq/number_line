'use strict';

function valsToFloat(vals) {
    return Number(vals.units + '.' + vals.tenths + vals.hundredths);
}

function rangesEqual(range0, range1) {
    return ((range0[0] == range1[0]) && (range0[1] == range1[1]))
}

angular.module('d3Directives').directive(
    'numberLine',
    ['d3', function (d3) {
        return {
            restrict: 'EA',
            scope: true,
            link: function (scope, element, attrs) {
                var oldPos, newPos, domain, viewableDomain,
                    oldDomain, newDomain, marginProp, ticks;
                domain = [0, 1];
                oldDomain = domain;
                oldPos = 0;
                newPos = 0;
                marginProp = 0.05;

                function getNewDomain(newPos, oldDomain) {
                    return d3.extent(oldDomain.concat([newPos]));
                }

                function getTenAndHundredTicks(min, max) {
                    var units = [];
                    var tens = [];
                    var hundreds = [];
                    var cursor, new_max;
                    cursor = Math.round(min*100);
                    new_max = Math.round(max*100);
                    while(cursor <= new_max) {
                        if(!(cursor % 100)) {
                            units.push(cursor/100);
                        }
                        if(!(cursor % 10)) {
                            tens.push(cursor/100);
                        }
                        hundreds.push(cursor/100);
                        cursor += 1
                    }
                    return [units, tens, hundreds];
                }

                function getViewableDomain(_domain) {
                    var domain = [].concat(_domain);
                    var margin = (domain[1] - domain[0])*marginProp;
                    domain[0] = domain[0] - margin;
                    domain[1] = domain[1] + margin;
                    return domain;
                }

                function transition(x, xAxis, gAxis, domain0, domain1) {
                    gAxis.transition().duration(500).tween("axis", function(d, i) {
                        var i = d3.interpolate(domain0, domain1);
                        return function(t) {
                            x.domain(i(t));
                            gAxis.call(xAxis);
                        }
                    });
                }

                scope.render = function(newVals, oldVals) {
                    oldDomain = newDomain;
                    oldPos = newPos;
                    newPos = valsToFloat(newVals);
                    newDomain = getNewDomain(newPos, domain);
                    viewableDomain = getViewableDomain(newDomain);
                    ticks = getTenAndHundredTicks(viewableDomain[0],viewableDomain[1]);

                    d3.select("svg").remove();
                    var width = 960,
                        height = 500;

                    var x = d3.scale.linear()
                        .domain(viewableDomain)
                        .range([0, width]);

                    var discreteX = d3.scale.quantile()
                        .domain([1,2,3,4,5,6,7,8,9,10,11,12])
                        .range([0, width]);

                    console.log(discreteX.quantiles());

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .ticks(0);

                    var svg = d3.select("div").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(0,200)");

                    var gAxis = svg.append("g")
                        .attr("class", "x axis")
                        .call(xAxis);

                    gAxis.selectAll("line").data(ticks[0], function(d) { return d; })
                        .enter()
                        .append("line")
                        .attr("class", "major")
                        .attr("y1", 0)
                        .attr("y2", -60)
                        .attr("x1", x)
                        .attr("x2", x);

                    gAxis.selectAll("line").data(ticks[1], function(d) { return d; })
                        .enter()
                        .append("line")
                        .attr("class", "major")
                        .attr("y1", 0)
                        .attr("y2", -40)
                        .attr("x1", x)
                        .attr("x2", x);

                    gAxis.selectAll("line").data(ticks[2], function(d) { return d; })
                        .enter()
                        .append("line")
                        .attr("class", "minor")
                        .attr("y1", 0)
                        .attr("y2", -20)
                        .attr("x1", x)
                        .attr("x2", x);


                    svg.append("rect")
                        .attr("x", x(oldPos))
                        .attr("width", 1)
                        .attr("height", 500)
                        .style("fill", "red")
                        .transition()
                        .attr("x", x(newPos))
                        .duration(500)
                        .delay(500);

                    svg.selectAll("text")
                        .data([newVals.units, '.', newVals.tenths, newVals.hundredths])
                        .enter()
                        .append("text")
                        .attr("x", function(d, i) { return 350 + (i*32); })
                        .attr("y", function(d, i) { return 150; })
                        .attr("dy", ".35em")
                        .text(function(d) { return d; });

                    transition(x, xAxis, gAxis,
                               getViewableDomain(oldDomain),
                               getViewableDomain(newDomain));
                };
                scope.$watch(attrs.binding, function (newVals, oldVals) {
                    return scope.render(newVals, oldVals);
                }, true);
            }
        };
    }]
);

