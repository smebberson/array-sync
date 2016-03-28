
var Promise = require('bluebird'),
    assert = require('assert');

/**
 * The default comparator function. Simple strict equality all the way.
 * @param  {Any} objOne The first object to compare.
 * @param  {Any} objTwo Compare the first object to this object.
 * @return {Boolean}    Return `true` if the object is the same, otherwise return `false`.
 */
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

/**
 * Data synchronisation module for Node.js.
 *
 * @param  {Array} source       Source array.
 * @param  {Array} update       An updated version of the source array.
 * @param  {Function} callback  An optional callback to execute with the results.
 * @param  {Object} opts        An object of options.
 * @return {Promise}            A promise that will be resolved or rejected with the result (unless callback was provided).
 */

module.exports = function arraySync (source, update, opts, callback) {

    if (!source) {
        throw Error('You must provide a source Array for arraySync to inspect.');
    }

    if (!update) {
        throw Error('You must provide an update Array for arraySync to inspect.');
    }

    // Support four signatures:
    //  1. (source, update, callback)
    //  2. (source, update, opts, callback)
    //  3, (source, update, opts)
    //  4. (source, update)
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }

    // Default `opts` to an Object.
    opts = opts || {};

    // Default `opts.comparator` function.
    opts.comparator = opts.comparator || comparator;

    // Return a promise (which will execute the callback if provided).
    return new Promise(function (resolve, reject) {

        // Default return object.
        var r = {
            remove: [],
            unchanged: [],
            create: []
        };

        // Find the missing values.
        r.remove = source.filter(function (sourceValue) {

            return update.find(function (element, index, array) {

                return comparator(sourceValue, element) === true;

            }) === undefined;

        });

        // Find the new values.
        r.create = update.filter(function (updateValue) {

            return source.find(function (element, index, array) {

                return comparator(updateValue, element) === true;

            }) === undefined;

        });

        // Determine the unchanged values (those that aren't new, nor missing).
        r.unchanged = source.filter(function (sourceValue) {

            return r.remove.concat(r.create).find(function (element, index, array) {

                return comparator(sourceValue, element) === true;

            }) === undefined;

        });

        // Resolve the result.
        return resolve(r);

    }).asCallback(callback);

}
