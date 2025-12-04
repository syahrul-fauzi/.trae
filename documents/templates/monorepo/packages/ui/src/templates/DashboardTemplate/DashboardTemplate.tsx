import React from 'react'
import PropTypes from 'prop-types'
import { Header } from '../../organisms'
import { Card } from '../../molecules'

export function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div style={{ padding: 24 }}>
        <Card title="Overview">
          {children}
        </Card>
      </div>
    </div>
  )
}

DashboardTemplate.propTypes = {
  children: PropTypes.node,
}
