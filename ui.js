(function(){
  'use strict';
  function ensure(){
    if(document.getElementById('agi-ui-status')) return;
    var box=document.createElement('div');
    box.id='agi-ui-status';
    box.setAttribute('role','status');
    box.setAttribute('aria-live','polite');
    box.innerHTML='<span id="agi-ui-icon">⏳</span><span id="agi-ui-text">Working…</span>';
    document.body.appendChild(box);
  }
  function show(message, type){
    ensure(); var box=document.getElementById('agi-ui-status');
    box.className='show '+(type||'loading');
    document.getElementById('agi-ui-text').textContent=message||'Working…';
    document.getElementById('agi-ui-icon').textContent=type==='error'?'⚠️':type==='success'?'✓':'⏳';
  }
  function hide(){var box=document.getElementById('agi-ui-status');if(box)box.className='';}
  window.AGIUI={loading:show,error:function(m){show(m,'error');setTimeout(hide,4200)},success:function(m){show(m,'success');setTimeout(hide,2200)},hide:hide,wrap:function(fn,label){return async function(){show(label||'Working…','loading');try{return await fn.apply(this,arguments)}catch(e){console.error(e);show('Something went wrong. Please try again.','error');throw e}finally{setTimeout(hide,2500)}}}};
  window.addEventListener('error',function(){ if(window.AGIUI) AGIUI.error('Something went wrong. Please refresh and try again.'); });
  window.addEventListener('unhandledrejection',function(){ if(window.AGIUI) AGIUI.error('A request could not be completed. Please try again.'); });
})();


/* Step 46 - Bug Fixing */
(() => {
  if (window.__agiHubBugFixesLoaded) return;
  window.__agiHubBugFixesLoaded = true;
  window.addEventListener('error', () => {
    const existing = document.querySelector('[data-global-error]');
    if (existing) return;
    const box = document.createElement('div');
    box.dataset.globalError = 'true';
    box.setAttribute('role', 'status');
    box.textContent = 'Something went wrong. Please refresh and try again.';
    box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;padding:12px 14px;border-radius:12px;background:#101827;color:#fff;border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(0,0,0,.25);font:500 14px/1.4 system-ui,sans-serif;';
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 6000);
  });
})();
