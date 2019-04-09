#!/usr/bin/env bash

WP=$(pwd)

if test ! -z "$TRAVIS_BUILD_DIR"; then
    WP="$TRAVIS_BUILD_DIR"
fi

exec "${WP}/node_modules/.bin/nyc" "${WP}/node_modules/.bin/_mocha" -- --trace-deprecation --check-leaks
