import type { Meta, StoryObj } from '@storybook/react'

import Home from './page'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Home> = {
  title: 'Picker Wheels/Home',
  component: Home,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Home>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const HomePage: Story = {}
