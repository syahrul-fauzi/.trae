## Audit Arsitektur Saat Ini

* Pemetaan fitur vs domain: `Header` dan `Sidebar` berada di `src/components`, belum dipisah per bounded context fitur; `Home` di `src/pages/Home.tsx:5` berperan sebagai halaman dashboard.

* Layering: Logika UI terpusat di komponen, state cross-cutting ada di `src/stores/theme.ts:1` dan `src/stores/responsive.ts:1`; belum ada pemisahan aplikasi/domain/infrastruktur.

* Coupling/cohesion: Impor langsung ke `@sba/ui` baik (agregasi antarmuka), namun komponen fitur tidak punya batas API sendiri sehingga coupling ke UI library cukup tinggi.

## Keselarasan dengan Dokumen Desain

* Target struktur (ReFactory-Header-Sidebar-App.md:92–159) mengarah ke FSD dengan DDD: `features/<bounded-context>`, `entities/`, `shared/`, `app/providers`, `pages/*.page.tsx`.

* Alur data: Theme provider global, navigasi melalui router, monitoring via AG-UI; saat ini alur tersebut ada namun belum dipisahkan per layer.

* Business rules: Theme toggling, responsive collapse, dan monitoring start/stop sudah ada; perlu dipromosikan ke domain services supaya tidak bocor ke UI.

## Perubahan Arsitektur (FSD/DDD Hybrid)

* Bounded contexts awal:

  * `header` (navigasi top, theme toggle trigger)

  * `sidebar` (navigasi utama + collapse)

  * `monitoring` (AG-UI monitoring dashboard integrasi)

  * `navigation` (model dan layanan rute/akses)

  * `theme` (konfigurasi tema global)

* Layering:

  * Presentation: `features/*/ui`, `pages/*.page.tsx`

  * Application: `features/*/services`, orkestrasi use case

  * Domain: `entities`, `value-objects`, `aggregates`, `domain-services`

  * Infrastructure: adaptors API/LocalStorage di `shared/api` dan repositori

## Rencana Refactor Berurutan

1. Struktur direktori FSD

   * Pindahkan `src/components/Header.tsx:43` ke `src/features/header/ui/Header.tsx` dan buat `src/features/header/model/header.store.ts` (+ `index.ts` ekspor publik).

   * Pindahkan `src/components/Sidebar.tsx:20` ke `src/features/sidebar/ui/Sidebar.tsx` dan buat `src/features/sidebar/model/sidebar.store.ts` (+ `index.ts`).

   * Ganti `src/pages/Home.tsx:5` menjadi `src/pages/home.page.tsx` dengan ekspor `meta` sesuai dokumen.
2. App & Providers

   * Buat `src/app/bootstrap.tsx` dan `src/app/providers/ThemeProvider.tsx` (membungkus `@sba/ui` ThemeProvider untuk domain `theme`).

   * Tambahkan `AgentProvider` stub (sesuai dokumen) untuk kompatibilitas AG-UI.
3. Domain Modeling (DDD)

   * `src/entities/navigation/NavigationItem.vo.ts` (value object) dan `Menu.aggregate.ts` untuk agregasi menu.

   * `src/entities/theme/Theme.vo.ts` (value object), `ThemePolicy.domain-service.ts` untuk aturan perubahan.

   * `src/entities/monitoring/SystemState.entity.ts` dan `MonitoringService.domain-service.ts` sebagai antarmuka ke AG-UI (start/stop/reset sebagai use case aplikasi).
4. Application Services

   * `src/features/navigation/services/navigation.service.ts`: mapping antarmuka ke router, guards sederhana.

   * `src/features/header/services/header.service.ts`: delegasi toggle tema ke domain `ThemePolicy`.

   * `src/features/sidebar/services/sidebar.service.ts`: kontrol collapse/expand sesuai breakpoint.
5. Infrastructure & Repositories

   * `src/shared/api/http.ts`: klien dasar (placeholder) dan kontrak.

   * `src/features/*/services/*.repository.ts`: stub repos domain bila diperlukan.
6. Routing

   * Tambahkan `src/app/routes.generated.tsx` (generator script di `src/tools/route-generator.ts`) untuk membuat routing dari `pages/*.page.tsx`.

   * Ubah `src/App.tsx:1` menjadi menggunakan `routes.generated.tsx` dan `AppProviders`.
7. Impor & Path

   * Konsolidasikan impor UI melalui `@sba/ui` untuk menjaga kompatibilitas dan mengurangi alias spesifik.

   * Pastikan `tsconfig.json` tetap sinkron dengan struktur baru (paths untuk `@/*`).

## Dokumentasi (README.md)

* Tambah diagram arsitektur (Mermaid) yang menggambarkan layering dan bounded contexts.

* Catat keputusan desain: pemisahan fitur, domain-first untuk theme/navigation/monitoring, konsolidasi impor UI.

* Jelaskan konvensi: suffix file (`*.page.tsx`, `model/*.store.ts`, `services/*.service.ts`), penamaan kebab-case/PascalCase, ekspor `index.ts`.

## Area Kritis & Perkuatan

* Kompleksitas: Monitoring (AG-UI) → bungkus dalam domain service agar UI tidak memegang state/aturan.

* Ketergantungan: Komponen sangat tergantung `@sba/ui`; mitigasi dengan adapters/ports (application layer) guna menjaga kontrak.

* SOLID: Pisahkan SRP untuk stores (header/sidebar), hindari logika bisnis di komponen; gunakan interface untuk repos.

## Konsistensi DDD

* Bounded contexts jelas: `header`, `sidebar`, `navigation`, `theme`, `monitoring`.

* Entities/value objects/aggregates: navigasi sebagai VO/Aggregate; theme sebagai VO + policy; monitoring sebagai Entity + service.

* Domain services & repositories: letakkan aturan bisnis di domain services; gunakan repos untuk persistence (nanti).

## Pemisahan Layer Tegas

* One-way data flow: UI → Application Service → Domain → Infrastructure.

* Tidak ada logika bisnis di UI: UI hanya konsumsi state/commands dari services.

* Isolasi infra: HTTP/LocalStorage di `shared/api` dan repos khusus, tidak dipakai langsung di domain.

## Dokumentasi Teknis Tambahan

* Alur data komponen utama (Header/Sidebar/Home) dalam diagram sequence.

* Dependensi kritis: `@sba/ui` dan router; definisikan ports (interfaces) di application layer.

* Kontrak interface: tipe untuk `NavigationItem`, `ThemePolicy`, `MonitoringService` sebagai public API feature.

## Testing Strategy

* Pyramid:

  * Unit: value objects, domain services, stores (Vitest).

  * Integration: boundary antar layer (UI ↔ services), verifikasi routing & monitoring.

  * Contract: antarmuka repos/services kritis (mock adapters).

* Tambah test integrasi untuk `pages/home.page.tsx` memastikan fungsi sorting/pagination/monitoring tetap lolos.

## Kriteria Penerimaan

* App tetap build, preview, dan semua test lolos.

* Struktur baru FSD/DDD terbentuk tanpa mematahkan fungsionalitas.

* README mencerminkan arsitektur final dan keputusan desain.

* Coupling menurun (UI tidak menyimpan aturan bisnis), cohesion meningkat per bounded context.

## Langkah Eksekusi Tahap Pertama (Setelah Persetujuan)

1. Buat kerangka folder FSD dan pindahkan Header/Sidebar/Home sesuai rencana.
2. Tambahkan providers (`ThemeProvider`, `AgentProvider`) dan route generator.
3. Implementasikan value objects + domain services untuk `theme` dan `navigation`.
4. Sesuaikan impor ke entry utama `@sba/ui` dan perbarui path.
5. Tulis unit/integration tests untuk domain/services dan halaman.
6. Perbarui README dengan diagram arsitektur dan keputusan desain.

