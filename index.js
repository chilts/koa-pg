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
        this.client = connect[0]
        this.done   = connect[1]

        // yield to all middlewares
        try {
            yield next
        }
        catch (e) {
            // Since there was an error somewhere down the middleware,
            // then we need to throw this client away.
            this.done(e)
            delete this.client
            delete this.done
            throw e
        }

        // on the way back up the stack, release the client
        this.done()
        delete this.client
        delete this.done
    }
    
}

// ----------------------------------------------------------------------------
