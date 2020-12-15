"use strict";
// middleware-supertest.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MWSuperTest = exports.mwsupertest = void 0;
const express = require("express");
const express_intercept_1 = require("express-intercept");
const supertest = require("supertest");
const mwsupertest = (app) => new MWSuperTest(app);
exports.mwsupertest = mwsupertest;
/**
 * Testing Express.js RequestHandler middlewares both on server-side and client-side
 */
class MWSuperTest {
    constructor(app) {
        this.app = app;
        this.handlers = express.Router();
        //
    }
    agent() {
        return this._agent || (this._agent = supertest(express().use(this.handlers).use(this.app)));
    }
    use(mw) {
        this.handlers.use(mw);
        this._agent = null;
        return this;
    }
    /**
     * defines a test function to test the response body as a `string` on server-side.
     */
    getString(checker) {
        return this.use(express_intercept_1.responseHandler().getString((str, req, res) => {
            return Promise.resolve(str).then(checker).catch(err => catchError(err, req, res));
        }));
    }
    /**
     * defines a test function to test the response body as a `Buffer` on server-side.
     */
    getBuffer(checker) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve(buf).then(checker).catch(err => catchError(err, req, res));
        }));
    }
    /**
     * defines a test function to test the response object aka `res` on server-side.
     */
    getRequest(checker) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => checker(req)).catch(err => catchError(err, req, res));
        }));
    }
    /**
     * defines a test function to test the request object aka `req` on server-side.
     */
    getResponse(checker) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => checker(res)).catch(err => catchError(err, req, res));
        }));
    }
    /**
     * perform a HTTP `DELETE` request and returns a SuperTest object to continue tests on client-side.
     */
    delete(url) {
        return wrapRequest(this.agent().delete.apply(this.agent, arguments));
    }
    /**
     * perform a HTTP `GET` request and returns a SuperTest object to continue tests on client-side.
     */
    get(url) {
        return wrapRequest(this.agent().get.apply(this.agent, arguments));
    }
    /**
     * perform a HTTP `HEAD` request and returns a SuperTest object to continue tests on client-side.
     */
    head(url) {
        return wrapRequest(this.agent().head.apply(this.agent, arguments));
    }
    /**
     * perform a HTTP `POST` request and returns a SuperTest object to continue tests on client-side.
     */
    post(url) {
        return wrapRequest(this.agent().post.apply(this.agent, arguments));
    }
    /**
     * perform a HTTP `PUT` request and returns a SuperTest object to continue tests on client-side.
     */
    put(url) {
        return wrapRequest(this.agent().put.apply(this.agent, arguments));
    }
}
exports.MWSuperTest = MWSuperTest;
/**
 * @private
 */
function wrapRequest(req) {
    const _req = req;
    const _assert = _req.assert;
    _req.assert = function (resError, res, fn) {
        let err = res.header["x-mwsupertest"];
        if (err) {
            err = Buffer.from(err, "base64").toString();
            resError = new Error(err);
            res = null;
        }
        if (_assert) {
            return _assert.call(this, resError, res, fn);
        }
    };
    return req;
}
/**
 * @private
 */
function catchError(err, req, res) {
    if (!err)
        err = "error";
    if ("string" !== typeof err) {
        err = err.stack || err.message || err + "";
    }
    err = Buffer.from(err).toString("base64");
    res.setHeader("x-mwsupertest", err);
}
