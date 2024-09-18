import type { Meta, StoryObj } from '@storybook/react'

import WinnerDialog from './WinnerDialog'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof WinnerDialog> = {
  title: 'Picker Wheels/Winner Dialog',
  component: WinnerDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof WinnerDialog>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {}
