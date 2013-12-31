# koa-pg #

Koa middleware to get you a Postgres client on the way down the middlewares,
and release it on the way back up the middlewares.

## Synopsis ##

```
var koa = require('koa')
var koaPg = require('koa-pg')

var app = koa()

app.use(pgKoa('postgres://clubsonline@localhost/clubsonline'))

app.use(function *(next) {
    // Here we have access to this.pg which is client returned from pg.connect().
    var result = yield this.client.query_('SELECT now()')
    console.log('result:', result)

    this.body = result.rows[0].now.toISOString()
})

app.listen(3000)
```

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

MIT - http://chilts.mit-license.org/2013/

(Ends)
