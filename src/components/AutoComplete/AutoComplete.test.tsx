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

  const keybordNavigation = async (input: HTMLElement, key: string) => {
    await act(async () => {
      fireEvent.keyDown(input, { key })
    })
  }

  const validateOnBlur = async (expectation: any) =>
    await waitFor(() => expectation, { timeout: 100 }) // timeout based on component business logic

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

    it('should not render the placeholder if not set', () => {
      const { queryByPlaceholderText } = render(<AutoComplete fetchData={fn} />)
      expect(queryByPlaceholderText('test')).toBeNull()
    })
  })

  integrationTestSuite(() => {
    it('should hide dropdown list prior than typing', () => {
      const { queryByText } = render(<AutoComplete fetchData={fn} />)
      expect(queryByText('test-0')).toBeNull()
    })

    it('should hide dropdown list if input loses focus', async () => {
      const { findByRole, queryByText } = render(
        <AutoComplete fetchData={fn} />
      )
      await typeOnInput(await findByRole('search'), 'test')
      fireEvent.blur(await findByRole('search'))
      await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
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

    it('should select on item click', async () => {
      const onSelect = vi.fn()
      const { findByRole, findByText } = render(
        <AutoComplete onItemSelect={onSelect} fetchData={fn} />
      )
      await typeOnInput(await findByRole('search'), 'test')
      await act(async () => {
        fireEvent.click(await findByText('test-0'))
      })
      expect(onSelect).toHaveBeenCalledOnce()
      expect(onSelect).toHaveBeenCalledWith('test-0')
    })

    describe('Keyboard navigation', () => {
      it('should select on enter key', async () => {
        const onSelect = vi.fn()
        const { findByRole, findByText } = render(
          <AutoComplete onItemSelect={onSelect} fetchData={fn} />
        )
        await typeOnInput(await findByRole('search'), 'test')
        await act(async () => fireEvent.mouseOver(await findByText('test-0')))
        await keybordNavigation(await findByRole('search'), 'Enter')
        expect(onSelect).toHaveBeenCalledOnce()
        expect(onSelect).toHaveBeenCalledWith('test-0')
      })

      it('should activate on arrow down key', async () => {
        const { findByRole, findByText } = render(
          <AutoComplete fetchData={fn} />
        )
        await typeOnInput(await findByRole('search'), 'test')
        await keybordNavigation(await findByRole('search'), 'ArrowDown')
        const itemBackground = getComputedStyle(
          await findByText('test-0')
        ).getPropertyValue('background-color')
        expect(itemBackground).toBe('rgba(0, 0, 255, 0.05)')
      })

      it('should activate on arrow up key', async () => {
        const { findByRole, findByText } = render(
          <AutoComplete fetchData={fn} />
        )
        await typeOnInput(await findByRole('search'), 'test')
        await act(async () => fireEvent.mouseOver(await findByText('test-1')))
        await keybordNavigation(await findByRole('search'), 'ArrowUp')
        const itemBackground = getComputedStyle(
          await findByText('test-0')
        ).getPropertyValue('background-color')
        expect(itemBackground).toBe('rgba(0, 0, 255, 0.05)')
      })

      it('should not change active item when key down is pressed and the active item is the last one', async () => {
        const { findByRole, findByText } = render(
          <AutoComplete fetchData={fn} />
        )
        await typeOnInput(await findByRole('search'), 'test')
        await act(async () => fireEvent.mouseOver(await findByText('test-9')))
        await keybordNavigation(await findByRole('search'), 'ArrowDown')
        const itemBackground = getComputedStyle(
          await findByText('test-9')
        ).getPropertyValue('background-color')
        expect(itemBackground).toBe('rgba(0, 0, 255, 0.05)')
      })

      it('should close dropdown on escape key', async () => {
        const { findByRole, queryByText } = render(
          <AutoComplete fetchData={fn} />
        )
        await typeOnInput(await findByRole('search'), 'test')
        await keybordNavigation(await findByRole('search'), 'Escape')
        await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
      })

      describe('Tab key', () => {
        it('should highlight first item when tab key is pressed and the input is focused', async () => {
          const { findByRole, findByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await keybordNavigation(await findByRole('search'), 'Tab')
          const itemBackground = getComputedStyle(
            await findByText('test-0')
          ).getPropertyValue('background-color')
          expect(itemBackground).toBe('rgba(0, 0, 255, 0.05)')
        })

        it('should close dropdown when tab key is pressed and some item is focused', async () => {
          const { findByRole, queryByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await act(async () => fireEvent.mouseOver(queryByText('test-0')!))
          await keybordNavigation(await findByRole('search'), 'Tab')
          await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
        })

        it('should close dropdown when tab key is pressed twice and the input is focused', async () => {
          const { findByRole, queryByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await keybordNavigation(await findByRole('search'), 'Tab')
          await keybordNavigation(await findByRole('search'), 'Tab')
          await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
        })

        it('should focus the input when shift + tab keys are pressed and some item is focused', async () => {
          const { findByRole, queryByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await act(async () => fireEvent.mouseOver(queryByText('test-0')!))
          await act(async () => {
            fireEvent.keyDown(queryByText('test-0')!, {
              key: 'Tab',
              shiftKey: true,
            })
          })
          expect(queryByText('test-0')).not.toBeNull()
        })

        it('should close dropdown when shift + tab keys are pressed and the input is focused', async () => {
          const { findByRole, queryByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await act(async () => {
            fireEvent.keyDown(queryByText('test-0')!, {
              key: 'Tab',
              shiftKey: true,
            })
          })
          await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
        })

        it('should close dropdown when shift + tab keys are pressed twice and some item is focused', async () => {
          const { findByRole, queryByText } = render(
            <AutoComplete fetchData={fn} />
          )
          await typeOnInput(await findByRole('search'), 'test')
          await act(async () => fireEvent.mouseOver(queryByText('test-0')!))
          await act(async () => {
            fireEvent.keyDown(queryByText('test-0')!, {
              key: 'Tab',
              shiftKey: true,
            })
          })
          await act(async () => {
            fireEvent.keyDown(queryByText('test-0')!, {
              key: 'Tab',
              shiftKey: true,
            })
          })
          await validateOnBlur(() => expect(queryByText('test-0')).toBeNull())
        })
      })
    })
  })
})
