import Hapi from 'hapi'
import test from 'tape'
import plugin from '../index.js'
let server = null

const setup = () => {
  server = new Hapi.Server()
}

const cleanup = (conn, done) => {
  server = null
  // reqlite doesn't yet support noreplyWait, so wait for a bit
  setTimeout(() => {
    conn.close({noreplyWait: false}, done)
  }, 30)
}

test('hapi-rethinkdb: should be able to register the plugin with default options', (t) => {
  setup()
  server.register({
    register: plugin
  }, (err) => {
    t.error(err, 'should not error on registration')

    const conn = server.plugins.rethinkdb.conn
    t.ok(conn, 'RethinkDB connection returned')
    t.equal(
      server.plugins.rethinkdb.conn.host
      , '127.0.0.1'
      , 'Connected to correct address'
    )
    t.equal(
      server.plugins.rethinkdb.conn.port
      , 28015, 'Connected to correct port'
    )

    cleanup(conn, t.end)
  })
})

test('hapi-rethinkdb: should have connected', (t) => {
  setup()
  server.register({
    register: plugin
  }, (err) => {
    t.error(err, 'should not error on registration')
    const conn = server.plugins.rethinkdb.conn
    t.ok(server.plugins.rethinkdb.conn.open, 'Did not connect')
    cleanup(conn, t.end)
  })
})

test('hapi-rethinkdb: should take URLs as parameters', (t) => {
  setup()
  server.register({
    register: plugin
    , options: {url: 'rethinkdb://localhost:28015'}
  }, (err) => {
    t.error(err, 'should not error on registration')
    const conn = server.plugins.rethinkdb.conn
    t.ok(
      server.plugins.rethinkdb.conn.host === 'localhost', 'Connected to incorrect address'
    )
    t.ok(
      server.plugins.rethinkdb.conn.port === 28015, 'Connected to incorrect port'
    )
    cleanup(conn, t.end)
  })
})

test('hapi-rethinkdb: should take URLs as parameters and use 28015 port as default', (t) => {
  setup()
  server.register({
    register: plugin, options: {url: 'rethinkdb://localhost'}
  }, (err) => {
    t.error(err, 'should not error on registration')
    const conn = server.plugins.rethinkdb.conn
    t.ok(
      server.plugins.rethinkdb.conn.host === 'localhost', 'Connected to incorrect address'
    )
    t.ok(
      server.plugins.rethinkdb.conn.port === 28015, 'Connected to incorrect port'
    )
    cleanup(conn, t.end)
  })
})

test('hapi-rethinkdb: should take init options', (t) => {
  setup()
  server.register({
    register: plugin
    , options: {table: 'hapi-rethinkdb'}
  }, (registerErr) => {
    t.error(registerErr, 'should not error on registration')
    const conn = server.plugins.rethinkdb.conn
    const r = server.plugins.rethinkdb.r

    r.tableList().run(conn, (err, tables) => {
      t.error(err, 'does not error on finding tables')
      tables
      // TODO: ensure the tables are created
      cleanup(conn, t.end)
    })
  })
})
