import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, TrendingUp, Clock, Users, Zap } from "lucide-react";

const categories = [
  { name: "All", icon: Zap, active: true },
  { name: "Trending", icon: TrendingUp, active: false },
  { name: "Recent", icon: Clock, active: false },
  { name: "Funny", icon: Users, active: false },
];

export const Header = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-neon">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MemeHub
              </h1>
              <p className="text-xs text-muted-foreground">
                The ultimate meme destination
              </p>
            </div>
          </div>
          
          <Button variant="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Meme
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search memes, tags, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/30 border-border/50 focus:border-neon-purple/50 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            
            return (
              <Button
                key={category.name}
                variant={isActive ? "neon" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category.name)}
                className={`gap-2 whitespace-nowrap ${
                  isActive 
                    ? "shadow-neon" 
                    : "hover:bg-secondary/50 hover:text-neon-purple"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
          
          {/* Popular Tags */}
          <div className="flex items-center gap-1 ml-4">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["dank", "relatable", "gaming"].map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs cursor-pointer bg-secondary/30 hover:bg-neon-purple/20 hover:text-neon-purple transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};