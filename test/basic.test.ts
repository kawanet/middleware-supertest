#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as express from "express";
import {RequestHandler} from "express";

import {mwsupertest} from "../lib/middleware-supertest";

const TITLE = __filename.split("/").pop();

const toHEX = (buf: Buffer) => Buffer.from(buf).toString("hex") || "(empty)";

describe(TITLE, () => {
    const handler: RequestHandler = (req, res) => {
        res.header("x-test", "response header");
        res.send("SUCCESS");
    };

    const app = express().use(handler);

    it("getString", async () => {
        await mwsupertest(app)
            .getString(str => assert.equal(str, "SUCCESS"))
            .get("/")
            .expect(200)
            .expect("SUCCESS");
    });

    it("getBuffer", async () => {
        await mwsupertest(app)
            .getBuffer(buf => assert.equal(toHEX(buf), toHEX(Buffer.from("SUCCESS"))))
            .get("/")
            .expect(200)
            .expect("SUCCESS");
    });

    it("getResponse", async () => {
        await mwsupertest(app)
            .getResponse(res => assert.equal(res.getHeader("x-test"), "response header"))
            .get("/")
            .expect(200)
            .expect("x-test", "response header")
            .expect("SUCCESS");
    });

    it("getRequest", async () => {
        await mwsupertest(app)
            .getRequest(req => assert.equal(req.header("x-test"), "request header"))
            .get("/")
            .set({"x-test": "request header"})
            .expect(200)
            .expect("SUCCESS");
    });
});
