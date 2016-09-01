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
var pg = require('co-pg')(require('pg'));

// ----------------------------------------------------------------------------

module.exports = function(opts) {
    "use strict"

    if (typeof opts === 'string') {
        opts = {pg: opts};
    }
    // For legacy support when 'pg' was named 'conStr'.
    else if (typeof opts.conStr !== 'undefined' &&
          typeof opts.pg === 'undefined')
    {
        //opts.pg = opts.conStr;
    }

    // set this db name
    opts.name = opts.name || 'db';

    return function *koaPg(next) {
        // set up where we store all the DB connections
        this.pg = this.pg || {};

        //From http://ivc.com/blog/better-sql-strings-in-io-js-nodejs-part-2/
        this.pg.sqltpl = function (pieces) {
            var result = '';
            var vals = [];
            var substitutions = [].slice.call(arguments, 1);
            for (var i = 0; i < substitutions.length; ++i) {
                result += pieces[i] + '$' + (i + 1);
                vals.push(substitutions[i]);
            }

            result += pieces[substitutions.length];
            return {text: result, values: vals};
        };

        var connectionResults = yield pg.connectPromise(opts.pg);

        this.pg[opts.name] = {
            client: connectionResults[0],
            done: connectionResults[1]
        };

        // yield to all middlewares
        try {
            yield next;
        }
        catch (e) {
            // Since there was an error somewhere down the middleware,
            // then we need to throw this client away.
            this.pg[opts.name].done(e);
            delete this.pg[opts.name];
            throw e;
        }

        // on the way back up the stack, release the client
        this.pg[opts.name].done();
        delete this.pg[opts.name];
    };
    
}

// ----------------------------------------------------------------------------
