/*
Copyright (c) 2014, Lee Wenzhu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

/**
 * a topo sort for a digraph
 * @param {Digraph}
 */
class Topological {
  constructor (g) {
    this.isDag = true
    this.sorted = topoSort(uniqueVertexs(g.edges()), g.edges())
  }

  isDAG () {
    return this.isDag
  }

  /**
   * get ordered vertexs of digraph
   */
  order () {
    return this.sorted.slice()
  }
}

/**
 * @param {Array} all vertex in digraph
 * @param {Object} all edges in the digraph
 */
function topoSort (vertexs, edges) {
  const sorted = []
  let cursor = vertexs.length
  const visited = {}
  let i = cursor
  while (i--) {
    if (!visited[i]) visit(vertexs[i], i, [])
  }

  return sorted.reverse()

  function visit (vertex, i, predecessors) {
    if (predecessors.indexOf(vertex) >= 0) {
      throw new Error('Cyclic dependency:' + JSON.stringify(vertex))
    }

    if (visited[i]) return
    visited[i] = true

    const outgoing = edges.filter(function (edge) {
      return edge.to() === vertex
    })

    let preds = []
    if (outgoing.length > 0) {
      preds = predecessors.concat(vertex)
    }
    let from
    outgoing.forEach(function (edge) {
      from = edge.from()
      visit(from, vertexs.indexOf(from), preds)
    })

    sorted[--cursor] = vertex
  }
}

function uniqueVertexs (edges) {
  const vertexs = []
  let from, to
  edges.forEach(function (edge) {
    from = edge.from()
    to = edge.to()
    if (vertexs.indexOf(from) < 0) vertexs.push(from)
    if (vertexs.indexOf(to) < 0) vertexs.push(to)
  })
  return vertexs
}

module.exports = Topological
