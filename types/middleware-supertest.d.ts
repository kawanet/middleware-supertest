/// <reference types="node" />

import type {NextHandleFunction} from "connect"
import type {Express, Request, Response} from "express"
import type * as supertest from "supertest"

export {} // external module indicator

export const mwsupertest: (app: Express) => MWSuperTest

/**
 * Test an Express.js `RequestHandler` middleware on both the server side
 * and the client side in a single chain.
 */
export interface MWSuperTest {
    /**
     * Mounts an additional middleware before the handler under test, scoped
     * to the agent built by this `MWSuperTest` instance.
     *
     * The middleware runs before the consumer-supplied app handles the
     * request, so it sees the raw Node `IncomingMessage` / `ServerResponse`,
     * not the Express-extended `Request` / `Response`. Use Node-standard
     * APIs here. Express extension methods become available in
     * `getRequest()` / `getResponse()` callbacks after the app has handled
     * the same objects in place.
     */
    use(mw: NextHandleFunction): this

    /**
     * Registers a server-side check that runs against the response body
     * decoded as a UTF-8 `string`.
     */
    getString(checker: (str: string) => (any | Promise<any>)): this

    /**
     * Registers a server-side check that runs against the response body
     * as a raw `Buffer`.
     */
    getBuffer(checker: (buf: Buffer) => (any | Promise<any>)): this

    /**
     * Registers a server-side check that runs against the inbound `req`
     * object once Express has finished routing it.
     */
    getRequest(checker: (req: Request) => (any | Promise<any>)): this

    /**
     * Registers a server-side check that runs against the outbound `res`
     * object just before the response is flushed to the client.
     */
    getResponse(checker: (res: Response) => (any | Promise<any>)): this

    /**
     * Performs an HTTP `DELETE` request and returns a SuperTest object
     * so further client-side assertions can chain on.
     */
    delete(url: string): supertest.Test

    /**
     * Performs an HTTP `GET` request and returns a SuperTest object so
     * further client-side assertions can chain on.
     */
    get(url: string): supertest.Test

    /**
     * Performs an HTTP `HEAD` request and returns a SuperTest object so
     * further client-side assertions can chain on.
     */
    head(url: string): supertest.Test

    /**
     * Performs an HTTP `POST` request and returns a SuperTest object so
     * further client-side assertions can chain on.
     */
    post(url: string): supertest.Test

    /**
     * Performs an HTTP `PUT` request and returns a SuperTest object so
     * further client-side assertions can chain on.
     */
    put(url: string): supertest.Test
}
