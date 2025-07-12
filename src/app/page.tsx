import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/home/hero-section";
import { SuggestedItems } from "@/components/home/suggested-items";
import { CategorySections } from "@/components/home/category-sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <SuggestedItems />
        <CategorySections />
      </main>
    </div>
  );
}
