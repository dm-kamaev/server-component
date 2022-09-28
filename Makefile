# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := test_watch_one
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
  # use the rest as arguments for the command
  COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(COMMAND_ARGS):;@:)
endif

publish: build
	npm publish --access public

test:
	npx jest --coverage

test_watch:
	npx jest --watchAll

# path to test file
# test_file := $(word 2, $(MAKECMDGOALS) )
test_watch_one:
	@npx jest $(COMMAND_ARGS) --watch;

check:
	npx tsc --noEmit

build:
	rm -rf dist;
	npx tsc

create_badge:
	npx coverage-badges;

ci: check test create_badge

.PHONY: test

