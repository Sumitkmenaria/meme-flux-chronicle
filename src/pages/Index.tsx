import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { MemeReel } from "@/components/MemeReel";
import { TrendingPage } from "@/components/TrendingPage";
import { ProfilePage } from "@/components/ProfilePage";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { MemeGrid } from "@/components/MemeGrid";
import { useAuth } from "@/hooks/useAuth";

// Mock data for the reel
const mockMemes = [
  {
    id: "1",
    title: "When you finally understand recursion",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    upvotes: 3421,
    downvotes: 78,
    comments: 445,
    tags: ["programming", "truth"],
    author: "realdev",
    timeAgo: "12h ago"
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <MemeReel memes={mockMemes} />;
      case "trending":
        return <TrendingPage />;
      case "upload":
        if (!user) {
          return (
            <div className="h-full flex items-center justify-center pb-20">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Upload Your Meme</h2>
                <p className="text-muted-foreground mb-6">Sign in to share your memes with the community!</p>
                <AuthModal>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Sign In to Upload
                  </Button>
                </AuthModal>
              </div>
            </div>
          );
        }
        return (
          <div className="h-full flex items-center justify-center pb-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Upload Coming Soon!</h2>
              <p className="text-muted-foreground">Meme upload feature will be available soon.</p>
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="h-full flex items-center justify-center pb-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Activity Feed</h2>
              <p className="text-muted-foreground">See who liked and commented on your memes.</p>
            </div>
          </div>
        );
      case "profile":
        return <ProfilePage />;
      default:
        return <MemeReel memes={mockMemes} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {renderContent()}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
