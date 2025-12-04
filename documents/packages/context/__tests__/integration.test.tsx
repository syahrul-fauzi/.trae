import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppProvider, useAppState, useAppActions } from '../src/index'
import { FileService } from '../../files/src/index'

class MemoryAdapter {
  store = new Map<string, ArrayBuffer>()
  async upload(buffer: ArrayBuffer, name: string) {
    const id = `${name}-${Date.now()}`
    this.store.set(id, buffer)
    return { id }
  }
  async download(id: string) { return this.store.get(id)! }
  async getUrl(id: string) { return `https://example.com/${id}` }
}
class CleanScanner { async scan() { return { clean: true } } }

function bufferFromString(s: string) { return new TextEncoder().encode(s).buffer }

function TestUpload() {
  const state = useAppState()
  const actions = useAppActions()
  return (
    <div>
      <div data-testid="count">{state.files.length}</div>
      <button onClick={async () => {
        const file = new File([bufferFromString('hello')], 'hello.txt', { type: 'text/plain' })
        await actions.uploadFile?.(file, { allowedTypes: ['text/plain'], maxSize: 1024 })
      }}>upload</button>
    </div>
  )
}

test('uploads via context and updates state', async () => {
  const fileService = new FileService(new MemoryAdapter() as any, new CleanScanner() as any)
  render(
    <AppProvider services={{ fileService }}>
      <TestUpload />
    </AppProvider>
  )
  expect(screen.getByTestId('count').textContent).toBe('0')
  fireEvent.click(screen.getByText('upload'))
  await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
})
