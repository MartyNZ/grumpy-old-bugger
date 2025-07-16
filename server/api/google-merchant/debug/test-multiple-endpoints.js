import { getAuthenticatedTokens } from '../auth/utils.js'

export default defineEventHandler(async (event) => {
  try {
    const tokens = await getAuthenticatedTokens(event)
    
    // Test multiple possible endpoint variations
    const endpoints = [
      'https://shoppingcontent.googleapis.com/content/v2.1/accounts',
      'https://www.googleapis.com/shopping/content/v2.1/accounts',
      'https://content.googleapis.com/shopping/v2.1/accounts',
      'https://shoppingcontent.googleapis.com/shopping/content/v2.1/accounts',
      'https://shoppingcontent.googleapis.com/content/v2/accounts'
    ]
    
    const results = []
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          results.push({
            endpoint,
            status: 'SUCCESS',
            statusCode: response.status,
            dataKeys: Object.keys(data),
            accountCount: data.resources?.length || data.accounts?.length || 0
          })
        } else {
          const errorText = await response.text()
          results.push({
            endpoint,
            status: 'ERROR',
            statusCode: response.status,
            error: errorText.substring(0, 100) + '...'
          })
        }
      } catch (fetchError) {
        results.push({
          endpoint,
          status: 'FETCH_ERROR',
          error: fetchError.message
        })
      }
    }
    
    // Also test the official Google Shopping API discovery endpoint
    try {
      const discoveryResponse = await fetch('https://www.googleapis.com/discovery/v1/apis/content/v2.1/rest')
      const discoveryData = await discoveryResponse.json()
      
      results.push({
        endpoint: 'DISCOVERY',
        status: 'SUCCESS',
        baseUrl: discoveryData.baseUrl,
        servicePath: discoveryData.servicePath,
        fullBaseUrl: discoveryData.rootUrl + discoveryData.servicePath
      })
    } catch (discoveryError) {
      results.push({
        endpoint: 'DISCOVERY',
        status: 'ERROR',
        error: discoveryError.message
      })
    }
    
    return {
      message: 'Testing multiple Google Shopping Content API endpoints',
      authentication: {
        valid: true,
        user: tokens.user_email || 'authenticated'
      },
      results,
      workingEndpoints: results.filter(r => r.status === 'SUCCESS'),
      recommendation: results.find(r => r.status === 'SUCCESS')?.endpoint || 'none_found'
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})
