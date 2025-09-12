import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useMemes } from "@/hooks/useMemes";
import { AuthModal } from "./AuthModal";
import { 
  Settings, 
  Share2, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Upload,
  Crown,
  Trophy,
  Zap
} from "lucide-react";

const achievements = [
  { name: "Meme Lord", description: "Posted 100+ memes", icon: Crown, earned: true },
  { name: "Viral Master", description: "Got 10k+ upvotes on a single meme", icon: Trophy, earned: true },
  { name: "Community Favorite", description: "Top contributor this month", icon: Zap, earned: false },
];

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { memes } = useMemes();
  const [activeTab, setActiveTab] = useState("posts");

  // Filter user's memes
  const userMemes = memes.filter(meme => meme.user_id === user?.id);
  
  // Calculate user stats
  const totalUpvotes = userMemes.reduce((sum, meme) => sum + meme.upvotes, 0);
  const totalComments = userMemes.reduce((sum, meme) => sum + meme.comments_count, 0);
  
  const userStats = [
    { label: "Memes Posted", value: userMemes.length.toString(), icon: Upload, color: "text-neon-purple" },
    { label: "Total Upvotes", value: totalUpvotes > 999 ? `${(totalUpvotes / 1000).toFixed(1)}k` : totalUpvotes.toString(), icon: Heart, color: "text-neon-pink" },
    { label: "Comments", value: totalComments > 999 ? `${(totalComments / 1000).toFixed(1)}k` : totalComments.toString(), icon: MessageCircle, color: "text-neon-cyan" },
    { label: "Followers", value: "0", icon: TrendingUp, color: "text-neon-green" },
  ];

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center pb-20">
        <Card className="max-w-md mx-4 bg-gradient-card border-border/50">
          <CardContent className="text-center p-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Join MemeHub
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your profile and start sharing memes with the community!
              </p>
            </div>
            
            <AuthModal>
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Get Started
              </Button>
            </AuthModal>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-card rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user.user_metadata?.username || 'Anonymous User'}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-neon-purple/20 text-neon-purple">
                    Meme Enthusiast
                  </Badge>
                  <Badge variant="secondary" className="bg-neon-pink/20 text-neon-pink">
                    Level 5
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Bio */}
          <p className="text-foreground mb-4">
            Passionate meme creator and developer. Turning bugs into features and features into memes! 🚀
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Icon className="h-3 w-3" />
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={achievement.name} 
                  className={`bg-gradient-card border-border/50 ${
                    achievement.earned ? 'ring-1 ring-neon-purple/30' : 'opacity-50'
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      achievement.earned ? 'text-neon-purple' : 'text-muted-foreground'
                    }`} />
                    <h4 className="font-semibold mb-1">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {["posts", "liked", "saved"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "neon" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "shadow-neon" : ""}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* User Memes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {userMemes.map((meme) => (
            <Card key={meme.id} className="group cursor-pointer overflow-hidden">
              <div className="relative aspect-square">
                <img 
                  src={meme.image_url} 
                  alt={meme.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {meme.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {meme.comments_count}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {userMemes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No memes posted yet. Start creating!</p>
          </div>
        )}

        {/* Sign Out */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300 hover:border-red-400"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};