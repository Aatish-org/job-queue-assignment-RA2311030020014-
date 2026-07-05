"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullQueue = exports.connection = exports.QUEUE_NAME = void 0;
require("dotenv/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
exports.QUEUE_NAME = "job-queue";
exports.connection = new ioredis_1.default(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
});
exports.bullQueue = new bullmq_1.Queue(exports.QUEUE_NAME, { connection: exports.connection });
