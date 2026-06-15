import type {Request, Response} from "express"
import {strict as assert} from "node:assert"
import {describe, it} from "node:test"

import {mwsupertest} from "../../lib/middleware-supertest.ts"
import type {ExpressModule} from "./util.ts"

////////////////////////////////////////////////

// const {mwsupertest} = require("middleware-supertest");

export function runSynopsisTests(label: string, express: ExpressModule): void {
    const app = express()

    // your Express application

    app.use((req: Request, res: Response) => {
        res.header("x-foo", "FOO")
        res.status(200)
        res.send("OK")
    })

    // your Mocha test

    describe(`${label}: synopsis`, async () => {
        it("/home", async () => {
            await mwsupertest(app)
                .getRequest(req => assert.equal(req.path, "/home"))
                .getResponse(res => assert.equal(res.statusCode, 200))
                .getResponse(res => assert.equal(res.getHeader("x-foo"), "FOO"))
                .getString(str => assert.equal(str, "OK"))
                .getBuffer(buf => assert.equal(buf.length, 2))
                // above tests runs on server-side
                .get("/home")
                // below tests runs on client-side
                .expect(res => assert.equal(res.status, 200))
                .expect(res => assert.equal(res.header["x-foo"], "FOO"))
                .expect(res => assert.equal(res.text, "OK"))
        })
    })
}
