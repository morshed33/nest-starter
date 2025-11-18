import { z } from 'zod';

const dbConfigSchema = z.object({
  databaseUrl: z.url(),
  connectionLimit: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().int().positive().default(10),
  ),
});

const rawDbConfig = {
  databaseUrl: process.env.DATABASE_URL,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ?? '10',
};

let dbConfig: z.infer<typeof dbConfigSchema>;

try {
  dbConfig = dbConfigSchema.parse(rawDbConfig);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid database configuration:');
    for (const issue of error.issues) {
      console.error(`- ${issue.path.join('.')} : ${issue.message}`);
    }
    process.exit(1);
  }
  throw error;
}

export { dbConfig };

export type DbConfig = z.infer<typeof dbConfigSchema>;
