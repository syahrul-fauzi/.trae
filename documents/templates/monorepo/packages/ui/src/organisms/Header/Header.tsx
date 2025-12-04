import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../atoms'

export function Header() {
  return (
    <header style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      <strong>SBA</strong>
      <div style={{ marginLeft: 'auto' }}>
        <Button variant="secondary">Login</Button>
      </div>
    </header>
  )
}

Header.propTypes = {}
