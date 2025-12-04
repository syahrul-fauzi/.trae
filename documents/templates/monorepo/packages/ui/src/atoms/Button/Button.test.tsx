import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

test('renders button and handles click', () => {
  const onClick = jest.fn()
  render(<Button onClick={onClick}>Hello</Button>)
  const el = screen.getByText('Hello')
  fireEvent.click(el)
  expect(onClick).toHaveBeenCalled()
})
