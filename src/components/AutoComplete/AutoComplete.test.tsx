import { act, fireEvent, render, waitFor } from '@testing-library/react'
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
      expect(queryByRole('search')).not.toBeNull()
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

      it('should call fetchData 1 time if user type each key under 500ms', async () => {
        const { getByRole } = render(
          <AutoComplete debounceTime={500} fetchData={fn} />
        )
        await typeOnInput(getByRole('search'), 't')
        await typeOnInput(getByRole('search'), 'te')
        await typeOnInput(getByRole('search'), 'tes')
        await typeOnInput(getByRole('search'), 'test')
        await waitFor(() => expect(fn).toHaveBeenCalledTimes(1))
      })
    })

    describe('Placeholder', () => {
      it('should render the placeholder', () => {
        const { queryByPlaceholderText } = render(
          <AutoComplete fetchData={fn} placeholder="test" />
        )
        expect(queryByPlaceholderText('test')).not.toBeNull()
      })
    })

    it('should not render the placeholder by default', () => {
      const { queryByPlaceholderText } = render(<AutoComplete fetchData={fn} />)
      expect(queryByPlaceholderText('test')).toBeNull()
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
      expect(queryByText('test-0')).not.toBeNull()
    })

    it('should hide dropdown list when user type cleans the input', async () => {
      const { findByRole, queryByText } = render(
        <AutoComplete fetchData={fn} />
      )
      await typeOnInput(await findByRole('search'), 'test')
      await typeOnInput(await findByRole('search'), '')
      expect(queryByText('test-0')).toBeNull()
    })

    it('should highlight searching text', async () => {
      const { findByRole, container } = render(
        <AutoComplete
          highlight
          fetchData={fn.mockResolvedValue(['some longer text response'])}
        />
      )
      await typeOnInput(await findByRole('search'), 'text')
      const pattern = /<span>some longer <mark.*>text<\/mark> response<\/span>/g
      expect(container.innerHTML).toMatch(pattern)
    })
  })
})
