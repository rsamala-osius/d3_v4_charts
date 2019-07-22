function($scope) {
/* widget controller */
var c = this;

var productData = $scope.data.productData;
var totalCount;

//	totalCount = productData.map( function(x) { return x.size; });
//	var maxValue = Math.max.apply(null, totalCount);
//  var minValue = Math.min.apply(null, totalCount);
//	var averageValue = (maxValue + minValue) /3;
//	var chartSize = 600;
//	var width = chartSize , height = chartSize;



var width = 600, height = 400;

var centre = { x: width / 2, y: height / 2 };
var forceStrength = 0.03;

// these will be set in createNodes and chart functions
var svg = null;
var bubbles = null;
var labels = null;

// charge is dependent on size of the bubble, so bigger towards the middle
function charge(d) {
  return Math.pow(d.radius, 2.0) * 0.01
}
var radiusScale = d3.scaleSqrt().domain([1, 600]).range([10, 80]);

// Simulation is collection of forces about where we want to our circles to go
var simulation = d3.forceSimulation()
.force('x', d3.forceX(width/2).strength(0.05))
.force('y', d3.forceY(height/2).strength(0.05))	.force('collision', d3.forceCollide(function (d) {
  return radiusScale(d.radius) + 5;
}));

simulation.stop();


function createNodes(rawData, noOfValues) {
  rawData = rawData.sort( (y, x) => x.count.total_effort - y.count.total_effort ).slice(0,noOfValues);
  // use max size in the data as the max in the scale's domain
  // note we have to ensure that size is a number
  var maxSize = d3.max(rawData, function(d) { return  +d.count.total_effort });
  // size bubbles based on area
  var radiusScale = d3.scaleSqrt()
  .domain([0, maxSize])
  .range([0, 150])

  // use map() to convert raw data into node data
  var myNodes = rawData.map(function(d) {
    return {
      //...d,
      name: d.name,
      radius: radiusScale(+d.count.total_effort),
      size: +d.count.total_effort,
      x: Math.random() * 900,
      y: Math.random() * 800
    };
  })
  return myNodes;
}

function ready(err, dataPoints) {
  dataPoints = createNodes(productData, 5);
  var averageValue = d3.mean(dataPoints, function(d) { return  +d.size });

  svg = d3.select('#chart')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .append('g')
  .attr('transform', 'translate(0,0)');

  var circles = svg.selectAll('.artist')
  .data(dataPoints, function(d) { return d.name })
  .enter()
  .append('g')

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {

    return "<strong> Product:</strong> <span style='color:#81B5A1'>" + d.name + "</span>" +
      " <br /> <sgrong>Effort :</sgrong> <span style='color:#81B5A1'> " + d.size + "</span>";
  });

  svg.call(tip);

  bubbles = circles
    .append('circle')
    .classed('bubble', true)
    .attr('r', function (d) {
    return d.radius;
  })
    .attr('fill', function (d) {
    if( d.size <= averageValue && d.size > 10) {
      return '#65adb2';
    } else if ( d.size > averageValue && d.size > (2 *averageValue) ) {
      return '#81B5A1';
    }
    else if(d.size < 5){
      return '#8686BC';
    }
    else if(d.size <= 10 && d.size >=5){
      return '#72D0E2 ';
    }
    return '#293E40';

    // return myColor(d.size);
  })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  // labels
  labels = circles
    .append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', 10)
    .text(function(d) { return d.name })

  simulation.nodes(dataPoints)
    .on('tick', ticked)
    .restart();

  function ticked() {
    bubbles
      .attr('cx', function(d) { return d.x })
      .attr('cy', function(d) { return d.y })

    labels
      .attr('x', function(d) { return d.x })
      .attr('y', function(d) { return d.y })
  }
}

d3.queue().await(ready);
}
