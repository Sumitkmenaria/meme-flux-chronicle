import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { MemeReel } from "@/components/MemeReel";
import { TrendingPage } from "@/components/TrendingPage";
import { ProfilePage } from "@/components/ProfilePage";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { MemeGrid } from "@/components/MemeGrid";
import { useAuth } from "@/hooks/useAuth";
import { useMemes } from "@/hooks/useMemes";
import { Grid3X3, Play } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [viewMode, setViewMode] = useState<"reel" | "grid">("reel");
  const { user } = useAuth();
  const { memes } = useMemes();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="relative">
            {/* View Toggle */}
            <div className="absolute top-4 right-4 z-50 flex bg-black/20 backdrop-blur-sm rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("reel")}
                className={`rounded-full h-10 w-10 p-0 ${
                  viewMode === "reel" 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-full h-10 w-10 p-0 ${
                  viewMode === "grid" 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            {viewMode === "reel" ? (
              <MemeReel memes={memes} />
            ) : (
              <div className="min-h-screen bg-background pb-20">
                <div className="pt-16 px-4">
                  <h1 className="text-2xl font-bold mb-6">Meme Gallery</h1>
                  <MemeGrid />
                </div>
              </div>
            )}
          </div>
        );
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
        return <MemeReel memes={memes} />;
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
