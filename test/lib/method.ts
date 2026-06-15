import type {RequestHandler} from "express"
import {describe, it} from "node:test"
import {mwsupertest} from "../../lib/middleware-supertest.ts"
import type {ExpressModule} from "./util.ts"

export function runMethodTests(label: string, express: ExpressModule): void {
    describe(`${label}: method`, () => {
        const app = express()

        const handler: RequestHandler = (req, res, next) => {
            res.header("x-method", req.method)
            next()
        }
        app.use(handler)

        app.head("/", (req, res) => res.send("HEAD"))
        app.get("/", (req, res) => res.send("GET"))
        app.post("/", (req, res) => res.send("POST"))
        app.put("/", (req, res) => res.send("PUT"))
        app.delete("/", (req, res) => res.send("DELETE"))

        it("HEAD", async () => {
            await mwsupertest(app).head("/").expect("x-method", "HEAD")
        })

        it("GET", async () => {
            await mwsupertest(app).get("/").expect("GET")
        })

        it("POST", async () => {
            await mwsupertest(app).post("/").expect("POST")
        })

        it("PUT", async () => {
            await mwsupertest(app).put("/").expect("PUT")
        })

        it("DELETE", async () => {
            await mwsupertest(app).delete("/").expect("DELETE")
        })
    })
}
