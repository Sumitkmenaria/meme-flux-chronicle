import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown } from "lucide-react";

interface MemeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  tags: string[];
  author: string;
  timeAgo: string;
}

export const MemeCard = ({ 
  id, 
  title, 
  imageUrl, 
  upvotes, 
  downvotes, 
  comments, 
  tags, 
  author, 
  timeAgo 
}: MemeCardProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    setUserVote(userVote === voteType ? null : voteType);
  };

  const totalScore = upvotes - downvotes;

  return (
    <Card className="bg-gradient-card border-border/50 overflow-hidden group hover:shadow-card-custom transition-all duration-300 animate-slide-up">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">@{author} • {timeAgo}</span>
          <div className="flex gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50 text-neon-purple">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <h3 className="font-semibold text-foreground mb-3 line-clamp-2">{title}</h3>
        
        <div className="relative mb-4 rounded-lg overflow-hidden bg-secondary/20">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary/30 rounded-full p-1">
              <Button
                variant="vote"
                size="sm"
                onClick={() => handleVote('up')}
                className={`rounded-full h-8 w-8 p-0 ${
                  userVote === 'up' ? 'bg-neon-green text-white animate-vote-bounce' : ''
                }`}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className={`px-2 text-sm font-medium ${
                totalScore > 0 ? 'text-neon-green' : totalScore < 0 ? 'text-red-400' : 'text-muted-foreground'
              }`}>
                {totalScore}
              </span>
              <Button
                variant="vote"
                size="sm"
                onClick={() => handleVote('down')}
                className={`rounded-full h-8 w-8 p-0 ${
                  userVote === 'down' ? 'bg-red-400 text-white animate-vote-bounce' : ''
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`h-8 px-2 ${isLiked ? 'text-red-400' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-neon-cyan">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-neon-purple">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};