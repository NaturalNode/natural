---
layout: default
title: Longest Path Tree
nav_order: 15
---

# LongestPathTree

LongestPathTree represents a data type for solving the single-source longest paths problem in
edge-weighted directed acyclic graphs (DAGs).
The edge weights can be positive, negative, or zero. There are three APIs same as ShortestPathTree:
getDistTo(vertex),
hasPathTo(vertex),
pathTo(vertex).

```javascript
var LongestPathTree = natural.LongestPathTree;
var lpt = new LongestPathTree(digraph, 5);
```
digraph is an instance of EdgeWeightedDigraph, the second param is the start vertex of DAG.

## getDistTo(vertex)

Will return the dist to vertex.

```javascript
console.log(lpt.getDistTo(4));
```
the output will be: 2.06

## pathTo(vertex)

Will return the longest path:

```javascript
console.log(lpt.pathTo(4));
```

output will be:

```javascript
[5, 1, 3, 6, 4]
```
