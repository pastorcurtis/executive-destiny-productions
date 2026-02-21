/* ============================================
   EXECUTIVE DESTINY PRODUCTIONS — Main JS
   $10K Premium Interactivity
   ============================================ */

(function () {
  'use strict';

  /* --- Page Loader --- */
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 400);
    });
    setTimeout(function () {
      if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
      }
    }, 2500);
  }

  /* --- Scroll Progress Bar --- */
  var scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgress.style.transform = 'scaleX(' + progress + ')';
    }, { passive: true });
  }

  /* --- Sticky Nav --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* --- Mobile Menu Toggle --- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll Reveal (Multi-Direction + Stagger) --- */
  var revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  var revealElements = document.querySelectorAll(revealSelectors);

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Image Curtain Reveals --- */
  var curtainElements = document.querySelectorAll('.curtain-reveal');
  if (curtainElements.length > 0 && 'IntersectionObserver' in window) {
    var curtainObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          curtainObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    curtainElements.forEach(function (el) {
      curtainObserver.observe(el);
    });
  }

  /* --- Text Line Reveals --- */
  var textReveals = document.querySelectorAll('.text-reveal');
  if (textReveals.length > 0 && 'IntersectionObserver' in window) {
    var textObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    textReveals.forEach(function (el) {
      textObserver.observe(el);
    });
  }

  /* --- Horizontal Carousel (Drag + Momentum) --- */
  var carousels = document.querySelectorAll('.carousel-track');

  carousels.forEach(function (track) {
    var isDown = false;
    var startX;
    var scrollLeft;
    var velX = 0;
    var momentumID = null;

    track.addEventListener('mousedown', function (e) {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      cancelMomentum();
    });

    track.addEventListener('mouseleave', function () {
      if (isDown) startMomentum();
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mouseup', function () {
      if (isDown) startMomentum();
      isDown = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.8;
      velX = track.scrollLeft - (scrollLeft - walk);
      track.scrollLeft = scrollLeft - walk;
    });

    function startMomentum() {
      cancelMomentum();
      momentumID = requestAnimationFrame(function step() {
        velX *= 0.92;
        track.scrollLeft += velX;
        if (Math.abs(velX) > 0.5) {
          momentumID = requestAnimationFrame(step);
        }
      });
    }

    function cancelMomentum() {
      if (momentumID) {
        cancelAnimationFrame(momentumID);
        momentumID = null;
      }
    }
  });

  /* --- Parallax on Multiple Images --- */
  var parallaxImages = document.querySelectorAll('.hero-image img, .about-teaser-image img');
  if (parallaxImages.length > 0) {
    window.addEventListener('scroll', function () {
      parallaxImages.forEach(function (img) {
        var parent = img.closest('section, .about-teaser');
        if (!parent) parent = img.parentElement;
        var rect = parent.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        var speed = img.closest('.hero-image') ? 0.15 : 0.08;
        var yPos = (rect.top * speed);
        img.style.transform = 'scale(1) translateY(' + yPos + 'px)';
      });
    }, { passive: true });
  }

  /* --- Section Rule Line-Draw Animation --- */
  var sectionRules = document.querySelectorAll('.section-rule');
  if (sectionRules.length > 0 && 'IntersectionObserver' in window) {
    var ruleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'lineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
          ruleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    sectionRules.forEach(function (rule) {
      rule.style.width = '0';
      ruleObserver.observe(rule);
    });
  }

  /* --- Animated Stats Counter --- */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';

    if (isNaN(target) || target <= 1) {
      el.textContent = el.getAttribute('data-suffix') || el.textContent;
      return;
    }

    var duration = 2200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease-out cubic for smooth deceleration */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* --- Button Ripple Effect --- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 600);
    });
  });

  /* --- Scroll-to-Top Button --- */
  var scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Hide Scroll Cue on Scroll --- */
  var scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        scrollCue.style.opacity = '0';
        scrollCue.style.transition = 'opacity 0.4s ease';
      } else {
        scrollCue.style.opacity = '1';
      }
    }, { passive: true });
  }

  /* --- Form Success State --- */
  var forms = document.querySelectorAll('form[data-netlify]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var successEl = form.parentElement.querySelector('.form-success');
      if (!successEl) return;

      e.preventDefault();
      var formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      }).then(function () {
        form.style.display = 'none';
        successEl.classList.add('show');
      }).catch(function () {
        form.submit();
      });
    });
  });

  /* --- Year in Footer --- */
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
