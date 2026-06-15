// Integration tests for the Express 4 line.

import express from "express4"

import {runBasicTests} from "./lib/basic.ts"
import {runFailureTests} from "./lib/failure.ts"
import {runMethodTests} from "./lib/method.ts"
import {runStatusTests} from "./lib/status.ts"
import {runSynopsisTests} from "./lib/synopsis.ts"

const label = "express4"

runBasicTests(label, express)
runFailureTests(label, express)
runMethodTests(label, express)
runStatusTests(label, express)
runSynopsisTests(label, express)
