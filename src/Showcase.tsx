import { useState } from 'react'
import styled from 'styled-components'
import AutoComplete from './components/AutoComplete'
import MediaDetail, { MediaDetailProps } from './components/SelectedMedia'
import Container from './components/theme/Container'
import Input from './components/theme/Input'
import Title from './components/theme/Title'
import { MediaRecord } from './types'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 1rem;
`

const FormFirstRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`

const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Disclaimer = styled.p`
  color: #777;
  font-size: 0.9rem;
  text-align: start;
`

const APIKeyInput = styled(Input)`
  width: 100%;
  max-width: 10rem;
`

const getMoviesByName = async (search: string, apiKey: string) => {
  if (apiKey.length !== 8) return []

  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&s=${search}`
  )
  const result = (await response.json()) as {
    Search?: MediaRecord[]
    Error?: string
  }
  if (result.Error) return []

  return result.Search?.map(({ Title, Type, Year, imdbID, Poster }) => ({
    title: Title,
    type: Type,
    year: Year,
    id: imdbID,
    poster: Poster,
  })) as MediaDetailProps[]
}

const Showcase = () => {
  const [apiKey, setApiKey] = useState('')
  const [list, setList] = useState<MediaDetailProps[]>([])
  const [selected, setSelected] = useState<MediaDetailProps>()

  const fetchData = async (search: string) => {
    const results = await getMoviesByName(search, apiKey)
    setSelected(undefined)
    setList(results)
    return results.map(({ title }) => title)
  }

  const handleSelect = (title: string) => {
    setSelected(list.find((item) => item.title === title))
  }

  return (
    <Container>
      <Title>Take Home Assessment: AutoComplete</Title>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormFirstRow>
          <APIKeyInput
            placeholder="Fill your API key..."
            type="text"
            onChange={(e) => setApiKey(e.target.value)}
          />
          <DisclaimerContainer>
            <Disclaimer>
              This app is based on{' '}
              <a href="https://www.omdbapi.com/">OMDb API</a>
            </Disclaimer>
            <Disclaimer>
              API key is required to use this app and you can request yours{' '}
              <a href="https://www.omdbapi.com/apikey.aspx">here</a>
            </Disclaimer>
          </DisclaimerContainer>
        </FormFirstRow>
        <AutoComplete
          highlight
          placeholder="Search for a movie..."
          debounceTime={300}
          fetchData={fetchData}
          onItemSelect={handleSelect}
        />
      </Form>
      {selected && <MediaDetail item={selected} apiKey={apiKey} />}
    </Container>
  )
}

export default Showcase
