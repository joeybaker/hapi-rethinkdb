import r from 'rethinkdb'
import rethinkdbInit from 'rethinkdb-init'
import pkg from './package.json'

const pluginName = 'rethinkdb'

exports.register = function registerRethinkdb (plugin, opts = {}, next) {
  const options = {}

  if (!opts.url) {
    options.port = opts.port || 28015
    options.host = opts.host || '127.0.0.1'
    options.db = opts.db || 'test'
  }
  else {
    const url = require('url').parse(opts.url)
    options.port = parseInt(url.port, 10) || 28015
    options.host = url.hostname || '127.0.0.1'
    options.db = url.pathname ? url.pathname.replace(/^\//, '') : 'test'

    if (url.auth) options.authKey = url.auth.split(':')[1]
  }

  plugin.log(['info', pluginName, 'initializing'], options)
  rethinkdbInit(r)

  const tables = (opts.table ? [opts.table] : opts.tables) || []
  r.init(options, tables)
     // fucking promises
    .then((conn) => {
      plugin.log(['info', pluginName, 'initializing'], {status: 'connected'})

      conn.use(options.db)
      plugin.expose('conn', conn)
      plugin.expose('r', r)
      // plugin.bind({rConn: conn, r})
      next()
    })
    .catch((err) => {
      plugin.log(['error', pluginName, 'initializing'], err)
      next(err)
    })
}

exports.register.attributes = {name: pluginName, version: pkg.version}
