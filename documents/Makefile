.PHONY: oas-lint pdf-build pdf-build-all check-links

oas-lint:
	npx @stoplight/spectral lint api/openapi.yaml

pdf-build:
	pandoc guides/USAGE_GUIDE.md --from gfm --template guides/pdf/sba-template.tex --toc -V date="$(shell date +%Y-%m-%d)" -o guides/USAGE_GUIDE.pdf

pdf-build-all:
	@$(MAKE) pdf-build

check-links:
	@echo "Optional: requires markdown-link-check installed"
	@echo "Run: npx markdown-link-check guides/USAGE_GUIDE.md"

