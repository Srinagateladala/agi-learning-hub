(()=>{
'use strict';
function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function on(el,ev,fn){if(el)el.addEventListener(ev,fn)}
function initMenu(){
 const btn=qs('#menuToggle'), nav=qs('#siteNav'); if(!btn||!nav)return;
 on(btn,'click',()=>{const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');btn.setAttribute('aria-label',open?'Close menu':'Open menu')});
 qsa('#siteNav a').forEach(a=>on(a,'click',()=>nav.classList.remove('open')));
}
const PROG='agiHubCompletedDays', NOTES='agiHubNotes';
function loadSet(){try{return new Set(JSON.parse(localStorage.getItem(PROG)||'[]').map(Number))}catch{return new Set()}}
function saveSet(s){localStorage.setItem(PROG,JSON.stringify([...s].sort((a,b)=>a-b)))}
function updateProgress(){
 const s=loadSet(), n=s.size, pct=Math.round(n/365*100);
 ['progressPercent','dashPercent'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=pct+'%'});
 const bar=qs('#progressBar'); if(bar)bar.style.width=pct+'%';
 const cc=qs('#completedCount');if(cc)cc.textContent=n;
 const rc=qs('#remainingCount');if(rc)rc.textContent=365-n;
 const dc=qs('#dashCompleted');if(dc)dc.textContent=n+' / 365';
 const cards=qsa('.day-card');cards.forEach(c=>{const m=c.getAttribute('href')?.match(/day-(\d+)\.html/);if(m&&s.has(Number(m[1])))c.classList.add('completed')});
 const attempts=Object.keys(JSON.parse(localStorage.getItem('agiQuizResults')||'{}')).length;const da=qs('#dashAttempts');if(da)da.textContent=attempts;
 const dn=qs('#dashNotes');if(dn)dn.textContent=JSON.parse(localStorage.getItem(NOTES)||'[]').length;
}
function initRoadmap(){
 const input=qs('#lessonSearch'), clear=qs('#clearSearch'), cards=qsa('.day-card'), status=qs('#searchStatus'), catStatus=qs('#categoryStatus'); let category='all';
 function apply(){const term=(input?.value||'').trim().toLowerCase();let shown=0;cards.forEach(c=>{const text=c.textContent.toLowerCase(), small=c.querySelector('small')?.textContent||'';const ok=(category==='all'||small===category)&&( !term||text.includes(term));c.style.display=ok?'':'none';if(ok)shown++});if(status)status.textContent='Showing '+shown+' lesson'+(shown===1?'':'s');if(catStatus)catStatus.textContent='Showing '+shown+' lessons';}
 on(input,'input',apply);on(clear,'click',()=>{if(input){input.value='';apply();input.focus()}});qsa('.category-btn').forEach(b=>on(b,'click',()=>{qsa('.category-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');category=b.dataset.category||'all';apply()}));
 on(qs('#resetProgress'),'click',()=>{if(confirm('Reset all completed days?')){localStorage.removeItem(PROG);updateProgress()}});apply();
}
function initStorage(){
 on(qs('#clearLocalData'),'click',()=>{localStorage.removeItem(PROG);localStorage.removeItem(NOTES);localStorage.removeItem('agiQuizResults');location.reload()});
 on(qs('#exportData'),'click',()=>{const data={completed:[...loadSet()],notes:JSON.parse(localStorage.getItem(NOTES)||'[]'),quiz:JSON.parse(localStorage.getItem('agiQuizResults')||'{}')};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='agi-learning-hub-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 on(qs('#importData'),'change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(Array.isArray(d.completed))localStorage.setItem(PROG,JSON.stringify(d.completed));if(Array.isArray(d.notes))localStorage.setItem(NOTES,JSON.stringify(d.notes));if(d.quiz)localStorage.setItem('agiQuizResults',JSON.stringify(d.quiz));location.reload()}catch{alert('Invalid backup file.')}};r.readAsText(f)})
}
function initLesson(){
 const m=location.pathname.match(/day-(\d+)\.html/);if(!m)return;const day=Number(m[1]), key='agiHubCompletedDays';
 let btn=qs('#markComplete'); if(btn){const refresh=()=>{const s=loadSet();btn.textContent=s.has(day)?'✓ Completed — Mark Again':'✓ Mark Day '+day+' Complete';btn.classList.toggle('completed',s.has(day))};on(btn,'click',()=>{const s=loadSet();s.add(day);saveSet(s);refresh();updateProgress()});refresh()}
}
function init(){initMenu();initRoadmap();initStorage();initLesson();updateProgress();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.AGIHub={markComplete:(d)=>{const s=loadSet();s.add(Number(d));saveSet(s);updateProgress()}};
})();
