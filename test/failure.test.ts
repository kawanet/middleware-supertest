#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as express from "express";
import {RequestHandler} from "express";

import {MWSuperTest, mwsupertest} from "../";

const TITLE = __filename.split("/").pop();

/**
 * This is a test to test mwsupertest to capture assertion thrown during mwsupertest.
 */

describe(TITLE, () => {
    const handler: RequestHandler = (req, res) => res.send("SUCCESS");
    const prefix = "something wrong with ";
    const app = express().use(handler);

    test("getString", mwsupertest(app).getString(async () => assert.ok(false, prefix + "getString")));

    test("getBuffer", mwsupertest(app).getString(async () => assert.ok(false, prefix + "getBuffer")));

    test("getResponse", mwsupertest(app).getString(async () => assert.ok(false, prefix + "getResponse")));

    test("getRequest", mwsupertest(app).getString(async () => assert.ok(false, prefix + "getRequest")));

    function test(title: string, testApp: MWSuperTest) {
        it(title, async () => {
            let error: Error;
            try {
                await testApp.get("/").expect(500);
            } catch (e) {
                error = e;
            }
            assert.ok(String(error).indexOf(prefix + title) > -1, String(error));
        });
    }
});
