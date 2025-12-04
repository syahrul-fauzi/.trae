import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Click Me', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Login', variant: 'secondary' },
}
