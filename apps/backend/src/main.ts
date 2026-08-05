/**
 * Backend Application Entry Point
 * Bootstraps Express + Apollo Server
 */

import 'dotenv/config';
import { createLogger } from '@snake-rescue/shared';
import { prisma } from '@snake-rescue/database';
import { createApp } from './app.js';
import { setupApolloServer } from './server.js';
import { config } from './config/index.js';

const logger = createLogger('Main');

async function bootstrap() {
  try {
    logger.info('Starting Snake Rescue Backend...');

    // Test database connection
    await prisma.$connect();
    logger.info('Database connected');

    // Create Express app
    const app = createApp();

    // Setup Apollo Server
    await setupApolloServer(app);

    // Start server - wrap in promise to keep process alive
    await new Promise<void>((resolve, reject) => {
      const server = app.listen(config.port, config.host, () => {
        logger.info(`🚀 Server ready at http://${config.host}:${config.port}`);
        logger.info(`🔥 GraphQL endpoint: http://${config.host}:${config.port}${config.graphqlPath}`);
        logger.info(`📊 Health check: http://${config.host}:${config.port}/health`);
        logger.info(`🌍 Environment: ${config.nodeEnv}`);
      });

      server.on('error', (error) => {
        logger.error({ msg: 'Server error', error });
        reject(error);
      });

      // Graceful shutdown
      const gracefulShutdown = async (signal: string) => {
        logger.info(`${signal} received, shutting down gracefully...`);
        
        server.close(async () => {
          logger.info('HTTP server closed');
          
          // Disconnect Prisma
          await prisma.$disconnect();
          logger.info('Database disconnected');
          
          resolve();
          process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
          logger.error('Forced shutdown after timeout');
          reject(new Error('Shutdown timeout'));
          process.exit(1);
        }, 10000);
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    });

  } catch (error) {
    logger.error({ msg: 'Failed to start server', error });
    process.exit(1);
  }
}

// Start the application
bootstrap();
