import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

test('renders metrics and search controls', () => {
  render(<DashboardPage />)
  expect(screen.getByText(/Metrics here.../i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument()
  expect(screen.getByText(/Search/i)).toBeInTheDocument()
})
