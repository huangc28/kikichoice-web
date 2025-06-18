// Server-side environment configuration
export function getClientEnv() {
  return {
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    // Add other client-safe environment variables here
    // NEVER expose secrets like API keys, database URLs, etc.
  };
}

export type ClientEnv = ReturnType<typeof getClientEnv>;