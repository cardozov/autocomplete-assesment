import { FC, HTMLAttributes } from 'react'
import styled from 'styled-components'

type DropdownProps = {
  isOpen?: boolean
} & HTMLAttributes<HTMLDivElement>

const DropdownWrapper = styled.div`
  width: 100%
  position: absolute;
`

const DropdownContainer = styled.ul.attrs({ role: 'listbox' })`
  background-color: #fff;
  border: 0.1rem solid rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
`

export const Dropdown: FC<DropdownProps> = ({ children, isOpen, ...rest }) => {
  if (!isOpen) return null

  return (
    <div style={{ width: '100%' }}>
      <DropdownWrapper {...rest}>
        <DropdownContainer>{children}</DropdownContainer>
      </DropdownWrapper>
    </div>
  )
}

export const DropdownItem = styled.li.attrs({ role: 'listitem' })`
  border-bottom: 0.1rem solid rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0;

  &:last-child {
    border-bottom: none;
  }
`
