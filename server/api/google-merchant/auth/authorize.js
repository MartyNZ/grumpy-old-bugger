import { getGoogleOAuthUrl, validateOAuthConfig } from './config.js'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { returnUrl } = query
    
    // Validate OAuth configuration
    const configValidation = validateOAuthConfig()
    if (!configValidation.isValid) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OAuth configuration error: ' + configValidation.errors.join(', ')
      })
    }
    
    const config = useRuntimeConfig()
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(32).toString('hex')
    
    // Store state and return URL in session/temporary storage
    // In production, you'd want to use proper session storage
    const stateData = {
      state,
      returnUrl: returnUrl || '/admin/google-merchant',
      timestamp: Date.now()
    }
    
    // Create authorization URL
    const authUrl = getGoogleOAuthUrl(
      config.googleOAuth.clientId,
      config.googleOAuth.redirectUri,
      state
    )
    
    // Set state cookie for verification
    setCookie(event, 'google_oauth_state', JSON.stringify(stateData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })
    
    // For API calls, return the URL; for browser visits, redirect
    if (getHeader(event, 'accept')?.includes('application/json')) {
      return {
        success: true,
        authUrl,
        message: 'Navigate to authUrl to authorize Google Merchant API access'
      }
    } else {
      // Redirect to Google OAuth
      await sendRedirect(event, authUrl, 302)
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
