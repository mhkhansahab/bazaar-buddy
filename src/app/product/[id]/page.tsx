import { ProductDetailPage } from "@/components/product/product-detail-page";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailPage productId={params.id} />;
}
