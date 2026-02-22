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

  /* --- Unified Scroll Handler (rAF-throttled) --- */
  var scrollProgress = document.querySelector('.scroll-progress');
  var nav = document.querySelector('.nav');
  var scrollTopBtn = document.querySelector('.scroll-top');
  var scrollCue = document.querySelector('.scroll-cue');
  var _parallaxImages = document.querySelectorAll('.about-teaser-image img');
  var mobileMenu = document.querySelector('.mobile-menu');
  var _scrollTicking = false;
  var _lastScrollY = 0;

  function onScroll() {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    /* Scroll progress bar + percentage */
    if (scrollProgress) {
      var progress = docHeight > 0 ? scrollY / docHeight : 0;
      scrollProgress.style.transform = 'scaleX(' + progress + ')';
    }
    var progressPercent = document.querySelector('.scroll-progress-percent');
    if (progressPercent) {
      var pct = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;
      progressPercent.textContent = pct + '%';
      progressPercent.classList.toggle('visible', scrollY > 100);
    }

    /* Sticky nav — scrolled + shrunk + hide/reveal */
    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 10);
      nav.classList.toggle('shrunk', scrollY > 80);

      /* Hide on scroll down, reveal on scroll up */
      var mobileMenuOpen = mobileMenu && mobileMenu.classList.contains('open');
      if (!mobileMenuOpen) {
        if (scrollY > _lastScrollY && scrollY > 200) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
      }
      _lastScrollY = scrollY;
    }

    /* Scroll-to-top button */
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', scrollY > 600);
    }

    /* Scroll cue fade */
    if (scrollCue) {
      scrollCue.style.opacity = scrollY > 100 ? '0' : '1';
      scrollCue.style.transition = 'opacity 0.4s ease';
    }

    /* Parallax images */
    _parallaxImages.forEach(function (img) {
      var parent = img.closest('section, .about-teaser');
      if (!parent) parent = img.parentElement;
      var rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      img.style.transform = 'scale(1) translateY(' + (rect.top * 0.08) + 'px)';
    });

    _scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!_scrollTicking) {
      requestAnimationFrame(onScroll);
      _scrollTicking = true;
    }
  }, { passive: true });

  /* --- Mobile Menu Toggle --- */
  var toggle = document.querySelector('.nav-toggle');

  /* Helper: close mobile menu */
  function closeMobileMenu() {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    nav.classList.remove('mobile-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && mobileMenu) {
    var _menuFocusableEls = mobileMenu.querySelectorAll('a, button');

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      nav.classList.toggle('mobile-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      /* Focus management */
      if (isOpen && _menuFocusableEls.length > 0) {
        _menuFocusableEls[0].focus();
      } else {
        toggle.focus();
      }
    });

    /* Escape key closes menu */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        toggle.focus();
      }
    });

    /* Focus trap within mobile menu */
    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || _menuFocusableEls.length === 0) return;
      var first = _menuFocusableEls[0];
      var last = _menuFocusableEls[_menuFocusableEls.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
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
      var prevScrollLeft = track.scrollLeft;
      track.scrollLeft = scrollLeft - walk;
      velX = track.scrollLeft - prevScrollLeft;
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

  /* --- Carousel Arrow + Dot Navigation --- */
  var carouselTrack = document.querySelector('.carousel-track');
  var prevBtn = document.querySelector('.carousel-prev');
  var nextBtn = document.querySelector('.carousel-next');
  var dots = document.querySelectorAll('.carousel-dot');

  if (carouselTrack && prevBtn && nextBtn && dots.length > 0) {
    var cards = carouselTrack.querySelectorAll('.product-card');
    var cardWidth = cards.length > 0 ? cards[0].offsetWidth + 32 : 432;

    /* Recalculate card width on resize */
    window.addEventListener('resize', function () {
      if (cards.length > 0) {
        cardWidth = cards[0].offsetWidth + 32;
      }
    });

    /* Set ARIA roles on dots */
    dots.forEach(function (dot) {
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', dot.classList.contains('active') ? 'true' : 'false');
    });

    function updateDots() {
      var scrollPos = carouselTrack.scrollLeft;
      var activeIndex = Math.round(scrollPos / cardWidth);
      dots.forEach(function (dot, i) {
        var isActive = i === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    prevBtn.addEventListener('click', function () {
      carouselTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', function () {
      carouselTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        carouselTrack.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
    });

    carouselTrack.addEventListener('scroll', updateDots, { passive: true });
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

  /* --- Hero Mouse-Tracking Spotlight --- */
  var heroSection = document.querySelector('.hero');
  var spotlightGlow = document.querySelector('.hero-spotlight-glow');
  if (heroSection && spotlightGlow) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      spotlightGlow.style.left = (e.clientX - rect.left) + 'px';
      spotlightGlow.style.top = (e.clientY - rect.top) + 'px';
      spotlightGlow.style.opacity = '1';
    });
    heroSection.addEventListener('mouseleave', function () {
      spotlightGlow.style.opacity = '0';
    });
  }

  /* --- Scroll-to-Top Click Handler --- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Form Loading State on Submit --- */
  document.querySelectorAll('form[name]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.classList.add('btn-loading');
        btn.setAttribute('disabled', 'true');
        /* Recovery timeout — re-enable button if submission stalls */
        setTimeout(function () {
          btn.classList.remove('btn-loading');
          btn.removeAttribute('disabled');
        }, 8000);
      }
    });
  });

  /* --- Form Success State (FormSubmit.co redirect with #success hash) --- */
  if (window.location.hash === '#success') {
    var forms = document.querySelectorAll('form[name]');
    forms.forEach(function (form) {
      var successEl = form.parentElement.querySelector('.form-success');
      if (successEl) {
        form.style.display = 'none';
        successEl.classList.add('show');
        /* Announce to screen readers */
        successEl.setAttribute('role', 'alert');
        successEl.setAttribute('aria-live', 'polite');
      }
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(function (btn, index) {
    /* Wire up aria-controls/id pairing */
    var answer = btn.closest('.faq-item').querySelector('.faq-answer');
    if (answer) {
      var answerId = 'faq-answer-' + index;
      answer.id = answerId;
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', 'faq-btn-' + index);
      btn.id = 'faq-btn-' + index;
      btn.setAttribute('aria-controls', answerId);
    }

    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      /* Close all items first */
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      /* Toggle clicked item */
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Carousel Keyboard Navigation --- */
  if (carouselTrack) {
    carouselTrack.setAttribute('role', 'region');
    carouselTrack.setAttribute('aria-label', 'Product carousel');
    carouselTrack.setAttribute('tabindex', '0');
    carouselTrack.addEventListener('keydown', function (e) {
      /* Use live cardWidth (recalculated on resize above) */
      var kbW = carouselTrack.querySelector('.product-card')
        ? carouselTrack.querySelector('.product-card').offsetWidth + 32 : 432;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        carouselTrack.scrollBy({ left: kbW, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        carouselTrack.scrollBy({ left: -kbW, behavior: 'smooth' });
      }
    });
  }

  /* --- Year in Footer --- */
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================
     VALUE-ADD UPGRADES — Interactive
     ============================================ */

  /* --- Image Lightbox (products.html only) --- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('.lightbox-image');
    var lbCloseBtn = lightbox.querySelector('.lightbox-close');
    var lbPrevBtn = lightbox.querySelector('.lightbox-prev');
    var lbNextBtn = lightbox.querySelector('.lightbox-next');
    var galleryImgs = document.querySelectorAll('.gallery-item img');
    var lbIndex = 0;

    function openLightbox(index) {
      lbIndex = index;
      var img = galleryImgs[lbIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lbCloseBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function lbNext() {
      lbIndex = (lbIndex + 1) % galleryImgs.length;
      lightboxImg.src = galleryImgs[lbIndex].src;
      lightboxImg.alt = galleryImgs[lbIndex].alt;
    }

    function lbPrev() {
      lbIndex = (lbIndex - 1 + galleryImgs.length) % galleryImgs.length;
      lightboxImg.src = galleryImgs[lbIndex].src;
      lightboxImg.alt = galleryImgs[lbIndex].alt;
    }

    galleryImgs.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function () { openLightbox(i); });
    });

    lbCloseBtn.addEventListener('click', closeLightbox);
    lbPrevBtn.addEventListener('click', lbPrev);
    lbNextBtn.addEventListener('click', lbNext);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    });

    /* Touch swipe */
    var lbTouchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      lbTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      var diff = lbTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) lbNext(); else lbPrev();
      }
    });
  }

  /* --- Testimonial Auto-Rotation (index.html only) --- */
  var testimonialGrid = document.querySelector('.testimonials-grid');
  var tCards = document.querySelectorAll('.testimonial-card');
  var tDots = document.querySelectorAll('.testimonial-dot');

  if (tCards.length > 1 && tDots.length > 0 && window.innerWidth > 768) {
    testimonialGrid.classList.add('rotating');
    var tIndex = 0;
    var tInterval = null;
    var tPaused = false;

    function showTestimonial(index) {
      tCards.forEach(function (card) { card.classList.remove('active'); });
      tDots.forEach(function (dot) { dot.classList.remove('active'); });
      tCards[index].classList.add('active');
      tDots[index].classList.add('active');
    }

    function nextTestimonial() {
      if (tPaused) return;
      tIndex = (tIndex + 1) % tCards.length;
      showTestimonial(tIndex);
    }

    showTestimonial(0);

    if (!prefersReducedMotion) {
      tInterval = setInterval(nextTestimonial, 5000);
    }

    testimonialGrid.addEventListener('mouseenter', function () { tPaused = true; });
    testimonialGrid.addEventListener('mouseleave', function () { tPaused = false; });

    tDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(tInterval);
        tIndex = i;
        showTestimonial(tIndex);
        tPaused = false;
        if (!prefersReducedMotion) {
          tInterval = setInterval(nextTestimonial, 5000);
        }
      });
    });
  }

  /* ============================================
     VISUAL UPGRADES — Phase 2 (JS-driven)
     ============================================ */

  /* Shared: detect reduced motion + touch device */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* --- 6. Custom Branded Cursor --- */
  if (!prefersReducedMotion && !isTouchDevice && window.innerWidth >= 769) {
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('has-custom-cursor');

    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      if (!cursor.classList.contains('visible')) {
        cursor.classList.add('visible');
      }
    });

    /* Scale up on interactive elements */
    var hoverTargets = document.querySelectorAll('a, button, .btn, .product-card, .gallery-item');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  /* --- 7. Product Card 3D Tilt --- */
  if (!prefersReducedMotion && !isTouchDevice) {
    var tiltCards = document.querySelectorAll('.product-card');
    tiltCards.forEach(function (card) {
      /* Add shine overlay */
      var shine = document.createElement('div');
      shine.className = 'tilt-shine';
      card.appendChild(shine);

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        /* Max ±8 degrees rotation */
        var rotateY = ((x - centerX) / centerX) * 8;
        var rotateX = ((centerY - y) / centerY) * 8;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        /* Move shine to follow cursor */
        shine.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.18), transparent 60%)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s var(--ease-out)';
        setTimeout(function () {
          card.style.transition = '';
        }, 400);
      });
    });
  }

  /* --- 8. Hero Text Split Reveals --- */
  if (!prefersReducedMotion) {
    var heroH1 = document.querySelector('.hero-content h1');
    if (heroH1) {
      /* Split text into word spans, preserving .accent spans */
      var wordSpans = [];
      var childNodes = Array.prototype.slice.call(heroH1.childNodes);

      function processNode(node) {
        if (node.nodeType === 3) {
          /* Text node — split into words */
          var words = node.textContent.split(/\s+/).filter(function (w) { return w.length > 0; });
          words.forEach(function (word) {
            var span = document.createElement('span');
            span.className = 'hero-word';
            span.textContent = word;
            wordSpans.push(span);
          });
        } else if (node.nodeType === 1) {
          /* Element node (e.g., .accent span) — wrap as one word unit */
          var wrapper = document.createElement('span');
          wrapper.className = 'hero-word';
          var clone = node.cloneNode(true);
          wrapper.appendChild(clone);
          wordSpans.push(wrapper);
        }
      }

      childNodes.forEach(processNode);

      /* Clear h1 and rebuild with word spans */
      while (heroH1.firstChild) {
        heroH1.removeChild(heroH1.firstChild);
      }
      /* Disable existing h1 animation */
      heroH1.style.animation = 'none';
      heroH1.style.opacity = '1';
      wordSpans.forEach(function (span) {
        heroH1.appendChild(span);
      });

      /* Stagger reveal after page loader completes */
      var splitDelay = loader ? 900 : 300;
      setTimeout(function () {
        wordSpans.forEach(function (span, i) {
          setTimeout(function () {
            span.classList.add('visible');
          }, i * 80);
        });
      }, splitDelay);
    }
  }

  /* --- 9. Magnetic Buttons --- */
  if (!prefersReducedMotion && !isTouchDevice) {
    var magneticBtns = document.querySelectorAll('.hero-buttons .btn, .cta-buttons .btn');
    magneticBtns.forEach(function (btn) {
      btn.classList.add('btn-magnetic');

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var btnCenterX = rect.left + rect.width / 2;
        var btnCenterY = rect.top + rect.height / 2;
        var distX = e.clientX - btnCenterX;
        var distY = e.clientY - btnCenterY;
        var distance = Math.sqrt(distX * distX + distY * distY);
        var maxDist = 100;
        if (distance < maxDist) {
          var strength = (1 - distance / maxDist) * 8;
          var moveX = (distX / distance) * strength;
          var moveY = (distY / distance) * strength;
          btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        }
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* --- 10. Parallax Depth Layers --- */
  if (!prefersReducedMotion) {
    var heroFloatShapes = document.querySelectorAll('.hero-float-shape');
    var parallaxSpeeds = [-0.15, -0.08, -0.12];

    if (heroFloatShapes.length > 0) {
      window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        /* Only calculate when hero is visible (first screenful) */
        if (scrollY > window.innerHeight * 1.5) return;
        heroFloatShapes.forEach(function (shape, i) {
          var speed = parallaxSpeeds[i] || -0.1;
          shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
      }, { passive: true });
    }
  }

  /* ============================================
     ADVANCED FEATURES — Phase 3
     ============================================ */

  /* --- Dark Mode Toggle --- */
  var dmToggle = document.querySelector('.dark-mode-toggle');
  if (dmToggle) {
    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);
    dmToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');

    dmToggle.addEventListener('click', function () {
      var theme = document.documentElement.getAttribute('data-theme');
      var newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      dmToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        var newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        dmToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
      }
    });
  }

  /* --- Page Transition Effects --- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href) return;
        /* Skip anchor links, external links, new-tab links */
        if (href.startsWith('#')) return;
        if (href.startsWith('http') || href.startsWith('//')) return;
        if (link.getAttribute('target') === '_blank') return;
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

        e.preventDefault();
        document.body.classList.add('page-transitioning');
        setTimeout(function () {
          window.location.href = href;
        }, 300);
      });
    });
  }

  /* --- Service Worker Registration --- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

})();
