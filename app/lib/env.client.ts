declare global {
  interface Window {
    ENV: {
      API_URL?: string;
      NODE_ENV?: string;
      GITHUB_RAW_CONTENT_URL?: string;

      CLERK_PUBLISHABLE_KEY?: string;
      CLERK_SECRET_KEY?: string;

      LINE_ID?: string;
      LINE_CHANNEL_SECRET?: string;
    };
  }
}

export function getEnv() {
  return typeof window !== 'undefined' ? window.ENV : {};
}

export function getApiUrl() {
  return getEnv().API_URL || '';
}

export function isProduction() {
  return getEnv().NODE_ENV === 'production';
}

export function isDevelopment() {
  return getEnv().NODE_ENV === 'development';
}