import { useState } from 'react'
import styled from 'styled-components'
import AutoComplete from './components/AutoComplete'
import Container from './components/theme/Container'
import Input from './components/theme/Input'
import Title from './components/theme/Title'

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

type MediaRecord = {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
}

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

  return result.Search?.map(({ Title }) => Title) ?? []
}

const Showcase = () => {
  const [apiKey, setApiKey] = useState('')
  return (
    <Container>
      <Title>Take Home Assessment: AutoComplete</Title>
      <Form>
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
          debounceTime={1000}
          fetchData={(data) => getMoviesByName(data, apiKey)}
        />
      </Form>
    </Container>
  )
}

export default Showcase
