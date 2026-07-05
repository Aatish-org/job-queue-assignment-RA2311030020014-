"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backoff = void 0;
const backoff = (attempt) => Math.min(1000 * 2 ** attempt, 30000);
exports.backoff = backoff;
