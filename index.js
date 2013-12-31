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

module.exports = function(opts) {
    "use strict"

    if ( typeof opts === 'string' ) {
        opts = { conStr : opts };
    }

    // set this db name
    opts.name = opts.name || 'db';

    return function *koaPg(next) {
        // set up where we store all the DB connections
        this.pg = this.pg || {};

        var connect = yield pg.connect_(opts.conStr)
        this.pg[opts.name] = {
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
            this.pg[opts.name].done(e)
            delete this.pg[opts.name];
            throw e
        }

        // on the way back up the stack, release the client
        this.pg[opts.name].done()
        delete this.pg[opts.name]
    }
    
}

// ----------------------------------------------------------------------------
