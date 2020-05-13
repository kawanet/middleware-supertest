"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MWSuperTest = exports.mwsupertest = void 0;
const express = require("express");
const express_intercept_1 = require("express-intercept");
const supertest = require("supertest");
exports.mwsupertest = (app) => new MWSuperTest(app);
class MWSuperTest {
    constructor(app) {
        this.app = app;
        this.handlers = express.Router();
    }
    agent() {
        return this._agent || (this._agent = supertest(express().use(this.handlers).use(this.app)));
    }
    use(mw) {
        this.handlers.use(mw);
        this._agent = null;
        return this;
    }
    getString(test) {
        return this.use(express_intercept_1.responseHandler().getString((str, req, res) => {
            return Promise.resolve(str).then(test).catch(err => catchError(err, req, res));
        }));
    }
    getBuffer(test) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve(buf).then(test).catch(err => catchError(err, req, res));
        }));
    }
    getRequest(test) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => test(req)).catch(err => catchError(err, req, res));
        }));
    }
    getResponse(test) {
        return this.use(express_intercept_1.responseHandler().getBuffer((buf, req, res) => {
            return Promise.resolve().then(() => test(res)).catch(err => catchError(err, req, res));
        }));
    }
    delete(url) {
        return wrapRequest(this.agent().delete.apply(this.agent, arguments));
    }
    get(url) {
        return wrapRequest(this.agent().get.apply(this.agent, arguments));
    }
    head(url) {
        return wrapRequest(this.agent().head.apply(this.agent, arguments));
    }
    post(url) {
        return wrapRequest(this.agent().post.apply(this.agent, arguments));
    }
    put(url) {
        return wrapRequest(this.agent().put.apply(this.agent, arguments));
    }
}
exports.MWSuperTest = MWSuperTest;
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
function catchError(err, req, res) {
    if (!err)
        err = "error";
    const e = err;
    err = e.stack || e.message || err;
    err = Buffer.from(err).toString("base64");
    res.setHeader("x-mwsupertest", err);
}
