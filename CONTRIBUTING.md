
# Contributing to array-sync

To develop on array-sync, all you need is Git, Node.js and NPM.

There are files for editors that should keep the file formatting consistent with what already exists in this repository.

## Getting started

Follow these steps to get started with hacking on array-sync.

1. Star and fork this repository on GitHub.
1. Clone your forked repository `git clone https://github.com/smebberson/array-sync.git ./array-sync`.
1. Execute `npm install`.

With that, you'll have everything you need to get started.

## Development

The entire module lives within `./index.js`. All tests can be found in `test/test.js`.

## Testing

To run tests use `npm test`. To show test coverage use `npm run coverage`. All tests are written using [mocha][mocha] and [chai][chai]. Please write unit tests for new code you create.

## Submitting changes

Please send a GitHub pull request with a clear list of what you've done ([read more about pull requests][pullrequests]). Test coverage is at 100% and ideally, your pull requests will keep it as such.

[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[pullrequests]: http://help.github.com/pull-requests/
