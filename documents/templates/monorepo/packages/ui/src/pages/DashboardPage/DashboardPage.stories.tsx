import type { Meta, StoryObj } from '@storybook/react'
import { DashboardPage } from './DashboardPage'
import { ErrorBoundary } from '../../organisms'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
}

export default meta
type Story = StoryObj<typeof DashboardPage>

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <DashboardPage />
    </ErrorBoundary>
  ),
}
