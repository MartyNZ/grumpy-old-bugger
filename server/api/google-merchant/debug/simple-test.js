import { getAuthenticatedTokens } from '../auth/utils.js'

export default defineEventHandler(async (event) => {
  try {
    // First check if we have valid tokens
    const tokens = await getAuthenticatedTokens(event)
    
    // Test a simple Google API call (userinfo - this should always work)
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    if (!userInfoResponse.ok) {
      throw new Error(`User info failed: ${userInfoResponse.status}`)
    }
    
    const userInfo = await userInfoResponse.json()
    
    // Now test the accounts endpoint
    const accountsResponse = await fetch('https://www.googleapis.com/content/v2.1/accounts', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    
    let accountsResult = {}
    if (accountsResponse.ok) {
      accountsResult = {
        status: 'success',
        data: await accountsResponse.json()
      }
    } else {
      const errorText = await accountsResponse.text()
      accountsResult = {
        status: 'error',
        statusCode: accountsResponse.status,
        error: errorText.substring(0, 500)
      }
    }
    
    return {
      authentication: {
        valid: true,
        user: userInfo.email,
        expires_at: tokens.expires_at
      },
      contentApi: accountsResult,
      nextSteps: accountsResult.status === 'error' ? [
        'The Google Content API may not be enabled for your project',
        'Go to Google Cloud Console → APIs & Services → Library',
        'Search for "Content API for Shopping" and enable it',
        'Also try enabling "Google Shopping Merchant API"'
      ] : [
        'API is working correctly!'
      ]
    }
    
  } catch (error) {
    return {
      authentication: {
        valid: false,
        error: error.message
      },
      nextSteps: [
        'Re-authenticate with Google OAuth',
        'Check that your OAuth setup is correct'
      ]
    }
  }
})
