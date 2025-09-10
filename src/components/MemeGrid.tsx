import { MemeCard } from "./MemeCard";

// Mock data for demonstration
const mockMemes = [
  {
    id: "1",
    title: "When you finally understand recursion",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop",
    upvotes: 1247,
    downvotes: 23,
    comments: 156,
    tags: ["programming", "relatable"],
    author: "codewizard",
    timeAgo: "2h ago"
  },
  {
    id: "2", 
    title: "Me explaining to my cat why I can't pet them right now",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    upvotes: 892,
    downvotes: 12,
    comments: 89,
    tags: ["cats", "funny"],
    author: "catperson",
    timeAgo: "4h ago"
  },
  {
    id: "3",
    title: "When the code works on the first try",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
    upvotes: 2156,
    downvotes: 34,
    comments: 234,
    tags: ["programming", "miracle"],
    author: "debugmaster",
    timeAgo: "6h ago"
  },
  {
    id: "4",
    title: "POV: You're trying to center a div",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    upvotes: 1789,
    downvotes: 45,
    comments: 167,
    tags: ["css", "struggle"],
    author: "frontend_dev",
    timeAgo: "8h ago"
  },
  {
    id: "5",
    title: "When someone says they don't use Stack Overflow",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    upvotes: 3421,
    downvotes: 78,
    comments: 445,
    tags: ["programming", "truth"],
    author: "realdev",
    timeAgo: "12h ago"
  },
  {
    id: "6",
    title: "My face when the build passes after 20 attempts",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop",
    upvotes: 987,
    downvotes: 19,
    comments: 123,
    tags: ["devlife", "relief"],
    author: "buildbreaker",
    timeAgo: "1d ago"
  }
];

export const MemeGrid = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMemes.map((meme) => (
          <MemeCard key={meme.id} {...meme} />
        ))}
      </div>
      
      {/* Load More Section */}
      <div className="flex justify-center mt-8">
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