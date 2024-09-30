import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import OptionsEditor from '@/components/wheel/OptionsEditor'

describe('OptionsEditor', () => {
  it('renders the correct number of options', () => {
    render(
      <OptionsEditor
        options={[
          { id: 1, label: 'test', enabled: true },
          { id: 2, label: 'other', enabled: true },
        ]}
        dispatch={jest.fn()}
      />,
    )

    // 1 input for new, 2 inputs for existing
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
  })
})
