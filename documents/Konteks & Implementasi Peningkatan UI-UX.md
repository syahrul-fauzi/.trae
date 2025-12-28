# 📘 Konteks & Implementasi Peningkatan UI/UX

## Smart Business Assistant (SBA) — apps/app

---

## 1. Analisis Konteks

### 1.1 Deskripsi Sistem yang Ditingkatkan

**apps/app** adalah:

* **Host UI utama SBA**
* Single interface untuk:

  * Admin
  * Workspace & Tenant
  * Agent Management
  * Run & Workflow
  * Analytics & Observability

Karakter sistem:

* **Multi-tenant**
* **Real-time (SSE / WS)**
* **AI agent–centric**
* **Enterprise-grade (RBAC, audit, observability)**

Secara UX, aplikasi ini **bukan CRUD dashboard biasa**, tetapi:

> *Control plane untuk AI-driven business operations*

---

### 1.2 Masalah UI/UX Saat Ini (Umum pada Sistem Sejenis & Indikasi Repo)

Berdasarkan konteks SBA dan struktur Anda, potensi masalah yang **harus diasumsikan dan diantisipasi**:

#### A. Cognitive Overload

* Banyak domain (Agents, Runs, Analytics, Admin)
* Informasi teknis (logs, reasoning, metrics)
* User non-teknis mudah bingung

#### B. Navigasi Kurang Kontekstual

* Workspace / tenant context tidak selalu “terasa”
* Perpindahan domain terasa seperti pindah aplikasi

#### C. Feedback Sistem Kurang Eksplisit

* Status agent/run tidak selalu jelas
* Error AI sering abstrak
* Loading state ambigu

#### D. UX AI Kurang Explainable (Risiko Tinggi)

* User tidak paham “AI sedang apa”
* Reasoning terlalu teknis atau terlalu tersembunyi

---

### 1.3 Tujuan Spesifik Peningkatan

**Tujuan UX utama SBA:**

1. **Clarity before power**
   → Sistem kompleks, UI harus terasa sederhana

2. **Explainable AI Experience**
   → User selalu tahu:

   * apa yang sedang terjadi
   * kenapa terjadi
   * apa yang bisa dilakukan

3. **Context-Preserving Navigation**
   → Tidak ada “tersesat” antar domain

4. **Enterprise-Grade Trust**
   → Sistem terasa:

   * stabil
   * aman
   * terobservasi

---

## 2. Perancangan UI/UX

### 2.1 Prinsip Desain Inti (UX Foundation)

Gunakan **5 UX pillars** berikut sebagai aturan global:

1. **Hierarchy over density**
2. **Progressive disclosure**
3. **State is visible**
4. **Action has feedback**
5. **Context is persistent**

---

### 2.2 Struktur UI Global (Layout Strategy)

```
┌──────────────────────────────────────┐
│ Top Bar                              │
│ - Workspace Switcher                 │
│ - Global Search                      │
│ - Notifications / System Status     │
└──────────────────────────────────────┘
│ Sidebar (Domain-aware) │ Main View  │
│ - Dashboard            │            │
│ - Agents               │            │
│ - Runs / Workflows     │            │
│ - Analytics            │            │
│ - Admin                │            │
└──────────────────────────────────────┘
│ Footer (Optional, Status / Build)    │
└──────────────────────────────────────┘
```

**Peningkatan penting:**

* Sidebar **berubah konten sesuai domain**
* Workspace & tenant **selalu terlihat**
* Status sistem **selalu accessible**

---

### 2.3 Wireframe Konseptual (Deskriptif)

#### A. Dashboard

* Ringkasan:

  * Active agents
  * Running workflows
  * Alerts
* CTA jelas: “Run Agent”, “Create Agent”

#### B. Agent Management

* List → Detail → Conversation
* Reasoning panel **collapsible**
* Run status sticky header

#### C. Run / Workflow View

* Timeline-based log
* Status badge (Running, Failed, Completed)
* Retry / Cancel jelas

---

### 2.4 Navigasi & User Flow

**Before:**

> User klik → pindah halaman → kehilangan konteks

**After:**

> User berpindah domain → konteks workspace + state tetap

Contoh:

* Dari Agent → langsung ke Run detail
* Dari Analytics → klik anomaly → masuk ke Agent terkait

---

## 3. Implementasi Fungsional

### 3.1 Fitur UX Baru (High Impact)

#### 1. Global Context Bar

* Workspace
* Role
* System health

#### 2. Unified Status System

* Loading
* Running
* Error
* Partial success

➡️ Semua komponen **wajib pakai status primitives yang sama**

---

### 3.2 AI Interaction Enhancement

* Streaming reasoning dengan:

  * Highlight step
  * Collapsible detail
* Interrupt / Pause button
* “Why this answer?” affordance

---

### 3.3 Performa UI

Implementasi teknis:

* Skeleton loading (bukan spinner)
* Optimistic UI untuk action cepat
* Virtualized list (agents, logs)
* Memoization & fine-grained state

---

### 3.4 Micro-interactions

Contoh:

* Hover state informatif
* Subtle motion saat status berubah
* Toast yang meaningful (bukan spam)

---

## 4. Pengujian UI/UX

### 4.1 Usability Testing

**Metode:**

* Task-based testing
* 5–7 user / persona
* Fokus:

  * onboarding
  * agent run
  * error recovery

**Metric:**

* Task completion time
* Error rate
* Confidence score

---

### 4.2 A/B Testing

Contoh eksperimen:

* Sidebar static vs domain-aware
* Reasoning expanded vs collapsed
* CTA wording

---

### 4.3 UX Metrics

| Metric                       | Target |
| ---------------------------- | ------ |
| Time to First Value          | ↓      |
| Error recovery success       | ↑      |
| Agent run success perception | ↑      |
| Navigation depth             | ↓      |

---

## 5. Dokumentasi

### 5.1 UI Style Guide

Isi minimum:

* Color system (semantic colors)
* Typography scale
* Spacing & layout grid
* Component states
* Accessibility rules

➡️ Diselaraskan dengan `packages/ui`

---

### 5.2 Spesifikasi Teknis

Untuk tiap komponen:

* Props
* State model
* Error states
* Performance notes

---

### 5.3 Implementasi di Repo (Update)

Ringkasan implementasi yang sudah ditanamkan di repo (apps/app):

* **Internationalization (i18n) aktif secara global**:
  * Provider i18n dipasang di root `Providers` agar hook `useI18n/useScopedI18n` bisa dipakai lintas komponen.
  * Implementasi: `apps/app/src/app/providers.tsx:1` (wrap `children` dengan `I18nProviderClient`).
* **Sidebar lebih aksesibel & konsisten**:
  * Menambah ARIA untuk navigasi, region quick actions, tombol expand/collapse submenu, dan tooltip saat collapsed.
  * Menambah dukungan `prefers-reduced-motion` pada transisi untuk mengurangi motion bagi user sensitif.
  * Implementasi: `apps/app/src/components/sidebar/Sidebar.tsx:1`.
* **WorkspaceSwitcher terhubung i18n**:
  * Label dan teks UI mengambil string dari `workspace.switcher.*`.
  * Implementasi: `apps/app/src/components/sidebar/WorkspaceSwitcher.tsx:1`.
* **Storybook konsisten dengan runtime app**:
  * Provider i18n dipasang di Storybook agar komponen yang memakai `useScopedI18n` tidak error saat preview.
  * Implementasi: `apps/app/.storybook/preview.ts:1`.
* **Verifikasi**:
  * `pnpm --filter @sba/app lint` (0 errors, warnings ada).
  * `pnpm --filter @sba/app type-check` (lulus).
  * `pnpm --filter @sba/app test:unit` (lulus).
  * `pnpm --filter @sba/app test:e2e:smoke` (lulus).

---

### 5.4 Laporan Hasil

* Before vs After UX metrics
* Temuan usability
* Keputusan desain
* Rencana iterasi berikutnya

---

## 6. Ringkasan Nilai Bisnis

Peningkatan UI/UX ini menghasilkan:

* ✅ Onboarding lebih cepat
* ✅ Kepercayaan user ke AI meningkat
* ✅ Beban support menurun
* ✅ Produk terasa **enterprise & premium**
* ✅ apps/app menjadi **single source of truth experience**

---

## 7. Next Action (Opsional)

Saya bisa lanjutkan ke:

1. **UX Architecture Diagram (UI layer → feature → domain)**
2. **Component-level UX spec (per halaman)**
3. **Mapping UX → Product OKR**
4. **Design tokens + UI contract**

Tinggal bilang:
**“lanjutkan ke …”**
