import { useState } from "react";
import { MemeCard } from "./MemeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemes } from "@/hooks/useMemes";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, Flame, Calendar } from "lucide-react";

const timeFilters = [
  { id: "today", label: "Today", icon: Clock },
  { id: "week", label: "This Week", icon: Calendar },
  { id: "month", label: "This Month", icon: TrendingUp },
  { id: "alltime", label: "All Time", icon: Flame },
];

export const TrendingPage = () => {
  const [activeFilter, setActiveFilter] = useState("today");
  const { memes, loading } = useMemes();

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gradient-card rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : memes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes
              .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
              .map((meme, index) => (
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
                  <MemeCard meme={meme} />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No trending memes yet</h3>
            <p className="text-muted-foreground">Be the first to create viral content!</p>
          </div>
        )}

        {/* Load More */}
        {memes.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Load More Trending
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Load More Trending
          </Button>
        </div>
      </div>
    </div>
  );
};