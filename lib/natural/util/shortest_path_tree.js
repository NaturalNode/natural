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

// const EdgeWeightedDigraph = require('./edge_weighted_digraph')
const Topological = require('./topological')

/**
  *  The ShortestPathTree represents a data type for solving the
  *  single-source shortest paths problem in edge-weighted directed
  *  acyclic graphs (DAGs). The edge weights can be positive, negative, or zero.
  *  This implementation uses a topological-sort based algorithm.
  *  the distTo() and hasPathTo() methods take
  *  constant time and the pathTo() method takes time proportional to the
  *  number of edges in the longest path returned.
  */
const ShortestPathTree = function (digraph, start) {
  const _this = this
  this.edgeTo = []
  this.distTo = []
  this.distTo[start] = 0.0
  this.start = start
  this.top = new Topological(digraph)
  this.top.order().forEach(function (vertex) {
    _this.relaxVertex(digraph, vertex, _this)
  })
}

ShortestPathTree.prototype.relaxEdge = function (e) {
  const distTo = this.distTo
  const edgeTo = this.edgeTo
  const v = e.from(); const w = e.to()
  if (distTo[w] > distTo[v] + e.weight) {
    distTo[w] = distTo[v] + e.weight
    edgeTo[w] = e
  }
}

/**
 * relax a vertex v in the specified digraph g
 * @param {EdgeWeightedDigraph} the apecified digraph
 * @param {Vertex} v vertex to be relaxed
 */
ShortestPathTree.prototype.relaxVertex = function (digraph, vertex, tree) {
  const distTo = tree.distTo
  const edgeTo = tree.edgeTo
  digraph.getAdj(vertex).forEach(function (edge) {
    const w = edge.to()
    distTo[w] = /\d/.test(distTo[w]) ? distTo[w] : Number.MAX_VALUE
    distTo[vertex] = distTo[vertex] || 0
    if (distTo[w] > distTo[vertex] + edge.weight) {
      // in case of the result of 0.28+0.34 is 0.62000001
      distTo[w] = parseFloat((distTo[vertex] + edge.weight).toFixed(2))
      edgeTo[w] = edge
    }
  })
}

ShortestPathTree.prototype.getDistTo = function (v) {
  return this.distTo[v]
}

ShortestPathTree.prototype.hasPathTo = function (v) {
  const dist = this.distTo[v]
  if (v === this.start) return false
  return /\d/.test(dist) ? dist !== Number.MAX_VALUE : false
}

ShortestPathTree.prototype.pathTo = function (v) {
  if (!this.hasPathTo(v) || v === this.start) return []
  const path = []
  const edgeTo = this.edgeTo
  for (let e = edgeTo[v]; e; e = edgeTo[e.from()]) {
    path.push(e.to())
  }
  path.push(this.start)
  return path.reverse()
}

module.exports = ShortestPathTree
