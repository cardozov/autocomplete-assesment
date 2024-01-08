import styled from 'styled-components'

const Highlight = styled.mark`
  background-color: rgba(0, 150, 255, 0.3);
`

type TextWithSliceHighlightProps = {
  text: string
  highlight: string
}

const TextWithSliceHighlight = ({
  text,
  highlight,
}: TextWithSliceHighlightProps) => {
  if (!highlight) {
    return <span>{text}</span>
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ?
          <Highlight key={i}>{part}</Highlight>
        : part
      )}
    </span>
  )
}

export default TextWithSliceHighlight
