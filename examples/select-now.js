var koa = require('koa')
var koaPg = require('../index.js')

var app = koa()

app.use(koaPg('postgres://user:password@localhost:5432/database'))

app.use(function *(next) {
    // Here we have access to this.pg which is client returned from pg.connect().
    var result = yield this.pg.client.query_('SELECT now()')
    console.log('result:', result)

    // if we get here, return a body
    this.body = result.rows[0].now.toISOString()
})

app.listen(3000)
