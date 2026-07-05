"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const pool_1 = require("../db/pool");
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password required" });
        }
        const existing = await pool_1.pool.query("SELECT id FROM users WHERE email=$1", [email]);
        if (existing.rowCount)
            return res.status(409).json({ message: "email already exists" });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const id = (0, uuid_1.v4)();
        await pool_1.pool.query("INSERT INTO users (id, email, password_hash, name) VALUES ($1,$2,$3,$4)", [id, email, passwordHash, name || null]);
        const token = (0, jwt_1.signToken)({ userId: id, email });
        return res.status(201).json({ token, user: { id, email, name: name || null } });
    }
    catch (e) {
        return res.status(500).json({ message: "register failed", error: String(e) });
    }
}
exports.register = register;
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password required" });
        }
        const r = await pool_1.pool.query("SELECT id,email,name,password_hash FROM users WHERE email=$1", [email]);
        if (!r.rowCount)
            return res.status(401).json({ message: "invalid credentials" });
        const user = r.rows[0];
        const ok = await bcrypt_1.default.compare(password, user.password_hash);
        if (!ok)
            return res.status(401).json({ message: "invalid credentials" });
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (e) {
        return res.status(500).json({ message: "login failed", error: String(e) });
    }
}
exports.login = login;
