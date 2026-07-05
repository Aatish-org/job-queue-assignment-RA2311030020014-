"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const worker_controller_1 = require("../controllers/worker.controller");
const router = (0, express_1.Router)();
router.get('/', worker_controller_1.listWorkers);
exports.default = router;
