import OptionEditor from '@/components/wheel/OptionEditor'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('OptionEditor', () => {
  it('renders inputs correctly', () => {
    render(<OptionEditor option={{ id: 1, label: 'test', enabled: true }} />)

    expect(screen.getByRole('textbox')).toHaveValue('test')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders disabled options correctly', () => {
    render(<OptionEditor option={{ id: 1, label: 'test', enabled: false }} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})
