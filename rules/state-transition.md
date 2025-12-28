# State Transition & Workflow

Dokumen ini mendefinisikan transisi status (state) untuk berbagai entitas dalam sistem SBA-Agentic.

## 1. Approval State Transition
| Current State | Event | Next State | Condition |
| --- | --- | --- | --- |
| `PENDING` | `approval.approved` | `APPROVED` | All levels approved |
| `PENDING` | `approval.rejected` | `REJECTED` | Any level rejected |
| `PENDING` | `task.timeout` | `ESCALATED` | Duration > threshold |
| `ESCALATED` | `manager.approved` | `APPROVED` | Manager override |

## 2. Rule Execution State
- `EVALUATING`: Mengecek trigger dan conditions.
- `QUEUED`: Aksi dimasukkan ke antrean BullMQ.
- `EXECUTING`: Worker sedang menjalankan langkah aksi.
- `SUCCESS`: Seluruh langkah aksi selesai tanpa error.
- `FAILED`: Terjadi kesalahan pada salah satu langkah aksi.

## 3. Agent Reasoning State
`ANALYSIS` -> `PLANNING` -> `VALIDATION` -> `EXECUTION` -> `REFLECTION`

---
*Pastikan setiap transisi status dicatat dalam trace observability.*
