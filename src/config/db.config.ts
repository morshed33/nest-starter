interface DbConfig {
  databaseUrl: string;
  connectionLimit: number;
}

function validateDbConfig(env: Record<string, unknown>): DbConfig {
  const errors: string[] = [];

  const databaseUrl = env.DATABASE_URL as string;
  const connectionLimit = Number(env.DB_CONNECTION_LIMIT ?? 10);

  if (!databaseUrl || typeof databaseUrl !== 'string') {
    errors.push('DATABASE_URL is required and must be a string');
  } else {
    try {
      new URL(databaseUrl);
    } catch {
      errors.push(
        `DATABASE_URL must be a valid URL (received: ${databaseUrl})`,
      );
    }
  }

  if (!Number.isInteger(connectionLimit) || connectionLimit <= 0) {
    errors.push(
      `DB_CONNECTION_LIMIT must be a positive integer (received: ${connectionLimit})`,
    );
  }

  if (errors.length) {
    throw new Error(
      `Invalid database configuration:\n- ${errors.join('\n- ')}`,
    );
  }

  return {
    databaseUrl,
    connectionLimit,
  };
}

let dbConfig: DbConfig;

try {
  dbConfig = validateDbConfig(process.env);
} catch (err) {
  console.error('❌ Invalid database configuration:');
  console.error((err as Error).message);
  process.exit(1);
}

export { dbConfig };
export type { DbConfig };
