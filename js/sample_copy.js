
var width = 600, height = 600;

var centre = { x: width / 2, y: height / 2 };
var forceStrength = 0.03;
var circle_size = 4;

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
  .force('x', d3.forceX().strength(forceStrength).x(centre.x))
  .force('y', d3.forceY().strength(forceStrength).y(centre.y))
  .force('collision', d3.forceCollide().radius(function (d) { return d.radius + 2 }));

simulation.stop();


function createNodes(rawData, noOfValues) {
  var sortByFiled = 'values';  //'count.total_effort'
  rawData = rawData.sort(function (y, x) { return x[sortByFiled].length - y[sortByFiled].length }).slice(0, noOfValues);
  // use max size in the data as the max in the scale's domain
  // note we have to ensure that size is a number
  var maxSize = d3.max(rawData, function (d) { return +d[sortByFiled].length });
  // size bubbles based on area
  var radiusScale = d3.scaleSqrt()
    .domain([0, maxSize])
    .range([0, 150]);

  // use map() to convert raw data into node data
  return rawData.map(function (d) {
    return {
      name: d.name,
      radius: radiusScale(d[sortByFiled].length),
      size: d[sortByFiled].length,
      x: Math.random() * 900,
      y: Math.random() * 800
    };
  });
}

function ready(err, dataPoints) {
  // dataPoints = createNodes(productData, 10);
  dataPoints = createNodes(dataPoints, 10);

  function truncateString(str, len) {
    if(!len) len = 5
    if(str.length > len) return str.substring(0, len) + '...'
    return str
  }
  var min = d3.min(dataPoints, function(d) { return d.size});
  var max = d3.max(dataPoints, function(d) { return d.size});
  var averageValue = (max - min) / 3   // d3.mean(dataPoints, function(d) { return  +d.size });

  var div = document.getElementById('vis')
  div.innerHTML = 'Min : ' + min + ' #65adb2 <br>  Avg: ' + averageValue + ' #81B5A1 <br> Max : ' + max + ' #8686BC'
  svg = d3.select('#chart')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', 'translate(0,0)');

  var circles = svg.selectAll('.artist')
    .data(dataPoints, function (d) { return d.name })
    .enter()
    .append('g')

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
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
      if (d.size < averageValue) return '#65adb2';
      else if (d.size > averageValue && d.size <= 2 * averageValue) return '#81B5A1';
      else if (d.size > (2 * averageValue)) return '#8686BC'
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  // labels
  labels = circles
    .append('text')

    .text(function (d) {
      var sizeAttr = ' (' + d.size + ')';
      if (d.size > averageValue / 2) {
        return d.name + sizeAttr
      }
      else return d.name.match(/\b\w/g).join('') + sizeAttr
    })
    .style("font-size", function (d) {
      var r = d.radius // Math.pow(d.radius, 0.4) * 3
      var font = Math.min(2 * r , (2 * r - 8 ) / this.getComputedTextLength() * 24);
      var fontSize = Math.ceil(font) + "px";
      console.log(fontSize)

      return fontSize
    })
    .attr("dy", ".35em")
    .style("fill", 'white')

  simulation.nodes(dataPoints)
    .on('tick', ticked)
    .restart();

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })

    labels
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
  }
}

// d3.json('http://localhost:8081/get/davies', ready)
d3.json('http://localhost:8081/get/digital', ready)
// d3.queue().await(ready);
