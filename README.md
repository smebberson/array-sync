# array-sync

[![npm](https://img.shields.io/npm/v/array-sync.svg)](https://www.npmjs.com/package/array-sync)
[![Build Status](https://travis-ci.org/smebberson/array-sync.svg?branch=master)](https://travis-ci.org/smebberson/array-sync)
[![Coverage Status](https://codecov.io/github/smebberson/array-sync/coverage.svg?branch=master)](https://codecov.io/github/smebberson/array-sync?branch=master)

array-sync is a complete data synchronization module for Node.js, highly customizable. It will accept a source array, an updated version of that source array and provide an object containing the keys `remove`, `unchanged`, `changed` and `create`.

array-sync can be used to simplify CRUD operations resulting from bulk array manipulations. For example, if you provide a list of clients for your users and provide them the ability to create new clients, edit current clients and remove old clients. Most data synchronization goes through the same process, and array-sync allows you to customize the process by providing a `comparator` function.

## Install

```
$ npm install array-sync
```

## API

```
var arraySync = require('array-sync');

```

### arraySync(source, updated, [options, callback])

Takes a source array, and compares it against an updated version of the source array to determine what needs to be removed, created and what hasn't changed. It returns an object:

```
{
    remove: [],
    unchanged: [],
    create: []
}
```

By default array-sync will compare using whole-object strict equality (i.e. `assert.deepStrictEqual`) on objects or strict equality on other data types (i.e. `===`). You can customize this by providing a key and a comparator function in the `options` object.

array-sync will return a promise unless a `callback` function has been provided.

#### source

The `source` array. It must be provided. array-sync will `throw` if it isn't provided.

#### updated

An updated version of the `source` array. It also must be provided (however, it can be empty). array-sync will `throw` if it isn't provided.

#### callback

An optional `callback` function. If provided will be executed with the standard Node.js callback signature `(err, result)`. If not provided a promise is returned.

```
arraySync(source, updated).then(
    function successHandler (result) {
        // { remove: [], unchanged: [], create: [] }
    },
    function failHandler (err) {
    }
);
```

#### options

array-sync will accept an optional `options` object.

##### key

A `string` which represents the key of an object to compare against. By default array-sync provides whole-object strict equality:

```
arraySync([
    { type: 'node', id: 1, label: 'one' },
    { type: 'node', id: 2, label: 'two' },
    { type: 'node', id: 3, label: 'three' }
], [
    { type: 'node', id: 1, label: 'one' },
    { type: 'node', id: 2, label: 'Two' },
    { type: 'node', id: 3, label: 'three' }
]).then(function (result) {

    // result = {
    //     unchanged: [{ type: 'node', id: 1, label: 'one' }, { type: 'node', id: 3, label: 'three' }],
    //     create: [{ type: 'node', id: 2, label: 'Two' }],
    //     remove: [{ type: 'node', id: 2, label: 'two' }]
    // }

});
```

In this mode it is unable to determine what has changed from what is new. By providing a `key`, array-sync is able to determine if something has changed:

```
arraySync([
    { type: 'node', id: 1, label: 'one' },
    { type: 'node', id: 2, label: 'two' },
    { type: 'node', id: 3, label: 'three' }
], [
    { type: 'node', id: 1, label: 'one' },
    { type: 'node', id: 2, label: 'Two' },
    { type: 'node', id: 3, label: 'three' }
], { key: 'id' }).then(function (result) {

    // result = {
    //     unchanged: [1, 3],
    //     changed: [{ type: 'node', id: 2, label: 'Two' }]
    //     create: [],
    //     remove: []
    // }

});
```

If a `key` is provided array-sync adds another key to the object it returns (`changed`). Also only the value of the `key` is returned in `unchanged` and `remove`, whereas the whole object is returned in `changed` and `create`. For database stored information (with an `id`), using a `key` is the more likely scenario and use case.

##### comparator

A `function` to replace the default `comparator` function. The `comparator` function will be executed with two arguments `(objOne, objTwo)`. It should return `true` if the object is the same, otherwise it should return `false`. The default comparator is:

```
function comparator (objOne, objTwo) {

    // Compare an object to an object.
    if (typeof objOne === 'object') {

        try {
            assert.deepStrictEqual(objOne, objTwo);
        } catch (e) {
            return false;
        }

        return true;

    }

    // Compare anything that is not (typeof objOne) === 'object' using the simple strict equals.
    return objOne === objTwo;

};
```

It will `assert.deepStrictEqual` compare objects, and `===` strict equals compare everything else. You can provide a custom comparator and do whatever you need to. Be aware that the comparator can be in the following two instances:

- To compare keys.
- To compare values of keys.

The default comparator provides support for this scenario, and so will any custom comparator (don't just assume you'll be comparing objects or whatever type of data the `source` and `update` arrays hold).

## Change log

[Review the change log for all changes.](CHANGELOG.md)

## Contributing

Contributors are welcomed. You can [read more about contributing to array-sync here](CONTRIBUTING.md).

## License

[MIT](LICENSE.md)
