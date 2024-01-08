import { FC, useState } from 'react'
import styled from 'styled-components'
import { Dropdown, DropdownItem } from '../Dropdown'
import Input from '../theme/Input'

const AutoCompleteInput = styled(Input)`
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type AutoCompleteProps = {
  fetchData: (search: string) => Promise<string[]>
} & React.HTMLAttributes<HTMLDivElement>

const AutoComplete: FC<AutoCompleteProps> = ({ fetchData, ...rest }) => {
  const [data, setData] = useState<string[]>([])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setData([])
      return
    }

    const result = await fetchData(value)
    setData(result)
  }

  return (
    <Wrapper {...rest}>
      <AutoCompleteInput role="search" type="text" onChange={handleChange} />
      <Dropdown isOpen={Boolean(data.length)}>
        {data.map((item, index) => (
          <DropdownItem style={{ top: index * 40 }} key={index}>
            {item}
          </DropdownItem>
        ))}
      </Dropdown>
    </Wrapper>
  )
}

export default AutoComplete
