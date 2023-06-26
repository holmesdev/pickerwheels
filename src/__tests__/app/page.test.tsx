import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

describe('Home page', () => {
  it('renders', () => {
    render(<Home />)
  })
})
