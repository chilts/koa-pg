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
    yield next
})

app.listen(3000)
```

(Ends)
