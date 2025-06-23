// Server-side environment configuration
export function getClientEnv() {
  return {
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_RAW_CONTENT_URL: process.env.GITHUB_RAW_CONTENT_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  };
}

export type ClientEnv = ReturnType<typeof getClientEnv>;