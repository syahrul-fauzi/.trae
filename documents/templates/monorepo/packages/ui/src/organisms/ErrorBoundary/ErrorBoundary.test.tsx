import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Boom() {
  throw new Error('boom')
}

test('renders fallback on error', () => {
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  )
  expect(screen.getByRole('alert')).toBeInTheDocument()
})
