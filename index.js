
var Promise = require('bluebird');

/**
 * Data synchronisation module for Node.js.
 *
 * @param  {Array} source       Source array.
 * @param  {Array} update       An updated version of the source array.
 * @param  {Function} callback  A callback to execute with the results.
 * @return {Object}             An object which expresses which items to remove, which items to create and which items are unchanged.
 */

module.exports = function arraySync (source, update, callback) {

    if (!source) {
        throw Error('You must provide a source Array for arraySync to inspect.');
    }

    if (!update) {
        throw Error('You must provide an update Array for arraySync to inspect.');
    }

    return new Promise(function (resolve, reject) {

        return resolve({
            remove: [],
            unchanged: [],
            create: []
        });

    }).asCallback(callback);

}
