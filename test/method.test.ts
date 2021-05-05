#!/usr/bin/env mocha -R spec

import * as express from "express";

import {mwsupertest} from "../";
import {RequestHandler} from "express";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    const app = express();

    const handler: RequestHandler = (req, res, next) => {
        res.header("x-method", req.method);
        next();
    }
    app.use(handler);

    app.head("/", (req, res) => res.send("HEAD"));
    app.get("/", (req, res) => res.send("GET"));
    app.post("/", (req, res) => res.send("POST"));
    app.put("/", (req, res) => res.send("PUT"));
    app.delete("/", (req, res) => res.send("DELETE"));

    it("HEAD", async () => {
        await mwsupertest(app).head("/").expect("x-method", "HEAD");
    });

    it("GET", async () => {
        await mwsupertest(app).get("/").expect("GET");
    });

    it("POST", async () => {
        await mwsupertest(app).post("/").expect("POST");
    });

    it("PUT", async () => {
        await mwsupertest(app).put("/").expect("PUT");
    });

    it("DELETE", async () => {
        await mwsupertest(app).delete("/").expect("DELETE");
    });
});
