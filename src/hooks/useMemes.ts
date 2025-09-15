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
  const [connectionError, setConnectionError] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMemes = async () => {
    try {
      setLoading(true);
      setConnectionError('');
      
      // Try to fetch memes without joins first (more reliable)
      const { data: memesData, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memes:', error);
        setConnectionError(`Database error: ${error.message}`);
        
        // Show fallback data if available
        if (memes.length === 0) {
          setMemes([]);
        }
        
        toast({
          title: "Connection Issue",
          description: "Having trouble loading memes. Check your connection.",
          variant: "destructive",
        });
        return;
      }

      if (!memesData) {
        setMemes([]);
        return;
      }

      // Try to enrich with profile data (graceful degradation)
      try {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url');

        const profilesMap = new Map(
          profilesData?.map(profile => [profile.id, profile]) || []
        );

        const enrichedMemes = memesData.map(meme => ({
          ...meme,
          profiles: profilesMap.get(meme.user_id) || null
        }));

        // If user is authenticated, fetch their votes
        if (user) {
          try {
            const { data: votesData } = await supabase
              .from('votes')
              .select('meme_id, vote_type')
              .eq('user_id', user.id);

            const votesMap = new Map(
              votesData?.map(vote => [vote.meme_id, vote.vote_type]) || []
            );

            const memesWithVotes = enrichedMemes.map(meme => ({
              ...meme,
              user_vote: votesMap.get(meme.id) || null
            }));

            setMemes(memesWithVotes);
          } catch (voteError) {
            console.warn('Could not fetch user votes:', voteError);
            setMemes(enrichedMemes);
          }
        } else {
          setMemes(enrichedMemes);
        }
      } catch (profileError) {
        console.warn('Could not fetch profiles:', profileError);
        // Fall back to memes without profile data
        setMemes(memesData.map(meme => ({ ...meme, profiles: null })));
      }
    } catch (error: any) {
      console.error('Error fetching memes:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setConnectionError('Network request blocked - check browser extensions');
      } else {
        setConnectionError(`Network error: ${error.message || 'Unknown error'}`);
      }
      
      toast({
        title: "Connection Failed",
        description: "Can't connect to server. Check your internet connection.",
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
    connectionError,
    fetchMemes,
    voteMeme,
    createMeme
  };
};