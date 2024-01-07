import { FC, useState } from 'react'

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
      <div>
        <ul>
          {data.map((item, index) => (
            <li style={{ top: index * 40 }} key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AutoComplete
