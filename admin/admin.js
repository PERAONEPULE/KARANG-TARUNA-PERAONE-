(() => {
  const $ = (id) => document.getElementById(id);
  const loginView = $('loginView'), dashboardView = $('dashboardView');
  const message = (el, text, ok=false) => { el.textContent = text || ''; el.style.color = ok ? '#6ee7b7' : '#fbbf24'; };

  if (!window.supabase || !window.PERAONE_SUPABASE_URL || !window.PERAONE_SUPABASE_ANON_KEY ||
      window.PERAONE_SUPABASE_URL.includes('YOUR-PROJECT') ||
      window.PERAONE_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
    message($('loginMessage'), 'Konfigurasi Supabase belum diisi. Edit admin/config.js terlebih dahulu.');
    return;
  }

  const db = window.supabase.createClient(window.PERAONE_SUPABASE_URL, window.PERAONE_SUPABASE_ANON_KEY);
  let currentTab = 'members';
  const tabs = {
    members: { table:'members', title:'Data Anggota', count:'membersCount' },
    payments: { table:'dues_payments', title:'Data Pembayaran Kas', count:'paymentsCount' },
    cash: { table:'cash_transactions', title:'Transaksi Kas', count:'cashCount' }
  };

  async function checkProfile(user) {
    const { data, error } = await db.from('profiles').select('full_name,role').eq('id', user.id).maybeSingle();
    if (error) throw new Error('Tidak bisa membaca profil/role. Periksa policy RLS profiles: ' + error.message);
    if (!data || !['admin','pengurus'].includes(data.role)) throw new Error('Akun ini belum memiliki role admin/pengurus di tabel profiles.');
    return data;
  }

  async function showSession(session) {
    if (!session) {
      loginView.hidden = false; dashboardView.hidden = true; return;
    }
    try {
      const profile = await checkProfile(session.user);
      loginView.hidden = true; dashboardView.hidden = false;
      $('userLabel').textContent = `${profile.full_name || session.user.email} · ${profile.role}`;
      message($('statusMessage'), 'Login berhasil. Dashboard terhubung ke Supabase.', true);
      await loadData();
    } catch (e) {
      await db.auth.signOut();
      loginView.hidden = false; dashboardView.hidden = true;
      message($('loginMessage'), e.message);
    }
  }

  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    message($('loginMessage'), 'Sedang login…');
    const { data, error } = await db.auth.signInWithPassword({ email:$('email').value.trim(), password:$('password').value });
    if (error) return message($('loginMessage'), error.message);
    await showSession(data.session);
  });

  $('logoutButton').addEventListener('click', async () => {
    await db.auth.signOut(); await showSession(null);
  });
  $('refreshButton').addEventListener('click', loadData);
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    if (!btn.dataset.tab) return;
    currentTab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    renderTab();
  }));

  async function loadData() {
    message($('statusMessage'), 'Memuat data…');
    for (const key of Object.keys(tabs)) {
      const { count, error } = await db.from(tabs[key].table).select('*', { count:'exact', head:true });
      $(tabs[key].count).textContent = error ? '—' : (count ?? 0);
    }
    await renderTab();
    message($('statusMessage'), 'Data berhasil diperbarui.', true);
  }

  function renderTab() {
    const cfg = tabs[currentTab];
    $('tableTitle').textContent = cfg.title;
    $('tableHint').textContent = `Tabel: ${cfg.table}`;
    $('tableHead').innerHTML = '';
    $('tableBody').innerHTML = '<tr><td class="empty">Memuat…</td></tr>';
    db.from(cfg.table).select('*').limit(50).then(({data,error}) => {
      if (error) {
        $('tableBody').innerHTML = `<tr><td class="empty">Gagal membaca data: ${escapeHtml(error.message)}. Periksa RLS/policy.</td></tr>`;
        return;
      }
      if (!data || !data.length) {
        $('tableBody').innerHTML = '<tr><td class="empty">Belum ada data di tabel ini.</td></tr>';
        return;
      }
      const columns = Object.keys(data[0]).slice(0,8);
      $('tableHead').innerHTML = '<tr>' + columns.map(c=>`<th>${escapeHtml(c)}</th>`).join('') + '</tr>';
      $('tableBody').innerHTML = data.map(row => '<tr>' + columns.map(c=>`<td>${escapeHtml(formatCell(row[c]))}</td>`).join('') + '</tr>').join('');
    });
  }
  function formatCell(v) {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  db.auth.getSession().then(({data}) => showSession(data.session));
  db.auth.onAuthStateChange((_event, session) => { showSession(session); });
  const uploadGalleryButton = $('uploadGalleryButton');

if (uploadGalleryButton) {
  uploadGalleryButton.addEventListener('click', async () => {
    const file = $('galleryPhoto').files[0];
    const category = $('galleryCategory').value;
    const msg = $('galleryUploadMessage');

    if (!file) {
      msg.textContent = 'Pilih foto terlebih dahulu.';
      return;
    }

    uploadGalleryButton.disabled = true;
    msg.textContent = 'Mengunggah foto...';

    try {
      const fileName = file.name.replace(/[^\w.-]/g, '_');
      const filePath = `${category}/${Date.now()}-${fileName}`;

      const { error } = await db.storage
        .from('galeri-peraone')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = db.storage
        .from('galeri-peraone')
        .getPublicUrl(filePath);

      msg.textContent = 'Foto berhasil diunggah! ' + data.publicUrl;
    } catch (error) {
      msg.textContent = 'Gagal upload: ' + error.message;
    } finally {
      uploadGalleryButton.disabled = false;
    }
  });
}
})();
