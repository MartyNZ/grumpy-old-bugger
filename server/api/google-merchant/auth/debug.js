import { validateOAuthConfig } from './config.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const validation = validateOAuthConfig()
  
  return {
    validation,
    currentConfig: {
      clientId: config.googleOAuth?.clientId ? 
        `${config.googleOAuth.clientId.substring(0, 20)}...` : 
        'NOT SET',
      clientSecret: config.googleOAuth?.clientSecret ? 
        '[SET]' : 
        'NOT SET',
      redirectUri: config.googleOAuth?.redirectUri || 'NOT SET'
    },
    detectedIssues: getDetectedIssues(config),
    troubleshootingSteps: [
      '1. Verify OAuth client is created in Google Cloud Console',
      '2. Check redirect URI matches exactly in Google Cloud Console',
      '3. Ensure OAuth consent screen is configured',
      '4. Add your email to test users if app is in testing mode',
      '5. Enable Google Merchant API in your Google Cloud project'
    ]
  }
})

function getDetectedIssues(config) {
  const issues = []
  
  if (!config.googleOAuth?.clientId || config.googleOAuth.clientId.includes('your-client-id')) {
    issues.push('Client ID not properly configured - still using placeholder value')
  }
  
  if (!config.googleOAuth?.clientSecret || config.googleOAuth.clientSecret.includes('your-client-secret')) {
    issues.push('Client Secret not properly configured - still using placeholder value')
  }
  
  if (!config.googleOAuth?.redirectUri) {
    issues.push('Redirect URI not configured')
  } else if (config.googleOAuth.redirectUri.includes('localhost') && process.env.NODE_ENV === 'production') {
    issues.push('Using localhost redirect URI in production')
  }
  
  return issues
}
