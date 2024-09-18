import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import WheelPage from '@/components/wheel/WheelPage'
import WinnerDialog from '@/components/wheel/WinnerDialog'

const dispatch = jest.fn()

describe('WinnerDialog', () => {
  it('renders', () => {
    render(<WinnerDialog label="Winner" open={true} dispatch={dispatch} />)
  })
})
