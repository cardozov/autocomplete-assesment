export const unitTestSuite = (fn: () => void) => describe('unit', fn)
export const integrationTestSuite = (fn: () => void) =>
  describe('integration', fn)
export const componentTestSuite = (fn: () => void) => describe('component', fn)
