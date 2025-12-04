import React from 'react'
import PropTypes from 'prop-types'

export type CardProps = {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}
