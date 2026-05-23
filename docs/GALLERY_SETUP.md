# Gallery Upload Setup

The "A Glimpse Behind the Scenes" gallery on the About page allows admins to upload images and videos to each gallery card. This requires configuring Supabase Storage.

## Setup Instructions

### 1. Create Storage Bucket

1. Go to your [Supabase dashboard](https://app.supabase.com)
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `gallery-uploads`
5. Make it **Public** (enable public access so images/videos can be viewed)
6. Click **Create bucket**

### 2. Apply storage policies

Run migration `supabase/migrations/20260321120000_security_rls_and_schema.sql` (includes gallery policies):

- **Public read** — anyone can view images
- **Admin upload/delete only** — requires `app_metadata.role = "admin"` (see `docs/SUPABASE_SECURITY.md`)

### 3. Test It Out

1. Go to the About page (`/about`)
2. Scroll to "A Glimpse Behind the Scenes" section
3. Click any gallery card to open the upload modal
4. Upload images (JPG, PNG, GIF, etc.) or videos (MP4, WebM, MOV)
5. Images/videos will appear in the gallery

## Features

- **Upload multiple files** at once
- **Support for images and videos** (JPEG, PNG, GIF, MP4, WebM, MOV)
- **Max file size**: 100MB per file
- **Preview** uploaded media before deleting
- **Delete** individual items from each gallery
- **Persistent storage** in Supabase

## Troubleshooting

### "Storage bucket not found" error

- Make sure the `gallery-uploads` bucket exists in Supabase Storage
- Verify it's set to Public access

### Files upload but don't appear

- Check browser console for errors
- Make sure Supabase credentials are set in `.env.local`
- Verify the bucket is public in Supabase dashboard

### Can't upload files

- Check the file size (max 100MB)
- Check file type (only images and videos are supported)
- Verify your internet connection

## File Organization

Files are stored at: `gallery-uploads/gallery-{id}/{filename}`

Where `{id}` is one of:
- `catering-events`
- `chefs-at-work`
- `fresh-ingredients`
- `meal-prep-line`
- `plated-dishes`
- `desserts`
