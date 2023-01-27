/*
Copyright (c) 2022,
Dylan R. E. Moonfire <https://github.com/dmoonfire>,
Emily Marigold Klassen <https://github.com/forivall>,
Hugo W.L. ter Doest <https://github.com/Hugo-ter-Doest>

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

export let stopwords: string[]

declare class Bag<T> {
  add (element: T): Bag<T>
  isEmpty (): boolean
  contains (item: T): boolean
  unpack (): T[]
}

declare class DirectedEdge {
  constructor (start: number, end: number, weight: number)
  weight (): number
  from (): number
  to (): number
  toString (): string
}

export class EdgeWeightedDigraph {
  edgesNum: number
  adj: Array<Bag<DirectedEdge>>

  add (start: number, end: number, weight: number): void
  addEdge (e: DirectedEdge): void
  v (): number
  e (): number
  getAdj (v: number): DirectedEdge[]
  edges (): DirectedEdge[]
  toString (): string
}

export class ShortestPathTree {
  constructor (diagraph: EdgeWeightedDigraph, start: number)
  relaxEdge (e: DirectedEdge): void
  relaxVertex (digraph: EdgeWeightedDigraph, vertex: number, tree: ShortestPathTree): void
  getDistTo (vertex: number): number
  hasPathTo (vertex: number): boolean
  pathTo (vertex: number): number[]
}

export class LongestPathTree {
  constructor (diagraph: EdgeWeightedDigraph, start: number)
  relaxEdge (e: DirectedEdge): void
  relaxVertex (digraph: EdgeWeightedDigraph, vertex: number, tree: LongestPathTree): void
  getDistTo (vertex: number): number
  hasPathTo (vertex: number): boolean
  pathTo (vertex: number): number[]
}
