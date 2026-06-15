// Integration tests for the Express 5 line.

import express5 from "express5"
import {runBasicTests} from "./lib/basic.ts"
import {runFailureTests} from "./lib/failure.ts"
import {runMethodTests} from "./lib/method.ts"
import {runStatusTests} from "./lib/status.ts"
import {runSynopsisTests} from "./lib/synopsis.ts"
import type {ExpressModule} from "./lib/util.ts"

const label = "express5"

// Runtime tests cover both Express 4 and 5. Type-level dual coverage
// is intentionally out of scope, so this cast pins express5 to the
// Express 4 baseline that the shared runners type-check against.
const express = express5 as unknown as ExpressModule

runBasicTests(label, express)
runFailureTests(label, express)
runMethodTests(label, express)
runStatusTests(label, express)
runSynopsisTests(label, express)
