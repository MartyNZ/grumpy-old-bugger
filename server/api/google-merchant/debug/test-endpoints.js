import { makeAuthenticatedRequest } from '../auth/utils.js'

export default defineEventHandler(async (event) => {
  const endpoints = [
    'https://shoppingcontent.googleapis.com/content/v2.1/accounts',
    'https://www.googleapis.com/shopping/content/v2.1/accounts',
    'https://shoppingcontent.googleapis.com/content/v2/accounts',
    'https://content.googleapis.com/content/v2.1/accounts'
  ]
  
  const results = []
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeAuthenticatedRequest(
        endpoint,
        { method: 'GET' },
        event
      )
      
      const data = await response.json()
      results.push({
        endpoint,
        status: 'success',
        accountCount: data.resources?.length || data.accounts?.length || 0,
        dataStructure: Object.keys(data)
      })
    } catch (error) {
      results.push({
        endpoint,
        status: 'error',
        error: error.message.substring(0, 200) + '...'
      })
    }
  }
  
  return {
    message: 'Testing different Google API endpoints',
    results,
    recommendation: results.find(r => r.status === 'success')?.endpoint || 'none_working'
  }
})
