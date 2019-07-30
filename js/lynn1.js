var theData = {
  children:[{"source":3,"value":2367257,"formattedValue":"€2,367,257","name":"Legacies","tooltip":"Legacies: €2,367,257","colour":"#3182bd","$$hashKey":"object:106"},{"source":4,"value":1199595,"formattedValue":"€1,199,595","name":"Donations including donations in kind","tooltip":"Donations including donations in kind: €1,199,595","colour":"#6baed6","$$hashKey":"object:101"},{"source":2,"value":1154618,"formattedValue":"€1,154,618","name":"Tax relief income","tooltip":"Tax relief income: €1,154,618","colour":"#9ecae1","$$hashKey":"object:110"},{"source":2,"value":81447065,"formattedValue":"€81,447,065","name":"Grants and service fees from government sources","tooltip":"Grants and service fees from government sources: €81,447,065","colour":"#c6dbef","$$hashKey":"object:104"},{"source":3,"value":151798455,"formattedValue":"€151,798,455","name":"Non-government grants and donations","tooltip":"Non-government grants and donations: €151,798,455","colour":"#e6550d","$$hashKey":"object:108"},{"source":4,"value":15039907,"formattedValue":"€15,039,907","name":"Memberships and subscriptions","tooltip":"Memberships and subscriptions: €15,039,907","colour":"#fd8d3c","$$hashKey":"object:107"},{"source":2,"value":278004,"formattedValue":"€278,004","name":"Church collection","tooltip":"Church collection: €278,004","colour":"#fdae6b","$$hashKey":"object:100"},{"source":4,"value":113941393,"formattedValue":"€113,941,393","name":"Unspecified voluntary income","tooltip":"Unspecified voluntary income: €113,941,393","colour":"#fdd0a2","$$hashKey":"object:114"},{"source":1,"value":22890793,"formattedValue":"€22,890,793","name":"Fundraising events and activities","tooltip":"Fundraising events and activities: €22,890,793","colour":"#31a354","$$hashKey":"object:103"},{"source":1,"value":10713266,"formattedValue":"€10,713,266","name":"Charity shop income","tooltip":"Charity shop income: €10,713,266","colour":"#74c476","$$hashKey":"object:99"},{"source":2,"value":3800759,"formattedValue":"€3,800,759","name":"Unspecified activities for generating funds","tooltip":"Unspecified activities for generating funds: €3,800,759","colour":"#a1d99b","$$hashKey":"object:112"},{"source":2,"value":26174523,"formattedValue":"€26,174,523","name":"Investment income (including deposit interest)","tooltip":"Investment income (including deposit interest): €26,174,523","colour":"#c7e9c0","$$hashKey":"object:105"},{"source":3,"value":1605097,"formattedValue":"€1,605,097","name":"Unspecified incoming resources from generated funds","tooltip":"Unspecified incoming resources from generated funds: €1,605,097","colour":"#756bb1","$$hashKey":"object:113"},{"source":1,"value":150535745,"formattedValue":"€150,535,745","name":"Fees and income from trading activities","tooltip":"Fees and income from trading activities: €150,535,745","colour":"#9e9ac8","$$hashKey":"object:102"},{"source":1,"value":14580809,"formattedValue":"€14,580,809","name":"Other activities","tooltip":"Other activities: €14,580,809","colour":"#bcbddc","$$hashKey":"object:109"},{"source":4,"value":147269606,"formattedValue":"€147,269,606","name":"Uncategorized and other income","tooltip":"Uncategorized and other income: €147,269,606","colour":"#dadaeb","$$hashKey":"object:111"}]
};

function randomComparator (a, b) {
  return Math.floor(Math.random() * 10) + 1
}

function clipText (d, t) {

  if (d.r < 40) {
    return "";
  }

  var name = t.substring(0, d.r / 5);
  if (name.length < t.length) {
    name = name.substring (0, name.length - Math.min(2, name.length)) + "...";
  }

  return name;

}

// var colourPalette = colourService.palettes.default;

var diameter = 577,
    width = 577,
    height = diameter,
    format = d3.format(",d");

// color = d3.scale.category20c();

var bubble = d3.layout.pack()
.sort(randomComparator)
.size([width, height])
.padding(3);

var svg = d3.select("#chart").append("svg")
.attr("width", width)
.attr("height", diameter)
.attr("class", "bubble");

var container = svg.append("g");

var node = container.selectAll(".node")
.data(bubble.nodes(theData)
      .filter(function(d) { return !d.children; }))
.enter().append("g")
.attr("class", "node")
.attr("transform", function(d) {
  return "translate(" + d.x + "," + d.y + ")";
});

node.append("title")
  .text(function(d) {
  return d.name + ": €" + format(d.value);
});

node.append("circle")
  .attr("r", function(d) { return d.r; })
  .style("fill", function(d) {
  return d.colour;
  //return color(d.source);
})
  .style("pointer-events", "all");

var text = node.append("text")
.attr("dy", ".3em")
.style("text-anchor", "middle")
.style("fill", "#fff");

text.append("tspan")
  .attr("x", "0")
  .attr("dy", "0")
  .style("font-weight", "600")
  .text(function(d) {
  return clipText(d, d.formattedValue);
});

text.append("tspan")
  .attr("x", "0")
  .attr("dy", "1.2em")
  .text(function(d) {
  return clipText(d, d.name);
});


// Setup zooming

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var zoom = d3.behavior.zoom()
.scaleExtent([-10, 50])
.on("zoom", zoomed);

zoom(svg);
