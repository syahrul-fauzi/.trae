.PHONY: install dev build test lint docker-build docker-run

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	eslint .

docker-build:
	docker build -t sba-module:latest .

docker-run:
	docker run --env-file .env -p 3000:3000 sba-module:latest

