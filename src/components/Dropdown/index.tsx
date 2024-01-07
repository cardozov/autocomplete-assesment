import { FC, HTMLAttributes } from 'react'
import styled from 'styled-components'

type DropdownProps = {
  isOpen?: boolean
} & HTMLAttributes<HTMLDivElement>

const DropdownWrapper = styled.div`
  position: absolute;
`

const DropdownContainer = styled.ul.attrs({ role: 'listbox' })`
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
  top: 100%;
  width: 100%;
  z-index: 1;
`

export const Dropdown: FC<DropdownProps> = ({ children, isOpen, ...rest }) => {
  if (!isOpen) return null

  return (
    <DropdownWrapper {...rest}>
      <DropdownContainer>{children}</DropdownContainer>
    </DropdownWrapper>
  )
}

export const DropdownItem = styled.li.attrs({ role: 'listitem' })`
  border-bottom: 1px solid #000;
  padding: 0.5rem 1rem;

  &:last-child {
    border-bottom: none;
  }
`
