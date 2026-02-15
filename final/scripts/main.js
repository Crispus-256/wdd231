import { getMentors, displayMentors } from './modules.js';

const menuBtn = document.querySelector('#menu-button');
const nav = document.querySelector('#nav-menu');

// Toggle Menu
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

// Load Mentors for resources.html
const mentorContainer = document.querySelector('#mentor-container');
if (mentorContainer) {
    getMentors('data/mentors.json').then(data => {
        displayMentors(data, mentorContainer);
        
        // Add a persistent toggle so users can re-enable/disable mentor detail modals
        (function setupMentorModalToggle() {
            if (!mentorContainer) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'mentor-controls';
            wrapper.innerHTML = `
                <label class="mentor-toggle">
                    <input id="mentor-modals-toggle" type="checkbox" aria-checked="true">
                    <span>Show mentor details modals</span>
                </label>
            `;
            mentorContainer.parentNode.insertBefore(wrapper, mentorContainer);

            const toggle = wrapper.querySelector('#mentor-modals-toggle');
            const suppressed = localStorage.getItem('suppressMentorModal') === 'true';
            toggle.checked = !suppressed; // checked === modals enabled

            toggle.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                if (enabled) localStorage.removeItem('suppressMentorModal');
                else localStorage.setItem('suppressMentorModal', 'true');

                // keep modal's internal suppress checkbox in sync if dialog is present
                const suppressCheckbox = document.querySelector('#suppress-modal');
                if (suppressCheckbox) suppressCheckbox.checked = !enabled;
            });
        })();

        // Modal Logic (accessible)
        const modal = document.querySelector('#mentor-details');
        const modalContent = document.querySelector('#modal-content');
        const closeBtn = document.querySelector('#close-modal');
        let lastFocusedElement = null;

        function trapFocus(element) {
            const focusable = element.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            function handleKey(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) { // shift + tab
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else { // tab
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            }

            element.addEventListener('keydown', handleKey);
            return () => element.removeEventListener('keydown', handleKey);
        }

        function openModalFor(mentor) {
            // persist last viewed mentor id
            localStorage.setItem('lastViewedMentor', mentor.id);

            // if user suppressed modals, do not show
            if (localStorage.getItem('suppressMentorModal') === 'true') return;

            lastFocusedElement = document.activeElement;
            modalContent.innerHTML = `
                <h2 id="modal-title">${mentor.name}</h2>
                <p>${mentor.bio}</p>
                <p><strong>Area:</strong> ${mentor.area}</p>
                <p><strong>Experience:</strong> ${mentor.experience}</p>
                <label><input type="checkbox" id="suppress-modal"> Don't show mentor details modals again</label>
            `;
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-labelledby', 'modal-title');
            modal.showModal();

            // focus first focusable inside
            const removeTrap = trapFocus(modal);

            // wire suppress checkbox
            const suppress = document.querySelector('#suppress-modal');
            if (suppress) {
                suppress.checked = localStorage.getItem('suppressMentorModal') === 'true';
                suppress.addEventListener('change', (e) => {
                    localStorage.setItem('suppressMentorModal', e.target.checked ? 'true' : 'false');
                });
            }

            // cleanup when dialog closes
            modal.addEventListener('close', () => {
                removeTrap();
                if (lastFocusedElement) lastFocusedElement.focus();
            }, { once: true });
        }

        function closeModal() {
            if (modal.open) modal.close();
        }

        // Attach click handlers to detail buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mentor = data.find(m => m.id == btn.dataset.id);
                if (mentor) openModalFor(mentor);
            });
        });

        // Image preview (click mentor image to see larger)
        const imgPreview = document.querySelector('#image-preview');
        const previewImg = document.querySelector('#preview-img');
        const previewCaption = document.querySelector('#preview-caption');
        const closePreviewBtn = document.querySelector('#close-preview');

        function openImagePreview(mentor) {
            // always show image preview regardless of suppress setting
            lastFocusedElement = document.activeElement;
            previewImg.src = mentor.image;
            previewImg.alt = mentor.name;
            previewCaption.textContent = `${mentor.name} — ${mentor.area}`;
            imgPreview.setAttribute('aria-hidden', 'false');
            imgPreview.showModal();
            const removeTrap = trapFocus(imgPreview);
            imgPreview.addEventListener('close', () => {
                removeTrap();
                imgPreview.setAttribute('aria-hidden', 'true');
                if (lastFocusedElement) lastFocusedElement.focus();
            }, { once: true });
        }

        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mentor = data.find(m => m.id == btn.dataset.id);
                if (mentor) openImagePreview(mentor);
            });
        });

        if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => imgPreview.close());
        if (imgPreview) {
            imgPreview.addEventListener('click', (e) => { if (e.target === imgPreview) imgPreview.close(); });
            imgPreview.addEventListener('keydown', (e) => { if (e.key === 'Escape') imgPreview.close(); });
        }

        // Close button
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // ensure Escape works when dialog is focused
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    });
}

// Local Storage for User Interaction
if (location.pathname.includes("index.html")) {
    const visitDisplay = document.querySelector('#last-visit');
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
        visitDisplay.textContent = `Welcome back! Your last visit was ${lastVisit}`;
    }
    localStorage.setItem('lastVisit', new Date().toLocaleDateString());
}

/* --------------------------------------------------------------------------
   Join page — autosave draft to localStorage, restore, clear and simple validation
   - Saves form inputs to 'joinFormDraft'
   - Restores on page load if present
   - Adds an accessible status message and a "Clear draft" button
   - Removes draft on successful submit
   -------------------------------------------------------------------------- */
const joinForm = document.querySelector('.mentor-form');
if (joinForm) {
    const fname = joinForm.querySelector('input[name="fname"]');
    const email = joinForm.querySelector('input[name="email"]');
    const interest = joinForm.querySelector('select[name="interest"]');
    const DRAFT_KEY = 'joinFormDraft';

    // create status element (aria-live) so SR users are notified of restore/clear actions
    let draftNote = document.querySelector('#draft-note');
    if (!draftNote) {
        draftNote = document.createElement('p');
        draftNote.id = 'draft-note';
        draftNote.className = 'sr-only';
        draftNote.setAttribute('role', 'status');
        draftNote.setAttribute('aria-live', 'polite');
        joinForm.insertAdjacentElement('beforebegin', draftNote);
    }

    function showDraftMessage(text, visible = false) {
        draftNote.textContent = text;
        if (visible) {
            draftNote.classList.remove('sr-only');
            setTimeout(() => draftNote.classList.add('sr-only'), 2500);
        }
    }

    // restore draft if present
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
        try {
            const saved = JSON.parse(raw);
            if (saved.fname) fname.value = saved.fname;
            if (saved.email) email.value = saved.email;
            if (saved.interest) interest.value = saved.interest;
            showDraftMessage('Restored saved application draft', true);
        } catch (err) {
            console.warn('corrupt draft removed', err);
            localStorage.removeItem(DRAFT_KEY);
        }
    }

    // debounce helper to reduce write frequency
    function debounce(fn, wait = 250) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // save draft
    const saveDraft = debounce(() => {
        const payload = {
            fname: fname.value.trim(),
            email: email.value.trim(),
            interest: interest.value,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        showDraftMessage('Draft saved');
    }, 300);

    fname.addEventListener('input', saveDraft);
    email.addEventListener('input', saveDraft);
    interest.addEventListener('change', saveDraft);

    // add Clear draft button (in DOM) — non-destructive to HTML source so user can still edit file
    if (!document.querySelector('#clear-draft')) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.id = 'clear-draft';
        clearBtn.className = 'cta-button';
        clearBtn.textContent = 'Clear draft';
        // place after submit button if present, otherwise append to form
        const submit = joinForm.querySelector('input[type="submit"]');
        if (submit && submit.parentNode) submit.parentNode.appendChild(clearBtn);
        else joinForm.appendChild(clearBtn);

        clearBtn.addEventListener('click', () => {
            localStorage.removeItem(DRAFT_KEY);
            fname.value = '';
            email.value = '';
            interest.value = 'mentee';
            showDraftMessage('Draft cleared', true);
        });
    }

    // remove draft on submit (allow normal navigation to thank-you page)
    joinForm.addEventListener('submit', () => {
        localStorage.removeItem(DRAFT_KEY);
    });

    // basic, friendly validation for full name (short message shown via Constraint API)
    fname.addEventListener('input', () => {
        const ok = fname.value.trim().length >= 2;
        fname.setCustomValidity(ok ? '' : 'Please enter your full name');
    });

}