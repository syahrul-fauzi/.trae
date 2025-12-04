import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './dashboard'

test('renders dashboard page via @sba/ui', () => {
  render(<DashboardPage />)
  expect(screen.getByText(/Metrics here.../i)).toBeInTheDocument()
})
