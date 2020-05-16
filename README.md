# middleware-supertest

Testing Express.js RequestHandler middlewares both on server-side and client-side

[![npm version](https://badge.fury.io/js/middleware-supertest.svg)](https://www.npmjs.com/package/middleware-supertest)

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

// your Mocha test

describe("mwsupertest", async () => {
    it("/home", async () => {
        await mwsupertest(app)
            .getString(str => assert.equal(str, "OK"))
            .getBuffer(buf => assert.equal(buf.length, 2))
            .getResponse(res => assert.equal(res.statusCode, 200))
            .getResponse(res => assert.equal(res.getHeader("x-foo"), "FOO"))
            .getRequest(req => assert.equal(req.path, "/home"))
            // abobe tests runs on server-side
            .get("/home")
            // below tests runs on client-side
            .expect(200)
            .expect("x-foo", "FOO")
            .expect("OK");
    });
})
```

## METHODS

See TypeScript definition
[middleware-supertest.d.ts](https://github.com/kawanet/middleware-supertest/blob/master/types/middleware-supertest.d.ts)
for detail.

## SEE ALSO

- https://github.com/kawanet/express-intercept
- https://github.com/visionmedia/supertest

## LICENSE

The MIT License (MIT)

Copyright (c) 2020 Yusuke Kawasaki

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