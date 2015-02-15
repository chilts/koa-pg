var koa = require('koa')
var koaPg = require('../index.js')

var app = koa()

app.use(koaPg('postgres://user:password@localhost:5432/database'));

app.use(function *(next) {
    // Here we have access to this.pg which is client returned from pg.connect().

    var testBind = 'test';

    //From http://ivc.com/blog/better-sql-strings-in-io-js-nodejs-part-2/
    var query = this.pg.sqltpl`
SELECT
    now()
where
    'test' = ${testBind}`;

    var result = yield this.pg.db.client.queryPromise(query);

    console.log('result:', result)
    console.log('query:', query)

    // if we get here, return a body
    this.body = result.rows[0].now.toISOString()
})

app.listen(3000)