import styled from 'styled-components'

import { MediaRecord } from '@/types'
import { useEffect, useState } from 'react'
import Container from '../theme/Container'

const Poster = styled.img`
  width: 100%;
  max-width: 15rem;
  height: auto;
  border-radius: 0.5rem;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`

const Subtitle = styled.h2`
  font-size: 1rem;
  font-weight: normal;
`

const DetailsContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 1rem;
`

const fetchDetails = async (id: string, apikey: string) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apikey}&i=${id}`
  )
  const data = (await response.json()) as MediaRecord
  const {
    Title,
    Type,
    Year,
    imdbID,
    Poster,
    Director,
    Plot,
    Runtime,
    Genre,
    imdbRating,
  } = data
  return {
    title: Title,
    type: Type,
    year: Year,
    id: imdbID,
    poster: Poster,
    director: Director,
    plot: Plot,
    runtime: Runtime,
    genre: Genre,
    rating: imdbRating,
  } as MediaDetailProps
}

export type MediaDetailProps = {
  id: string
  title: string
  type: string
  year: string
  poster: string
  rating: string
  runtime: string
  genre: string
  plot: string
  director: string
}

const MediaDetail = ({
  item,
  apiKey,
}: {
  item: Partial<MediaDetailProps>
  apiKey: string
}) => {
  const [details, setDetails] = useState<Partial<MediaDetailProps>>(item)
  const {
    id,
    title,
    type,
    year,
    poster,
    rating,
    genre,
    plot,
    runtime,
    director,
  } = details
  useEffect(() => {
    fetchDetails(id!, apiKey).then(setDetails)
  }, [item, apiKey])

  return (
    <DetailsContainer>
      <Poster src={poster} />
      <Details>
        <Title>{title}</Title>
        <Subtitle>{`${runtime} | ${year} | ${rating}`}</Subtitle>
        <Subtitle>{`[${genre}]: ${type} by ${director}`}</Subtitle>
        <p>{plot}</p>
      </Details>
    </DetailsContainer>
  )
}

export default MediaDetail
