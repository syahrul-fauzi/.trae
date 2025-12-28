# Naming Convention

Standar penamaan untuk menjamin konsistensi di seluruh ekosistem SBA-Agentic.

## 1. Rule IDs
Format: `[DOMAIN]-[SUB]-[NN]`
- **DOMAIN**: BPA, CX, DA, SI.
- **SUB**: Singkatan sub-kategori 3 huruf (misal: APP, EVT, SCH).
- **NN**: Nomor urut 2 digit.
- *Contoh*: `BPA-APP-01`

## 2. Event Names
Format: `[object].[action]`
- Menggunakan snake_case.
- *Contoh*: `document.uploaded`, `user.login_failed`.

## 3. File & Directory
- **Rule Files**: `[id].yaml` (Kebab-case ID).
- **TypeScript Files**: PascalCase untuk Class, camelCase untuk variabel/fungsi.
- **Directories**: kebab-case.

## 4. Environment Variables
Format: `UPPER_SNAKE_CASE`
- *Contoh*: `SUPABASE_SERVICE_ROLE_KEY`, `REDIS_URL`.

---
*Pelanggaran terhadap konvensi penamaan akan memicu kegagalan pada tahap CI linting.*
