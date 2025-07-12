import { AddProductPage } from "../../../components/seller/add-product-page";
import { ProtectedSellerRoute } from "@/components/seller/protected-seller-route";

export default function AddProduct() {
  return (
    <ProtectedSellerRoute>
      <AddProductPage />
    </ProtectedSellerRoute>
  );
}
