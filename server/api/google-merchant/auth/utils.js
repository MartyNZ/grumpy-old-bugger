/**
 * Authentication utilities for Google Merchant API
 */

export async function getAuthenticatedTokens(event) {
  const tokenCookie = getCookie(event, 'google_merchant_tokens')
  
  if (!tokenCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated. Please authorize Google Merchant API access first.'
    })
  }
  
  const tokenData = JSON.parse(tokenCookie)
  const now = Date.now()
  
  // Check if token is expired
  if (tokenData.expires_at && now >= tokenData.expires_at) {
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
        
        return newTokenData
      } catch (refreshError) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token expired and refresh failed. Please re-authenticate.'
        })
      }
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Token expired. Please re-authenticate.'
    })
  }
  
  return tokenData
}

export async function makeAuthenticatedRequest(url, options = {}, event) {
  const tokens = await getAuthenticatedTokens(event)
  
  const headers = {
    'Authorization': `Bearer ${tokens.access_token}`,
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw createError({
      statusCode: response.status,
      statusMessage: `Google API request failed: ${errorText}`
    })
  }
  
  return response
}

async function refreshAccessToken(refreshToken) {
  const config = useRuntimeConfig()
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
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

export function requireAuthentication(handler) {
  return async (event) => {
    // Check authentication before proceeding
    await getAuthenticatedTokens(event)
    return handler(event)
  }
}
