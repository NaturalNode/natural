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

var LPT = require('../lib/natural/util/longest_path_tree'),
    Topological = require('../lib/natural/util/topological'),
    EdgeWeightedDigraph = require('../lib/natural/util/edge_weighted_digraph');

describe("shortest path tree", function() {
    var digraph = new EdgeWeightedDigraph();
    digraph.add(5,4,0.35);
    digraph.add(4,7,0.37);
    digraph.add(5,7,0.28);
    digraph.add(5,1,0.32);
    digraph.add(4,0,0.38);
    digraph.add(0,2,0.26);
    digraph.add(3,7,0.39);
    digraph.add(1,3,0.29);
    digraph.add(7,2,0.34);
    digraph.add(6,2,0.40);
    digraph.add(3,6,0.52);
    digraph.add(6,0,0.58);
    digraph.add(6,4,0.93);
    describe("edge weighted digraph normal operations", function() {
        it("should get the numbers of vertexs", function() {
            expect(digraph.v()).toBe(8);
        });
        it("should get the numbers of edges", function() {
            expect(digraph.e()).toBe(13);
        });
        it("should print all item in digraph", function() {
            expect(digraph.toString()).toBe('0 -> 2, 0.26\n' +
                                            '1 -> 3, 0.29\n' +
                                            '3 -> 7, 0.39\n' +
                                            '3 -> 6, 0.52\n' +
                                            '4 -> 7, 0.37\n' +
                                            '4 -> 0, 0.38\n' +
                                            '5 -> 4, 0.35\n' +
                                            '5 -> 7, 0.28\n' +
                                            '5 -> 1, 0.32\n' +
                                            '6 -> 2, 0.4\n' +
                                            '6 -> 0, 0.58\n' +
                                            '6 -> 4, 0.93\n' +
                                            '7 -> 2, 0.34');
        });
    });

    describe("topo sort for digraph", function() {
        it("should sort all the vertexs", function() {
            var topoSort = new Topological(digraph);
            expect(topoSort.isDAG()).toBe(true);
            expect(topoSort.order()).toEqual([ 5, 1, 3, 6, 4, 7, 0, 2 ]);
        });
    });

    describe("shortest path tree normal operations", function() {
        var lpt = new LPT(digraph, 5);
        expect(lpt.hasPathTo(0)).toBe(true);
        expect(lpt.hasPathTo(1)).toBe(true);
        expect(lpt.hasPathTo(2)).toBe(true);
        expect(lpt.hasPathTo(3)).toBe(true);
        expect(lpt.hasPathTo(4)).toBe(true);
        expect(lpt.hasPathTo(5)).toBe(false);
        expect(lpt.hasPathTo(6)).toBe(true);
        expect(lpt.hasPathTo(7)).toBe(true);
        expect(lpt.pathTo(0)).toEqual([ 5, 1, 3, 6, 4, 0 ]);
        expect(lpt.pathTo(1)).toEqual([ 5, 1 ]);
        expect(lpt.pathTo(2)).toEqual([ 5, 1, 3, 6, 4, 7, 2 ]);
        expect(lpt.pathTo(3)).toEqual([ 5, 1, 3 ]);
        expect(lpt.pathTo(4)).toEqual([ 5, 1, 3, 6, 4 ]);
        expect(lpt.pathTo(5)).toEqual([ ]);
        expect(lpt.pathTo(6)).toEqual([ 5, 1, 3, 6 ]);
        expect(lpt.pathTo(7)).toEqual([ 5, 1, 3, 6, 4, 7 ]);
        expect(lpt.getDistTo(0)).toBe(2.44);
        expect(lpt.getDistTo(1)).toBe(0.32);
        expect(lpt.getDistTo(2)).toBe(2.77);
        expect(lpt.getDistTo(3)).toBe(0.61);
        expect(lpt.getDistTo(4)).toBe(2.06);
        expect(lpt.getDistTo(5)).toBe(0);
        expect(lpt.getDistTo(6)).toBe(1.13);
        expect(lpt.getDistTo(7)).toBe(2.43);
    });
});
