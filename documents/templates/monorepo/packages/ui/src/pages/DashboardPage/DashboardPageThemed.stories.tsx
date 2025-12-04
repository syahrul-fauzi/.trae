import type { Meta, StoryObj } from '@storybook/react'
import { DashboardPage } from './DashboardPage'
import { ThemeProvider } from '../../shared'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage/Themed',
  component: DashboardPage,
}

export default meta
type Story = StoryObj<typeof DashboardPage>

export const BrandAlt: Story = {
  render: () => (
    <ThemeProvider tokens={{
      colors: { primary: '#6AA6FF', accent: '#52C41A', border: '#e5e7eb', text: '#ffffff' },
      radius: { sm: 6, md: 8 },
      spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 }
    }}>
      <DashboardPage />
    </ThemeProvider>
  ),
}
