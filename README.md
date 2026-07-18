# middleware-supertest

[![Node.js CI](https://github.com/kawanet/middleware-supertest/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/kawanet/middleware-supertest/actions/)
[![npm version](https://img.shields.io/npm/v/middleware-supertest)](https://www.npmjs.com/package/middleware-supertest)

Test an Express.js `RequestHandler` middleware on both the server side and the client side in a single chain.

Works with Express 4 and 5.

## SYNOPSIS

```js
const assert = require("assert").strict;
const express = require("express");
const {mwsupertest} = require("middleware-supertest");

const app = express();

// your Express application

app.use((req, res) => {
    res.header("x-foo", "FOO");
    res.status(200);
    res.send("OK");
})

// your test

describe("mwsupertest", async () => {
    it("/home", async () => {
        await mwsupertest(app)
            .getRequest(req => assert.equal(req.path, "/home"))
            .getResponse(res => assert.equal(res.statusCode, 200))
            .getResponse(res => assert.equal(res.getHeader("x-foo"), "FOO"))
            .getString(str => assert.equal(str, "OK"))
            .getBuffer(buf => assert.equal(buf.length, 2))
            // the assertions above run on the server side
            .get("/home")
            // the assertions below run on the client side
            .expect(res => assert.equal(res.status, 200))
            .expect(res => assert.equal(res.header["x-foo"], "FOO"))
            .expect(res => assert.equal(res.text, "OK"));
    });
})
```

## METHODS

See the TypeScript declaration
[middleware-supertest.d.ts](https://github.com/kawanet/middleware-supertest/blob/main/types/middleware-supertest.d.ts)
for full details.

## SEE ALSO

- https://github.com/kawanet/express-intercept
- https://github.com/kawanet/middleware-supertest
- https://github.com/visionmedia/supertest

## LICENSE

The MIT License (MIT)

Copyright (c) 2020-2026 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
