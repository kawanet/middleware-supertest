#!/usr/bin/env mocha -R spec

import {Request, Response} from "express";
import {mwsupertest} from "../lib/middleware-supertest";

const TITLE = __filename.split("/").pop();

////////////////////////////////////////////////

const assert = require("assert").strict;
const express = require("express");
// const {mwsupertest} = require("middleware-supertest");

const app = express();

// your Express application

app.use((req: Request, res: Response) => {
    res.header("x-foo", "FOO");
    res.status(200);
    res.send("OK");
})

// your Mocha test

describe(TITLE, async () => {
    it("/home", async () => {
        await mwsupertest(app)
            .getString(str => assert.equal(str, "OK"))
            .getBuffer(buf => assert.equal(buf.length, 2))
            .getResponse(res => assert.equal(res.statusCode, 200))
            .getResponse(res => assert.equal(res.getHeader("x-foo"), "FOO"))
            .getRequest(req => assert.equal(req.path, "/home"))
            // abobe tests runs on server-side
            .get("/home")
            // below tests runs on client-side
            .expect(200)
            .expect("x-foo", "FOO")
            .expect("OK");
    });
})