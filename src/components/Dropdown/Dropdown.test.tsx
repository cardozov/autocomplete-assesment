import { render } from '@testing-library/react'
import { unitTestSuite } from '@tests/customResources'
import { describe, expect, it } from 'vitest'
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

    describe('DropdownItem', () => {
      it('should render the component', () => {
        const { queryByRole } = render(<DropdownItem />)
        expect(queryByRole('listitem')).not.toBeNull()
      })

      it('should render the children', () => {
        const { queryByText } = render(<DropdownItem>test</DropdownItem>)
        expect(queryByText('test')).not.toBeNull()
      })
    })
  })
})
