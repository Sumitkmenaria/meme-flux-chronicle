import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ChevronUp, 
  ChevronDown,
  MoreHorizontal,
  Volume2,
  VolumeX
} from "lucide-react";

interface MemeReelProps {
  memes: Array<{
    id: string;
    title: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
    comments: number;
    tags: string[];
    author: string;
    timeAgo: string;
  }>;
}

interface MemeItemProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
    comments: number;
    tags: string[];
    author: string;
    timeAgo: string;
  };
  isActive: boolean;
}

const MemeItem = ({ meme, isActive }: MemeItemProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleVote = (voteType: 'up' | 'down') => {
    setUserVote(userVote === voteType ? null : voteType);
  };

  const totalScore = meme.upvotes - meme.downvotes;

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img 
          src={meme.imageUrl} 
          alt={meme.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pb-24">
        {/* Top Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {meme.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white font-medium">{meme.author}</span>
            <span className="text-white/70 text-sm">{meme.timeAgo}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Bottom Content */}
        <div className="flex items-end justify-between">
          {/* Left Side - Content */}
          <div className="flex-1 max-w-xs">
            <h3 className="text-white font-semibold text-lg mb-2 leading-tight">
              {meme.title}
            </h3>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {meme.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col items-center gap-4">
            {/* Vote Buttons */}
            <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-full p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={`rounded-full h-12 w-12 p-0 ${
                  userVote === 'up' 
                    ? 'bg-neon-green text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
              
              <span className={`text-sm font-bold my-1 ${
                totalScore > 0 ? 'text-neon-green' : 
                totalScore < 0 ? 'text-red-400' : 'text-white'
              }`}>
                {totalScore > 999 ? `${(totalScore / 1000).toFixed(1)}k` : totalScore}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={`rounded-full h-12 w-12 p-0 ${
                  userVote === 'down' 
                    ? 'bg-red-400 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-full h-12 w-12 p-0 ${
                isLiked 
                  ? 'text-red-400' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </Button>

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-12 w-12 p-0 text-white hover:bg-white/20 flex-col"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs mt-1">
                {meme.comments > 999 ? `${(meme.comments / 1000).toFixed(1)}k` : meme.comments}
              </span>
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-12 w-12 p-0 text-white hover:bg-white/20"
            >
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50">
        <div className="flex flex-col items-center gap-1">
          <ChevronUp className="h-4 w-4 animate-bounce" />
          <div className="text-xs">Swipe</div>
          <ChevronDown className="h-4 w-4 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
};

export const MemeReel = ({ memes }: MemeReelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    
    // Add some visual feedback during swipe
    if (containerRef.current) {
      const progress = Math.min(Math.abs(deltaY) / 100, 1);
      containerRef.current.style.transform = `translateY(${-deltaY * 0.1}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;
    
    // Reset transform
    if (containerRef.current) {
      containerRef.current.style.transform = '';
    }
    
    // Threshold for swipe (50px)
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentIndex < memes.length - 1) {
        // Swipe up - next meme
        setCurrentIndex(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        // Swipe down - previous meme
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    setIsDragging(false);
  };

  // Handle wheel events for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < memes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < memes.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, memes.length]);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-black touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div 
        className="flex flex-col transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateY(-${currentIndex * 100}vh)`,
          height: `${memes.length * 100}vh`
        }}
      >
        {memes.map((meme, index) => (
          <MemeItem 
            key={meme.id} 
            meme={meme} 
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        {memes.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-4 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white' 
                : index < currentIndex 
                  ? 'bg-white/50' 
                  : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};