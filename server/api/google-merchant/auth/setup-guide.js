export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const isDev = process.env.NODE_ENV === 'development'
  const currentUrl = getRequestURL(event)
  const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`
  
  return {
    title: "Google OAuth Setup Guide for Localhost Development",
    currentEnvironment: isDev ? 'development' : 'production',
    detectedBaseUrl: baseUrl,
    
    steps: [
      {
        step: 1,
        title: "Google Cloud Console Setup",
        actions: [
          "Go to https://console.cloud.google.com/apis/credentials",
          "Create new project or select existing",
          "Click 'Create Credentials' → 'OAuth 2.0 Client IDs'",
          "Application type: 'Web application'",
          "Name: 'Grumpy Old Bugger - Local Dev'"
        ]
      },
      {
        step: 2,
        title: "Configure Authorized Redirect URIs",
        note: "Add EXACTLY these URIs (HTTP for localhost):",
        redirectUris: [
          `${baseUrl}/api/google-merchant/auth/callback`,
          "https://grumpyoldbugger.store/api/google-merchant/auth/callback"
        ]
      },
      {
        step: 3,
        title: "Enable Required APIs",
        apis: [
          "Content API for Shopping",
          "Merchant API (Beta)"
        ],
        url: "https://console.cloud.google.com/apis/library"
      },
      {
        step: 4,
        title: "OAuth Consent Screen",
        fields: {
          appName: "Grumpy Old Bugger",
          userSupportEmail: "your-email@example.com",
          developerContact: "your-email@example.com"
        },
        note: "For testing, add your email to 'Test users' section"
      },
      {
        step: 5,
        title: "Update .env File",
        envVars: {
          GOOGLE_OAUTH_CLIENT_ID: "your-client-id.apps.googleusercontent.com",
          GOOGLE_OAUTH_CLIENT_SECRET: "GOCSPX-your-secret",
          GOOGLE_OAUTH_REDIRECT_URI: `${baseUrl}/api/google-merchant/auth/callback`
        }
      }
    ],
    
    currentConfig: {
      clientId: config.googleOAuth?.clientId?.includes('your-client-id') ? 
        'PLACEHOLDER - NEEDS UPDATE' : 
        (config.googleOAuth?.clientId ? 'CONFIGURED' : 'NOT SET'),
      redirectUri: config.googleOAuth?.redirectUri || 'NOT SET'
    },
    
    testUrls: {
      authorize: `${baseUrl}/api/google-merchant/auth/authorize`,
      status: `${baseUrl}/api/google-merchant/auth/status`
    },
    
    troubleshooting: {
      "Access blocked error": [
        "Ensure redirect URI in Google Console exactly matches your .env",
        "Use HTTP (not HTTPS) for localhost",
        "Add your email to OAuth consent screen test users"
      ],
      "This site can't provide secure connection": [
        "Check .env file uses HTTP for localhost",
        "Restart server after .env changes",
        "Verify Google Console has HTTP localhost URI"
      ]
    }
  }
})
