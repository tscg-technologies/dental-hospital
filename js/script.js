/**
 * DENTAL HOSPITAL - Interactive Client Script
 * Pure Vanilla JavaScript (ES6+)
 * Zero external libraries or frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. ACTIVE NAVIGATION LINK DETECTION
     -------------------------------------------------------------------------- */
  const initActiveNav = () => {
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '' || currentPath === '/') {
      currentPath = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };

  /* --------------------------------------------------------------------------
     2. RESPONSIVE MOBILE NAVIGATION TOGGLE
     -------------------------------------------------------------------------- */
  const initMobileMenu = () => {
    const navToggle = document.getElementById('navToggle');
    const navMenuWrapper = document.getElementById('navMenuWrapper');

    if (!navToggle || !navMenuWrapper) return;

    const toggleMenu = () => {
      const isOpen = navToggle.classList.contains('open');
      if (isOpen) {
        navToggle.classList.remove('open');
        navMenuWrapper.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        navToggle.classList.add('open');
        navMenuWrapper.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenuWrapper.classList.contains('open') &&
        !navMenuWrapper.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleMenu();
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenuWrapper.classList.contains('open')) {
        toggleMenu();
      }
    });

    // Close menu on link click inside mobile drawer
    const menuLinks = navMenuWrapper.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenuWrapper.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     3. FAQ ACCORDION INTERACTION
     -------------------------------------------------------------------------- */
  const initFaqAccordion = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close other items in the same container for clean accordion effect
        const parentList = item.parentElement;
        if (parentList) {
          parentList.querySelectorAll('.faq-item').forEach(sibling => {
            sibling.classList.remove('active');
            const q = sibling.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
          });
        }

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     4. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const initBackToTop = () => {
    const backBtn = document.getElementById('backToTop');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    });

    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  /* --------------------------------------------------------------------------
     5. DEPARTMENT & TREATMENT FILTERING
     -------------------------------------------------------------------------- */
  const initCategoryFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterGroup = btn.getAttribute('data-filter-group') || 'default';
        const targetCategory = btn.getAttribute('data-category');

        // Toggle active button inside the same group
        const groupButtons = document.querySelectorAll(`.filter-btn[data-filter-group="${filterGroup}"]`);
        groupButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        const filterItems = document.querySelectorAll(`.filterable-item[data-filter-group="${filterGroup}"]`);
        filterItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category') || '';
          const categoryList = itemCategories.split(' ').map(c => c.trim());

          if (targetCategory === 'all' || categoryList.includes(targetCategory)) {
            item.style.display = '';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });
      });
    });
  };

  /* --------------------------------------------------------------------------
     6. URL PARAMETERS PRE-FILL FOR APPOINTMENT & CONTACT
     -------------------------------------------------------------------------- */
  const initUrlParamsPreFill = () => {
    const params = new URLSearchParams(window.location.search);
    const deptParam = params.get('dept');
    const specialistParam = params.get('specialist');

    if (deptParam) {
      const deptSelect = document.getElementById('appointmentDept');
      if (deptSelect) {
        for (let i = 0; i < deptSelect.options.length; i++) {
          if (deptSelect.options[i].text.toLowerCase().includes(deptParam.toLowerCase()) ||
              deptSelect.options[i].value.toLowerCase().includes(deptParam.toLowerCase())) {
            deptSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    if (specialistParam) {
      const specialistSelect = document.getElementById('appointmentSpecialist');
      if (specialistSelect) {
        for (let i = 0; i < specialistSelect.options.length; i++) {
          if (specialistSelect.options[i].text.toLowerCase().includes(specialistParam.toLowerCase())) {
            specialistSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  /* --------------------------------------------------------------------------
     7. FORM VALIDATION & DEMO SUBMISSION (APPOINTMENT FORM)
     -------------------------------------------------------------------------- */
  const initAppointmentForm = () => {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    // Set minimum date for appointment to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Inputs to validate
      const nameInput = document.getElementById('patientName');
      const phoneInput = document.getElementById('patientPhone');
      const emailInput = document.getElementById('patientEmail');
      const dateInp = document.getElementById('appointmentDate');
      const timeInp = document.getElementById('appointmentTime');
      const deptInp = document.getElementById('appointmentDept');
      const reasonInp = document.getElementById('appointmentReason');
      const termsCheckbox = document.getElementById('appointmentTerms');

      const validateInput = (input, condition) => {
        if (!input) return true;
        if (!condition) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      };

      // 1. Name: minimum 3 characters
      if (nameInput) {
        validateInput(nameInput, nameInput.value.trim().length >= 3);
      }

      // 2. Phone: valid 10-digit number
      if (phoneInput) {
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phoneInput.value.replace(/\D/g, '');
        validateInput(phoneInput, phoneRegex.test(cleanPhone));
      }

      // 3. Email: standard regex
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
      }

      // 4. Date: must be picked
      if (dateInp) {
        validateInput(dateInp, dateInp.value !== '');
      }

      // 5. Time: must be picked
      if (timeInp) {
        validateInput(timeInp, timeInp.value !== '');
      }

      // 6. Department: must be selected
      if (deptInp) {
        validateInput(deptInp, deptInp.value !== '');
      }

      // 7. Reason: must be selected
      if (reasonInp) {
        validateInput(reasonInp, reasonInp.value !== '');
      }

      // 8. Terms checkbox
      if (termsCheckbox) {
        if (!termsCheckbox.checked) {
          termsCheckbox.classList.add('is-invalid');
          isValid = false;
        } else {
          termsCheckbox.classList.remove('is-invalid');
        }
      }

      if (isValid) {
        const specialistInp = document.getElementById('appointmentSpecialist');
        const specialistVal = specialistInp && specialistInp.value ? specialistInp.value : 'Assigned Senior Consultant';
        const notesInp = document.getElementById('appointmentNotes');
        const notesVal = notesInp ? notesInp.value.trim() : 'None';

        // Generate demo reference number
        const refId = 'DH-' + Math.floor(100000 + Math.random() * 900000);

        // Show Modal Confirmation
        showAppointmentModal({
          name: nameInput ? nameInput.value.trim() : '',
          phone: phoneInput ? phoneInput.value.trim() : '',
          email: emailInput ? emailInput.value.trim() : '',
          dept: deptInp ? deptInp.options[deptInp.selectedIndex].text : '',
          specialist: specialistVal,
          date: dateInp ? dateInp.value : '',
          time: timeInp ? timeInp.options[timeInp.selectedIndex].text : '',
          refId: refId
        });

        // Reset form
        form.reset();
        document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      } else {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      }
    });

    // Real-time input clearing of invalid state
    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
      input.addEventListener('change', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     8. FORM VALIDATION (GENERAL CONTACT / ENQUIRY FORM)
     -------------------------------------------------------------------------- */
  const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInp = document.getElementById('contactName');
      const emailInp = document.getElementById('contactEmail');
      const phoneInp = document.getElementById('contactPhone');
      const subjectInp = document.getElementById('contactSubject');
      const messageInp = document.getElementById('contactMessage');

      const validate = (input, condition) => {
        if (!input) return;
        if (!condition) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      };

      if (nameInp) validate(nameInp, nameInp.value.trim().length >= 2);
      if (emailInp) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validate(emailInp, emailRegex.test(emailInp.value.trim()));
      }
      if (phoneInp) {
        const phoneRegex = /^[6-9]\d{9}$/;
        validate(phoneInp, phoneRegex.test(phoneInp.value.replace(/\D/g, '')));
      }
      if (subjectInp) validate(subjectInp, subjectInp.value.trim().length >= 3);
      if (messageInp) validate(messageInp, messageInp.value.trim().length >= 10);

      if (isValid) {
        showGenericMessageModal(
          'Enquiry Submitted Successfully (Demonstration)',
          `Thank you, <strong>${nameInp ? nameInp.value.trim() : 'Patient'}</strong>. Your demonstration inquiry has been recorded.<br><br>
          <div class="demo-alert-banner" style="margin-top:1rem;margin-bottom:0;">
            <p><strong>Demonstration Note:</strong> As this is a portfolio demonstration website, no actual message was transmitted to a real hospital desk.</p>
          </div>`
        );
        form.reset();
        document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      }
    });
  };

  /* --------------------------------------------------------------------------
     9. MODAL DIALOG CONTROLLER
     -------------------------------------------------------------------------- */
  const showAppointmentModal = (details) => {
    let modal = document.getElementById('demoModalBackdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'demoModalBackdrop';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true">
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close dialog">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <div id="modalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#modalCloseBtn').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

    const modalBody = modal.querySelector('#modalBody');
    modalBody.innerHTML = `
      <div class="text-center" style="margin-bottom: 1.5rem;">
        <div style="width: 58px; height: 58px; border-radius: 50%; background-color: var(--color-accent); color: var(--color-secondary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <svg style="width: 32px; height: 32px; fill: currentColor;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <h3 style="color: var(--color-text); margin-bottom: 0.35rem;">Appointment Request Confirmed</h3>
        <span class="badge badge-demo">Simulated Demonstration Booking</span>
      </div>

      <div style="background-color: var(--color-bg-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
          <span style="color: var(--color-text-muted);">Reference ID:</span>
          <strong style="color: var(--color-primary);">${details.refId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
          <span style="color: var(--color-text-muted);">Patient Name:</span>
          <strong>${details.name}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
          <span style="color: var(--color-text-muted);">Department:</span>
          <strong>${details.dept}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
          <span style="color: var(--color-text-muted);">Preferred Specialist:</span>
          <strong>${details.specialist}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
          <span style="color: var(--color-text-muted);">Appointment Date:</span>
          <strong>${details.date}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-muted);">Time Slot:</span>
          <strong>${details.time}</strong>
        </div>
      </div>

      <div class="demo-alert-banner" style="margin-bottom: 1.5rem;">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <p><strong>Demonstration Notice:</strong> DENTAL HOSPITAL is a fictional showcase institution. Form submissions do not connect to a live database or create actual medical reservations.</p>
      </div>

      <button class="btn btn-primary btn-full" id="modalOkBtn">Done & Close</button>
    `;

    modal.querySelector('#modalOkBtn').addEventListener('click', closeModal);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const showGenericMessageModal = (title, htmlContent) => {
    let modal = document.getElementById('demoModalBackdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'demoModalBackdrop';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true">
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close dialog">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <div id="modalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#modalCloseBtn').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

    const modalBody = modal.querySelector('#modalBody');
    modalBody.innerHTML = `
      <h3 style="margin-bottom: 1rem; color: var(--color-primary);">${title}</h3>
      <div style="font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">${htmlContent}</div>
      <button class="btn btn-primary btn-full" id="modalOkBtn">Close</button>
    `;

    modal.querySelector('#modalOkBtn').addEventListener('click', closeModal);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    const modal = document.getElementById('demoModalBackdrop');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  /* --------------------------------------------------------------------------
     10. DEPARTMENT / TREATMENT QUICK MODAL VIEW DETAILS
     -------------------------------------------------------------------------- */
  const initDetailButtons = () => {
    const detailButtons = document.querySelectorAll('.js-view-details');
    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title') || 'Department Information';
        const desc = btn.getAttribute('data-desc') || 'Comprehensive specialist care tailored to patient oral health needs.';
        const items = btn.getAttribute('data-items') || '';
        const deptLink = btn.getAttribute('data-link') || 'contact.html';

        let itemsHtml = '';
        if (items) {
          const list = items.split(',').map(s => s.trim());
          itemsHtml = '<h5 style="margin-top:1rem;margin-bottom:0.5rem;color:var(--color-text);">Clinical Scope & Treatments:</h5><ul style="list-style:disc;padding-left:1.25rem;color:var(--color-text-muted);font-size:0.9rem;display:flex;flex-direction:column;gap:0.35rem;">';
          list.forEach(li => {
            itemsHtml += `<li>${li}</li>`;
          });
          itemsHtml += '</ul>';
        }

        showGenericMessageModal(
          title,
          `<p style="color:var(--color-text-muted);font-size:0.95rem;line-height:1.6;">${desc}</p>
          ${itemsHtml}
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
            <a href="${deptLink}" class="btn btn-primary" style="flex: 1;">Book Consultation</a>
          </div>`
        );
      });
    });
  };

  /* --------------------------------------------------------------------------
     INITIALIZE ALL SYSTEMS
     -------------------------------------------------------------------------- */
  initActiveNav();
  initMobileMenu();
  initFaqAccordion();
  initBackToTop();
  initCategoryFilters();
  initUrlParamsPreFill();
  initAppointmentForm();
  initContactForm();
  initDetailButtons();
});
