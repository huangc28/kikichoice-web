import { AuthenticateWithRedirectCallback } from '@clerk/remix';

export default function LineOAuthCallback() {
  return <AuthenticateWithRedirectCallback />;
}