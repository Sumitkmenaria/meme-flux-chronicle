import { useState } from "react";
import { MemeGrid } from "./MemeGrid";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Flame } from "lucide-react";

export const TrendingPage = () => {
  const [activeFilter, setActiveFilter] = useState("hot");

  const filters = [
    { id: "hot", label: "Hot", icon: Flame },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "new", label: "New", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="pt-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Trending Memes</h1>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        <MemeGrid />
      </div>
    </div>
  );
};