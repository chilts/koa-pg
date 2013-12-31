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
var pg = require('co-pg')

// ----------------------------------------------------------------------------

module.exports = function(conStr) {
    "use strict"

    return function *koaPg(next) {
        var connect = yield pg.connect_(conStr)
        this.pg = {
            client : connect[0],
            done   : connect[1],
        }

        // yield to all middlewares
        try {
            yield next
        }
        catch (e) {
            // Since there was an error somewhere down the middleware,
            // then we need to throw this client away.
            this.pg.done(e)
            delete this.pg
            throw e
        }

        // on the way back up the stack, release the client
        this.pg.done()
        delete this.pg
    }
    
}

// ----------------------------------------------------------------------------
