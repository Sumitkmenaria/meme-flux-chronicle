import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  TrendingUp, 
  User, 
  Search, 
  Plus,
  Heart,
  MessageCircle
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "trending", icon: TrendingUp, label: "Trending" },
  { id: "upload", icon: Plus, label: "Upload" },
  { id: "activity", icon: Heart, label: "Activity" },
  { id: "profile", icon: User, label: "Profile" },
];

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isUpload = item.id === "upload";
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isUpload 
                  ? "bg-gradient-primary text-white shadow-neon rounded-full"
                  : isActive 
                    ? "text-neon-purple" 
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isUpload ? "h-6 w-6" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && !isUpload && (
                <div className="w-1 h-1 bg-neon-purple rounded-full" />
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};