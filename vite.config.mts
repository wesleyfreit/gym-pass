import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environmentMatchGlobs: [['src/http/**', 'prisma']],
    poolOptions: {
      threads: { execArgv: ["--env-file=.env"] },
    }
  },
});
