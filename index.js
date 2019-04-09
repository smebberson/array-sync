
const assert = require('assert');

/**
 * The default comparator function. Simple strict equality all the way.
 * @param  {Any} objOne The first object to compare.
 * @param  {Any} objTwo Compare the first object to this object.
 * @return {Boolean}    Return `true` if the object is the same, otherwise return `false`.
 */
const comparator = (objOne, objTwo) => {

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
 * Takes an `Array` of objects, and a `key` that exists within the objects and returns an array
 * containing the value of the key on each object within the array.
 * @param  {Array}  a   An array of objects.
 * @param  {String} key A key that exists on each object within the array.
 * @return {Array}      An array of values pertaining to the value of the key on each object.
 */
const mapToKey = (a, key) => a.map(val => val[key]);

/**
 * Find anything that was in the `source` array but does not exist in the `update` array.
 * @param  {Array} source Source array.
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that are in the `source` array but don't exist
 *                        in the `update` array.
 */
const findMissingValues = (source, update, opts) => source.filter(function (sourceValue) {

    return update.find(function (element, index, array) {

        // If we have a key, we only want to compare the value of the keys.
        return opts.key ?
            (opts.comparator || comparator)(sourceValue[opts.key], element[opts.key]) === true :
            (opts.comparator || comparator)(sourceValue, element) === true;

    }) === undefined;

});

/**
 * Find anything that is new in the `update` array.
 * @param  {Array} source Source array.
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that are in the `update` array but don't exist
 *                        in the `source` array.
 */
const findNewValues = (source, update, opts) => update.filter(function (updateValue) {

    return source.find(function (element, index, array) {

        // If we have a key, we don't want to create.
        return opts.key ?
            (opts.comparator || comparator)(updateValue[opts.key], element[opts.key]) === true :
            (opts.comparator || comparator)(updateValue, element) === true;

    }) === undefined;

});

/**
 * Find anything that is exactly the same between the `source` array and the `update` array.
 * @param  {Array} source                  Source array.
 * @param  {Array} removeCreateAndChanged  An updated version of the source array.
 * @param  {Object} opts                   An Object containing information to alter the outcome of the function.
 * @return {Array}                         An array of items that appear in the `update` array and exactly match
 *                                         their counterpart in the `source` array.
 */
const findUnchangedValues = (source, removeCreateAndChanged, opts) => source.filter(function (sourceValue) {

    return removeCreateAndChanged.find(function (element, index, array) {

        // If we have a key, we only want to compare the actual key is the same.
        if (opts.key) {
            return (opts.comparator || comparator)(sourceValue[opts.key], element[opts.key]) === true;
        }

        return (opts.comparator || comparator)(sourceValue, element) === true;

    }) === undefined;

});

/**
 * Find anything that has changed between the `source` array and the `update` array.
 * @param  {Array} source The source array
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that appear in the `update` array and do not match
 *                        their counterpart in the `source` array.
 */
const findChangedValues = (source, update, opts) => source.filter(function (sourceValue) {

    return update.find(function (element, index, array) {

        // If we have a key, we only want to compare when the key is the same.
        return (opts.comparator || comparator)(sourceValue[opts.key], element[opts.key]) === true && (opts.comparator || comparator)(sourceValue, element, opts.key) !== true;

    }) !== undefined;

// We always have a key if this function is executing, make sure we pass back the changed values, not those from the source.
}).map(function (sourceValue) {

    return update.find(function (element, index, array) {

        return (opts.comparator || comparator)(sourceValue[opts.key], element[opts.key]) === true;

    });

})

/**
 * Data synchronisation module for Node.js.
 *
 * @param  {Array} source       Source array.
 * @param  {Array} update       An updated version of the source array.
 * @param  {Object} opts        An object of options.
 * @return {Promise}            A promise that will be resolved or rejected with the result.
 */

module.exports = function arraySync (source, update, opts = {}) {

    if (!source) {
        throw Error('You must provide a source Array for arraySync to inspect.');
    }

    if (!update) {
        throw Error('You must provide an update Array for arraySync to inspect.');
    }

    if (opts.comparator && !opts.key) {
        throw Error('You must provide a key when passing in a custom comparator function.')
    }

    if (opts.key && typeof opts.keyOnly === 'undefined') {
        opts.keyOnly = true;
    }

    return new Promise(function (resolve, reject) {

        // Default return object.
        const r = {
            remove: [],
            unchanged: [],
            create: []
        };

        // Find the missing values.
        r.remove = findMissingValues(source, update, opts);

        // Find the new values.
        r.create = findNewValues(source, update, opts);

        // Add support for a more complex evaluation of Objects, if the `opts.key` has been provided.
        if (opts.key) {
            r.changed = findChangedValues(source, update, opts);
        }

        // Determine the unchanged values (those that aren't new, nor missing).
        r.unchanged = findUnchangedValues(source, r.remove.concat(r.create, r.changed || []), opts);

        // If we have a `key`, transform the results to contain only the key Object.
        if (opts.key && opts.keyOnly) {
            r.remove = mapToKey(r.remove, opts.key);
            r.unchanged = mapToKey(r.unchanged, opts.key);
        }

        // Resolve the result.
        return resolve(r);

    });

}
