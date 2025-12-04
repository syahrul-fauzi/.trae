# Panduan Ekspor Artefak

## PDF (Markdown → PDF)
- Gunakan pandoc: `pandoc -s input.md -o output.pdf`
- Atau use VS Code extension Markdown PDF.

## PNG (Mermaid/Diagram → PNG)
- Render Mermaid: `mmdc -i diagram.mmd -o diagram.png`
- Export dari Drawio/Visio ke PNG.

## Excel (CSV → XLSX)
- Buka `REQUIREMENTS_MATRIX.csv` di Excel dan simpan sebagai `.xlsx`.
- Alternatif: skrip konversi Python/pandas.

## Figma/Adobe XD (Wireframe/Prototype)
- Replikasi struktur dari `ui-prototype/wireframes.md`.
- Lampirkan interaksi sesuai flow navigasi yang diuraikan.

## Confluence (Spesifikasi Teknis)
- Copy `SPEC_SBA_AGENTIC.md` ke Confluence, gunakan template Page.
- Lampirkan diagram dan matriks kebutuhan sebagai attachment.

## Versioning & Review
- Ikuti `NAMING_CONVENTION.md` dan `REVIEW_CHECKLIST.md`.
- Simpan versi lama ke `/_archive`.

