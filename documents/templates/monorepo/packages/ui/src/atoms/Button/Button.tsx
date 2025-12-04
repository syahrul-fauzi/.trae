import React from 'react'
import PropTypes from 'prop-types'
import { colors, radius, spacing } from '../../shared/tokens'

export type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  const style = {
    backgroundColor: variant === 'primary' ? colors.primary : colors.accent,
    color: colors.text,
    border: 'none',
    borderRadius: radius.sm,
    padding: `${spacing.sm}px ${spacing.md}px`,
    cursor: 'pointer',
  } as const
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
}
