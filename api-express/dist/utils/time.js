"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iso = exports.now = void 0;
const now = () => Date.now();
exports.now = now;
const iso = () => new Date().toISOString();
exports.iso = iso;
