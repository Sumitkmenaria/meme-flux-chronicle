/*
  # Create memes table

  1. New Tables
    - `memes`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `image_url` (text, not null)
      - `user_id` (uuid, references profiles)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `memes` table
    - Add policies for public read access
    - Add policies for authenticated users to create memes
    - Add policies for users to update/delete their own memes
*/

-- Create memes table
CREATE TABLE IF NOT EXISTS memes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Memes are viewable by everyone"
  ON memes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create memes"
  ON memes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memes"
  ON memes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memes"
  ON memes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER memes_updated_at
  BEFORE UPDATE ON memes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS memes_user_id_idx ON memes(user_id);
CREATE INDEX IF NOT EXISTS memes_created_at_idx ON memes(created_at DESC);
CREATE INDEX IF NOT EXISTS memes_upvotes_idx ON memes(upvotes DESC);
CREATE INDEX IF NOT EXISTS memes_tags_idx ON memes USING GIN(tags);