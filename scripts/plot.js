/**
 *
 * Created by jeffquinn on 12/15/14.
 */

//Width and height
var w = 1000;
var h = 500;
var margin = 50;

var dataset = [
    [5, 20, 1],
    [480, 90, 2],
    [250, 50, 3],
    [100, 33, 4],
    [330, 95, 5],
    [410, 12, 6],
    [475, 44, 7],
    [25, 67, 8],
    [85, 21, 9],
    [220, 88, 10]
];

//Create scale functions
var xScale = d3.scale.linear()
    .domain([0,
             d3.max(dataset, function (d) {
                return d[0];
             })])
    .range([0+margin*2, w-margin*2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function (d) {
                return d[1];
            })])
    .range([0+margin*2, h-margin*2]);

var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function (d) {
                return d[2];
            })])
    .range([1, margin]);


var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
              return xScale(d[0]);
          })
    .attr("cy", function (d) {
              return yScale(d[1]);
          })
    .attr("r", function (d) {
              return rScale(d[2]);
          });

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
              return d[0] + "," + d[1];
          })
    .attr("x", function (d) {
              return xScale(d[0]);
          })
    .attr("y", function (d) {
              return yScale(d[1]);
          })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "red");


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - margin) + ")")
    .call(xAxis);


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin + ",0)")
    .call(yAxis);

