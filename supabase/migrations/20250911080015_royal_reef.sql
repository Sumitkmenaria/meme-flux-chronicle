/*
  # Create votes table

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `meme_id` (uuid, references memes)
      - `vote_type` (text, 'up' or 'down')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `votes` table
    - Add policies for authenticated users to manage their votes
    - Add unique constraint to prevent duplicate votes

  3. Functions
    - Function to update meme vote counts when votes change
*/

-- Create vote_type enum
DO $$ BEGIN
  CREATE TYPE vote_type AS ENUM ('up', 'down');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meme_id uuid REFERENCES memes(id) ON DELETE CASCADE NOT NULL,
  vote_type vote_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, meme_id)
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update meme vote counts
CREATE OR REPLACE FUNCTION update_meme_vote_counts()
RETURNS trigger AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE memes SET upvotes = upvotes + 1 WHERE id = NEW.meme_id;
    ELSE
      UPDATE memes SET downvotes = downvotes + 1 WHERE id = NEW.meme_id;
    END IF;
    RETURN NEW;
  END IF;

  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- Remove old vote
    IF OLD.vote_type = 'up' THEN
      UPDATE memes SET upvotes = upvotes - 1 WHERE id = OLD.meme_id;
    ELSE
      UPDATE memes SET downvotes = downvotes - 1 WHERE id = OLD.meme_id;
    END IF;
    
    -- Add new vote
    IF NEW.vote_type = 'up' THEN
      UPDATE memes SET upvotes = upvotes + 1 WHERE id = NEW.meme_id;
    ELSE
      UPDATE memes SET downvotes = downvotes + 1 WHERE id = NEW.meme_id;
    END IF;
    RETURN NEW;
  END IF;

  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE memes SET upvotes = upvotes - 1 WHERE id = OLD.meme_id;
    ELSE
      UPDATE memes SET downvotes = downvotes - 1 WHERE id = OLD.meme_id;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER votes_update_meme_counts
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_meme_vote_counts();

-- Create indexes
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);
CREATE INDEX IF NOT EXISTS votes_meme_id_idx ON votes(meme_id);
CREATE INDEX IF NOT EXISTS votes_created_at_idx ON votes(created_at DESC);