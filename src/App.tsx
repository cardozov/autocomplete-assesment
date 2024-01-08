import AutoComplete from './components/AutoComplete'
import Container from './components/theme/Container'
import Title from './components/theme/Title'

const fetchData = async (search: string) =>
  Array.from({ length: 10 }).map((_, i) => `${search}-${i}`)

const App = () => (
  <Container>
    <Title>Take Home Assessment: AutoComplete</Title>
    <AutoComplete style={{ width: 500 }} fetchData={fetchData} />
  </Container>
)

export default App
