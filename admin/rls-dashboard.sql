-- PERAONEPULE dashboard: RLS helper + policies.
-- Run in Supabase SQL Editor. Review any existing policies before rerunning.
-- This script does NOT expose service_role keys.

CREATE OR REPLACE FUNCTION public.is_peraone_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin','pengurus')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_peraone_admin() TO authenticated;

-- profiles: users can read their own profile; authorized officers can read profiles.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profile self read" ON public.profiles;
CREATE POLICY "profile self read" ON public.profiles
FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_peraone_admin());

DROP POLICY IF EXISTS "profile admin update" ON public.profiles;
CREATE POLICY "profile admin update" ON public.profiles
FOR UPDATE TO authenticated
USING (public.is_peraone_admin())
WITH CHECK (public.is_peraone_admin());

-- Officers may view/edit dashboard tables. Adjust policy if you want pengurus read-only.
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members officer access" ON public.members;
CREATE POLICY "members officer access" ON public.members
FOR ALL TO authenticated
USING (public.is_peraone_admin())
WITH CHECK (public.is_peraone_admin());

ALTER TABLE public.dues_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dues officer access" ON public.dues_payments;
CREATE POLICY "dues officer access" ON public.dues_payments
FOR ALL TO authenticated
USING (public.is_peraone_admin())
WITH CHECK (public.is_peraone_admin());

ALTER TABLE public.cash_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cash officer access" ON public.cash_transactions;
CREATE POLICY "cash officer access" ON public.cash_transactions
FOR ALL TO authenticated
USING (public.is_peraone_admin())
WITH CHECK (public.is_peraone_admin());
