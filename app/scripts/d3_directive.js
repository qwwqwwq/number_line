'use strict';

function valsToFloat(vals) {
    var magnitude = vals.units + vals.tenths/10 + vals.hundredths/100;
    if (vals.sign == '-') {
        return magnitude * -1;
    } else {
        return magnitude;
    }
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
                var oldPos, newPos, domain,
                    newViewableDomain,
                    oldViewableDomain,
                    oldDomain, newDomain, marginProp, ticks;
                domain = [0, 1];
                oldDomain = domain;
                newDomain = domain;
                oldPos = 0;
                newPos = 0;
                marginProp = 0.05;

                function getNewDomain(newPos, oldDomain) {
                    return d3.extent(oldDomain.concat([newPos]));
                }

                function getTenAndHundredTicks(min, max) {
                    var N = 1000;
                    var units = [];
                    var tens = [];
                    var hundreds = [];
                    var thousands = [];
                    var cursor, new_max;
                    cursor = Math.round(min*N);
                    new_max = Math.round(max*N);
                    while(cursor <= new_max) {
                        if(!(cursor % N)) {
                            units.push(cursor/N);
                        }
                        if(!(cursor % (N/10))) {
                            tens.push(cursor/N);
                        }
                        if(!(cursor % (N/100))) {
                            hundreds.push(cursor/N);
                        }
                        thousands.push(cursor/N);
                        cursor += 1
                    }
                    return [units, tens, hundreds, thousands];
                }

                function getViewableDomain(_domain) {
                    var domain = [].concat(_domain);
                    var margin = (domain[1] - domain[0])*marginProp;
                    domain[0] = domain[0] - margin;
                    domain[1] = domain[1] + margin;
                    return domain;
                }

                function domainSize(_domain) {
                    return (_domain[1] - _domain[0]);
                }

                function drawTickSet(gAxis, x, ticks, height, clazz) {
                    gAxis.selectAll("line").data(ticks, function(d) { return d; })
                        .enter()
                        .append("line")
                        .attr("class", clazz)
                        .attr("y1", 0)
                        .attr("y2", -1*height)
                        .attr("x1", x)
                        .attr("x2", x);
                }

                function setDiff(A, B) {
                    return A.filter(function(x) { return B.indexOf(x) < 0 });
                }

                function drawTicks(gAxis, x, domain) {
                    ticks = getTenAndHundredTicks(domain[0],domain[1]);
                    drawTickSet(gAxis, x, ticks[0], 60, "major");
                    drawTickSet(gAxis, x, ticks[1], 40, "");
                    drawTickSet(gAxis, x, ticks[2], 20, "minor");
                    drawTickSet(gAxis, x, ticks[3], 10, "micro");

                    gAxis.selectAll("text").data(ticks[0], function(d) { return d; })
                        .enter()
                        .append("text")
                        .text(function(d) {return d;})
                        .attr("class", "label-major")
                        .attr("y", 20)
                        .attr("x", function(d) { return x( d ) - 4 });

                    if(ticks[1].length <= 30) {
                        gAxis.selectAll("text").data(setDiff(ticks[1], ticks[0]), function (d) {
                            return d;
                        })
                            .enter()
                            .append("text")
                            .text(function (d) {
                                      return d;
                                  })
                            .attr("class", "label-minor")
                            .attr("y", 20)
                            .attr("x", function (d) {
                                      return x(d) - 10
                                  });
                    }
                }

                function transition(svg, x, xAxis, gAxis, domain0, domain1) {
                    x.domain(domain1);
                    svg.select("axis").transition().duration(500).call(xAxis);

/*

                    trans.tween("axis", function(d, i) {
                        var i = d3.interpolate(domain0, domain1);
                        return function(t) {
                            x.domain(i(t));
                            gAxis.call(xAxis);
                        }
                    });

                    trans = trans.duration(5000);

                    if( domainSize(domain1) < domainSize(domain0) ) {
                        console.log("smaller");
                        trans = trans.delay(500);
                    }
                    */

                }

                function digitChange(newVals, oldVals) {
                    var output = [];
                    if( newVals.sign != oldVals.sign) {
                        output.push('sign');
                    }
                    if( newVals.units != oldVals.units) {
                        output.push('unit');
                    }

                    if( newVals.tenths != oldVals.tenths) {
                        output.push('tenth');
                    }

                    if( newVals.hundredths != oldVals.hundredths) {
                        output.push('hundredth');
                    }

                    if( newVals.thousandths != oldVals.thousandths) {
                        output.push('thousandth');
                    }

                    return output;
                }

                scope.render = function(newVals, oldVals) {
                    oldDomain = newDomain;
                    oldPos = newPos;
                    newPos = newVals.number;
                    newDomain = getNewDomain(newPos, domain);
                    oldViewableDomain = getViewableDomain(oldDomain);
                    newViewableDomain = getViewableDomain(newDomain);

                    d3.select("svg").remove();
                    var width = 960,
                        height = 310;

                    var x = d3.scale.linear()
                        .domain(newViewableDomain)
                        .range([0, width]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .ticks(0);

                    console.log(oldViewableDomain);
                    var oldx = d3.scale.linear()
                        .domain(oldViewableDomain)
                        .range([0, width]);

                    var oldxAxis = d3.svg.axis()
                        .scale(oldx)
                        .ticks(0);

                    var svg = d3.select("number-line").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(0,200)");

                    svg.append("rect")
                        .attr("x", oldx(oldPos))
                        .attr("y", -500)
                        .attr("width", 1)
                        .attr("height", 1000)
                        .style("fill", "red")
                        .transition()
                        .attr("x", x(newPos))
                        .duration(500);


                    var numberTexts = [{value: newVals.vals.sign,
                                name: 'sign'},
                               {value: newVals.vals.units,
                                name: 'unit'},
                               {value: '.',
                                name: 'decimal'},
                               {value: newVals.vals.tenths,
                                name: 'tenth'},
                               {value: newVals.vals.hundredths,
                                name: 'hundredth'},
                               {value: newVals.vals.thousandths,
                                name: 'thousandth'}];
                    svg.selectAll("text")
                        .data(numberTexts)
                        .enter()
                        .append("text")
                        .attr("x", function(d, i) { return ((width/2)-(36)-(36*(Math.ceil(numberTexts.length/2)))) + (i*42); })
                        .attr("y", function(d, i) { return 80; })
                        .attr("dy", ".35em")
                        .attr("class", function(d) {return "main " + d.name;})
                        .text(function(d) { return String(d.value); });

                    digitChange(newVals.vals, oldVals.vals).forEach(function(clazz) {
                        svg.select("."+clazz)
                            .transition()
                            .duration(0)
                            .attr("fill", "red")
                            .transition().duration(2000)
                            .attr("fill", "black")
                            .transition().delay(2000).duration(1000);
                    });


                    var gAxis = svg.append("g")
                        .attr("class", "x axis")
                        .call(xAxis);

                    drawTicks(gAxis, x, newViewableDomain);



                        /*
                    transition(svg, x, xAxis, gAxis,
                               oldViewableDomain,
                               newViewableDomain);
                               */
                };
                scope.$watch(attrs.binding, function (newVals, oldVals) {
                    return scope.render(newVals, oldVals);
                }, true);
            }
        };
    }]
);

