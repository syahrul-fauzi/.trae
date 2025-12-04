import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <div role="alert">Terjadi kesalahan pada komponen.</div>
    }
    return this.props.children
  }
}
