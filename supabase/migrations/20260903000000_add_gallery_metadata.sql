-- Create gallery_images table for managing gallery photos and metadata
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  storage_path TEXT NOT NULL UNIQUE,
  title VARCHAR(255),
  caption TEXT,
  crop_position JSONB DEFAULT '{"x": 0, "y": 0, "width": 100, "height": 75}'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying by year/quarter
CREATE INDEX IF NOT EXISTS idx_gallery_year_quarter ON gallery_images(year, quarter);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_images(display_order);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view gallery images
CREATE POLICY "Anyone can view gallery images" ON gallery_images
  FOR SELECT
  USING (true);

-- RLS Policy: Only authenticated admins can manage gallery
CREATE POLICY "Only admins can insert gallery images" ON gallery_images
  FOR INSERT
  WITH CHECK (
    auth.jwt()->>'email' IS NOT NULL AND
    (auth.jwt()->>'email' = ANY(ARRAY(
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
    )))
  );

CREATE POLICY "Only admins can update gallery images" ON gallery_images
  FOR UPDATE
  WITH CHECK (
    auth.jwt()->>'email' IS NOT NULL AND
    (auth.jwt()->>'email' = ANY(ARRAY(
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
    )))
  );

CREATE POLICY "Only admins can delete gallery images" ON gallery_images
  FOR DELETE
  USING (
    auth.jwt()->>'email' IS NOT NULL AND
    (auth.jwt()->>'email' = ANY(ARRAY(
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
    )))
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_images_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_images_timestamp_trigger
BEFORE UPDATE ON gallery_images
FOR EACH ROW
EXECUTE FUNCTION update_gallery_images_timestamp();
