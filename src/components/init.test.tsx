import { describe, expect, it } from 'vitest'

import {
  componentTestSuite,
  integrationTestSuite,
  unitTestSuite,
} from '@tests/customResources'

describe('test setup', () => {
  unitTestSuite(() => {
    it('should pass', () => {
      expect(true).toBe(true)
    })
  })
  integrationTestSuite(() => {
    it('should pass', () => {
      expect(true).toBe(true)
    })
  })
  componentTestSuite(() => {
    it('should pass', () => {
      expect(true).toBe(true)
    })
  })
})
