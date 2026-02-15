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