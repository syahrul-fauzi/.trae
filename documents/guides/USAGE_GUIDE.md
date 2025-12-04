# Panduan Penggunaan SBA

- Instalasi: lihat template modul README
- API: lihat `../api/openapi.yaml` dan preview `swagger.html`
- Diagram: lihat `../architecture` untuk C4

## Konversi PDF
Gunakan Pandoc + LaTeX:

```bash
pandoc USAGE_GUIDE.md \
  --from gfm \
  --template ./pdf/sba-template.tex \
  --toc \
  -V date="2025-12-03" \
  -o USAGE_GUIDE.pdf
```

