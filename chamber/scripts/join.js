// Join page behaviors: timestamp, modal controls, card reveal
document.addEventListener('DOMContentLoaded', () => {
  const tsInput = document.getElementById('timestamp');
  const setTimestamp = () => {
    if (tsInput) tsInput.value = new Date().toISOString();
  };
  setTimestamp();

  const form = document.querySelector('form');
  if (form) form.addEventListener('submit', setTimestamp);

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    const focusable = dialog.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  // Open dialogs via data-modal attribute
  document.querySelectorAll('button[data-modal]').forEach(button => {
    const modalId = button.dataset.modal;
    const dialog = document.getElementById(modalId);
    if (!dialog) return;

    button.addEventListener('click', () => openDialog(dialog));

    // Close button inside dialog
    const closeBtn = dialog.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => closeDialog(dialog));

    // Backdrop click closes dialog
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  // Close any open dialogs on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(d => closeDialog(d));
    }
  });

  // Reveal cards with staggered, unique entrance animations
  const mapping = {
    'np-card': 'animate-np',
    'bronze-card': 'animate-bronze',
    'silver-card': 'animate-silver',
    'gold-card': 'animate-gold'
  };

  const cards = Array.from(document.querySelectorAll('.card'));
  cards.forEach((card, i) => {
    const delay = i * 130; // stagger in ms
    const animClass = mapping[card.id] || 'animate-np';

    // apply delay and animation class (respect reduced-motion)
    card.style.animationDelay = `${delay}ms`;

    // If user prefers reduced motion, don't animate; just reveal
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTimeout(() => card.classList.add('visible'), delay);
      return;
    }

    setTimeout(() => {
      card.classList.add(animClass);
    }, delay);

    card.addEventListener('animationend', () => {
      card.classList.remove(animClass);
      card.classList.add('visible');
      card.style.animationDelay = '';
    }, { once: true });
  });
});