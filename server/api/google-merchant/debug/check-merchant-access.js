import { getAuthenticatedTokens } from '../auth/utils.js'

export default defineEventHandler(async (event) => {
  try {
    const tokens = await getAuthenticatedTokens(event)
    const baseUrl = 'https://shoppingcontent.googleapis.com/content/v2.1'
    
    // Test the accounts endpoint with proper authentication
    const accountsResponse = await fetch(`${baseUrl}/accounts`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    
    let accountsResult = {
      url: `${baseUrl}/accounts`,
      status: accountsResponse.status,
      statusText: accountsResponse.statusText
    }
    
    if (accountsResponse.ok) {
      const data = await accountsResponse.json()
      accountsResult.success = true
      accountsResult.data = data
      accountsResult.accountCount = data.resources?.length || 0
    } else {
      const errorText = await accountsResponse.text()
      accountsResult.success = false
      accountsResult.error = errorText
      
      // Check if it's a specific error type
      if (accountsResponse.status === 403) {
        accountsResult.diagnosis = 'Permission denied - Your Google account may not have access to any Merchant Center accounts'
      } else if (accountsResponse.status === 404) {
        accountsResult.diagnosis = 'Endpoint not found - API might not be properly enabled'
      } else if (accountsResponse.status === 401) {
        accountsResult.diagnosis = 'Authentication failed - Token may be invalid'
      }
    }
    
    return {
      message: 'Testing Google Shopping Content API accounts access',
      authentication: {
        valid: true,
        user: tokens.user_email || 'authenticated',
        hasAccessToken: !!tokens.access_token
      },
      apiTest: accountsResult,
      nextSteps: accountsResult.success ? [
        'API access is working!',
        'You can now sync products to Google Merchant Center'
      ] : [
        'Check if you have a Google Merchant Center account set up',
        'Visit https://merchants.google.com to create/verify your account',
        'Ensure your Google account has access to the Merchant Center account',
        'The account used for OAuth must have admin access to Merchant Center'
      ]
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      nextSteps: [
        'Re-authenticate with Google OAuth',
        'Ensure you have proper Merchant Center access'
      ]
    }
  }
})
