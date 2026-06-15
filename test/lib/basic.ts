import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import type {RequestHandler} from "express"

import {mwsupertest} from "../../lib/middleware-supertest.ts"
import type {ExpressModule} from "./util.ts"

const toHEX = (buf: Buffer) => Buffer.from(buf).toString("hex") || "(empty)"

export function runBasicTests(label: string, express: ExpressModule): void {
    describe(`${label}: basic`, () => {
        const handler: RequestHandler = (req, res) => {
            res.header("x-test", "response header")
            res.send("SUCCESS")
        }

        const app = express().use(handler)

        it("getString", async () => {
            await mwsupertest(app)
                .getString(str => assert.equal(str, "SUCCESS"))
                .get("/")
                .expect(200)
                .expect("SUCCESS")
        })

        it("getBuffer", async () => {
            await mwsupertest(app)
                .getBuffer(buf => assert.equal(toHEX(buf), toHEX(Buffer.from("SUCCESS"))))
                .get("/")
                .expect(200)
                .expect("SUCCESS")
        })

        it("getResponse", async () => {
            await mwsupertest(app)
                .getResponse(res => assert.equal(res.getHeader("x-test"), "response header"))
                .get("/")
                .expect(200)
                .expect("x-test", "response header")
                .expect("SUCCESS")
        })

        it("getRequest", async () => {
            await mwsupertest(app)
                .getRequest(req => assert.equal(req.header("x-test"), "request header"))
                .get("/")
                .set({"x-test": "request header"})
                .expect(200)
                .expect("SUCCESS")
        })
    })
}
