import {
  EdgeWeightedDigraph,
  ShortestPathTree,
  LongestPathTree
} from '../lib/natural/util'

const digraph = new EdgeWeightedDigraph()
digraph.add(5, 4, 0.35)
digraph.add(5, 1, 0.32)
digraph.add(1, 3, 0.29)
digraph.add(6, 2, 0.4)
digraph.add(3, 6, 0.52)
digraph.add(6, 4, 0.93)
console.log(digraph.v())
console.log(digraph.e())

let spt = new ShortestPathTree(digraph, 5)
console.log(spt.getDistTo(4))
console.log(spt.hasPathTo(4))
console.log(spt.hasPathTo(5))
console.log(spt.pathTo(4))

spt = new LongestPathTree(digraph, 5)
console.log(spt.getDistTo(4))
console.log(spt.hasPathTo(4))
console.log(spt.hasPathTo(5))
console.log(spt.pathTo(4))
