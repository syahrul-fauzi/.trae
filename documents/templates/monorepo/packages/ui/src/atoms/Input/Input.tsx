import React from 'react'
import PropTypes from 'prop-types'
import { colors, radius, spacing } from '../../shared/tokens'

export type InputProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
}

export function Input({ value = '', placeholder, onChange }: InputProps) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      style={{ padding: `${spacing.sm}px ${spacing.md}px`, border: `1px solid ${colors.border}`, borderRadius: radius.sm }}
    />
  )
}

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}
