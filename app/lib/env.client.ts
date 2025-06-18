declare global {
  interface Window {
    ENV: {
      API_URL?: string;
      NODE_ENV?: string;
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