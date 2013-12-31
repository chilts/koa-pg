// ----------------------------------------------------------------------------
//
// http://npm.im/koa-pg
//
// Copyright (c) 2013 Andrew Chilton. All Rights Reserved.
//
// License : MIT - http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------

// npm
var thunkify = require('thunkify')
var pg = require('pg')

// ----------------------------------------------------------------------------

var thunkedConnect = thunkify(pg.connect.bind(pg))

module.exports = function(conString) {
    "use strict"

    return function *koaPg(next) {

        var self = this

        var err, ret = yield thunkedConnect(conString)
        var client = ret[0]
        var done = ret[1]
        if (err) return self.throw(err)

        // prior to the rest of the middleware, down the stack
        self.pg = client

        // yield to all middlewares
        try {
            yield next
        }
        catch (e) {
            // Since there was an error somewhere down the middleware,
            // then we need to throw this client away.
            done(e)
            throw e
        }

        // on the way back up the stack, release the client
        done()
    }
    
}

// ----------------------------------------------------------------------------
