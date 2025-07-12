import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

export interface SellerAuth {
  id: string
  email: string
  name: string
  storeName: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(seller: SellerAuth): string {
  return jwt.sign(
    { 
      id: seller.id, 
      email: seller.email, 
      name: seller.name, 
      storeName: seller.storeName 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): SellerAuth | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as SellerAuth
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateSeller(email: string, password: string): Promise<SellerAuth | null> {
  const seller = await prisma.seller.findUnique({
    where: { email }
  })

  if (!seller) {
    return null
  }

  const isValid = await verifyPassword(password, seller.password)
  if (!isValid) {
    return null
  }

  return {
    id: seller.id,
    email: seller.email,
    name: seller.name,
    storeName: seller.storeName
  }
} 