---
layout: default
title: Shortest Path Tree
nav_order: 16
---

# ShortestPathTree

ShortestPathTree represents a data type for solving the single-source shortest paths problem in
edge-weighted directed acyclic graphs (DAGs).
The edge weights can be positive, negative, or zero. There are three APIs:
getDistTo(vertex),
hasPathTo(vertex),
pathTo(vertex).

```javascript
var ShortestPathTree = natural.ShortestPathTree;
var spt = new ShortestPathTree(digraph, 5);
```
digraph is an instance of EdgeWeightedDigraph, the second param is the start vertex of DAG.

## getDistTo(vertex)

Will return the dist to vertex.

```javascript
console.log(spt.getDistTo(4));
```
the output will be: 0.35

## pathTo(vertex)

Will return the shortest path:

```javascript
console.log(spt.pathTo(4));
```

output will be:

```javascript
[5, 4]
```
