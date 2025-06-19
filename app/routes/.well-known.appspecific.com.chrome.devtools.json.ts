import { json } from '@remix-run/node';

// Route handler for Chrome DevTools endpoint
// This prevents the "No route matches URL" error in the console
export const loader = () => {
  // Return empty JSON response for Chrome DevTools
  return json({});
};