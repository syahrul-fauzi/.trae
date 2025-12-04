export interface ServiceStatus {
  name: string
  status: 'ok' | 'degraded' | 'down'
}
