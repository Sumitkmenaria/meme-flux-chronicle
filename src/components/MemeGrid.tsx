import { MemeCard } from "./MemeCard";
import { useMemes } from "@/hooks/useMemes";
import { Skeleton } from "@/components/ui/skeleton";

const MemeGridSkeleton = () => (
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
);

export const MemeGrid = () => {
  const { memes, loading } = useMemes();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <MemeGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {memes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No memes yet</h3>
          <p className="text-muted-foreground">Be the first to share a meme with the community!</p>
        </div>
      )}
      
      {/* Load More Section */}
      {memes.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="bg-gradient-card rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Want to see more memes?
            </h3>
            <p className="text-muted-foreground mb-4">
              More memes are loading as the community grows!
            </p>
            <div className="flex gap-2 justify-center">
              <div className="h-2 w-2 rounded-full bg-neon-purple animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-neon-pink animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

        <div className="bg-gradient-card rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Want to see more memes?
          </h3>
          <p className="text-muted-foreground mb-4">
            Connect to Supabase to enable infinite scroll and personalized feeds!
          </p>
          <div className="flex gap-2 justify-center">
            <div className="h-2 w-2 rounded-full bg-neon-purple animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-neon-pink animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};