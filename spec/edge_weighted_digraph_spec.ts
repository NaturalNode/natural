import { EdgeWeightedDigraph } from 'lib/natural'

describe('edge weighted digraph vertex count', function () {
  it('should have no vertices before adding an edge', function () {
    const graph = new EdgeWeightedDigraph()
    expect(graph.v()).toBe(0)
    expect(graph.e()).toBe(0)
  })

  it('should count a vertex with only incoming edges', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(0, 1, 1)
    expect(graph.v()).toBe(2)
  })

  it('should count sparse vertex identifiers without counting the gaps', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(10, 20, 1)
    expect(graph.v()).toBe(2)
  })

  it('should count the six vertices from issue #317', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(5, 4, 0.35)
    graph.add(5, 1, 0.32)
    graph.add(1, 3, 0.29)
    graph.add(6, 2, 0.40)
    graph.add(3, 6, 0.52)
    graph.add(6, 4, 0.93)
    expect(graph.v()).toBe(6)
    expect(graph.e()).toBe(6)
  })

  it('should count shared endpoints once as more edges are added', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(0, 1, 1)
    graph.add(0, 1, 2)
    expect(graph.v()).toBe(2)
    graph.add(1, 0, 3)
    expect(graph.v()).toBe(2)
    graph.add(1, 2, 4)
    expect(graph.v()).toBe(3)
    expect(graph.e()).toBe(4)
  })

  it('should count a self-loop endpoint only once', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(0, 0, 1)
    graph.add(0, 0, 2)
    expect(graph.v()).toBe(1)
    expect(graph.e()).toBe(2)
  })

  it('should count both endpoints when adding an existing edge', function () {
    const source = new EdgeWeightedDigraph()
    source.add(4, 9, 1)
    const edge = source.edges()[0]
    const graph = new EdgeWeightedDigraph()
    graph.addEdge(edge)
    expect(graph.v()).toBe(2)
    expect(graph.getAdj(4)).toEqual([edge])
    expect(graph.edges()[0]).toBe(edge)
  })

  it('should preserve edge order and adjacency queries', function () {
    const graph = new EdgeWeightedDigraph()
    graph.add(2, 9, 0.5)
    graph.add(2, 7, 1.5)
    graph.add(0, 2, 2.5)
    expect(graph.getAdj(2).map(edge => edge.to())).toEqual([9, 7])
    expect(graph.getAdj(9)).toEqual([])
    expect(graph.getAdj(99)).toEqual([])
    expect(graph.toString()).toBe('0 -> 2, 2.5\n2 -> 9, 0.5\n2 -> 7, 1.5')
    expect(graph.e()).toBe(3)
  })
})
