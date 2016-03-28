
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

                return done(err);

            });

        });

    });

    describe('will', function () {

        describe('determine which records should be removed', function () {

            it('when working with strings', function (done) {

                arraySync(['one', 'two', 'three', 'four'], ['one', 'three', 'four']).then(function (result) {

                    expect(result).to.exist;
                    expect(result).to.have.property('unchanged');
                    expect(result).to.have.property('create');

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

                    expect(result).to.have.property('remove');
                    expect(result.remove).to.have.length(1);
                    expect(result.remove[0]).to.eql({ type: 'node', label: 'two' });

                    return done();

                }, function (err) {

                    return done(err);

                });

            });

        });

        describe('determine which records should be created', function () {

            it('when working with strings', function (done) {

                arraySync(['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four', 'five']).then(function (result) {

                    expect(result).to.exist;
                    expect(result).to.have.property('unchanged');
                    expect(result).to.have.property('remove');

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

                    expect(result).to.have.property('create');
                    expect(result.create).to.have.length(1);
                    expect(result.create[0]).to.eql({ type: 'node', label: 'three' });

                    return done();

                }, function (err) {

                    return done(err);

                });

            });

        });

        describe('determine which records are unchanged', function () {

            it('when working with strings', function (done) {

                arraySync(['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four', 'five']).then(function (result) {

                    expect(result).to.exist;
                    expect(result).to.have.property('remove');
                    expect(result).to.have.property('create');

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

    });

});
