import { render } from '@testing-library/react'
import { unitTestSuite } from '@tests/customResources'
import { describe } from 'vitest'
import TextWithSliceHighlight from '.'

describe('TextWithSliceHighlight', () => {
  unitTestSuite(() => {
    it('should render the component', () => {
      const { queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="ex" />
      )
      expect(queryByText('text')).toBeNull()
      expect(queryByText('ex', { selector: 'mark' })).not.toBeNull()
    })

    it('should highligh at the beginning', () => {
      const { queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="te" />
      )
      expect(queryByText('te')).not.toBeNull()
    })

    it('should highligh at the middle', () => {
      const { queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="ex" />
      )
      expect(queryByText('ex')).not.toBeNull()
    })

    it('should highligh at the end', () => {
      const { queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="xt" />
      )
      expect(queryByText('xt')).not.toBeNull()
    })

    it('should highligh full text', () => {
      const { getByText } = render(
        <TextWithSliceHighlight text="text" highlight="text" />
      )
      expect(getByText('text')).not.toBeNull()
    })

    it('should highligh multiple times', () => {
      const { queryAllByText } = render(
        <TextWithSliceHighlight text="text" highlight="t" />
      )
      expect(queryAllByText('t')).toHaveLength(2)
    })

    it('should not highligh if highlight is not found', () => {
      const { queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="not found" />
      )
      expect(queryByText('not found')).toBeNull()
    })

    it('should not highligh if highlight is blank', () => {
      const { container, queryByText } = render(
        <TextWithSliceHighlight text="text" highlight="" />
      )
      expect(queryByText('text')).not.toBeNull()
      expect(container.querySelector('mark')).toBeNull()
    })

    it('should highligh case insensitive', () => {
      const { getByText } = render(
        <TextWithSliceHighlight text="text" highlight="TE" />
      )
      expect(getByText('te')).not.toBeNull()
    })

    it('should highligh multiple times case insensitive', () => {
      const { container } = render(
        <TextWithSliceHighlight text="text TEXT TeXt" highlight="te" />
      )
      expect(container.querySelectorAll('mark')).toHaveLength(3)
    })

    it('should highligh full text case insensitive', () => {
      const { getByText } = render(
        <TextWithSliceHighlight text="text" highlight="TeXt" />
      )
      expect(getByText('text')).not.toBeNull()
    })
  })
})
