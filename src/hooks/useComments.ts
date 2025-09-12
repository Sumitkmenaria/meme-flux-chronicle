import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  meme_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export const useComments = (memeId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('meme_id', memeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content,
          user_id: user.id,
          meme_id: memeId
        });

      if (error) {
        console.error('Error creating comment:', error);
        toast({
          title: "Error",
          description: "Failed to create comment",
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to create comment",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: "Error",
          description: "Failed to delete comment",
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  useEffect(() => {
    if (memeId) {
      fetchComments();
    }
  }, [memeId]);

  return {
    comments,
    loading,
    fetchComments,
    createComment,
    deleteComment
  };
};