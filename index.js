/**
 * Determine if something is array.
 * @param  {String} valueType A string returned from the `type` function.
 * @return {Boolean}          Return `true` if the object is an array.
 */
const isArray = (valueType) => valueType === '[object Array]';

/**
 * Determine if something is a function.
 * @param  {String} valueType A string returned from the `type` function.
 * @return {Boolean}          Return `true` if the object is a function.
 */
const isFunction = (valueType) => valueType === '[object Function]';

/**
 * Determine if something is a symbol.
 * @param  {String} valueType A string returned from the `type` symbol.
 * @return {Boolean}          Return `true` if the object is a symbol.
 */
const isSymbol = (valueType) => valueType === '[object Symbol]';

/**
 * Determine if something is a plain object.
 * @param  {String} valueType A string returned from the `type` function.
 * @return {Boolean}          Return `true` if the object is a plain object.
 */
const isObject = (valueType) => valueType === '[object Object]';

/**
 * Determine if something is a plain object, or an array.
 * @param  {String} valueType A string returned from the `type` function.
 * @return {Boolean}          Return `true` if the object is a plain object, or an array.
 */
const isObjectOrArray = (valueType) =>
    isObject(valueType) || isArray(valueType);

/**
 * Convert the type of an object to string for easy comparison.
 * @param  {Any} value An object to determine the value of.
 * @return {Boolean}   Return a string representing the type of object (i.e. `[object Object]` or `[object Array]`).
 */
const type = (value) => Object.prototype.toString.call(value);

/**
 * Used to compare if two items are equal.
 * @param  {Any} objOne The first object to compare.
 * @param  {Any} objTwo Compare the first object to this object.
 * @return {Boolean}    Return `true` if the object is the same, otherwise return `false`.
 */
const isEqual = (value, other) => {
    // Get the value type
    const valueType = type(value);

    // Compare properties
    if (isArray(valueType)) {
        return value.every((v, i) => comparator(v, other[i]));
    }

    return Object.getOwnPropertyNames(value).every((key) =>
        comparator(value[key], other[key])
    );
};

/**
 * The default comparator function, which will loop through arrays to compare them.
 * @param  {Any} objOne The first object to compare.
 * @param  {Any} objTwo Compare the first object to this object.
 * @return {Boolean}    Return `true` if the object is the same, otherwise return `false`.
 */
const comparator = (item1, item2) => {
    // Get the object type
    const itemType = type(item1);

    // If an object or array, compare recursively
    if (isObjectOrArray(itemType)) {
        return isEqual(item1, item2);
    }

    // If it's a function, convert to a string and compare.
    if (isFunction(itemType) || isSymbol(itemType)) {
        return item1.toString() === item2.toString();
    }

    // Otherwise, just compare.
    return item1 === item2;
};

/**
 * Takes an `Array` of objects, and a `key` that exists within the objects and returns an array
 * containing the value of the key on each object within the array.
 * @param  {Array}  a   An array of objects.
 * @param  {String} key A key that exists on each object within the array.
 * @return {Array}      An array of values pertaining to the value of the key on each object.
 */
const mapToKey = (a, key) => a.map((val) => val[key]);

/**
 * Find anything that was in the `source` array but does not exist in the `update` array.
 * @param  {Array} source Source array.
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that are in the `source` array but don't exist
 *                        in the `update` array.
 */
const findMissingValues = (source, update, opts) =>
    source.filter(function(sourceValue) {
        return (
            update.find(function(element, index, array) {
                // If we have a key, we only want to compare the value of the keys.
                return opts.key
                    ? (opts.comparator || comparator)(
                          sourceValue[opts.key],
                          element[opts.key]
                      ) === true
                    : (opts.comparator || comparator)(sourceValue, element) ===
                          true;
            }) === undefined
        );
    });

/**
 * Find anything that is new in the `update` array.
 * @param  {Array} source Source array.
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that are in the `update` array but don't exist
 *                        in the `source` array.
 */
const findNewValues = (source, update, opts) =>
    update.filter(function(updateValue) {
        return (
            source.find(function(element, index, array) {
                // If we have a key, we don't want to create.
                return opts.key
                    ? (opts.comparator || comparator)(
                          updateValue[opts.key],
                          element[opts.key]
                      ) === true
                    : (opts.comparator || comparator)(updateValue, element) ===
                          true;
            }) === undefined
        );
    });

/**
 * Find anything that is exactly the same between the `source` array and the `update` array.
 * @param  {Array} source                  Source array.
 * @param  {Array} removedCreatedChanged  An updated version of the source array.
 * @param  {Object} opts                   An Object containing information to alter the outcome of the function.
 * @return {Array}                         An array of items that appear in the `update` array and exactly match
 *                                         their counterpart in the `source` array.
 */
const findUnchangedValues = (source, removedCreatedChanged, opts) =>
    source.filter(function(sourceValue) {
        return (
            removedCreatedChanged.find(function(element, index, array) {
                // If we have a key, we only want to compare the actual key is the same.
                if (opts.key) {
                    return (
                        (opts.comparator || comparator)(
                            sourceValue[opts.key],
                            element[opts.key]
                        ) === true
                    );
                }

                return (
                    (opts.comparator || comparator)(sourceValue, element) ===
                    true
                );
            }) === undefined
        );
    });

/**
 * Find anything that has changed between the `source` array and the `update` array.
 * @param  {Array} source The source array
 * @param  {Array} update An updated version of the source array.
 * @param  {Object} opts  An Object containing information to alter the outcome of the function.
 * @return {Array}        An array of items that appear in the `update` array and do not match
 *                        their counterpart in the `source` array.
 */
const findChangedValues = (source, update, opts) =>
    source
        .filter(function(sourceValue) {
            return (
                update.find(function(element, index, array) {
                    // If we have a key, we only want to compare when the key is the same.
                    return (
                        (opts.comparator || comparator)(
                            sourceValue[opts.key],
                            element[opts.key]
                        ) === true &&
                        (opts.comparator || comparator)(
                            sourceValue,
                            element,
                            opts.key
                        ) !== true
                    );
                }) !== undefined
            );

            // We always have a key if this function is executing, make sure we pass back the changed values, not those from the source.
        })
        .map(function(sourceValue) {
            return update.find(function(element, index, array) {
                return (
                    (opts.comparator || comparator)(
                        sourceValue[opts.key],
                        element[opts.key]
                    ) === true
                );
            });
        });

/**
 * Data synchronization module for Node.js.
 *
 * @param  {Array} source       Source array.
 * @param  {Array} update       An updated version of the source array.
 * @param  {Object} opts        An object of options.
 * @return {Promise}            A promise that will be resolved or rejected with the result.
 */

module.exports = function arraySync(source, update, opts = {}) {
    if (!source) {
        throw Error(
            'You must provide a source Array for arraySync to inspect.'
        );
    }

    if (!update) {
        throw Error(
            'You must provide an update Array for arraySync to inspect.'
        );
    }

    if (opts.comparator && !opts.key) {
        throw Error(
            'You must provide a key when passing in a custom comparator function.'
        );
    }

    if (opts.key && typeof opts.keyOnly === 'undefined') {
        opts.keyOnly = true;
    }

    // Default return object.
    const r = {
        get create() {
            console.log(
                'DeprecationWarning: The create property has been deprecated, use the created property instead.'
            );
            return this.removed;
        },
        get remove() {
            console.log(
                'DeprecationWarning: The remove property has been deprecated, use the removed property instead.'
            );
            return this.removed;
        },
        removed: [],
        unchanged: [],
        created: []
    };

    // Find the missing values.
    r.removed = findMissingValues(source, update, opts);

    // Find the new values.
    r.created = findNewValues(source, update, opts);

    // Add support for a more complex evaluation of Objects, if the `opts.key` has been provided.
    if (opts.key) {
        r.changed = findChangedValues(source, update, opts);
    }

    // Determine the unchanged values (those that aren't new, nor missing).
    r.unchanged = findUnchangedValues(
        source,
        r.removed.concat(r.created, r.changed || []),
        opts
    );

    // If we have a `key`, transform the results to contain only the key Object.
    if (opts.key && opts.keyOnly) {
        r.removed = mapToKey(r.removed, opts.key);
        r.unchanged = mapToKey(r.unchanged, opts.key);
    }

    return r;
};
