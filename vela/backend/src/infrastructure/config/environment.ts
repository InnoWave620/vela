import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresInSeconds: number;
    refreshExpiresInSeconds: number;
  };
  corsOrigin: string;
}

export const env: EnvironmentConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'vela_fallback_secret_access_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'vela_fallback_secret_refresh_key',
    accessExpiresInSeconds: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '3600', 10),
    refreshExpiresInSeconds: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10),
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

