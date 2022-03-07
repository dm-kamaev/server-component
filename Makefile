publish:
	npm publish --access public

test:
	npx jest --coverage

make_badge: test
	npx coverage-badges;
	rm -f coverage.svg;
	cp ./badges/coverage.svg ./coverage.svg;

.PHONY: test