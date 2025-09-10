import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="MemeHub Hero"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-primary text-white px-4 py-2 text-sm font-medium shadow-neon">
              <Star className="h-4 w-4 mr-2" />
              The Ultimate Meme Destination
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Discover
            </span>
            {" "}
            <span className="text-foreground">
              Viral Memes
            </span>
            <br />
            <span className="text-foreground">
              Share
            </span>
            {" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Epic Laughs
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the hottest meme community where viral content meets epic entertainment. 
            Upload, vote, and discover the internet's best memes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="neon" size="xl" className="text-lg">
              <Zap className="h-5 w-5" />
              Start Exploring
            </Button>
            <Button variant="upload" size="xl" className="text-lg">
              <TrendingUp className="h-5 w-5" />
              Upload Your Meme
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-gradient-card rounded-lg p-6 border border-border/50 shadow-card-custom">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">
                Daily Memes
              </div>
            </div>
            
            <div className="bg-gradient-card rounded-lg p-6 border border-border/50 shadow-card-custom">
              <div className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Users
              </div>
            </div>
            
            <div className="bg-gradient-card rounded-lg p-6 border border-border/50 shadow-card-custom">
              <div className="text-3xl font-bold text-neon-purple mb-2">
                1M+
              </div>
              <div className="text-sm text-muted-foreground">
                Laughs Created
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-neon-pink rounded-full animate-pulse-neon opacity-60" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-neon-cyan rounded-full animate-pulse-neon opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-neon-green rounded-full animate-pulse-neon opacity-50" style={{ animationDelay: '2s' }} />
    </section>
  );
};