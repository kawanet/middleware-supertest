#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as express from "express";
import {RequestHandler} from "express";

import {mwsupertest} from "../lib/middleware-supertest";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    it("200", async () => {
        await mwsupertest(app(200))
            .getResponse(res => assert.equal(res.statusCode, 200))
            .get("/")
            .expect(200);
    });

    it("302", async () => {
        await mwsupertest(app(302))
            .getResponse(res => assert.equal(res.statusCode, 302))
            .get("/")
            .expect(302);
    });

    it("404", async () => {
        await mwsupertest(app(404))
            .getResponse(res => assert.equal(res.statusCode, 404))
            .get("/")
            .expect(404);
    });

    it("500", async () => {
        await mwsupertest(app(500))
            .getResponse(res => assert.equal(res.statusCode, 500))
            .get("/")
            .expect(500);
    });
});

function app(status: number) {
    const handler: RequestHandler = (req, res) => {
        res.status(status).end();
    };

    return express().use(handler);
}