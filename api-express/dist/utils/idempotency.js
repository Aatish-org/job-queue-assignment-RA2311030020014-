"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyKey = void 0;
const idempotencyKey = (req) => req.headers['idempotency-key'] || null;
exports.idempotencyKey = idempotencyKey;
