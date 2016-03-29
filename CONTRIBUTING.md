
# Contributing to array-sync

array-sync comes complete with an isolated development environment. You aren't required to use it, if you already have what you get with the development environment then you're already good to go. All you need is:

- [Vagrant][vagrant]
- Virtualization software, either: [VMware Workstation][vmwareworkstation], [VMware Fusion][vmwarefusion] or [Virtual Box][virtualbox]
- [Git][git]

Once you've created the virtual machine you'll have an environment complete with:

- Node.js
- NPM

There are files for editors that should keep the file formatting consistent with what already exists in this repository.

## Getting started

Follow these steps to get started with hacking on array-sync.

1. Star and fork this repository on GitHub.
1. Clone your forked repository `git clone https://github.com/smebberson/array-sync.git ./array-sync`.
1. Start the virtual machine with `vagrant up` (this might take 10 minutes or so).

With that, you'll have a virtual machine up and running.

## Development

The entire module lives within `./index.js`. All tests can be found in `test/test.js`.

## Testing

To run tests use `npm test`. To show test coverage use `npm run coverage`. All tests are written using [mocha][mocha] and [chai][chai]. Please write unit tests for new code you create.

## Submitting changes

Please send a GitHub pull request with a clear list of what you've done ([read more about pull requests][pullrequests]). Test coverage is at 100% and ideally, your pull requests will keep it as such.

[vagrant]: https://www.vagrantup.com/
[vmwareworkstation]: https://www.vmware.com/au/products/workstation/
[vmwarefusion]: https://www.vmware.com/au/products/fusion/
[virtualbox]: https://www.virtualbox.org/
[git]: https://git-scm.com/
[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[pullrequests]: http://help.github.com/pull-requests/
