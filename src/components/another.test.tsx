import { describe, expect, it } from 'vitest'

import {
  componentTestSuite,
  integrationTestSuite,
  unitTestSuite,
} from '@tests/customResources'

describe('test setup', () => {
  unitTestSuite(() => {
    it('should pass either', () => {
      expect(false).not.toBe(true)
    })
  })
  integrationTestSuite(() => {
    it('should pass either', () => {
      expect(false).not.toBe(true)
    })
  })
  componentTestSuite(() => {
    it('should pass either', () => {
      expect(false).not.toBe(true)
    })
  })
})
