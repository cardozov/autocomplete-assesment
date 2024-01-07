import { fireEvent, render } from '@testing-library/react'
import { Mock, describe, expect, expectTypeOf, vi } from 'vitest'

import { unitTestSuite } from '@tests/customResources'
import AutoComplete from '.'

describe('AutoComplete', () => {
  unitTestSuite(() => {
    let fn: Mock<[data: string], Promise<string[]>>

    beforeEach(() => {
      fn = vi.fn(async (data: string) =>
        Array.from({ length: 10 }).map((_, i) => `${data}-${i}`)
      )
    })

    it('should render the component', () => {
      const { queryByRole } = render(<AutoComplete fetchData={fn} />)
      expect(queryByRole('search')).toBeDefined()
    })

    describe('List Dropdown', () => {
      it('should not show list prior then input interaction', () => {
        const { queryByText } = render(<AutoComplete fetchData={fn} />)
        expect(queryByText('test-0')).toBeNull()
      })

      it('should show list after input interaction', () => {
        const { getByRole, findByText } = render(
          <AutoComplete fetchData={fn} />
        )
        const input = getByRole('search')
        fireEvent.change(input, { target: { value: 'test' } })
        expect(findByText('test-0')).toBeDefined()
      })

      it('should not show list if input is blank', () => {
        const { getByRole, queryByText } = render(
          <AutoComplete fetchData={fn} />
        )
        const input = getByRole('search')
        fireEvent.change(input, { target: { value: 'some text' } })
        fireEvent.change(input, { target: { value: '' } })
        expect(queryByText('test-0')).toBeNull()
        expect(fn).toHaveBeenCalledTimes(1)
      })
    })

    describe('Fetch data function', () => {
      expectTypeOf(fn).toBeFunction() // precondition

      it("should call fetchData with 'test'", () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        fireEvent.change(getByRole('search'), { target: { value: 'test' } })
        expect(fn).toHaveBeenCalledWith('test')
      })

      it('should call fetchData just once', () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        fireEvent.change(getByRole('search'), { target: { value: 'test' } })
        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should not call fetchData if input is blank', () => {
        const { getByRole } = render(<AutoComplete fetchData={fn} />)
        fireEvent.change(getByRole('search'), { target: { value: '' } })
        expect(fn).not.toHaveBeenCalled()
      })
    })
  })
})
