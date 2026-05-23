-- Create menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  tier TEXT NOT NULL CHECK (tier IN ('Essentials', 'Classics', 'Deluxe')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for user_id for faster queries
CREATE INDEX IF NOT EXISTS menu_items_user_id_idx ON menu_items(user_id);
CREATE INDEX IF NOT EXISTS menu_items_tier_idx ON menu_items(tier);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see/edit their own menu items
DROP POLICY IF EXISTS "Users can manage their own menu items" ON menu_items;
CREATE POLICY "Users can manage their own menu items"
  ON menu_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
