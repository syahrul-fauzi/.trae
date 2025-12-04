Gap Analysis — Legacy vs Sistem Baru

Tujuan
- Mengidentifikasi fungsi yang dipertahankan, dimodifikasi, dan yang baru

Tabel Ringkas
- Legacy: Multi-tenant konsep; Baru: RLS eksplisit di semua lapisan; Status: Dimodifikasi; Risiko: kebocoran data; Rekomendasi: policy test dan contract test
- Legacy: Chat dan context; Baru: session thread; tools calling; Status: Dimodifikasi; Risiko: state inconsistency; Rekomendasi: event sourcing ringkas
- Legacy: Workflow dokumen; Baru: builder node-based; Status: Baru; Risiko: kompleksitas UI; Rekomendasi: progressive disclosure dan autosave
- Legacy: CI contoh; Baru: pipeline end-to-end; Status: Dimodifikasi; Risiko: flaky tests; Rekomendasi: stabilisasi Vitest; isolation
- Legacy: API spesifikasi; Baru: adapter integrasi; Status: Dipertahankan; Risiko: versi; Rekomendasi: semver kontrak
- Legacy: A11y pedoman; Baru: AA checklist terukur; Status: Dipertahankan; Risiko: regressi; Rekomendasi: linters dan e2e a11y

Rangkuman Rekomendasi
- Perkuat RLS dan audit
- Standarisasi observability dan error model
- Refactor UI Workflow Builder dengan fokus aksesibilitas
- Kontrak API versi dan backward compatibility
- CI/CD dengan matriks test dan smoke gate

