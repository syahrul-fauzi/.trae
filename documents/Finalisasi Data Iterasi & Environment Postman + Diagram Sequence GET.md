## Artefak Baru
- Tambahkan file iterasi: `workspace/05_API/load_runner_data.csv` (format CSV sesuai standar, kolom lengkap untuk simulasi multi-user).
- Tambahkan template environment: `workspace/05_API/postman_env.json` (variabel yang diperlukan agar koleksi siap dieksekusi).
- Sisipkan dua diagram sequence (GET /events, GET /stats) ke `workspace/05_API/analytics-heatmap-api.md` dengan legend yang menjelaskan simbol dan konsisten dengan UML.

## Isi & Format
- `load_runner_data.csv`: kolom `eventId,type,page,selector,x,y,vw,vh,sessionId,ts,limit,from,to` dengan nilai contoh relevan.
- `postman_env.json`: variabel `baseUrl`, `jwt`, `tenantId`, `format`, placeholders waktu (`from`, `to`), dan defaults untuk limit/page/type.
- Diagram mermaid sequence:
  - GET /events: Auth → Param Validation → Cache (hit/miss) → DB Query → Pagination → Response
  - GET /stats: Auth → Param Validation → Aggregation → Filtering → Formatting → Response
  - Legend: actor (Client), boundary (Gateway), control (Service), entity (DB/Cache), notes untuk error handling.

## Integrasi
- Tautkan kedua artefak (CSV/JSON) dan diagram baru dalam spesifikasi.
- Pastikan konsistensi dengan skema dan contoh OpenAPI.

Saya akan menambahkan `postman_env.json`, menyisipkan diagram sequence GET ke spesifikasi dengan legend, dan menautkan artefak CSV/JSON supaya siap dijalankan dengan Newman/Postman tanpa modifikasi tambahan.