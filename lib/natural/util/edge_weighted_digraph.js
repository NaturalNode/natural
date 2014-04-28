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
'use strict';

var util = require('util'),
    Bag = require('./bag');

var DirectedEdge = function(start, end, weight) {
    this.start = start;
    this.end = end;
    this.weight = weight;
};

DirectedEdge.prototype.weight = function() {
    return this.weight;
};

DirectedEdge.prototype.from = function() {
    return this.start;
};

DirectedEdge.prototype.to = function() {
    return this.end;
};

DirectedEdge.prototype.toString = function() {
    return util.format('%s -> %s, %s', this.start, this.end, this.weight);
};

var EdgeWeightedDigraph = function() {
    this.edgesNum = 0;
    this.adj = []; // adjacency list
};

/**
 * the number of vertexs saved.
 */
EdgeWeightedDigraph.prototype.v = function() {
    return this.adj.length;
};

/**
 * the number of edges saved.
 */
EdgeWeightedDigraph.prototype.e = function() {
    return this.edgesNum;
};

EdgeWeightedDigraph.prototype.add = function(start, end, weight) {
    var e = new DirectedEdge(start, end, weight);
    this.addEdge(e);
};

EdgeWeightedDigraph.prototype.addEdge = function(e) {
    if(!this.adj[e.from()]) {
        this.adj[e.from()] = new Bag();
    }
    this.adj[e.from()].add(e);
    this.edgesNum++;
};

/**
 * use callback on all edges from v.
 */
EdgeWeightedDigraph.prototype.getAdj = function(v) {
    if(!this.adj[v]) return [];
    return this.adj[v].unpack();
};

/**
 * use callback on all edges.
 */
EdgeWeightedDigraph.prototype.edges = function() {
    var adj = this.adj;
    var list = new Bag();
    for(var i in adj) {
        adj[i].unpack().forEach(function(item) {
            list.add(item);
        });
    }
    return list.unpack();
};

EdgeWeightedDigraph.prototype.toString = function() {
    var result = [];
    var list = this.edges();
    list.forEach(function(edge) {
        result.push(edge.toString());
    });
    return result.join('\n');
};

module.exports = EdgeWeightedDigraph;
