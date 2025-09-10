import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MemeGrid } from "@/components/MemeGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MemeGrid />
    </div>
  );
};

export default Index;
