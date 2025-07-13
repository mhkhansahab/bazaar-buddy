"use client";

import { useEffect, useState } from "react";
import { getSellerFromStorage, SellerInfo } from "@/lib/seller-auth";
import { useRouter } from "next/navigation";

interface ProtectedSellerRouteProps {
  children: React.ReactNode;
}

export function ProtectedSellerRoute({ children }: ProtectedSellerRouteProps) {
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const sellerInfo = getSellerFromStorage();

    if (!sellerInfo) {
      // Redirect to login if no seller info found
      router.push("/seller/login");
      return;
    }

    setSeller(sellerInfo);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
