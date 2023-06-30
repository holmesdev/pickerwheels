import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import WheelPage from '@/components/wheel/WheelPage'
import OptionCreator from '@/components/wheel/OptionCreator'

describe('OptionCreator', () => {
  it('renders', () => {
    render(<OptionCreator onAdd={() => {}} />)
  })
})
