-- PERAONEPULE: ID anggota otomatis dan PERMANEN.
-- Jalankan SATU KALI di Supabase > SQL Editor untuk MENGGANTI
-- trigger lama yang menyusun ulang ID berdasarkan nama.
-- ID member_code yang sudah ada dipertahankan. Anggota baru mendapat nomor
-- berikutnya. Perubahan nama/alamat tidak mengubah ID.
-- Hanya mengubah public.members dan sequence ID anggota;
-- tidak menyentuh dues_payments atau cash_transactions.

-- Hentikan mekanisme lama yang mengubah semua ID setiap ada perubahan nama.
DROP TRIGGER IF EXISTS members_auto_id_after_change ON public.members;
DROP FUNCTION IF EXISTS public.peraone_renumber_members();

-- Pastikan kolom identitas tersedia (aman bila sudah ada).
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS member_uid uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS member_code text,
  ADD COLUMN IF NOT EXISTS address text;

UPDATE public.members
SET member_uid = gen_random_uuid()
WHERE member_uid IS NULL;

ALTER TABLE public.members
  ALTER COLUMN member_uid SET DEFAULT gen_random_uuid(),
  ALTER COLUMN member_uid SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS members_member_uid_uidx
  ON public.members(member_uid);

-- Sequence untuk ID baru. Mulai dari angka terbesar yang sudah terpakai + 1.
CREATE SEQUENCE IF NOT EXISTS public.members_member_code_seq;

SELECT setval(
  'public.members_member_code_seq',
  COALESCE((
    SELECT MAX(substring(member_code FROM '^PRP-([0-9]+)$')::bigint)
    FROM public.members
    WHERE member_code ~ '^PRP-[0-9]+$'
  ), 0) + 1,
  false
);

-- Fungsi ini membuat ID saat INSERT dan menolak perubahan ID saat UPDATE.
CREATE OR REPLACE FUNCTION public.peraone_set_permanent_member_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.member_code := 'PRP-' || lpad(nextval('public.members_member_code_seq')::text, 3, '0');
    IF NEW.member_uid IS NULL THEN
      NEW.member_uid := gen_random_uuid();
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.member_code IS DISTINCT FROM OLD.member_code THEN
    RAISE EXCEPTION 'ID anggota bersifat permanen dan tidak dapat diubah.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS members_assign_permanent_code_before_insert ON public.members;
CREATE TRIGGER members_assign_permanent_code_before_insert
BEFORE INSERT ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.peraone_set_permanent_member_code();

-- Pastikan semua anggota lama memiliki kode sebelum memasang pengunci perubahan.
-- Kode yang sudah terisi TIDAK diubah; hanya baris tanpa kode yang diberi nomor.
DO $$
DECLARE
  member_row record;
BEGIN
  FOR member_row IN
    SELECT member_uid
    FROM public.members
    WHERE member_code IS NULL OR btrim(member_code) = ''
    ORDER BY lower(trim(coalesce(name, ''))), member_uid
  LOOP
    UPDATE public.members
    SET member_code = 'PRP-' || lpad(nextval('public.members_member_code_seq')::text, 3, '0')
    WHERE member_uid = member_row.member_uid;
  END LOOP;
END;
$$;

DROP TRIGGER IF EXISTS members_prevent_code_change_before_update ON public.members;
CREATE TRIGGER members_prevent_code_change_before_update
BEFORE UPDATE OF member_code ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.peraone_set_permanent_member_code();

CREATE UNIQUE INDEX IF NOT EXISTS members_member_code_uidx
  ON public.members(member_code)
  WHERE member_code IS NOT NULL;
