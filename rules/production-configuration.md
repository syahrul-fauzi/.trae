# Production Configuration

Panduan konfigurasi untuk lingkungan produksi SBA-Agentic.

## 1. Environment Variables
- **LLM_MODEL**: `gpt-4-turbo` atau `claude-3-opus`.
- **API_BASE_URL**: URL endpoint produksi.
- **REDIS_URL**: Endpoint Redis cluster (Upstash).
- **SUPABASE_URL** & **SERVICE_ROLE_KEY**.

## 2. Resource Allocation
- **API Server**: 2 vCPU, 4GB RAM (Min 2 instances).
- **Worker Node**: 4 vCPU, 8GB RAM (Autoscale based on Queue depth).

## 3. Scaling Strategy
- Gunakan Horizontal Pod Autoscaler (HPA) berdasarkan metrik CPU dan memori.
- Skalakan worker secara agresif jika antrean `rule-execution` menumpuk > 1000 pesan.

---
*Dilarang menyimpan secret dalam file repositori.*
