import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Meme {
  id: string;
  title: string;
  image_url: string;
  user_id: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
  user_vote?: 'up' | 'down' | null;
}

export const useMemes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMemes = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('memes')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      const { data: memesData, error } = await query;

      if (error) {
        console.error('Error fetching memes:', error);
        toast({
          title: "Error",
          description: "Failed to load memes",
          variant: "destructive",
        });
        return;
      }

      // If user is authenticated, fetch their votes
      if (user && memesData) {
        const { data: votesData } = await supabase
          .from('votes')
          .select('meme_id, vote_type')
          .eq('user_id', user.id);

        const votesMap = new Map(
          votesData?.map(vote => [vote.meme_id, vote.vote_type]) || []
        );

        const memesWithVotes = memesData.map(meme => ({
          ...meme,
          user_vote: votesMap.get(meme.id) || null
        }));

        setMemes(memesWithVotes);
      } else {
        setMemes(memesData || []);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast({
        title: "Error",
        description: "Failed to load memes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const voteMeme = async (memeId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on memes",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('meme_id', memeId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same vote type
          await supabase
            .from('votes')
            .delete()
            .eq('user_id', user.id)
            .eq('meme_id', memeId);
        } else {
          // Update vote type
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('user_id', user.id)
            .eq('meme_id', memeId);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            meme_id: memeId,
            vote_type: voteType
          });
      }

      // Refresh memes to get updated counts
      await fetchMemes();
    } catch (error) {
      console.error('Error voting on meme:', error);
      toast({
        title: "Error",
        description: "Failed to vote on meme",
        variant: "destructive",
      });
    }
  };

  const createMeme = async (title: string, imageUrl: string, tags: string[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create memes",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('memes')
        .insert({
          title,
          image_url: imageUrl,
          user_id: user.id,
          tags
        });

      if (error) {
        console.error('Error creating meme:', error);
        toast({
          title: "Error",
          description: "Failed to create meme",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Meme created successfully!",
      });

      await fetchMemes();
      return true;
    } catch (error) {
      console.error('Error creating meme:', error);
      toast({
        title: "Error",
        description: "Failed to create meme",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMemes();
  }, [user]);

  return {
    memes,
    loading,
    fetchMemes,
    voteMeme,
    createMeme
  };
};