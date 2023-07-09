import { act, render } from '@testing-library/react'
import OptionCreator from '@/components/wheel/OptionCreator'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

const onAdd = jest.fn()

describe('OptionCreator', () => {
  it('renders', async () => {
    render(<OptionCreator />)
  })

  it('submits the new label', async () => {
    const user = userEvent.setup()
    const page = await render(<OptionCreator onAdd={onAdd} />)
    await act(async () => {
      await user.type(page.getByRole('textbox'), 'test')
      await user.click(page.getByRole('button'))
    })
    expect(onAdd).toHaveBeenCalledWith('test')
  })
})
