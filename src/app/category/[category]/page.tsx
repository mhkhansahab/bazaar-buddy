import { CategoryPage } from "@/components/category/category-page";

export default async function Category({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryPage category={category} />;
}
