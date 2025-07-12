"use client";

import { useState, useEffect } from 'react';

export interface SellerInfo {
  id: string;
  email: string;
  name: string;
  storeName: string;
}

export function getSellerFromStorage(): SellerInfo | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const seller = localStorage.getItem('seller');
    return seller ? JSON.parse(seller) : null;
  } catch (error) {
    console.error('Failed to parse seller from localStorage:', error);
    return null;
  }
}

export function setSellerToStorage(seller: SellerInfo): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('seller', JSON.stringify(seller));
}

export function removeSellerFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('seller');
}

export function logout(): void {
  removeSellerFromStorage();
  
  // Clear any other auth-related data
  localStorage.removeItem('authToken');
  
  // Show a toast notification if available
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('seller-logout'));
  }
  
  // Redirect to login page
  window.location.href = '/seller/login';
}

export function isSellerLoggedIn(): boolean {
  return getSellerFromStorage() !== null;
}

// Hook to get current seller info with reactivity
export function useSellerAuth() {
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sellerInfo = getSellerFromStorage();
    setSeller(sellerInfo);
    setIsLoading(false);

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedSeller = getSellerFromStorage();
      setSeller(updatedSeller);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    seller,
    isLoading,
    isLoggedIn: seller !== null,
    logout
  };
}
