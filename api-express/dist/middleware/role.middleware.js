"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
function requireRole(...roles) {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: "forbidden" });
        }
        next();
    };
}
exports.requireRole = requireRole;
