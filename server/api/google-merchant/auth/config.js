/**
 * Google OAuth 2.0 configuration for Merchant API
 */

export const GOOGLE_OAUTH_CONFIG = {
  // OAuth 2.0 endpoints
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  
  // Required scopes for Google Merchant Center API
  scopes: [
    'https://www.googleapis.com/auth/content', // Merchant Center API access
    'openid',
    'email',
    'profile'
  ],
  
  // Response type for authorization code flow
  responseType: 'code',
  
  // Access type for offline refresh tokens
  accessType: 'offline',
  
  // Prompt for consent to get refresh token
  prompt: 'consent'
}

export function getGoogleOAuthUrl(clientId, redirectUri, state = null) {
  // Ensure localhost uses HTTP, not HTTPS
  if (redirectUri.includes('localhost') && redirectUri.startsWith('https://')) {
    redirectUri = redirectUri.replace('https://', 'http://')
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt
  })
  
  if (state) {
    params.append('state', state)
  }
  
  return `${GOOGLE_OAUTH_CONFIG.authUrl}?${params.toString()}`
}

export function validateOAuthConfig() {
  const config = useRuntimeConfig()
  const errors = []
  
  if (!config.googleOAuth?.clientId) {
    errors.push('Missing GOOGLE_OAUTH_CLIENT_ID environment variable')
  }
  
  if (!config.googleOAuth?.clientSecret) {
    errors.push('Missing GOOGLE_OAUTH_CLIENT_SECRET environment variable')
  }
  
  if (!config.googleOAuth?.redirectUri) {
    errors.push('Missing GOOGLE_OAUTH_REDIRECT_URI environment variable')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
