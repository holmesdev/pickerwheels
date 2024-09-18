import type { Meta, StoryObj } from '@storybook/react'

import Footer from './Footer'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Footer> = {
  title: 'Picker Wheels/Footer',
  component: Footer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {}
