import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

test('renders input and handles change', () => {
  const handle = jest.fn()
  render(<Input placeholder="Type here..." onChange={handle} />)
  const el = screen.getByPlaceholderText('Type here...') as HTMLInputElement
  fireEvent.change(el, { target: { value: 'abc' } })
  expect(handle).toHaveBeenCalledWith('abc')
})
