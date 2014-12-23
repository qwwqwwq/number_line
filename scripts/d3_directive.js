'use strict';

function valsToFloat(vals) {
    return vals.units + vals.tenths/10 + vals.hundredths/100;
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
                var oldPos, newPos, oldDomain, newDomain, marginProp, ticks;
                oldDomain = [0, 1];
                newDomain = [0, 1];
                oldPos = 0;
                newPos = 0;
                marginProp = 0.00;

                function getNewDomain(newPos, oldDomain) {
                    return d3.extent(oldDomain.concat([newPos]));
                }

                function getTenAndHundredTicks(min, max) {
                    var tens = [];
                    var hundreds = [];
                    var cursor, new_max;
                    cursor = Math.round(min*100);
                    new_max = Math.round(max*100);
                    while(cursor <= new_max) {
                        if(!(cursor % 10)) {
                            tens.push(cursor/100);
                        }
                        hundreds.push(cursor/100);
                        cursor += 1
                    }
                    console.log([tens, hundreds]);
                    return [tens, hundreds];
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
                    console.log(["Render.", newVals, oldVals]);
                    oldPos = newPos;
                    oldDomain = newDomain;
                    newPos = valsToFloat(newVals);
                    newDomain = getNewDomain(newPos, oldDomain);
                    ticks = getTenAndHundredTicks(newDomain[0],newDomain[1])

                    d3.select("svg").remove();
                    var width = 960,
                        height = 500;

                    var x = d3.scale.linear()
                        .domain(getViewableDomain(newDomain))
                        .range([0, width]);

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
                        .attr("y1", 0)
                        .attr("y2", -60)
                        .attr("x1", x)
                        .attr("x2", x);

                    gAxis.selectAll("line").data(ticks[1], function(d) { return d; })
                        .enter()
                        .append("line")
                        .attr("class", "minor")
                        .attr("y1", 0)
                        .attr("y2", -40)
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
                        .delay(100);

                    if(!rangesEqual(oldDomain, newDomain)) {
                        transition(x, xAxis, gAxis,
                                   getViewableDomain(oldDomain),
                                   getViewableDomain(newDomain));
                    }
                };
                scope.$watch(attrs.binding, function (newVals, oldVals) {
                    return scope.render(newVals, oldVals);
                }, true);
            }
        };
    }]
);

