import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Dropdown, DropdownItem } from '../Dropdown'
import TextWithSliceHighlight from '../TextWithSliceHighlight'
import Input from '../theme/Input'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

type AutoCompleteProps = {
  fetchData: (search: string) => Promise<string[]>
  highlight?: boolean
  debounceTime?: number
  placeholder?: string
} & React.HTMLAttributes<HTMLDivElement>

const AutoComplete: FC<AutoCompleteProps> = ({
  fetchData,
  debounceTime = 0,
  highlight = false,
  placeholder,
  ...rest
}) => {
  const [search, setSearch] = useState('')
  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    if (!search) return
    if (debounceTime === 0) {
      fetchData(search).then(setData)
      return () => setData([])
    }
    const timeout = setTimeout(
      () => fetchData(search).then(setData),
      debounceTime
    )
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

  return (
    <Wrapper {...rest}>
      <Input
        placeholder={placeholder}
        role="search"
        type="text"
        onChange={handleChange}
      />
      <Dropdown isOpen={Boolean(data.length)}>
        {data.map((item, index) => (
          <DropdownItem style={{ top: index * 40 }} key={index}>
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
