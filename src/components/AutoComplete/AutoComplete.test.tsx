import { act, fireEvent, render } from '@testing-library/react'
import { Mock, describe, expect, expectTypeOf, vi } from 'vitest'

import { integrationTestSuite, unitTestSuite } from '@tests/customResources'
import AutoComplete from '.'

describe('AutoComplete', () => {
  let fn: Mock<[data: string], Promise<string[]>>

  const typeOnInput = async (input: HTMLElement, value: string) => {
    await act(async () => {
      fireEvent.change(input, { target: { value } })
    })
  }

  beforeEach(async () => {
    fn = vi.fn(async (data: string) =>
      Array.from({ length: 10 }).map((_, i) => `${data}-${i}`)
    )
  })

  unitTestSuite(() => {
    it('should render the component', () => {
      const { queryByRole } = render(<AutoComplete fetchData={fn} />)
      expect(queryByRole('search')).toBeDefined()
    })

    describe('Fetch data function', () => {
      expectTypeOf(fn).toBeFunction() // precondition

      it("should call fetchData with 'test'", async () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        await typeOnInput(getByRole('search'), 'test')
        expect(fn).toHaveBeenCalledWith('test')
      })

      it('should call fetchData just once', async () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        await typeOnInput(getByRole('search'), 'test')
        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should not call fetchData if input is blank', async () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        await typeOnInput(getByRole('search'), '')
        expect(fn).not.toHaveBeenCalled()
      })
    })
  })

  integrationTestSuite(() => {
    it('should hide dropdown list by default', () => {
      const { queryByText } = render(<AutoComplete fetchData={fn} />)
      expect(queryByText('test-0')).toBeNull()
    })

    it("should show dropdown list when user type 'test'", async () => {
      const { getByRole, queryByText } = render(<AutoComplete fetchData={fn} />)
      await typeOnInput(getByRole('search'), 'test')
      expect(queryByText('test-0')).toBeDefined()
    })

    it('should hide dropdown list when user type cleans the input', async () => {
      const { findByRole, queryByText } = render(
        <AutoComplete fetchData={fn} />
      )
      await typeOnInput(await findByRole('search'), 'test')
      await typeOnInput(await findByRole('search'), '')
      expect(queryByText('test-0')).toBeNull()
    })
  })
})