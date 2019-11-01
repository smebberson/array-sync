# array-sync change log

All notable changes to array-sync will be documented here. This project adheres to [Semantic Versioning](http://semver.org/).

## 4.1.0 - 2019-11-01

-   Removed `assert` to provide a massive performance boost.
-   Added support for comparison of Symbol(s) and Function(s).
-   **Deprecated** the `remove` property, renaming it to `removed`.
-   **Deprecated** the `create` property, renaming it to `created`.

## 4.0.0 - 2019-07-15

-   **_Breaking change_**: removed the promise-based API.
-   Moved to Jest.
-   Added Prettier.
-   Removed Greenkeeper.

## 3.0.1 - 2019-04-09

-   Updated all dependencies.

## 3.0.0 - 2019-04-09

-   Removed Bluebird.
-   Removed callback support, only promises are supported now.
-   Modernised code (although, I didn't go overboard).

## 2.0.2 - 2018-06-28

-   Installed Greenkeeper and updated all dependencies to the latest version.

## 2.0.1 - 2018-06-28

-   You can now supply `keyOnly: false` in conjunction with the `key` option to have the entire object returned, rather than just the key.

## 2.0.0 - 2016-03-29

-   **_Breaking change_**: `changed` and `create` values now return entire objects when working with a `key` rather than just the `key` value.

## 1.0.0 - 2016-03-29

-   First complete version.

## 0.0.1 - 2016-03-25

-   Created first version. Essentially, just a shell.
