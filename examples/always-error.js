var koa = require('koa')
var koaPg = require('../index.js')

var app = koa()

app.use(koaPg('postgres://user:password@localhost:5432/database'))

app.use(function *(next) {
    // Here we have access to this.pg which is client returned from pg.connect().
    var result = yield this.pg.db.client.queryPromise('SELECT blah()')
    console.log('result:', result)

    this.body = 'Never reached'
})

app.listen(3000)
