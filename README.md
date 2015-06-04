# hapi-rethinkdb [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Build Status][travis-image]][travis-url]

Hapi (^8.0) plugin for rethinkdb native driver. This is a fork of @ghostbar's version that adds rethinkdb-init.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Install](#install)
- [Usage](#usage)
  - [Registration](#registration)
  - [Access](#access)
- [Options](#options)
  - [`<String>` url **Required if `host` and `port` not set**](#string-url-required-if-host-and-port-not-set)
  - [`<String>` host **Required if `url` set**](#string-host-required-if-url-set)
  - [`<Number>` port **Required if `url` set**](#number-port-required-if-url-set)
  - [`<String>` db](#string-db)
  - [`<String>` auth](#string-auth)
  - [`<String or Object>` table OR `<Array>` tables](#string-or-object-table-or-array-tables)
- [Tests](#tests)
- [Developing](#developing)
  - [Requirements](#requirements)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i -S @joeybaker/hapi-rethinkdb
```


## Usage

### Registration
You can pass as options either an URL (all are optionals, defaults to: no password, localhost and ) or `host` and `port`. Obviously passing an URL is way more convenient (specially for 12factor-compliant apps).

```js
import hapiRethinkdb from '@joeybaker/hapi-rethinkdb'
import Hapi from 'hapi'
const server = new Hapi.Server()

server.register({
  register: hapiRethinkdb
  , options: {
    url: 'rethinkdb://:password@domain.tld:port/dbname'
    table: {
      name: 'example'
      , indexes: 'name'
    }
  }
})
```

### Access
The connection object returned by `rethinkdb.connect` callback is exposed on `server.plugins.rethinkdb.conn`. You can find the `rethinkdb` library itself exposed on `server.plugins.rethinkdb.r`. It's usually important to use library instance on the plugin instead of importing your own so [that connections are valid](https://github.com/rethinkdb/rethinkdb/issues/3263).

From a handler you can use it like:

```js
function handler (request, response) {
  const {r, conn} = request.server.plugins.rethinkdb

  r.table('example').run(conn, (err, cursor) => {
    cursor.each(console.log.bind(console))
  })
}
```

## Options

### `<String>` url **Required if `host` and `port` not set**
Convenience method to set the rethinkdb connection. Takes the format: `rethinkdb://:password@host:port/dbname`

### `<String>` host **Required if `url` set**
The rethinkdb host. Defaults to `127.0.0.1`

### `<Number>` port **Required if `url` set**
The rethinkdb port. Defaults to `28015`

### `<String>` db
The db to use. If it doesn't exist, it will be created for you.

### `<String>` auth
The rethinkdb auth key.

### `<String or Object>` table OR `<Array>` tables
Ensure tables and indexes exist. For full configuration see: [`rethinkdb-init`](https://github.com/thejsj/rethinkdb-init)

## Tests
Tests are in [tape](https://github.com/substack/tape).

* `npm test` will run the tests
* `npm run tdd` will run the tests on every file change.

## Developing
To publish, run `npm run release -- [{patch,minor,major}]`

_NOTE: you might need to `sudo ln -s /usr/local/bin/node /usr/bin/node` to ensure node is in your path for the git hooks to work_

### Requirements
* **npm > 2.0.0** So that passing args to a npm script will work. `npm i -g npm`
* **git > 1.8.3** So that `git push --follow-tags` will work. `brew install git`

## License

Artistic 2.0 © [Joey Baker](http://byjoeybaker.com) A copy of the license can be found in the file `LICENSE`.


[npm-url]: https://npmjs.org/package/@joeybaker/hapi-rethinkdb
[npm-image]: https://badge.fury.io/js/%40joeybaker%2Fhapi-rethinkdb.svg
[travis-url]: https://travis-ci.org/joeybaker/hapi-rethinkdb
[travis-image]: https://travis-ci.org/joeybaker/hapi-rethinkdb.svg?branch=master
[daviddm-url]: https://david-dm.org/joeybaker/hapi-rethinkdb.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/joeybaker/hapi-rethinkdb
