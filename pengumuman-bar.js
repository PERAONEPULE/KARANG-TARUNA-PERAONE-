(() => {
  const bar = document.getElementById('announcementBar');
  if (!bar) return;
  const text = document.getElementById('announcementText');
  const counter = document.getElementById('announcementCounter');
  const close = document.getElementById('announcementClose');
  let items = [];
  let current = 0;
  let timer = null;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show = (index) => {
    current = index;
    text.classList.add('is-changing');
    window.setTimeout(() => {
      const item = items[current];
      text.textContent = item.title || 'Pengumuman terbaru';
      text.href = '#berita';
      counter.textContent = items.length > 1 ? `${current + 1}/${items.length}` : '';
      text.classList.remove('is-changing');
    }, reducedMotion ? 0 : 180);
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
  close.addEventListener('click', () => { stop(); bar.remove(); });
  async function load() {
    if (!window.supabase || !window.PERAONE_SUPABASE_URL || !window.PERAONE_SUPABASE_ANON_KEY) return;
    try {
      const db = window.supabase.createClient(window.PERAONE_SUPABASE_URL, window.PERAONE_SUPABASE_ANON_KEY);
      const { data, error } = await db.from('announcements').select('id,title,created_at').order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      if (!data || !data.length) return;
      items = data;
      bar.hidden = false;
      bar.classList.add('is-entering');
      requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.remove('is-entering')));
      show(0);
      if (items.length > 1 && !reducedMotion) timer = window.setInterval(() => show((current + 1) % items.length), 4500);
    } catch (err) { console.warn('Papan pengumuman belum dapat dimuat:', err.message || err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
