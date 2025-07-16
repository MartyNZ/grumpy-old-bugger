import { GOOGLE_OAUTH_CONFIG } from './config.js'

export default defineEventHandler(async (event) => {
  try {
    // Check if user has valid tokens
    const tokenCookie = getCookie(event, 'google_merchant_tokens')
    
    if (!tokenCookie) {
      return {
        authenticated: false,
        message: 'No authentication tokens found'
      }
    }
    
    const tokenData = JSON.parse(tokenCookie)
    const now = Date.now()
    
    // Check if token is expired
    if (tokenData.expires_at && now >= tokenData.expires_at) {
      // TODO: Attempt to refresh token if refresh_token is available
      if (tokenData.refresh_token) {
        try {
          const refreshedTokens = await refreshAccessToken(tokenData.refresh_token)
          
          // Update cookie with new tokens
          const newTokenData = {
            ...tokenData,
            access_token: refreshedTokens.access_token,
            expires_at: Date.now() + (refreshedTokens.expires_in * 1000)
          }
          
          setCookie(event, 'google_merchant_tokens', JSON.stringify(newTokenData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: refreshedTokens.expires_in || 3600
          })
          
          return {
            authenticated: true,
            user_email: tokenData.user_email,
            expires_at: newTokenData.expires_at,
            message: 'Token refreshed successfully'
          }
        } catch (refreshError) {
          return {
            authenticated: false,
            message: 'Token expired and refresh failed',
            error: refreshError.message
          }
        }
      }
      
      return {
        authenticated: false,
        message: 'Token expired and no refresh token available'
      }
    }
    
    // Token is valid
    return {
      authenticated: true,
      user_email: tokenData.user_email,
      expires_at: tokenData.expires_at,
      expires_in_minutes: Math.round((tokenData.expires_at - now) / 60000),
      message: 'Authentication valid'
    }
    
  } catch (error) {
    return {
      authenticated: false,
      message: 'Error checking authentication status',
      error: error.message
    }
  }
})

async function refreshAccessToken(refreshToken) {
  const config = useRuntimeConfig()
  
  const response = await fetch(GOOGLE_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: config.googleOAuth.clientId,
      client_secret: config.googleOAuth.clientSecret,
      grant_type: 'refresh_token'
    })
  })
  
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Token refresh failed: ${errorData}`)
  }
  
  return await response.json()
}
