MOCHA_OPTS= --check-leaks
REPORTER = dot

check: test

test: test-unit test-acceptance

#test-unit:
#	@NODE_ENV=test ./node_modules/.bin/mocha \
#		--reporter $(REPORTER) \
#		--globals setImmediate,clearImmediate \
#       -R travis-cov \
#		$(MOCHA_OPTS)

test-acceptance:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail \
        -R travis-cov \
		test/acceptance/*.js

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit test-acceptance bench clean