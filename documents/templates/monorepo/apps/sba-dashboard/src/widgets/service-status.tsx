import React from 'react'

export function ServiceStatusWidget() {
  const items = [
    { name: 'API Gateway', status: 'ok' },
    { name: 'Auth Service', status: 'ok' },
    { name: 'Users Service', status: 'ok' },
  ]
  return (
    <section>
      <h2>Service Status</h2>
      <ul>
        {items.map((it) => (
          <li key={it.name}>{it.name}: {it.status}</li>
        ))}
      </ul>
    </section>
  )
}
