export const setupGracefulShutdown = (cleanup: () => Promise<void> | void) => {
  const shutdown = async () => {
    console.log('Shutting down...');
    try {
      await cleanup();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown as any);
  process.on('SIGTERM', shutdown as any);
};

