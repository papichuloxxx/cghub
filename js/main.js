  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  // Header shadow on scroll
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(41,41,41,.06)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // Universal smooth scroll handler â€” works for ALL anchor buttons
  function scrollToSection(sectionId, offsetExtra) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    const headerHeight = header.offsetHeight || 80;
    const extra = offsetExtra || 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extra;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

    // Visual highlight so user sees they've arrived
    target.classList.remove('target-highlight');
    void target.offsetWidth; // force reflow
    target.classList.add('target-highlight');
    setTimeout(() => target.classList.remove('target-highlight'), 1400);
  }

  // Attach to all buttons/links with data-scroll attribute
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const sectionId = this.getAttribute('data-scroll');
      scrollToSection(sectionId, 20);
    });
  });

  // Also handle regular nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        scrollToSection(href.substring(1), 10);
      }
    });
  });

  // Handle logo link
  document.querySelector('.logo').addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Multi-step Form Logic
  let currentStep = 1;
  const totalSteps = 3;

  window.nextStep = function(step) {
    // Basic validation for current step
    const currentStepEl = document.getElementById(`step${step}`);
    const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });
    if (!isValid) return;

    document.getElementById(`step${step}`).classList.remove('active');
    currentStep = step + 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
  };

  window.prevStep = function(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    currentStep = step - 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
  };

  function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    
    let stepName = "";
    if (currentStep === 1) stepName = "Personal Info";
    if (currentStep === 2) stepName = "Programme Selection";
    if (currentStep === 3) stepName = "Message / Questions";
    
    progressText.innerText = `Step ${currentStep} of ${totalSteps}: ${stepName}`;
  }

  // Form submission
  window.handleSubmit = function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const programme = document.getElementById('programme').value;
    const message = document.getElementById('message').value;

    // Construct WhatsApp message
    const waText = `*New Registration / Enquiry*
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Programme:* ${programme}
*Message:* ${message}`;

    const encodedText = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/263719989060?text=${encodedText}`;

    // Update button UI temporarily
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Opening WhatsApp...';
    btn.style.background = '#25D366';
    btn.style.color = '#FFFFFF';
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
      
      // Reset multi-step form to step 1
      document.getElementById(`step${currentStep}`).classList.remove('active');
      currentStep = 1;
      document.getElementById('step1').classList.add('active');
      updateProgress();
    }, 3000);
  }

  // Smooth reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.prog-card, .why-card, .focus-card, .trust-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });
