import { GOOGLE_OAUTH_CONFIG, validateOAuthConfig } from './config.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { code, state, error } = query
    
    // Handle OAuth errors
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: `OAuth error: ${error}`
      })
    }
    
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing authorization code'
      })
    }
    
    // Verify state parameter
    const stateCookie = getCookie(event, 'google_oauth_state')
    if (!stateCookie) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing or expired state parameter'
      })
    }
    
    const stateData = JSON.parse(stateCookie)
    if (stateData.state !== state) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid state parameter'
      })
    }
    
    // Check if state is not too old (10 minutes)
    if (Date.now() - stateData.timestamp > 600000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'State parameter expired'
      })
    }
    
    // Validate OAuth configuration
    const configValidation = validateOAuthConfig()
    if (!configValidation.isValid) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OAuth configuration error'
      })
    }
    
    const config = useRuntimeConfig()
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(GOOGLE_OAUTH_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.googleOAuth.clientId,
        client_secret: config.googleOAuth.clientSecret,
        redirect_uri: config.googleOAuth.redirectUri,
        grant_type: 'authorization_code'
      })
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      throw createError({
        statusCode: 400,
        statusMessage: `Token exchange failed: ${errorData}`
      })
    }
    
    const tokens = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch(GOOGLE_OAUTH_CONFIG.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    const userInfo = userResponse.ok ? await userResponse.json() : null
    
    // TODO: Store tokens securely (database, encrypted storage, etc.)
    // For now, we'll return them and log (don't do this in production!)
    console.log('Google OAuth tokens received:', {
      access_token: tokens.access_token ? '[REDACTED]' : null,
      refresh_token: tokens.refresh_token ? '[REDACTED]' : null,
      expires_in: tokens.expires_in,
      user: userInfo?.email
    })
    
    // Clear state cookie
    deleteCookie(event, 'google_oauth_state')
    
    // Store tokens temporarily in a cookie (in production, use proper storage)
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      user_email: userInfo?.email
    }
    
    setCookie(event, 'google_merchant_tokens', JSON.stringify(tokenData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600
    })
    
    // Redirect to return URL or admin page
    const returnUrl = stateData.returnUrl || '/admin/google-merchant'
    await sendRedirect(event, `${returnUrl}?auth=success&user=${encodeURIComponent(userInfo?.email || 'unknown')}`, 302)
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Redirect to error page or return URL with error
    const returnUrl = '/admin/google-merchant?auth=error&message=' + encodeURIComponent(error.message)
    await sendRedirect(event, returnUrl, 302)
  }
})
