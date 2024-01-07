import { FC, useState } from 'react'
import { Dropdown, DropdownItem } from '../Dropdown'

interface AutoCompleteProps {
  fetchData: (search: string) => Promise<string[]>
}

const AutoComplete: FC<AutoCompleteProps> = ({ fetchData }) => {
  const [data, setData] = useState<string[]>([])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setData([])
      return
    }

    const result = await fetchData(e.target.value)
    setData(result)
  }

  return (
    <div>
      <input role="search" type="text" onChange={handleChange} />
      <Dropdown isOpen={Boolean(data.length)}>
        {data.map((item, index) => (
          <DropdownItem style={{ top: index * 40 }} key={index}>
            {item}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  )
}

export default AutoComplete
