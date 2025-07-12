import { SellerDashboard } from "@/components/seller/seller-dashboard";
import { ProtectedSellerRoute } from "@/components/seller/protected-seller-route";

export default function SellerDashboardPage() {
  return (
    <ProtectedSellerRoute>
      <SellerDashboard />
    </ProtectedSellerRoute>
  );
}
