import { EdgeWeightedDigraph } from 'lib/natural'
import Bag from 'lib/natural/util/bag'

describe('Bag', function () {
  it('should report a newly created bag as empty', function () {
    const bag = new Bag()

    expect(bag.isEmpty()).toBe(true)
    expect(bag.unpack()).toEqual([])
  })

  it('should stay non-empty after adding falsy and duplicate elements', function () {
    const bag = new Bag()

    bag.add(0)
    expect(bag.isEmpty()).toBe(false)

    bag.add(0)
    expect(bag.isEmpty()).toBe(false)
    expect(bag.unpack()).toEqual([0, 0])
  })

  it('should report a graph adjacency bag with an edge as non-empty', function () {
    const digraph = new EdgeWeightedDigraph()
    digraph.add(0, 1, 0.5)

    expect(digraph.adj[0].isEmpty()).toBe(false)
    expect(digraph.getAdj(0).length).toBe(1)
  })
})
