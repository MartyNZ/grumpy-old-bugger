export default defineEventHandler(async (event) => {
  try {
    // Get current tokens
    const tokenCookie = getCookie(event, 'google_merchant_tokens')
    
    if (tokenCookie) {
      const tokenData = JSON.parse(tokenCookie)
      
      // Revoke the token with Google
      if (tokenData.access_token) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
            method: 'POST'
          })
        } catch (revokeError) {
          console.error('Error revoking token with Google:', revokeError)
          // Continue anyway to clear local tokens
        }
      }
    }
    
    // Clear the authentication cookie
    deleteCookie(event, 'google_merchant_tokens')
    
    return {
      success: true,
      message: 'Authentication revoked successfully'
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
