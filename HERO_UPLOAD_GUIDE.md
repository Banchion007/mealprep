# Hero Section Image Upload Guide

All page heroes are now ready to accept your custom images! The system automatically falls back to beautiful branded gradients with decorative blobs when no image is present.

## How to Add Hero Images

1. **Get an image** — any photo, screenshot, or downloaded image (JPG, PNG, WebP all supported)
2. **Name it correctly** — use the exact filename for the page you want:
   - Landing page: `landing.jpg`
   - About page: `about.jpg`
   - Menu page: `menu.jpg`
   - Meal Prep page: `meal-prep.jpg`
3. **Drop it in** → `public/heroes/` folder
4. **Done!** — Dev server hot-reloads automatically. Navigate to the page and your image appears.

## Example

To add a photo to the Landing hero:
```
public/
  heroes/
    landing.jpg      ← Drop your image here
    about.jpg        ← Or here for About page
    menu.jpg         ← Or here for Menu page
    meal-prep.jpg    ← Or here for Meal Prep page
```

The `<img>` tags automatically load from `/heroes/{page-name}.jpg`. If the file doesn't exist, the `onError` handler hides the img and reveals the beautiful gradient background instead.

## Fallback Design (No Image)

Each hero displays a branded gradient + decorative floating blobs (indigo + orange) when no image is present:
- **Landing** — two large soft-glow circles, high opacity, animation-ready
- **About** — indigo blob top-left, orange blob bottom-right
- **Menu** — smaller blobs with grain texture overlay
- **Meal Prep** — orange accent blend, premium gradient

No flickers, no errors — just a polished, designed look while you gather real photos.

## To Replace an Image

Just swap the file in `public/heroes/`:
- Delete the old image
- Drop the new one in with the same filename
- Refresh the page (or wait for hot-reload)

## File Format Notes

- **Naming**: Must match exactly: `landing.jpg`, `about.jpg`, `menu.jpg`, `meal-prep.jpg`
- **Extensions**: Use any supported format (.jpg, .jpeg, .png, .webp)
- **Size**: No strict limits; Vite will optimize at build time. Mobile-friendly sizes (1600px wide) recommended for best quality
- **Location**: Always goes in `public/heroes/`

## Technical Details

- **Image path**: `/heroes/{page-name}.jpg` in the src attribute
- **Error handling**: `onError={e => { e.currentTarget.style.display = 'none' }}` hides missing images
- **Backdrop**: CSS gradients + decorative blobs (z-index: 0) behind the overlay, automatically covered when an image is present
- **No code changes needed** — just add or swap files and reload

## When Ready for Production

Build the project and deploy. Images in `public/heroes/` will be bundled and served as static assets. The fallback gradients will never show in production if images are present.
