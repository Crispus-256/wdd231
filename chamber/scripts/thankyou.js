// Extract query parameters from the URL and display them safely
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || 'N/A';
  };

  setText('firstName', params.get('firstName'));
  setText('lastName', params.get('lastName'));
  setText('email', params.get('email'));
  setText('phone', params.get('phone'));
  setText('businessName', params.get('businessName'));

  const ts = params.get('timestamp');
  if (ts) {
    // try to format ISO timestamp into a readable string
    const date = new Date(ts);
    const valid = !Number.isNaN(date.getTime());
    setText('timestamp', valid ? date.toLocaleString() : ts);
  } else {
    setText('timestamp', 'N/A');
  }
});