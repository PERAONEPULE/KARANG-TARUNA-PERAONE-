# PERAONEPULE — Website + Admin Dashboard

## Isi ZIP
- Website publik lama (file website dipertahankan)
- `admin/index.html`: login dan panel dashboard
- `admin/admin.js`: autentikasi Supabase, validasi role, tabel ringkasan
- `admin/config.js`: tempat URL Supabase + anon/public key
- `admin/rls-dashboard.sql`: policy RLS untuk dashboard

## 1. Konfigurasi Supabase
1. Buka Supabase project PERAONEPULE-ADMIN.
2. Project Settings → API (atau API Keys).
3. Salin Project URL dan anon/public key.
4. Isi file `admin/config.js`.
   - Jangan masukkan `service_role` atau secret key ke website.

## 2. Pastikan role admin
Akun admin sudah dibuat melalui Authentication → Users.
Pastikan UUID akun tersebut memiliki row di `public.profiles` dengan role `admin`.

## 3. RLS
Jalankan `admin/rls-dashboard.sql` di SQL Editor Supabase.
Pastikan policy sesuai dengan kebutuhan organisasi. Policy ini memberi admin/pengurus akses CRUD ke members, dues_payments, cash_transactions.

## 4. Deploy ke Netlify
Upload isi folder repository (bukan folder ZIP) ke GitHub, commit, dan tunggu Netlify deploy.
URL dashboard:
`https://NAMA-SITE-NETLIFY.netlify.app/admin/`

## Catatan
- Dashboard ini merupakan versi awal: login, pemeriksaan role, jumlah record, dan tabel data.
- Data edit/tambah/hapus dan ringkasan nominal kas belum diaktifkan karena perlu memastikan struktur kolom tabel yang sebenarnya.
- Jangan mengubah password, anon key, atau menaruh service_role key di JavaScript frontend.


## 5. Fitur daftar anggota: ID otomatis dan alamat
1. Buka Supabase → SQL Editor.
2. Jalankan isi file `admin/members-auto-id.sql` satu kali.
3. Upload/commit seluruh isi ZIP hasil pembaruan ke GitHub agar Netlify melakukan deploy.
4. Buka `/admin/`, login sebagai admin/pengurus.
5. Pada tab Anggota, gunakan **Tambah Anggota** untuk menambahkan nama dan alamat (alamat boleh dikosongkan). Gunakan **Edit alamat** untuk mengisi alamat anggota lama.

ID anggota menggunakan format `PRP-001`, `PRP-002`, dan seterusnya. Kode otomatis diurutkan ulang A–Z setiap ada anggota baru atau perubahan nama. Pengurutan ini hanya berlaku pada `members`; tidak mengubah tabel pembayaran maupun transaksi kas.

Catatan: kolom `member_uid` adalah identitas internal yang stabil untuk mengedit data. Admin tidak perlu mengisi atau mengubah ID apa pun.
