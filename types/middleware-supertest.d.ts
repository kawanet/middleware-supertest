/// <reference types="node" />
import { Request, RequestHandler, Response } from "express";
import * as supertest from "supertest";
export declare const mwsupertest: (app: RequestHandler) => MWSuperTest;
/**
 * Testing Express.js RequestHandler middlewares both on server-side and client-side
 */
export declare class MWSuperTest {
    private app;
    private _agent;
    private handlers;
    constructor(app: RequestHandler);
    private agent;
    use(mw: RequestHandler): this;
    /**
     * defines a test function to test the response body as a `string` on server-side.
     */
    getString(test: (str: string) => (any | Promise<any>)): this;
    /**
     * defines a test function to test the response body as a `Buffer` on server-side.
     */
    getBuffer(test: (buf: Buffer) => (any | Promise<any>)): this;
    /**
     * defines a test function to test the response object aka `res` on server-side.
     */
    getRequest(test: (req: Request) => (any | Promise<any>)): this;
    /**
     * defines a test function to test the request object aka `req` on server-side.
     */
    getResponse(test: (res: Response) => (any | Promise<any>)): this;
    /**
     * perform a HTTP `DELETE` request and returns a SuperTest object to continue tests on client-side.
     */
    delete(url: string): supertest.Test;
    /**
     * perform a HTTP `GET` request and returns a SuperTest object to continue tests on client-side.
     */
    get(url: string): supertest.Test;
    /**
     * perform a HTTP `HEAD` request and returns a SuperTest object to continue tests on client-side.
     */
    head(url: string): supertest.Test;
    /**
     * perform a HTTP `POST` request and returns a SuperTest object to continue tests on client-side.
     */
    post(url: string): supertest.Test;
    /**
     * perform a HTTP `PUT` request and returns a SuperTest object to continue tests on client-side.
     */
    put(url: string): supertest.Test;
}
