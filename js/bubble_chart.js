var height = 500
var width = 500
/* global d3, _ */
var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

var circleSize = 4

var colourScale = d3.scaleOrdinal(d3.schemeCategory10)

function flatten (root) {
  var nodes = []
  var i = 0

  function recurse (node) {
    if (node.children) node.children.forEach(recurse)
    if (!node.id) node.id = ++i
    nodes.push(node)
  }

  recurse(root)
  return nodes
}

function addLabelLeaves (csvData, root) {
  function recurse (tree) {
    if (!(tree.children)) {
      // add to csv data with correct parent id and uniform size.

      const newRecord = {}
      newRecord['name'] = tree.data.name + '_label'
      newRecord['parent'] = tree.data.id
      newRecord['id'] = tree.data.id + '_label'
      newRecord['data'] = 20
      newRecord['text'] = tree.data.text

      csvData.push(newRecord)
    } else {
      _.each(tree.children, function (thisTree) {
        recurse(thisTree)
      })
    }
  }

  recurse(root)
}

// d3.csv('./assets/data.csv', function (csvData) {
d3.json('./assets/data.json', function (csvData) {
  var rootFn = d3.stratify()
    .id(function (d) {
      return d.id
    })
    .parentId(function (d) {
      return d.parent
    })

  var root = rootFn(csvData)

  // Recurse into root's children, and when we find

  var links = root.links()
  var nodes = flatten(root)

  addLabelLeaves(csvData, root)

  d3.forceSimulation(nodes)
    .force('link',
      d3.forceLink(links)
        .distance(function (d) {
          // We want the distance to be equal so they are spaced in a circle around the parent
          return Math.pow(d.source.data.data, 0.5) * circleSize * 1.5
        })
        .strength(function (d) {
          // Strength just needs to be enough so that length is uniform
          return 0.1
        })
    )
    .force('charge', d3.forceManyBody()
      .strength(function (d) {
        var force = -Math.pow(d.data.data, 0.5) * circleSize

        return force
      })
      .distanceMin(0)
      .distanceMax(200)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(function (d) { return Math.pow(d.data.data, 0.5) * circleSize }))
    .velocityDecay(0.05)
    .alphaMin(0.0001)
    .alphaDecay(0.01)

    .on('tick', ticked)

  function ticked () {
    var selection = svg.selectAll('.my_links')
      .data(links)

    selection.enter()
      .append('line')
      .attr('class', 'my_links')
      .merge(selection)
      .attr('x1', function (d) {
        return d.source.x
      })
      .attr('y1', function (d) {
        return d.source.y
      })
      .attr('x2', function (d) {
        return d.target.x
      })
      .attr('y2', function (d) {
        return d.target.y
      })
      .attr('stroke-width', function (d) {
        if (d.target.children) {
          return 1
        } else {
          return 0
        }
      })

    selection.exit().remove()

    // Update the nodes…
    selection = svg.selectAll('.my_nodes')
      .data(nodes, function (d) {
        return d.id
      })

    // Entering
    const enterSelection = selection
      .enter()
      .append('g')
      .attr('class', 'my_nodes')

    enterSelection.append('circle')

    enterSelection.append('text')

      .text(function (d) { return d.data.text })

      .style('font-size', function (d) {
        var r = Math.pow(d.data.data, 0.5) * circleSize
        return Math.min(2 * r, (2 * r - 8) / this.getComputedTextLength() * 24) + 'px'
      })
      .attr('dy', '.35em')
      .style('fill', function (d) {
        if (d.children) {
          return 'white'
        } else {
          return 'black'
        }
      })

    // Update
    enterSelection.merge(selection)
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })

    enterSelection.merge(selection).select('circle')
      .attr('r', function (d) {
        return Math.pow(d.data.data, 0.5) * circleSize
      })
      .attr('fill', function (d, i) {
        if (d.children) {
          return colourScale(i)
        } else {
          return 'white'
        }
      })
  }
})
