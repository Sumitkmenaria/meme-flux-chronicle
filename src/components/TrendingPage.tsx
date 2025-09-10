import { useState } from "react";
import { MemeCard } from "./MemeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Flame, Calendar } from "lucide-react";

// Mock trending data
const trendingMemes = [
  {
    id: "t1",
    title: "When AI finally understands my code",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop",
    upvotes: 5247,
    downvotes: 123,
    comments: 856,
    tags: ["ai", "programming", "relatable"],
    author: "techguru",
    timeAgo: "2h ago"
  },
  {
    id: "t2",
    title: "Me explaining why I need 32GB RAM for coding",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    upvotes: 4892,
    downvotes: 89,
    comments: 723,
    tags: ["programming", "hardware", "funny"],
    author: "rammaster",
    timeAgo: "4h ago"
  },
  // ... more trending memes
];

const timeFilters = [
  { id: "today", label: "Today", icon: Clock },
  { id: "week", label: "This Week", icon: Calendar },
  { id: "month", label: "This Month", icon: TrendingUp },
  { id: "alltime", label: "All Time", icon: Flame },
];

export const TrendingPage = () => {
  const [activeFilter, setActiveFilter] = useState("today");

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            🔥 Trending Memes
          </h1>
          <p className="text-muted-foreground">
            The hottest memes that everyone's talking about
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {timeFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "neon" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={`gap-2 whitespace-nowrap ${
                  isActive 
                    ? "shadow-neon" 
                    : "hover:bg-secondary/50 hover:text-neon-purple"
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-neon-pink">142.3k</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </div>
          <div className="bg-gradient-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-neon-cyan">28.5k</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </div>
          <div className="bg-gradient-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-neon-green">85.2k</div>
            <div className="text-sm text-muted-foreground">Shares</div>
          </div>
          <div className="bg-gradient-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-neon-purple">156</div>
            <div className="text-sm text-muted-foreground">Hot Memes</div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["programming", "relatable", "ai", "funny", "gaming", "cats", "dank", "wholesome"].map((tag) => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="cursor-pointer bg-secondary/30 hover:bg-neon-purple/20 hover:text-neon-purple transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Meme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingMemes.map((meme, index) => (
            <div key={meme.id} className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className={`
                    ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                    ${index === 1 ? 'bg-gray-400 text-black' : ''}
                    ${index === 2 ? 'bg-amber-600 text-white' : ''}
                  `}>
                    #{index + 1}
                  </Badge>
                </div>
              )}
              <MemeCard {...meme} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Load More Trending
          </Button>
        </div>
      </div>
    </div>
  );
};