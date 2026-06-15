// middleware-supertest.ts

import type {Express, Request, RequestHandler, Response} from "express"
import {responseHandler} from "express-intercept"
import type * as types from "middleware-supertest"
import type {IncomingMessage, ServerResponse} from "node:http"
import supertest from "supertest"

export const mwsupertest: typeof types.mwsupertest = app => new MWSuperTest(app)

/**
 * Test an Express.js app — and the middleware it composes — on both the
 * server side and the client side in a single chain.
 */

class MWSuperTest implements types.MWSuperTest {
    private _agent?: supertest.Agent
    private chain: RequestHandler[] = []
    private readonly app: Express

    constructor(app: Express) {
        this.app = app
    }

    private agent() {
        if (this._agent) return this._agent

        // Compose the observation chain and the consumer-supplied app into a
        // single 2-arg listener that supertest can hand to http.createServer.
        // We deliberately avoid calling `express()` or `express.Router()` here
        // so that the runtime contract is just "any callable Express app",
        // which both Express 4 and Express 5 satisfy. The version of Express
        // used by the consumer never enters this module at runtime.
        const stack = [...this.chain]
        const composed = (req: IncomingMessage, res: ServerResponse) => {
            runChain(stack, req as Request, res as Response, (err?: any) => {
                // Stop if the pre-app chain already completed the response.
                if (res.writableEnded) return
                if (err) {
                    res.statusCode = (err && err.status) || 500
                    res.end((err && err.message) || "Internal Server Error")
                } else {
                    this.app(req, res)
                }
            })
        }

        return (this._agent = supertest(composed))
    }

    use(mw: types.NextHandleFunction): this {
        return this.add(mw)
    }

    private add(mw: RequestHandler): this {
        this.chain.push(mw)
        this._agent = undefined
        return this
    }

    /**
     * defines a test function to test the response body as a `string` on server-side.
     */

    getString(checker: (str: string) => (any | Promise<any>)): this {
        return this.add(responseHandler().getString((str, req, res) => {
            return Promise.resolve(str).then(checker).catch(err => catchError(err, req, res))
        }))
    }

    /**
     * defines a test function to test the response body as a `Buffer` on server-side.
     */

    getBuffer(checker: (buf: Buffer) => (any | Promise<any>)): this {
        return this.add(responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve(buf).then(checker).catch(err => catchError(err, req, res))
        }))
    }

    /**
     * defines a test function to test the response object aka `res` on server-side.
     */

    getRequest(checker: (req: Request) => (any | Promise<any>)): this {
        return this.add(responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => checker(req)).catch(err => catchError(err, req, res))
        }))
    }

    /**
     * defines a test function to test the request object aka `req` on server-side.
     */

    getResponse(checker: (res: Response) => (any | Promise<any>)): this {
        return this.add(responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => checker(res)).catch(err => catchError(err, req, res))
        }))
    }

    /**
     * perform a HTTP `DELETE` request and returns a SuperTest object to continue tests on client-side.
     */

    delete(url: string) {
        return wrapRequest(this.agent().delete(url))
    }

    /**
     * perform a HTTP `GET` request and returns a SuperTest object to continue tests on client-side.
     */

    get(url: string) {
        return wrapRequest(this.agent().get(url))
    }

    /**
     * perform a HTTP `HEAD` request and returns a SuperTest object to continue tests on client-side.
     */

    head(url: string) {
        return wrapRequest(this.agent().head(url))
    }

    /**
     * perform a HTTP `POST` request and returns a SuperTest object to continue tests on client-side.
     */

    post(url: string) {
        return wrapRequest(this.agent().post(url))
    }

    /**
     * perform a HTTP `PUT` request and returns a SuperTest object to continue tests on client-side.
     */

    put(url: string) {
        return wrapRequest(this.agent().put(url))
    }
}

/**
 * @private
 *
 * Connect-style middleware runner. Iterates `handlers` in order, advancing
 * to the next one each time a handler invokes the supplied `next` callback.
 * Stops on the first error or when the list is exhausted, then calls `done`.
 *
 * This re-implements the slice of `express.Router()` semantics that mws
 * actually relies on (sequential `.use()` chaining, no path-prefix matching,
 * no 4-arg error handlers, no nested routers). Anything richer than that is
 * the consumer's own app, which we call after this chain completes.
 *
 * Synchronous exceptions from a handler are caught and surfaced through
 * `next()`, mirroring Express's `Layer.handle_request` so that a thrown
 * error becomes a 500 response via `done(err)` instead of escaping to
 * Node's request listener and aborting the test run.
 */

function runChain(handlers: RequestHandler[], req: Request, res: Response, done: (err?: any) => void): void {
    let i = 0
    const step = (err?: any) => {
        if (err) return done(err)
        if (i >= handlers.length) return done()
        try {
            handlers[i++](req, res, step)
        } catch (e) {
            step(e)
        }
    }
    step()
}

/**
 * @private
 */

function wrapRequest(req: supertest.Request): supertest.Test {
    const _req = req as unknown as {assert: (resError: any, res: any, fn: any) => void}
    const _assert = _req.assert
    _req.assert = function (resError, res, fn) {
        let err: string = res?.header["x-mwsupertest"]
        if (err) {
            err = Buffer.from(err, "base64").toString()
            resError = new Error(err)
            res = null
        }
        if (_assert) {
            return _assert.call(this, resError, res, fn)
        }
    }
    return req as supertest.Test
}

/**
 * @private
 */

function catchError(err: string | Error, req: Request, res: Response) {
    if (!err) err = "error"

    if ("string" !== typeof err) {
        err = err.stack || err.message || err + ""
    }

    err = Buffer.from(err).toString("base64")
    res.setHeader("x-mwsupertest", err)
}
