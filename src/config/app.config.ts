import { z } from 'zod';

const appConfigSchema = z.object({
  nodeEnv: z
    .enum(['development', 'production', 'staging', 'test'])
    .default('development'),
  port: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().int().positive().default(3000),
  ),
  jwtSecret: z.string().min(16),
  corsOrigin: z.url(),
});

const rawAppConfig = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
};

let appConfig: z.infer<typeof appConfigSchema>;

try {
  appConfig = appConfigSchema.parse(rawAppConfig);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid app configuration:');
    for (const issue of error.issues) {
      console.error(`- ${issue.path.join('.')} : ${issue.message}`);
    }
    process.exit(1);
  }
  throw error;
}

export { appConfig };

export type AppConfig = z.infer<typeof appConfigSchema>;
