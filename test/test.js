'use strict';

const arraySync = require('../');
const clone = require('clone');

describe('arraySync', () => {
    test('must be passed a source Array', () => {
        const fn = function() {
            const middleware = arraySync(); // eslint-disable-line no-unused-vars
        };

        expect(fn).toThrowError(Error);
    });

    test('must be passed an update Array', () => {
        const fn = function() {
            const middleware = arraySync([]); // eslint-disable-line no-unused-vars
        };

        expect(fn).toThrowError(Error);
    });

    test('must be passed a key when a comparator function is provided', () => {
        const fn = function() {
            const middleware = arraySync([], [], { comparator: function() {} }); // eslint-disable-line no-unused-vars
        };

        expect(fn).toThrowError(Error);
    });

    test('can accept an opts Object', () => {
        const results = arraySync([], [], {});

        expect(results).toBeDefined();
        expect(results).toHaveProperty('removed');
        expect(results).toHaveProperty('unchanged');
        expect(results).toHaveProperty('created');
        expect(results).not.toHaveProperty('changed');
    });

    test('will resolve to an object with the keys removed, unchanged, created', () => {
        const results = arraySync([], []);

        expect(results).toBeDefined();
        expect(results).toHaveProperty('removed');
        expect(results).toHaveProperty('unchanged');
        expect(results).toHaveProperty('created');
        expect(results).not.toHaveProperty('changed');
    });

    test('will throw upon error', () => {
        const fn = () =>
            arraySync(
                [
                    {
                        type: 'fruit',
                        _id: 1,
                        label: 'Apple',
                        stats: { views: 1, purchases: 1 }
                    },
                    {
                        type: 'fruit',
                        _id: 2,
                        label: 'Cucumber',
                        stats: { views: 10, purchases: 2 }
                    }
                ],
                [
                    {
                        type: 'fruit',
                        _id: 1,
                        label: 'Apple',
                        stats: { views: 20, purchases: 2 }
                    },
                    {
                        type: 'vegetable',
                        _id: 2,
                        label: 'Cucumber',
                        stats: { views: 20, purchases: 5 }
                    }
                ],
                {
                    key: '_id',
                    comparator: function comparator(objOne, objTwo) {
                        throw new Error('Test error');
                    }
                }
            );

        expect(fn).toThrowError();
    });

    describe('will', () => {
        describe('determine which items', () => {
            describe('should be removed', () => {
                test('when working with strings', () => {
                    const result = arraySync(
                        ['one', 'two', 'three', 'four'],
                        ['one', 'three', 'four']
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('unchanged');
                    expect(result).toHaveProperty('created');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('removed');
                    expect(result.removed).toHaveLength(1);
                    expect(result.removed[0]).toBe('two');
                });

                test('when working with objects', () => {
                    const result = arraySync(
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' },
                            { type: 'node', label: 'three' }
                        ],
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'three' }
                        ]
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('unchanged');
                    expect(result).toHaveProperty('created');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('removed');
                    expect(result.removed).toHaveLength(1);
                    expect(result.removed[0]).toEqual({
                        type: 'node',
                        label: 'two'
                    });
                });
            });

            describe('should be createdd', () => {
                test('when working with strings', () => {
                    const result = arraySync(
                        ['one', 'two', 'three', 'four'],
                        ['one', 'two', 'three', 'four', 'five']
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('unchanged');
                    expect(result).toHaveProperty('removed');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('created');
                    expect(result.created).toHaveLength(1);
                    expect(result.created[0]).toBe('five');
                });

                test('when working with objects', () => {
                    const result = arraySync(
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' }
                        ],
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' },
                            { type: 'node', label: 'three' }
                        ]
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('unchanged');
                    expect(result).toHaveProperty('removed');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('created');
                    expect(result.created).toHaveLength(1);
                    expect(result.created[0]).toEqual({
                        type: 'node',
                        label: 'three'
                    });
                });
            });

            describe('are unchanged', () => {
                test('when working with strings', () => {
                    const result = arraySync(
                        ['one', 'two', 'three', 'four'],
                        ['one', 'two', 'three', 'four', 'five']
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('removed');
                    expect(result).toHaveProperty('created');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('unchanged');
                    expect(result.unchanged).toHaveLength(4);
                    expect(result.unchanged[0]).toBe('one');
                    expect(result.unchanged[1]).toBe('two');
                    expect(result.unchanged[2]).toBe('three');
                    expect(result.unchanged[3]).toBe('four');
                });

                test('when working with objects', () => {
                    const result = arraySync(
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' }
                        ],
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' },
                            { type: 'node', label: 'three' }
                        ]
                    );

                    expect(result).toBeDefined();
                    expect(result).toHaveProperty('removed');
                    expect(result).toHaveProperty('created');
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('unchanged');
                    expect(result.unchanged).toHaveLength(2);
                    expect(result.unchanged[0]).toEqual({
                        type: 'node',
                        label: 'one'
                    });
                    expect(result.unchanged[1]).toEqual({
                        type: 'node',
                        label: 'two'
                    });
                });
            });

            describe('are unchanged, to be removed and to be createdd', () => {
                test('when working with strings', () => {
                    const result = arraySync(
                        ['one', 'two', 'three', 'four'],
                        ['one', 'three', 'four', 'five']
                    );

                    expect(result).toBeDefined();
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('removed');
                    expect(result.removed).toHaveLength(1);
                    expect(result.removed[0]).toBe('two');

                    expect(result).toHaveProperty('created');
                    expect(result.created).toHaveLength(1);
                    expect(result.created[0]).toBe('five');

                    expect(result).toHaveProperty('unchanged');
                    expect(result.unchanged).toHaveLength(3);
                    expect(result.unchanged[0]).toBe('one');
                    expect(result.unchanged[1]).toBe('three');
                    expect(result.unchanged[2]).toBe('four');
                });

                test('when working with objects', () => {
                    const result = arraySync(
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' },
                            { type: 'node', label: 'three' },
                            { type: 'node', label: 'four' }
                        ],
                        [
                            { type: 'node', label: 'one' },
                            { type: 'node', label: 'two' },
                            { type: 'node', label: 'three' },
                            { type: 'node', label: 'five' }
                        ]
                    );

                    expect(result).toBeDefined();
                    expect(result).not.toHaveProperty('changed');

                    expect(result).toHaveProperty('removed');
                    expect(result.removed).toHaveLength(1);
                    expect(result.removed[0]).toEqual({
                        type: 'node',
                        label: 'four'
                    });

                    expect(result).toHaveProperty('created');
                    expect(result.created).toHaveLength(1);
                    expect(result.created[0]).toEqual({
                        type: 'node',
                        label: 'five'
                    });

                    expect(result).toHaveProperty('unchanged');
                    expect(result.unchanged).toHaveLength(3);
                    expect(result.unchanged[0]).toEqual({
                        type: 'node',
                        label: 'one'
                    });
                    expect(result.unchanged[1]).toEqual({
                        type: 'node',
                        label: 'two'
                    });
                    expect(result.unchanged[2]).toEqual({
                        type: 'node',
                        label: 'three'
                    });
                });
            });
        });

        describe('use a key, to compare complex items', () => {
            test('and determine which items are unchanged, to be removed and to be createdd', () => {
                const result = arraySync(
                    [
                        { type: 'fruit', _id: 'one', label: 'Apple' },
                        { type: 'fruit', _id: 'two', label: 'Orange' },
                        { type: 'fruit', _id: 'three', label: 'Grape' },
                        { type: 'fruit', _id: 'four', label: 'Cucumber' },
                        { type: 'fruit', _id: 'five', label: 'Plum' }
                    ],
                    [
                        { type: 'fruit', _id: 'one', label: 'Apple' },
                        { type: 'fruit', _id: 'two', label: 'Orange' },
                        { type: 'fruit', _id: 'three', label: 'Grape' },
                        { type: 'vegetable', _id: 'four', label: 'Cucumber' },
                        { type: 'vegetable', _id: 'six', label: 'Pumpkin' }
                    ],
                    {
                        key: '_id'
                    }
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(3);
                expect(result.unchanged[0]).toBe('one');
                expect(result.unchanged[1]).toBe('two');
                expect(result.unchanged[2]).toBe('three');

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toEqual({
                    type: 'vegetable',
                    _id: 'six',
                    label: 'Pumpkin'
                });

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0]).toBe('five');

                expect(result).toHaveProperty('changed');
                expect(result.changed).toHaveLength(1);
                expect(result.changed[0]).toEqual({
                    type: 'vegetable',
                    _id: 'four',
                    label: 'Cucumber'
                });
            });

            test('and return complete objects', () => {
                const result = arraySync(
                    [
                        { type: 'fruit', _id: 'one', label: 'Apple' },
                        { type: 'fruit', _id: 'two', label: 'Orange' },
                        { type: 'fruit', _id: 'three', label: 'Grape' },
                        { type: 'fruit', _id: 'four', label: 'Cucumber' },
                        { type: 'fruit', _id: 'five', label: 'Plum' }
                    ],
                    [
                        { type: 'fruit', _id: 'one', label: 'Apple' },
                        { type: 'fruit', _id: 'two', label: 'Orange' },
                        { type: 'fruit', _id: 'three', label: 'Grape' },
                        { type: 'vegetable', _id: 'four', label: 'Cucumber' },
                        { type: 'vegetable', _id: 'six', label: 'Pumpkin' }
                    ],
                    {
                        key: '_id',
                        keyOnly: false
                    }
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(3);
                expect(result.unchanged[0]).toEqual({
                    type: 'fruit',
                    _id: 'one',
                    label: 'Apple'
                });
                expect(result.unchanged[1]).toEqual({
                    type: 'fruit',
                    _id: 'two',
                    label: 'Orange'
                });
                expect(result.unchanged[2]).toEqual({
                    type: 'fruit',
                    _id: 'three',
                    label: 'Grape'
                });

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toEqual({
                    type: 'vegetable',
                    _id: 'six',
                    label: 'Pumpkin'
                });

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0]).toEqual({
                    type: 'fruit',
                    _id: 'five',
                    label: 'Plum'
                });

                expect(result).toHaveProperty('changed');
                expect(result.changed).toHaveLength(1);
                expect(result.changed[0]).toEqual({
                    type: 'vegetable',
                    _id: 'four',
                    label: 'Cucumber'
                });
            });
        });

        describe('use a key, and a custom comparator', () => {
            test('and determine which items are unchanged, to be removed and to be createdd', () => {
                let called = false;

                const result = arraySync(
                    [
                        {
                            type: 'fruit',
                            _id: 1,
                            label: 'Apple',
                            stats: { views: 1, purchases: 1 }
                        },
                        {
                            type: 'fruit',
                            _id: 2,
                            label: 'Cucumber',
                            stats: { views: 10, purchases: 2 }
                        }
                    ],
                    [
                        {
                            type: 'fruit',
                            _id: 1,
                            label: 'Apple',
                            stats: { views: 20, purchases: 2 }
                        },
                        {
                            type: 'vegetable',
                            _id: 2,
                            label: 'Cucumber',
                            stats: { views: 20, purchases: 5 }
                        }
                    ],
                    {
                        key: '_id',
                        comparator: function comparator(objOne, objTwo) {
                            called = true;

                            // Compare an object to an object.
                            if (typeof objOne === 'object') {
                                const oOne = clone(objOne);
                                const oTwo = clone(objTwo);

                                // delete keys we don't want to compare
                                delete oOne.stats;
                                delete oTwo.stats;

                                try {
                                    expect(oOne).toEqual(oTwo);
                                } catch (e) {
                                    return false;
                                }

                                return true;
                            }

                            // Compare anything that is not (typeof objOne) === 'object' using the simple strict equals.
                            return objOne === objTwo;
                        }
                    }
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(1);
                expect(result.unchanged[0]).toBe(1);

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(0);

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(0);

                expect(result).toHaveProperty('changed');
                expect(result.changed).toHaveLength(1);
                expect(result.changed[0]).toEqual({
                    type: 'vegetable',
                    _id: 2,
                    label: 'Cucumber',
                    stats: { views: 20, purchases: 5 }
                });

                expect(called).toBe(true);
            });
        });

        describe('work with', () => {
            test('numbers', () => {
                const result = arraySync([1, 2, 3, 4], [1, 3, 4, 5]);

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(3);
                expect(result.unchanged[0]).toBe(1);
                expect(result.unchanged[1]).toBe(3);
                expect(result.unchanged[2]).toBe(4);

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toBe(5);

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0]).toBe(2);
            });

            test('arrays', () => {
                const result = arraySync(
                    [
                        ['a', 'b', 'c'],
                        ['one', 'two', 'three'],
                        ['cat', 'mouse', 'dog'],
                        ['orange', 'apple', 'pear']
                    ],
                    [
                        ['letter-a', 'letter-b', 'letter-c'],
                        ['one', 'two', 'three'],
                        ['orange', 'apple', 'pear']
                    ]
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(2);
                expect(result.unchanged[0]).toEqual(['one', 'two', 'three']);
                expect(result.unchanged[1]).toEqual([
                    'orange',
                    'apple',
                    'pear'
                ]);

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toEqual([
                    'letter-a',
                    'letter-b',
                    'letter-c'
                ]);

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(2);
                expect(result.removed[0]).toEqual(['a', 'b', 'c']);
                expect(result.removed[1]).toEqual(['cat', 'mouse', 'dog']);
            });

            test('objects', () => {
                const result = arraySync(
                    [
                        { type: 'fruit', _id: 1, label: 'Apple' },
                        { type: 'fruit', _id: 2, label: 'Cucumber' }
                    ],
                    [
                        { type: 'fruit', _id: 1, label: 'Apple' },
                        { type: 'vegetable', _id: 2, label: 'Cucumber' }
                    ]
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(1);
                expect(result.unchanged[0]).toEqual({
                    type: 'fruit',
                    _id: 1,
                    label: 'Apple'
                });

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toEqual({
                    type: 'vegetable',
                    _id: 2,
                    label: 'Cucumber'
                });

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0]).toEqual({
                    type: 'fruit',
                    _id: 2,
                    label: 'Cucumber'
                });

                expect(result).not.toHaveProperty('changed');
            });

            test('strings', () => {
                const result = arraySync(
                    ['Apple', 'Cucumber'],
                    ['Apple', 'Pear']
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(1);
                expect(result.unchanged[0]).toBe('Apple');

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0]).toBe('Pear');

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0]).toBe('Cucumber');

                expect(result).not.toHaveProperty('changed');
            });

            test('functions', () => {
                let result = arraySync(
                    [(v) => v(), (i) => i()],
                    [(v) => v(), (g) => g()]
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(1);
                expect(result.unchanged[0].toString()).toBe(
                    ((v) => v()).toString()
                );

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0].toString()).toBe(
                    ((g) => g()).toString()
                );

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0].toString()).toBe(
                    ((i) => i()).toString()
                );

                expect(result).not.toHaveProperty('changed');
            });
            test('symbols', () => {
                let result = arraySync(
                    [Symbol('v'), Symbol('i')],
                    [Symbol('v'), Symbol('g')]
                );

                expect(result).toBeDefined();

                expect(result).toHaveProperty('unchanged');
                expect(result.unchanged).toHaveLength(1);
                expect(result.unchanged[0].toString()).toBe(
                    Symbol('v').toString()
                );

                expect(result).toHaveProperty('created');
                expect(result.created).toHaveLength(1);
                expect(result.created[0].toString()).toBe(
                    Symbol('g').toString()
                );

                expect(result).toHaveProperty('removed');
                expect(result.removed).toHaveLength(1);
                expect(result.removed[0].toString()).toBe(
                    Symbol('i').toString()
                );

                expect(result).not.toHaveProperty('changed');
            });
        });
    });
    describe('deprecations', () => {
        test('create -> created', () => {
            let result = arraySync([], [Symbol('g')]);
            const original = console.log;
            const mockFn = jest.fn();

            console.log = mockFn;

            expect(result).toBeDefined();

            expect(result).toHaveProperty('unchanged');
            expect(result.unchanged).toHaveLength(0);

            expect(result).toHaveProperty('created');
            expect(result.created).toHaveLength(1);
            expect(result.created[0].toString()).toBe(Symbol('g').toString());

            expect(result).toHaveProperty('removed');
            expect(result.removed).toHaveLength(0);

            expect(result).not.toHaveProperty('changed');

            result.create;

            console.log = original;

            expect(mockFn.mock.calls).toHaveLength(1);
            expect(mockFn.mock.calls[0][0]).toMatch(/DeprecationWarning/);
        });
        test('remove -> removed', () => {
            let result = arraySync([], [Symbol('g')]);
            const original = console.log;
            const mockFn = jest.fn();

            console.log = mockFn;

            expect(result).toBeDefined();

            expect(result).toHaveProperty('unchanged');
            expect(result.unchanged).toHaveLength(0);

            expect(result).toHaveProperty('created');
            expect(result.created).toHaveLength(1);
            expect(result.created[0].toString()).toBe(Symbol('g').toString());

            expect(result).toHaveProperty('removed');
            expect(result.removed).toHaveLength(0);

            expect(result).not.toHaveProperty('changed');

            result.remove;

            console.log = original;

            expect(mockFn.mock.calls).toHaveLength(1);
            expect(mockFn.mock.calls[0][0]).toMatch(/DeprecationWarning/);
        });
    });
});
