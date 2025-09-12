-- Remove foreign key constraint on profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Ensure timestamp update triggers exist
DROP TRIGGER IF EXISTS set_updated_at_memes ON public.memes;
CREATE TRIGGER set_updated_at_memes
BEFORE UPDATE ON public.memes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_comments ON public.comments;
CREATE TRIGGER set_updated_at_comments
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Ensure comment count trigger exists
DROP TRIGGER IF EXISTS trg_update_comment_counts ON public.comments;
CREATE TRIGGER trg_update_comment_counts
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_meme_comment_counts();

-- Ensure vote count trigger exists
DROP TRIGGER IF EXISTS trg_update_vote_counts ON public.votes;
CREATE TRIGGER trg_update_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_meme_vote_counts();

-- Ensure auth trigger exists for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Clear existing demo data
DELETE FROM public.comments WHERE content LIKE '%relatable%' OR content LIKE '%better%';
DELETE FROM public.votes WHERE meme_id IN (SELECT id FROM public.memes WHERE title LIKE '%Programming%' OR title LIKE '%Cat%');
DELETE FROM public.memes WHERE title LIKE '%Programming%' OR title LIKE '%Cat%' OR title LIKE '%Office%' OR title LIKE '%Weekend%';
DELETE FROM public.profiles WHERE username LIKE 'demo_%';

-- Insert sample data
DO $$
DECLARE
  u1 uuid := gen_random_uuid();
  u2 uuid := gen_random_uuid();
  m1 uuid := gen_random_uuid();
  m2 uuid := gen_random_uuid();
  m3 uuid := gen_random_uuid();
  m4 uuid := gen_random_uuid();
BEGIN
  -- Sample profiles (demo data)
  INSERT INTO public.profiles(id, username, full_name, avatar_url)
  VALUES 
    (u1, 'demo_user1', 'Demo User 1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'), 
    (u2, 'demo_user2', 'Demo User 2', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150');

  -- Sample memes with better images
  INSERT INTO public.memes (id, title, image_url, tags, user_id, upvotes, downvotes, comments_count)
  VALUES 
    (m1, 'Classic Programming Meme', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', ARRAY['programming','funny'], u1, 15, 2, 0),
    (m2, 'Cat Reaction Meme', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600', ARRAY['cats','reaction'], u2, 23, 1, 0),
    (m3, 'Office Life Humor', 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600', ARRAY['office','work','relatable'], u1, 8, 0, 0),
    (m4, 'Weekend Vibes', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600', ARRAY['weekend','mood','nature'], u2, 31, 3, 0);

  -- Sample comments
  INSERT INTO public.comments (meme_id, user_id, content)
  VALUES 
    (m1, u2, 'This is so relatable! 😂'),
    (m1, u1, 'Every developer knows this feeling'),
    (m2, u1, 'Perfect reaction meme!'),
    (m2, u2, 'Cats always make everything better');

  -- Sample votes
  INSERT INTO public.votes (meme_id, user_id, vote_type)
  VALUES 
    (m1, u1, 'up'),
    (m1, u2, 'up'),
    (m2, u1, 'up'),
    (m2, u2, 'up'),
    (m3, u1, 'up'),
    (m4, u2, 'up');

  -- Update comment counts manually for existing memes
  UPDATE public.memes SET comments_count = (
    SELECT COUNT(*) FROM public.comments WHERE meme_id = memes.id
  );
END $$;