
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

});
