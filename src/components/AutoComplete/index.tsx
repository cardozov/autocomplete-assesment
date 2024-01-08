import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Dropdown, DropdownItem } from '../Dropdown'
import TextWithSliceHighlight from '../TextWithSliceHighlight'
import Input from '../theme/Input'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

type NavigationKeys = 'ArrowUp' | 'ArrowDown' | 'Enter' | 'Escape'

type AutoCompleteProps = {
  fetchData: (search: string) => Promise<string[]>
  highlight?: boolean
  debounceTime?: number
  placeholder?: string
  onItemSelect?: (value: string) => void
} & React.HTMLAttributes<HTMLDivElement>

const AutoComplete: FC<AutoCompleteProps> = ({
  fetchData,
  debounceTime = 0,
  highlight = false,
  placeholder,
  onItemSelect,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<string[]>([])
  const [index, setIndex] = useState(0)

  const searchData = () => fetchData(search).then(setData)

  useEffect(() => {
    if (!search) return
    if (debounceTime === 0) {
      searchData()
      return () => setData([])
    }
    const timeout = setTimeout(searchData, debounceTime)
    return () => {
      setData([])
      clearTimeout(timeout)
    }
  }, [search])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) return setData([])

    setSearch(value)
  }

  const keybordNavigation = (key: NavigationKeys) => {
    switch (key) {
      case 'ArrowUp':
        index > 0 && setIndex((index) => index - 1)
        break
      case 'ArrowDown':
        index < data.length && setIndex((index) => index + 1)
        break
      case 'Enter':
        if (data[index - 1]) {
          onItemSelect?.(data[index - 1])
        } else break
      case 'Escape':
        setData([])
        setIndex(0)
        setSearch('')
        if (ref.current) ref.current.value = ''
        ref.current?.blur()
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && index > 0) {
        e.preventDefault()
        setIndex(0)
      } else if (!e.shiftKey && data.length && index === 0) {
        e.preventDefault()
        setIndex(1)
      } else setData([])
    }
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault()
      keybordNavigation(e.key as NavigationKeys)
    }
  }

  const handleFocus = () => {
    if (ref?.current?.value) searchData()
  }

  const handleBlur = () => {
    setTimeout(() => {
      // Timeout is needed to prevent dropdown from closing before click event
      setData([])
      setIndex(0)
    }, 100)
  }

  const handleItemHover = (index: number) => setIndex(index + 1)

  const handleItemSelect = (index: number) => {
    data[index] && onItemSelect?.(data[index])
    setSearch('')
    if (ref.current) ref.current.value = ''
  }

  return (
    <Wrapper {...rest}>
      <Input
        ref={ref}
        placeholder={placeholder}
        role="search"
        type="text"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Dropdown isOpen={Boolean(data.length)}>
        {data?.map((item, i) => (
          <DropdownItem
            isActive={index === i + 1}
            onHover={() => handleItemHover(i)}
            onClick={() => handleItemSelect(i)}
            key={i}
          >
            {highlight ?
              <TextWithSliceHighlight text={item} highlight={search} />
            : item}
          </DropdownItem>
        ))}
      </Dropdown>
    </Wrapper>
  )
}

export default AutoComplete
