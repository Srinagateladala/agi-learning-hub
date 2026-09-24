/* Step 41 — API Integration Layer
   Safe by default: no API key is stored in the browser.
   Set window.AGI_API_CONFIG.endpoint only for a backend you control.
*/
window.AGI_API_CONFIG = window.AGI_API_CONFIG || {
  mode: 'demo',
  endpoint: '',
  provider: 'Backend adapter'
};

window.AGIAPI = {
  status() {
    return window.AGI_API_CONFIG.endpoint ? 'backend-ready' : 'demo';
  },
  async request(payload) {
    const cfg = window.AGI_API_CONFIG;
    if (!cfg.endpoint) {
      return { ok: true, demo: true, message: 'Demo response: API integration is ready, but no backend endpoint is configured.' };
    }
    const response = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Backend request failed (${response.status})`);
    return response.json();
  }
};
