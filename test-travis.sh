#!/usr/bin/env bash

WP=$(pwd)

if test ! -z "$TRAVIS_BUILD_DIR"; then
    WP="$TRAVIS_BUILD_DIR"
fi

exec "${WP}/node_modules/.bin/istanbul" cover "${WP}/node_modules/.bin/_mocha" -- -R spec
