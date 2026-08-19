.PHONY: dev build check

dev:
	npm run dev

build:
	npx prettier --write .
	npm run build

check: build
	npx astro check
	npx eslint .
	npm test
