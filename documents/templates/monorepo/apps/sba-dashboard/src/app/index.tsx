import React from 'react'
import { createRoot } from 'react-dom/client'
import { DashboardPage } from '../pages/dashboard'

const root = createRoot(document.getElementById('root')!)
root.render(<DashboardPage />)
