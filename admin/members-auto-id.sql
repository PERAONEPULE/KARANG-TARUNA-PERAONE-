-- PERAONEPULE: ID otomatis + identitas stabil untuk pengelolaan anggota.
-- Jalankan SATU KALI di Supabase > SQL Editor sebelum memakai fitur anggota.
-- Hanya mengubah tabel public.members; tidak menyentuh dues_payments/cash_transactions.

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS member_uid uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS member_code text,
  ADD COLUMN IF NOT EXISTS address text;

UPDATE public.members
SET member_uid = gen_random_uuid()
WHERE member_uid IS NULL;

ALTER TABLE public.members
  ALTER COLUMN member_uid SET DEFAULT gen_random_uuid(),
  ALTER COLUMN member_uid SET NOT NULL;

ALTER TABLE public.members
  ALTER COLUMN created_at SET DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS members_member_uid_uidx
  ON public.members(member_uid);

-- Susun ulang kode anggota berdasarkan nama A-Z.
CREATE OR REPLACE FUNCTION public.peraone_renumber_members()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH numbered AS (
    SELECT member_uid,
           'PRP-' || lpad(
             row_number() OVER (
               ORDER BY lower(trim(coalesce(name, ''))), member_uid
             )::text, 3, '0'
           ) AS new_code
    FROM public.members
  )
  UPDATE public.members AS m
  SET member_code = numbered.new_code
  FROM numbered
  WHERE m.member_uid = numbered.member_uid
    AND m.member_code IS DISTINCT FROM numbered.new_code;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS members_auto_id_after_change ON public.members;
CREATE TRIGGER members_auto_id_after_change
AFTER INSERT OR UPDATE OF name ON public.members
FOR EACH STATEMENT
EXECUTE FUNCTION public.peraone_renumber_members();

-- Isi ID semua anggota yang sudah ada sekarang.
DO $$
BEGIN
  WITH numbered AS (
    SELECT member_uid,
           'PRP-' || lpad(
             row_number() OVER (
               ORDER BY lower(trim(coalesce(name, ''))), member_uid
             )::text, 3, '0'
           ) AS new_code
    FROM public.members
  )
  UPDATE public.members AS m
  SET member_code = numbered.new_code
  FROM numbered
  WHERE m.member_uid = numbered.member_uid;
END $$;
