import type {RequestHandler} from "express"
import {strict as assert} from "node:assert"
import {describe, it} from "node:test"

import type {MWSuperTest} from "middleware-supertest"
import {mwsupertest} from "../../lib/middleware-supertest.ts"
import type {ExpressModule} from "./util.ts"

/**
 * This is a test to test mwsupertest to capture assertion thrown during mwsupertest.
 */

export function runFailureTests(label: string, express: ExpressModule): void {
    describe(`${label}: failure`, () => {
        const handler: RequestHandler = (req, res) => res.send("SUCCESS")
        const prefix = "something wrong with "
        const app = express().use(handler)

        runCase("getString", mwsupertest(app).getString(async () => assert.ok(false, prefix + "getString")))
        runCase("getBuffer", mwsupertest(app).getBuffer(async () => assert.ok(false, prefix + "getBuffer")))
        runCase("getResponse", mwsupertest(app).getResponse(async () => assert.ok(false, prefix + "getResponse")))
        runCase("getRequest", mwsupertest(app).getRequest(async () => assert.ok(false, prefix + "getRequest")))

        function runCase(title: string, testApp: MWSuperTest) {
            it(title, async () => {
                let error: Error
                try {
                    await testApp.get("/").expect(500)
                } catch (e) {
                    error = e
                }
                assert.ok(String(error).indexOf(prefix + title) > -1, String(error))
            })
        }
    })
}
