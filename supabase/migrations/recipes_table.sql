-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  serves INTEGER DEFAULT 1,
  prep_time INTEGER DEFAULT 0,
  cook_time INTEGER DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions TEXT DEFAULT '',
  category_tags TEXT[] DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for user_id for faster queries
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON recipes(created_at DESC);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see/edit their own recipes
CREATE POLICY "Users can manage their own recipes"
  ON recipes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
