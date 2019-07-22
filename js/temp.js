function test($scope) {
	/* widget controller */
	var c = this;

	var productData = $scope.data.productData;
	var totalCount;

	totalCount = productData.map( function(x) { return x.count.total_effort; });
	var maxValue = Math.max.apply(null, totalCount);
	var minValue = Math.min.apply(null, totalCount);
	var averageValue = (maxValue + minValue) /3;
	var chartSize = 600;
	var width = chartSize , height = chartSize;


	// var width = 400, height = 400;

	var svg = d3.select('#chart')
	.append('svg')
	.attr('height', height)
	.attr('width', width)
	.append('g')
	.attr('transform', 'translate(0,0)');

	var radiusScale = d3.scaleSqrt().domain([1, 600]).range([10, 80]);

	// Add a scale for bubble color
	var myColor = d3.scaleOrdinal(d3.schemeCategory20);

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {

		return "<strong> Product:</strong> <span style='color:#81B5A1'>" + d.name + "</span>" +
			" <br /> <sgrong>Effort :</sgrong> <span style='color:#81B5A1'> " + d.count.total_effort + "</span>";
	});

	svg.call(tip);


	// Simulation is collection of forces about where we want to our circles to go
	var simulation = d3.forceSimulation()
	.force('x', d3.forceX(width/2).strength(0.05))
	.force('y', d3.forceY(height/2).strength(0.05))
	.force('collide', d3.forceCollide(function (d) {
		return radiusScale(d.count.total_effort) + 2;
	}));

	d3.queue().await(ready);

	function ready(err, dataPoints) {
		dataPoints = productData;
		var circles = svg.selectAll('.artist')
		.data(dataPoints)
		.enter()
		.append('circle')
		.attr('class', 'bubbles')
		.attr('cx', 100)
		.attr('cy', 300)
		.attr('r', function (d) {
			return radiusScale(d.count.total_effort);
		})
		.attr('fill', function (d) {
			if( d.count.total_effort <= averageValue && d.count.total_effort > 10) {
				return '#65adb2';
			} else if ( d.count.total_effort > averageValue && d.count.total_effort > (2 *averageValue) ) {
				return '#81B5A1';
			}
			else if(d.count.total_effort < 5){
				return '#8686BC';
			}
			else if(d.count.total_effort <= 10 && d.count.total_effort >=5){
				return '#72D0E2 ';
			}
			return '#293E40';

			// return myColor(d.count.total_effort);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

		simulation.nodes(dataPoints)
			.on('tick', ticked);

		function ticked() {
			circles
				.attr('cx', function (d) {
				return d.x;
			})
				.attr('cy', function (d) {
				return d.y;
			});
		}
	}
}
