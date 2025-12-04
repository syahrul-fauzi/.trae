# Context Package — Global State & Actions (React Context)

## Tujuan
- Menyediakan manajemen state global berbasis React Context API dengan provider komprehensif, action handlers, hooks, error boundary, dan tipe TypeScript.

## Fitur Utama
- Provider global dengan state, actions, dan integrasi layanan.
- Custom hooks: `useAppContext`, `useAppState`, `useAppActions`.
- Error boundary dengan fallback UI.
- Type definitions untuk state, actions, payloads.
- Integrasi FileService: upload/download/preview, sinkronisasi metadata ke state.

## Instalasi
- Tambahkan sebagai dependency lokal, atau impor langsung dari sumber paket.

## Penggunaan Dasar
```
import { AppProvider, useAppState, useAppActions } from './src'

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}

function Dashboard() {
  const state = useAppState()
  const actions = useAppActions()
  return (
    <button onClick={() => actions.selectFile('file_1')}>Select</button>
  )
}
```

## API Reference
- `AppProvider` props: `children`, opsional `services`.
- `useAppContext`: akses penuh ke `{ state, actions }`.
- `useAppState`: hanya state.
- `useAppActions`: hanya actions.
- `ErrorBoundary`: pembungkus UI dengan props `fallback`.
- Actions terintegrasi: `uploadFile(file, options)`, `downloadFile(id)`, `getPreviewUrl(id)`.

## Best Practices
- Simpan state domain inti di context, hindari data besar.
- Delegasikan operasi IO ke services, expose via actions.
- Gunakan tipe ketat dan pemisahan lapisan UI/logic.
- Hindari kebocoran memori; batalkan operasi async saat unmount.

## Testing
- Unit: validasi reducer, hooks, dan error boundary.
- Integration: alur actions yang memanggil services.
- Coverage target: ≥85%.
- Gunakan environment `jsdom` untuk test React.
