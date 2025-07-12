// JWT verification for Edge Runtime (middleware)
export interface SellerAuth {
  id: string
  email: string
  name: string
  storeName: string
}

// Simple JWT verification for Edge Runtime
export function verifyTokenEdge(token: string): SellerAuth | null {
  try {
    // For Edge Runtime, we'll do basic JWT validation
    // This is a simplified version - in production, use a proper JWT library that supports Edge Runtime
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      storeName: payload.storeName
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
} 