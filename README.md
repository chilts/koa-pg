Note: This project is in need of an owner or maintainer since I don't use it. I fear my pulling of PRs isn't making it better since it requires more of an overview by someone. Please get in touch. :) Thanks.

# koa-pg #

Koa middleware to get you a Postgres client on the way down the middlewares, and release it on the way back up the
middlewares.

This extends Koa by adding a `this.pg` object to it. This contains the `this.pg.client` and `this.pg.done`. You should
use `this.pg.db.client` to yield to the `.query_()` method (from [co-pg](https://npmjs.org/package/co-pg)) but you should
not call `this.pg.db.done()` since that is used internally by `koa-pg` when going back up the middlewares.

## Synopsis ##

```js
var koa = require('koa')
var koaPg = require('koa-pg')

var app = koa()

app.use(koaPg('postgres://user:password@localhost:5432/database'))

app.use(function *(next) {
    // Here we have access to this.pg.db.client which is client returned from pg.connect().
    var result = yield this.pg.db.client.query_('SELECT now()')
    console.log('result:', result)

    this.body = result.rows[0].now.toISOString()
})

app.listen(3000)
```

## Options ##

* 'name' : default -> 'db'

This is the name you want to use for this database. The default is `db` which means the client is
at `this.pg.db.client`. If you only have one database connection you may want to just leave this as
the default. See below if you require two or more database connections (such as `master` or `slave`).

```
app.use(koaPg({
    name   : 'master',
    pg : 'postgres://user:password@localhost:5432/database'
}))

app.use(function *(next) {
    var result = yield this.pg.master.client.query_('SELECT now()')
    this.body = result.rows[0].now.toISOString()
})
```

* 'pg'

This is the parameter that is passed via `co-pg` to `node-postgres`. It can be
either a string or an object and conforms to the API as provided by the aforementioned modules.

```js
var config = {
    name: 'master_db',
    pg: {
        user: 'postgres',
        database: 'db',
        password: 'pass',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 60
    }
}

app.use(koaPg(config))
```

## Multiple Database Connections ##

When using only one database connection you can use the default `db` name, but if you need more than one
connection you must name at least one or other (or both) to something different. Let's say you have a master
and a slave and you require a client at all times (in reality you'd probably just connect to one or the other
depending on what operations you are doing).

```
app.use(koaPg({
    name   : 'master',
    pg : 'postgres://user:password@masterhost:5432/database'
}))

app.use(koaPg({
    name   : 'slave',
    pg : 'postgres://user:password@slavehost:5432/database'
}))

// a write query
app.use(function *(next) {
    var result = yield this.pg.master.client.query_('SELECT now()')
    // ...
})

// a read query
app.use(function *(next) {
    var result = yield this.pg.slave.client.query_('SELECT now()')
    // ...
})
```

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

(Ends)
