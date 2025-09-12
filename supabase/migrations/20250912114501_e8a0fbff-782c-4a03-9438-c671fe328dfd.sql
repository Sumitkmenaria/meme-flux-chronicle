-- Align with best practices: avoid FK to auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Recreate triggers (idempotent)
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

DROP TRIGGER IF EXISTS set_updated_at_votes ON public.votes;
CREATE TRIGGER set_updated_at_votes
BEFORE UPDATE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_update_comment_counts ON public.comments;
CREATE TRIGGER trg_update_comment_counts
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_meme_comment_counts();

DROP TRIGGER IF EXISTS trg_update_vote_counts ON public.votes;
CREATE TRIGGER trg_update_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_meme_vote_counts();

-- Seed sample data
DO $$
DECLARE
  u1 uuid := gen_random_uuid();
  u2 uuid := gen_random_uuid();
  m1 uuid;
  m2 uuid;
BEGIN
  INSERT INTO public.profiles(id, username, full_name)
  VALUES (u1, 'demo1', 'Demo User 1'), (u2, 'demo2', 'Demo User 2')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.memes (id, title, image_url, tags, user_id)
  VALUES (gen_random_uuid(), 'Meme One', 'https://placehold.co/600x600?text=Meme+1', ARRAY['funny','demo'], u1)
  RETURNING id INTO m1;

  INSERT INTO public.memes (id, title, image_url, tags, user_id)
  VALUES (gen_random_uuid(), 'Meme Two', 'https://placehold.co/600x600?text=Meme+2', ARRAY['trending','cats'], u2)
  RETURNING id INTO m2;

  INSERT INTO public.comments (meme_id, user_id, content)
  VALUES (m1, u2, 'Nice meme!'), (m2, u1, 'Lol!');

  INSERT INTO public.votes (meme_id, user_id, vote_type)
  VALUES 
    (m1, u1, 'up'),
    (m2, u2, 'up'),
    (m1, u2, 'down'),
    (m2, u1, 'up');
END $$;