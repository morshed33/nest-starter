interface AppConfig {
  nodeEnv: 'development' | 'production' | 'staging' | 'test';
  port: number;
  jwtSecret: string;
  corsOrigin: string;
}

const VALID_NODE_ENVS: AppConfig['nodeEnv'][] = [
  'development',
  'production',
  'staging',
  'test',
];

function validateAppConfig(env: Record<string, unknown>): AppConfig {
  const errors: string[] = [];

  const nodeEnv = (env.NODE_ENV as AppConfig['nodeEnv']) || 'development';
  const port = Number(env.PORT);
  const jwtSecret = env.JWT_SECRET as string;
  const corsOrigin = env.CORS_ORIGIN as string;

  if (!VALID_NODE_ENVS.includes(nodeEnv)) {
    errors.push(
      `NODE_ENV must be one of: ${VALID_NODE_ENVS.join(', ')} (received: ${nodeEnv})`,
    );
  }

  if (!Number.isInteger(port) || port <= 0) {
    errors.push(`PORT must be a positive integer (received: ${port})`);
  }

  if (!jwtSecret || typeof jwtSecret !== 'string' || jwtSecret.length < 16) {
    errors.push(`JWT_SECRET must be a string with at least 16 characters`);
  }

  if (!corsOrigin || typeof corsOrigin !== 'string') {
    errors.push(`CORS_ORIGIN is required and must be a string`);
  } else {
    try {
      new URL(corsOrigin);
    } catch {
      errors.push(`CORS_ORIGIN must be a valid URL (received: ${corsOrigin})`);
    }
  }

  if (errors.length) {
    throw new Error(`Invalid configuration:\n- ${errors.join('\n- ')}`);
  }

  return {
    nodeEnv,
    port,
    jwtSecret,
    corsOrigin,
  };
}

let appConfig: AppConfig;

try {
  appConfig = validateAppConfig(process.env);
} catch (err) {
  console.error('❌ Invalid app configuration:');
  console.error((err as Error).message);
  process.exit(1);
}

export { appConfig };
export type { AppConfig };
