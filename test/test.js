
var expect = require('chai').expect,
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

            it('and determine which are unchanged, to be removed and to be created', function (done) {

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
                    expect(result.create[0]).to.eql('six');

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql('five');

                    expect(result).to.have.property('changed');
                    expect(result.changed).to.have.length(1);
                    expect(result.changed[0]).to.eql('four');


                    return done(err);

                });

            });

        });

    });

});
