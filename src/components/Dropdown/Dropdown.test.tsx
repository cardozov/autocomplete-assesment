import { fireEvent, render } from '@testing-library/react'
import { componentTestSuite, unitTestSuite } from '@tests/customResources'
import { describe, expect, it, vi } from 'vitest'
import { Dropdown, DropdownItem } from '.'

describe('Dropdown', () => {
  unitTestSuite(() => {
    it('should render the component', () => {
      const { queryByRole } = render(<Dropdown isOpen />)
      expect(queryByRole('listbox')).not.toBeNull()
    })

    it('should not render the component if isOpen is false', () => {
      const { queryByRole } = render(<Dropdown />)
      expect(queryByRole('listbox')).toBeNull()
    })

    describe('Custom children', () => {
      it('should render the children if isOpen is true', () => {
        const { queryByText } = render(
          <Dropdown isOpen>
            <li>test</li>
          </Dropdown>
        )
        expect(queryByText('test')).not.toBeNull()
      })

      it('should not render the children if isOpen is false', () => {
        const { queryByText } = render(
          <Dropdown>
            <li>test</li>
          </Dropdown>
        )
        expect(queryByText('test')).toBeNull()
      })
    })
  })
})

describe('DropdownItem', () => {
  unitTestSuite(() => {
    it('should render the component', () => {
      const { queryByRole } = render(<DropdownItem />)
      expect(queryByRole('listitem')).not.toBeNull()
    })

    it('should render the children', () => {
      const { queryByText } = render(<DropdownItem>test</DropdownItem>)
      expect(queryByText('test')).not.toBeNull()
    })

    it('should trigger onHover after mouseEnter', () => {
      const onHover = vi.fn()
      const mouseEnterMock = new MouseEvent('mouseenter', {})
      const { getByRole } = render(
        <DropdownItem onHover={onHover}>test</DropdownItem>
      )
      fireEvent.mouseEnter(getByRole('listitem'), mouseEnterMock)
      expect(onHover).toHaveBeenCalledOnce()
      expect(onHover.mock.calls[0][0]).toMatchObject({ ...mouseEnterMock })
    })
  })

  componentTestSuite(() => {
    const fn = vi.fn()

    it('should style if active', async () => {
      const { getByRole } = render(
        <DropdownItem isActive onHover={fn}>
          test
        </DropdownItem>
      )
      expect(getComputedStyle(getByRole('listitem'))).toHaveProperty(
        'background-color',
        'rgba(0, 0, 255, 0.05)'
      )
    })
  })
})
