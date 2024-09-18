import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import WheelPage from '@/components/wheel/WheelPage'

jest.mock('next/navigation', () => ({
  useRouter() {
    return { refresh: () => {} }
  },
}))

describe('Wheel page', () => {
  it('renders with no wheel data', () => {
    render(<WheelPage wheelData={null} />)
  })
})
