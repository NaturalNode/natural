const libPath = 'dist/esm/index.js'

describe('Module tests', () => {
  let myLib

  beforeAll(() => {
    // Assuming the module is named 'myModule' and is located in the 'src' directory
    // import * as myLib from libPath
  })

  // List of functions and classes expected to be exported by the module
  const expectedExports = ['Metaphone']

  expectedExports.forEach((exportName) => {
    it(`should have an export named ${exportName}`, () => {
      expect(myLib[exportName]).toBeDefined()
    })
  })
})
