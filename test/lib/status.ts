import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import type {RequestHandler} from "express"

import {mwsupertest} from "../../lib/middleware-supertest.ts"
import type {ExpressModule} from "./util.ts"

export function runStatusTests(label: string, express: ExpressModule): void {
    describe(`${label}: status`, () => {
        const app = (status: number) => {
            const handler: RequestHandler = (req, res) => {
                res.status(status).end()
            }
            return express().use(handler)
        }

        it("200", async () => {
            await mwsupertest(app(200))
                .getResponse(res => assert.equal(res.statusCode, 200))
                .get("/")
                .expect(200)
        })

        it("302", async () => {
            await mwsupertest(app(302))
                .getResponse(res => assert.equal(res.statusCode, 302))
                .get("/")
                .expect(302)
        })

        it("404", async () => {
            await mwsupertest(app(404))
                .getResponse(res => assert.equal(res.statusCode, 404))
                .get("/")
                .expect(404)
        })

        it("500", async () => {
            await mwsupertest(app(500))
                .getResponse(res => assert.equal(res.statusCode, 500))
                .get("/")
                .expect(500)
        })
    })
}
