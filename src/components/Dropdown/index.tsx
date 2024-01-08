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

const DropdownItemContainer = styled.li.attrs({ role: 'listitem' })`
  padding: 0.7rem 1rem 0 1rem;
  cursor: pointer;

  &:not(:last-child):after {
    content: '';
    display: block;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.2);
    padding-bottom: 0.7rem;
  }

  &:first-child {
    padding-top: 1rem;
  }

  &:last-child {
    padding-bottom: 1rem;
  }
`

const DropdownItemContainerActive = styled(DropdownItemContainer)`
  background-color: rgba(0, 0, 255, 0.05);
`

type DropdownItemProps = {
  isActive?: boolean
  onHover?: () => void
} & HTMLAttributes<HTMLLIElement>

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  isActive,
  onHover,
  ...rest
}) => {
  const Container =
    isActive ? DropdownItemContainerActive : DropdownItemContainer

  return (
    <Container onMouseEnter={onHover} {...rest}>
      {children}
    </Container>
  )
}
