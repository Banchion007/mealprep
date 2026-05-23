-- Security: admin helper, core tables, RLS, storage policies
-- Set admin users: Auth → Users → app_metadata: { "role": "admin" }

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Global site settings (meal prep toggle) — separate from legacy per-user app_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  meal_prep_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.site_settings (key, meal_prep_enabled)
VALUES ('global', true)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins_update_site_settings" ON public.site_settings;

CREATE POLICY "public_read_site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "admins_update_site_settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Menu items catalog
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  tier text NOT NULL CHECK (tier IN ('Essentials', 'Classics', 'Deluxe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_items_user_id_idx ON public.menu_items(user_id);
CREATE INDEX IF NOT EXISTS menu_items_tier_idx ON public.menu_items(tier);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own menu items" ON public.menu_items;
DROP POLICY IF EXISTS "admins_manage_menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "public_read_menu_items" ON public.menu_items;

CREATE POLICY "admins_manage_menu_items"
  ON public.menu_items FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "public_read_menu_items"
  ON public.menu_items FOR SELECT
  USING (true);

-- Delivery profiles
CREATE TABLE IF NOT EXISTS public.delivery_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  street text,
  city text,
  state text,
  zip text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.delivery_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_delivery" ON public.delivery_profiles;

CREATE POLICY "users_manage_own_delivery"
  ON public.delivery_profiles FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Orders: secure admin read
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "admins_select_all_orders" ON public.orders;

CREATE POLICY "admins_select_all_orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.is_admin());

-- Weekly menu: admin write
ALTER TABLE public.weekly_menu ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage weekly_menu" ON public.weekly_menu;
DROP POLICY IF EXISTS "admins_manage_weekly_menu" ON public.weekly_menu;

CREATE POLICY "admins_manage_weekly_menu"
  ON public.weekly_menu FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Recipes: admin only
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own recipes" ON public.recipes;
DROP POLICY IF EXISTS "admins_manage_recipes" ON public.recipes;

CREATE POLICY "admins_manage_recipes"
  ON public.recipes FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Storage: gallery-uploads (create bucket in Dashboard if missing)
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete gallery" ON storage.objects;

CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-uploads');

CREATE POLICY "Admins upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery-uploads' AND public.is_admin());

CREATE POLICY "Admins update gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery-uploads' AND public.is_admin())
  WITH CHECK (bucket_id = 'gallery-uploads' AND public.is_admin());

CREATE POLICY "Admins delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery-uploads' AND public.is_admin());
