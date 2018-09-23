// tslint:disable: no-http-string

export default {
  databaseType: process.env.DATABASE_TYPE || 'sqlite',
  databaseName: process.env.DATABASE_NAME || 'database.sqlite',
  databaseSynchronize: process.env.DATABASE_SYNCHRONIZE === undefined ? true : process.env.DATABASE_SYNCHRONIZE,
  databaseLogging: process.env.DATABASE_LOGGING!,
  databaseUsername: process.env.DATABASE_USERNAME!,
  databasePort: process.env.DATABASE_PORT!,
  databaseHost: process.env.DATABASE_HOST!,
  databasePassword: process.env.DATABASE_PASSWORD!,
  environment: process.env.NODE_ENV!,
  port: process.env.PORT || 5001,
  serverUrl: process.env.SERVER_URL || 'http://localhost:5001',
  cryptoSecret: process.env.CRYPTO_SECRET || 'secret',
  jwtSecret: process.env.JWT_SECRET! || 'secret',
  sentryDsn: process.env.SENTRY_DSN!,
};
