"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGracefulShutdown = void 0;
const setupGracefulShutdown = (cleanup) => {
    const shutdown = async () => {
        console.log('Shutting down...');
        try {
            await cleanup();
        }
        finally {
            process.exit(0);
        }
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
};
exports.setupGracefulShutdown = setupGracefulShutdown;
