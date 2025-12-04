import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DashboardTemplate } from '../../templates'
import { Input, Button } from '../../atoms'
import { ThemeProvider } from '../../shared/theme'

export function DashboardPage() {
  const [query, setQuery] = useState('')
  return (
    <ThemeProvider>
      <DashboardTemplate>
        <div>Metrics here...</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Input value={query} onChange={setQuery} placeholder="Search..." />
          <Button variant="primary">Search</Button>
        </div>
      </DashboardTemplate>
    </ThemeProvider>
  )
}

DashboardPage.propTypes = {}
