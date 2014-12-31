"use strict";

// so that touchmove is not scrolling
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 

var FizzyText = function() {
  this.jitter = 12;
  this.tailLength = 40;
  this.tailColor = '#ffffff';
};

var iteratePerSecond = 30;
var period = 1000 / iteratePerSecond;

var text = new FizzyText();
var gui = new dat.GUI();
var controller = {jitter: gui.add(text, 'jitter', 0, 80)
							 .onChange(function(value) {
								text.jitter = value;
							}),
			  	  tailLength: gui.add(text, 'tailLength', 0 , 100)
			  	  				 .onChange(function(value) {
									text.tailLength = Math.floor(value);
									points.splice(0, (points.length - text.tailLength));
								 }),
   				  color: gui.addColor(text, 'tailColor')
   				  			.onChange(function(value) {
  								svg.select("path").attr("stroke", value);
							})
   				  };

// standard parameters
var margin = {
		top: 20,
		right: 0,
		bottom: 0,
		left: 0
	},
	width = 1400 - margin.left - margin.right,
	height = 1000 - margin.bottom - margin.top;

// new parameters
var points = [];

// define the function for the line with jitter
var lineFunction = d3.svg.line()
	.x(function(d) {
		return d.x + Math.random() * text.jitter - text.jitter/2 - margin.left;
	})
	.y(function(d) {
		return d.y + Math.random() * text.jitter - text.jitter/2 - margin.top;
	})
	.interpolate('basis');

// standard svg intro + mousemove
var svg = d3.select('.main')
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .on("mousemove", function() {
				updateArray(d3.mouse(this));
			})
        .on("touchmove", function() {
        		updateArray(d3.mouse(this));
			});;

svg.append('path')
		.attr("d", lineFunction(points))
		.attr("stroke", text.tailColor)
		.attr("class", "mainPath");

var paths = svg.select("path");

// update line with new points
function jitter() {
	// update points
	paths.attr("d", lineFunction(points))

	// call repeatedly
	requestAnimationFrame(jitter);
}

jitter();

// update point array
function updateArray(coord) {

	if(points.length < text.tailLength - 1){
		points.push({
			x: coord[0],
			y: coord[1]
		});
	} else {
		// set up so as not to create a new object, but to reuse the old one
		points.push(points[0]);
		points[points.length - 1].x = coord[0];
		points[points.length - 1].y = coord[1];
		points.shift()
	}
};