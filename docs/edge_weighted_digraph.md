---
layout: default
title: Edge Weighted Digraph
nav_order: 15
---

# EdgeWeightedDigraph

EdgeWeightedDigraph represents a digraph, you can add an edge, get the number vertexes, edges, get all edges and use toString to print the Digraph.

initialize a digraph:

```javascript
var EdgeWeightedDigraph = natural.EdgeWeightedDigraph;
var digraph = new EdgeWeightedDigraph();
digraph.add(5,4,0.35);
digraph.add(5,1,0.32);
digraph.add(1,3,0.29);
digraph.add(6,2,0.40);
digraph.add(3,6,0.52);
digraph.add(6,4,0.93);
```
the api used is: add(from, to, weight).

get the number of vertexes:

```javascript
console.log(digraph.v());
```
you will get 7.

get the number of edges:

```javascript
console.log(digraph.e());
```
you will get 6.

## Outgoing edges

Each existing entry in `digraph.adj` is a bag of outgoing edges. Its `isEmpty()` method returns `true` when the bag contains no edges and `false` when it contains one or more edges.

Use `getAdj(vertex)` to retrieve the outgoing edges as an array. It returns an empty array when the vertex has no adjacency bag, so there is no need to access a missing entry in `adj`.

For the graph above:

```javascript
console.log(digraph.adj[5].isEmpty()); // false
console.log(digraph.getAdj(5).length); // 2
console.log(digraph.getAdj(2)); // []
```
