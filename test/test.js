
var expect = require('chai').expect,
    clone = require('clone'),
    arraySync = require('../');

describe('arraySync', function () {

    it('must be passed a source Array', function () {

        var fn = function () {
            var middleware = arraySync(); // eslint-disable-line no-unused-vars
        };

        expect(fn).to.throw(Error, /source/);

    });

    it('must be passed an update Array', function () {

        var fn = function () {
            var middleware = arraySync([]); // eslint-disable-line no-unused-vars
        };

        expect(fn).to.throw(Error, /update/);

    });

    it('must be passed a key when a comparator function is provided', function () {

        var fn = function () {
            var middleware = arraySync([], [], { comparator: function () {} }); // eslint-disable-line no-unused-vars
        };

        expect(fn).to.throw(Error, /comparator/);

    });

    it('can accept an opts Object', function (done) {

        arraySync([], [], {}, function (err, results) {

            expect(err).to.not.exist;
            expect(results).to.have.property('remove');
            expect(results).to.have.property('unchanged');
            expect(results).to.have.property('create');
            expect(results).to.not.have.property('changed');

            return done(err);

        });

    });

    describe('via promise', function () {

        it('will resolve to an object with the keys remove, unchanged, create', function (done) {

            arraySync([], []).then(function (results) {

                expect(results).to.exist;
                expect(results).to.have.property('remove');
                expect(results).to.have.property('unchanged');
                expect(results).to.have.property('create');
                expect(results).to.not.have.property('changed');

                return done();

            }, function (err) {

                return done(err);

            });

        });

    });

    describe('via callback', function () {

        it('returns an object with the keys remove, unchanged, create', function (done) {

            arraySync([], [], function (err, results) {

                expect(err).to.not.exist;
                expect(results).to.have.property('remove');
                expect(results).to.have.property('unchanged');
                expect(results).to.have.property('create');
                expect(results).to.not.have.property('changed');

                return done(err);

            });

        });

    });

    describe('will', function () {

        describe('determine which items', function () {

            describe('should be removed', function () {

                it('when working with strings', function (done) {

                    arraySync(['one', 'two', 'three', 'four'], ['one', 'three', 'four']).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('unchanged');
                        expect(result).to.have.property('create');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('remove');
                        expect(result.remove).to.have.length(1);
                        expect(result.remove[0]).to.equal('two');

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

                it('when working with objects', function (done) {

                    arraySync([
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' },
                        { type: 'node', label: 'three' }
                    ], [
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'three' }
                    ]).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('unchanged');
                        expect(result).to.have.property('create');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('remove');
                        expect(result.remove).to.have.length(1);
                        expect(result.remove[0]).to.eql({ type: 'node', label: 'two' });

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

            });

            describe('should be created', function () {

                it('when working with strings', function (done) {

                    arraySync(['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four', 'five']).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('unchanged');
                        expect(result).to.have.property('remove');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('create');
                        expect(result.create).to.have.length(1);
                        expect(result.create[0]).to.equal('five');

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

                it('when working with objects', function (done) {

                    arraySync([
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' }
                    ], [
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' },
                        { type: 'node', label: 'three' }
                    ]).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('unchanged');
                        expect(result).to.have.property('remove');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('create');
                        expect(result.create).to.have.length(1);
                        expect(result.create[0]).to.eql({ type: 'node', label: 'three' });

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

            });

            describe('are unchanged', function () {

                it('when working with strings', function (done) {

                    arraySync(['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four', 'five']).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('remove');
                        expect(result).to.have.property('create');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('unchanged');
                        expect(result.unchanged).to.have.length(4);
                        expect(result.unchanged[0]).to.equal('one');
                        expect(result.unchanged[1]).to.equal('two');
                        expect(result.unchanged[2]).to.equal('three');
                        expect(result.unchanged[3]).to.equal('four');

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

                it('when working with objects', function (done) {

                    arraySync([
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' }
                    ], [
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' },
                        { type: 'node', label: 'three' }
                    ]).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.have.property('remove');
                        expect(result).to.have.property('create');
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('unchanged');
                        expect(result.unchanged).to.have.length(2);
                        expect(result.unchanged[0]).to.eql({ type: 'node', label: 'one' });
                        expect(result.unchanged[1]).to.eql({ type: 'node', label: 'two' });

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

            });

            describe('are unchanged, to be removed and to be created', function () {

                it('when working with strings', function (done) {

                    arraySync(['one', 'two', 'three', 'four'], ['one', 'three', 'four', 'five']).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('remove');
                        expect(result.remove).to.have.length(1);
                        expect(result.remove[0]).to.equal('two');

                        expect(result).to.have.property('create');
                        expect(result.create).to.have.length(1);
                        expect(result.create[0]).to.equal('five');

                        expect(result).to.have.property('unchanged');
                        expect(result.unchanged).to.have.length(3);
                        expect(result.unchanged[0]).to.equal('one');
                        expect(result.unchanged[1]).to.equal('three');
                        expect(result.unchanged[2]).to.equal('four');

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

                it('when working with objects', function (done) {

                    arraySync([
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' },
                        { type: 'node', label: 'three' },
                        { type: 'node', label: 'four' }
                    ], [
                        { type: 'node', label: 'one' },
                        { type: 'node', label: 'two' },
                        { type: 'node', label: 'three' },
                        { type: 'node', label: 'five' }
                    ]).then(function (result) {

                        expect(result).to.exist;
                        expect(result).to.not.have.property('changed');

                        expect(result).to.have.property('remove');
                        expect(result.remove).to.have.length(1);
                        expect(result.remove[0]).to.eql({ type: 'node', label: 'four' });

                        expect(result).to.have.property('create');
                        expect(result.create).to.have.length(1);
                        expect(result.create[0]).to.eql({ type: 'node', label: 'five' });

                        expect(result).to.have.property('unchanged');
                        expect(result.unchanged).to.have.length(3);
                        expect(result.unchanged[0]).to.eql({ type: 'node', label: 'one' });
                        expect(result.unchanged[1]).to.eql({ type: 'node', label: 'two' });
                        expect(result.unchanged[2]).to.eql({ type: 'node', label: 'three' });

                        return done();

                    }, function (err) {

                        return done(err);

                    });

                });

            });

        });

        describe('use a key, to compare complex items', function () {

            it('and determine which items are unchanged, to be removed and to be created', function (done) {

                arraySync([
                    { type: 'fruit', _id: 'one', label: 'Apple' },
                    { type: 'fruit', _id: 'two', label: 'Orange' },
                    { type: 'fruit', _id: 'three', label: 'Grape' },
                    { type: 'fruit', _id: 'four', label: 'Cucumber' },
                    { type: 'fruit', _id: 'five', label: 'Plum' }
                ], [
                    { type: 'fruit', _id: 'one', label: 'Apple' },
                    { type: 'fruit', _id: 'two', label: 'Orange' },
                    { type: 'fruit', _id: 'three', label: 'Grape' },
                    { type: 'vegetable', _id: 'four', label: 'Cucumber' },
                    { type: 'vegetable', _id: 'six', label: 'Pumpkin' }
                ], {
                    key: '_id'
                }, function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(3);
                    expect(result.unchanged[0]).to.eql('one');
                    expect(result.unchanged[1]).to.eql('two');
                    expect(result.unchanged[2]).to.eql('three');

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql({ type: 'vegetable', _id: 'six', label: 'Pumpkin' });

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql('five');

                    expect(result).to.have.property('changed');
                    expect(result.changed).to.have.length(1);
                    expect(result.changed[0]).to.eql({ type: 'vegetable', _id: 'four', label: 'Cucumber' });


                    return done(err);

                });

            });

        });

        describe('use a key, and a custom comparator', function () {

            it('and determine which items are unchanged, to be removed and to be created', function (done) {

                var called = false;

                arraySync([
                    { type: 'fruit', _id: 1, label: 'Apple', stats: { views: 1, purchases: 1 } },
                    { type: 'fruit', _id: 2, label: 'Cucumber', stats: { views: 10, purchases: 2 } }
                ], [
                    { type: 'fruit', _id: 1, label: 'Apple', stats: { views: 20, purchases: 2 } },
                    { type: 'vegetable', _id: 2, label: 'Cucumber', stats: {views: 20, purchases: 5 } }
                ], {
                    key: '_id',
                    comparator: function comparator (objOne, objTwo) {

                        called = true;

                        // Compare an object to an object.
                        if (typeof objOne === 'object') {

                            var oOne = clone(objOne),
                                oTwo = clone(objTwo);

                            // delete keys we don't want to compare
                            delete oOne.stats;
                            delete oTwo.stats;

                            try {
                                expect(oOne).to.deep.equal(oTwo);
                            } catch (e) {
                                return false;
                            }

                            return true;

                        }

                        // Compare anything that is not (typeof objOne) === 'object' using the simple strict equals.
                        return objOne === objTwo;

                    }
                }, function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(1);
                    expect(result.unchanged[0]).to.eql(1);

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(0);

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(0);

                    expect(result).to.have.property('changed');
                    expect(result.changed).to.have.length(1);
                    expect(result.changed[0]).to.eql({ type: 'vegetable', _id: 2, label: 'Cucumber', stats: {views: 20, purchases: 5 } });

                    expect(called).to.equal(true);

                    return done(err);

                });

            });

        });

        describe('work with', function () {

            it('numbers', function (done) {

                arraySync([1, 2, 3, 4], [1, 3, 4, 5], function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(3);
                    expect(result.unchanged[0]).to.eql(1);
                    expect(result.unchanged[1]).to.eql(3);
                    expect(result.unchanged[2]).to.eql(4);

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql(5);

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql(2);

                    return done(err);

                });

            });

            it('arrays', function (done) {

                arraySync([
                    ['a', 'b', 'c'],
                    ['one', 'two', 'three'],
                    ['cat', 'mouse', 'dog'],
                    ['orange', 'apple', 'pear']
                ], [
                    ['letter-a', 'letter-b', 'letter-c'],
                    ['one', 'two', 'three'],
                    ['orange', 'apple', 'pear']
                ], function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(2);
                    expect(result.unchanged[0]).to.eql(['one', 'two', 'three']);
                    expect(result.unchanged[1]).to.eql(['orange', 'apple', 'pear']);

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql(['letter-a', 'letter-b', 'letter-c']);

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(2);
                    expect(result.remove[0]).to.eql(['a', 'b', 'c']);
                    expect(result.remove[1]).to.eql(['cat', 'mouse', 'dog']);

                    return done(err);

                });

            });

            it('objects', function (done) {

                arraySync([
                    { type: 'fruit', _id: 1, label: 'Apple' },
                    { type: 'fruit', _id: 2, label: 'Cucumber' }
                ], [
                    { type: 'fruit', _id: 1, label: 'Apple' },
                    { type: 'vegetable', _id: 2, label: 'Cucumber' }
                ], function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(1);
                    expect(result.unchanged[0]).to.eql({ type: 'fruit', _id: 1, label: 'Apple' });

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql({ type: 'vegetable', _id: 2, label: 'Cucumber' });

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql({ type: 'fruit', _id: 2, label: 'Cucumber' });

                    expect(result).to.not.have.property('changed');

                    return done(err);

                });

            });

            it('strings', function (done) {

                arraySync([
                    'Apple',
                    'Cucumber'
                ], [
                    'Apple',
                    'Pear'
                ], function (err, result) {

                    expect(err).to.not.exist;

                    expect(result).to.exist;

                    expect(result).to.have.property('unchanged');
                    expect(result.unchanged).to.have.length(1);
                    expect(result.unchanged[0]).to.eql('Apple');

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql('Pear');

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql('Cucumber');

                    expect(result).to.not.have.property('changed');

                    return done(err);

                });

            });

        });

    });

});
