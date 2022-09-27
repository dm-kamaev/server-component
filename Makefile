publish: build
	npm publish --access public

test:
	npx jest --coverage

check:
	npx tsc --noEmit

build:
	rm -rf dist;
	npx tsc

create_badge:
	npx coverage-badges;

.PHONY: test