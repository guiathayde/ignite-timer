import { ThemeProvider } from 'styled-components'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

import { Button } from './components/Button'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <Button variant="primary">Click me!</Button>
      <Button variant="secondary">Click me!</Button>
      <Button variant="danger">Click me!</Button>
      <Button variant="success">Click me!</Button>
      <Button>Click me!</Button>
    </ThemeProvider>
  )
}
