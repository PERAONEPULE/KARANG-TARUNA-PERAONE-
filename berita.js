
(() => {
  const section=document.getElementById('berita');
  if(!section)return;
  const grid=document.getElementById('newsGrid');
  const more=document.getElementById('newsMoreButton');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateText=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(d)};
  const excerpt=(v,n=190)=>{const t=String(v??'').trim();return t.length>n?t.slice(0,n).trimEnd()+'…':t};
  async function load(){
    if(!window.supabase||!window.PERAONE_SUPABASE_URL||!window.PERAONE_SUPABASE_ANON_KEY)return;
    try{
      const db=window.supabase.createClient(window.PERAONE_SUPABASE_URL,window.PERAONE_SUPABASE_ANON_KEY);
      const {data,error}=await db.from('announcements').select('id,title,content,created_at').order('created_at',{ascending:false}).limit(100);
      if(error)throw error;
      if(!data?.length)return;
      section.hidden=false;
      let expanded=false;
      const render=()=>{
        const items=expanded?data:data.slice(0,3);
        grid.classList.toggle('is-expanded',expanded);
        grid.innerHTML=items.map(x=>`<article class="news-card"><div class="news-card-date">${esc(dateText(x.created_at))}</div><h3>${esc(x.title)}</h3><p>${esc(excerpt(x.content))}</p></article>`).join('');
        more.hidden=data.length<=3;
        more.textContent=expanded?'Tampilkan lebih sedikit':`Lihat semua berita (${data.length})`;
      };
      render();
      more.addEventListener('click',()=>{expanded=!expanded;render()});
    }catch(e){console.warn('Berita belum dapat dimuat:',e.message||e);section.hidden=true}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
