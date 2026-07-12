/**
 * BamTech - Main Website JS Script
 * Replicates interactive features of modern agency sites
 */

// EmailJS is loaded via CDN in HTML and initialized with publicKey before this script runs

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // Navbar Scrolled Class & Scroll-To-Top Button
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    // Navbar Scroll Shadow
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to Top Button Visibility
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }, { passive: true });

  // Scroll to Top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // Mobile Hamburger Navigation
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile nav when links are clicked
    navMenu.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // FAQ Accordion Toggle
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (questionBtn && answerEl) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current FAQ
        if (isActive) {
          item.classList.remove('active');
          answerEl.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
        }
      });
    }
  });

  // ==========================================
  // Scroll Reveal Animations & Active Links
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id="hero"]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Active Link Observer
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(section => activeLinkObserver.observe(section));

  // ==========================================
  // Counter Section Animation
  // ==========================================
  const counters = document.querySelectorAll('.counter-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetVal = parseInt(targetEl.getAttribute('data-target'), 10);
        let startVal = 0;
        const duration = 1200;
        let startTime = null;

        const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease-out cubic curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * targetVal);

          if (targetVal === 5 && currentVal === 5) {
            targetEl.textContent = '5★';
          } else if (targetVal === 100) {
            targetEl.textContent = currentVal + '%';
          } else {
            targetEl.textContent = currentVal + '+';
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (targetVal === 5) targetEl.textContent = '5★';
            else if (targetVal === 100) targetEl.textContent = '100%';
            else targetEl.textContent = targetVal + '+';
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(targetEl);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ==========================================
  // Pricing Selector Switch (Web vs Systems)
  // ==========================================
  const pricingToggle = document.getElementById('pricing-toggle');
  const toggleLblA = document.getElementById('toggle-label-a');
  const toggleLblB = document.getElementById('toggle-label-b');

  if (pricingToggle) {
    let activeMode = 'web'; // 'web' or 'sys'

    const handlePricingSwitch = () => {
      pricingToggle.classList.toggle('active', activeMode === 'sys');
      toggleLblA.classList.toggle('active', activeMode === 'web');
      toggleLblB.classList.toggle('active', activeMode === 'sys');

      // Update Card Prices & Delivery text
      document.querySelectorAll('.plan-price').forEach(el => {
        el.textContent = el.getAttribute(`data-${activeMode}`) || el.textContent;
      });
      document.querySelectorAll('.delivery-val').forEach(el => {
        el.textContent = el.getAttribute(`data-${activeMode}`) || el.textContent;
      });
    };

    pricingToggle.addEventListener('click', () => {
      activeMode = activeMode === 'web' ? 'sys' : 'web';
      handlePricingSwitch();
    });
  }

  // ==========================================
  // Contact Form Submission & Dialog Modal
  // ==========================================
  const quoteForm = document.getElementById('quote-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalSummaryBox = document.getElementById('modal-summary-box');

  if (quoteForm) {
    const checkField = (field) => {
      const group = field.closest('.form-group');
      if (!group) return true;

      let valid = true;
      if (field.hasAttribute('required')) {
        if (field.type === 'email') {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        } else {
          valid = field.value.trim().length > 0;
        }
      }
      group.classList.toggle('invalid', !valid);
      return valid;
    };

    // Attach interactive event listeners for clean user validation UX
    quoteForm.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
      input.addEventListener('blur', () => checkField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('invalid')) {
          checkField(input);
        }
      });
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredEls = quoteForm.querySelectorAll('input[required], select[required], textarea[required]');
      let formIsValid = true;

      requiredEls.forEach(input => {
        if (!checkField(input)) {
          formIsValid = false;
        }
      });

      if (!formIsValid) {
        const firstInvalid = quoteForm.querySelector('.form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Read form data values
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone') ? document.getElementById('form-phone').value.trim() : '';
      const projectSelect = document.getElementById('form-project');
      const projectName = projectSelect ? projectSelect.options[projectSelect.selectedIndex].text : '';
      const message = document.getElementById('form-message') ? document.getElementById('form-message').value.trim() : '';

      // Show loading state on submit button
      const submitBtn = document.getElementById('submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Remove any previous error banner
      const existingErr = quoteForm.querySelector('.form-send-error');
      if (existingErr) existingErr.remove();

      // Send via EmailJS
      const payload = {
        from_name: name,
        from_email: email,
        phone: phone || 'Not provided',
        service: projectName,
        message: message || 'No message provided'
      };
      console.log('📤 Sending to EmailJS with payload:', payload);

      emailjs.send('service_3kafl56', 'template_hcfe73e', payload)
      .then((response) => {
        console.log('✅ EmailJS success:', response);
        // Show success modal
        if (successModal) successModal.classList.add('active');

        // Reset form
        quoteForm.reset();
        quoteForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
      })
      .catch((err) => {
        console.error('❌ EmailJS error details:', JSON.stringify(err));
        // Show inline error message below the form
        const errBanner = document.createElement('p');
        errBanner.className = 'form-send-error';
        errBanner.style.cssText = 'color:#e53935;margin-top:12px;font-size:0.9rem;text-align:center;';
        errBanner.textContent = '⚠️ Message could not be sent. Please try WhatsApp or email us directly at bamtechke@gmail.com.';
        quoteForm.appendChild(errBanner);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    });
  }

  // Handle Modal Closing trigger actions
  if (closeModalBtn && successModal) {
    const closeModal = () => successModal.classList.remove('active');

    closeModalBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Initialize CSS classes for scroll animations safely
  document.querySelectorAll('.service-card, .pricing-card, .review-card, .about-img-wrap, .about-content').forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

});
