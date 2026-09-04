-- Menu V3 Premium Theme System: consolidate the legacy eight-theme catalog into five.
-- Existing tenants are migrated to the closest new visual system before the constraint changes.
SET search_path = menu_v3, public;

DO $$
BEGIN
  IF to_regnamespace('menu_v3') IS NOT NULL THEN
    UPDATE menu_v3.tenants
    SET theme_key = CASE theme_key
      WHEN 'minimal' THEN 'essential'
      WHEN 'fast-casual' THEN 'essential'
      WHEN 'coffee' THEN 'gallery'
      WHEN 'dark-dining' THEN 'noir'
      WHEN 'immersive' THEN 'noir'
      WHEN 'editorial' THEN 'editorial'
      WHEN 'heritage' THEN 'heritage'
      WHEN 'gallery' THEN 'gallery'
      ELSE 'essential'
    END
    WHERE theme_key IS NULL
      OR theme_key NOT IN ('essential', 'editorial', 'noir', 'heritage', 'gallery');

    ALTER TABLE menu_v3.tenants
      DROP CONSTRAINT IF EXISTS tenants_theme_key_check;

    ALTER TABLE menu_v3.tenants
      ADD CONSTRAINT tenants_theme_key_check
      CHECK (theme_key IN ('essential', 'editorial', 'noir', 'heritage', 'gallery'));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.tenants') IS NOT NULL THEN
    UPDATE public.tenants
    SET theme_key = CASE theme_key
      WHEN 'minimal' THEN 'essential'
      WHEN 'fast-casual' THEN 'essential'
      WHEN 'coffee' THEN 'gallery'
      WHEN 'dark-dining' THEN 'noir'
      WHEN 'immersive' THEN 'noir'
      WHEN 'editorial' THEN 'editorial'
      WHEN 'heritage' THEN 'heritage'
      WHEN 'gallery' THEN 'gallery'
      ELSE 'essential'
    END
    WHERE theme_key IS NULL
      OR theme_key NOT IN ('essential', 'editorial', 'noir', 'heritage', 'gallery');

    ALTER TABLE public.tenants
      DROP CONSTRAINT IF EXISTS tenants_theme_key_check;

    ALTER TABLE public.tenants
      ADD CONSTRAINT tenants_theme_key_check
      CHECK (theme_key IN ('essential', 'editorial', 'noir', 'heritage', 'gallery'));
  END IF;
END $$;
