// Check for Vite environment variable
const getViteEnv = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env;
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
};

const viteEnv = getViteEnv();

const host = viteEnv?.VITE_API_HOST || 
  (typeof process !== 'undefined' && process.env?.VITE_API_HOST) || 
  'localhost';

const port = viteEnv?.VITE_API_PORT || 
  (typeof process !== 'undefined' && process.env?.VITE_API_PORT) || 
  '3000';

const protocol = viteEnv?.VITE_API_PROTOCOL || 
  (typeof process !== 'undefined' && process.env?.VITE_API_PROTOCOL) || 
  'http';

export const API_CONFIG = {
  HOST: host,
  PORT: port,
  PROTOCOL: protocol,
  baseUrl: `${protocol}://${host}:${port}`
};