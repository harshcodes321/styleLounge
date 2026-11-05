/* ============================================
   STYLE LOUNGE - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader (2 seconds) ----------
  const preloader = document.getElementById('preloader');
  const preloaderStart = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - preloaderStart;
    const remaining = Math.max(0, 2000 - elapsed);
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after fade-out completes
      setTimeout(() => {
        preloader.remove();
      }, 900);
    }, remaining);
  });

  // ---------- Hero Background Auto-Slider (3s screen time, zoom in) ----------
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentHeroIndex = 0;
    const slideDuration = 3000; // 3 seconds screen time per cycle

    function nextHeroSlide() {
      const activeSlide = heroSlides[currentHeroIndex];
      activeSlide.classList.remove('active');
      activeSlide.classList.add('prev');

      currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
      const nextSlide = heroSlides[currentHeroIndex];
      nextSlide.classList.remove('prev');

      // Trigger reflow to ensure the zoom-in animation restarts cleanly
      void nextSlide.offsetWidth;
      nextSlide.classList.add('active');


      setTimeout(() => {
        activeSlide.classList.remove('prev');
      }, 1000);
    }

    setInterval(nextHeroSlide, slideDuration);
  }

  // ---------- Navbar Scroll & Floating Elements ----------
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  const floatingDock = document.querySelector('.floating-dock');
  const heroSection = document.getElementById('home');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show floating dock only when scrolling down past the home/hero section
    const heroHeight = heroSection ? (heroSection.offsetHeight * 0.45) : 320;
    if (floatingDock) {
      if (scrollY > heroHeight) {
        floatingDock.classList.add('visible');
      } else {
        floatingDock.classList.remove('visible');
      }
    }

    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ---------- Mobile Menu ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ---------- Back to Top ----------
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.offsetTop - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ---------- Testimonial Slider ----------
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startAutoSlide();
    });
  });

  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked if wasn't active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 25);
  }


  // ---------- Ambient Soothing Canvas (Floating Luminous Particles) ----------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 16 : 32;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.radius = Math.random() * 2.8 + 1.2;
        this.baseAlpha = Math.random() * 0.45 + 0.25;
        this.alpha = this.baseAlpha;
        this.speed = Math.random() * 0.38 + 0.14;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.012;
        // Warm gold / champagne hues
        const goldTones = [
          '212, 175, 55',    // warm gold
          '200, 185, 165',   // champagne taupe
          '240, 226, 210',   // luminous pearl
          '255, 248, 235'    // warm ivory
        ];
        this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
      }
      update() {
        this.y -= this.speed;
        this.angle += this.angularSpeed;
        this.x += Math.sin(this.angle) * 0.35;
        if (this.y < -30) {
          this.reset(false);
        }
      }
      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2.2);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.35})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    }
    animate();

    // Cursor aura follower
    const aura = document.querySelector('.ambient-aura-cursor');
    if (aura && window.matchMedia('(pointer: fine)').matches) {
      let mouseX = -500, mouseY = -500;
      let auraX = -500, auraY = -500;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        aura.style.opacity = '1';
      });

      window.addEventListener('mouseleave', () => {
        aura.style.opacity = '0';
      });

      function renderAura() {
        auraX += (mouseX - auraX) * 0.08;
        auraY += (mouseY - auraY) * 0.08;
        aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
        requestAnimationFrame(renderAura);
      }
      renderAura();
    }
  }


  // ---------- Studio Gallery: Interactive Lightbox & 4-Second Auto-Slider ----------
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.querySelector('.gallery-grid');
  const gallerySliderWrap = document.getElementById('gallerySliderWrap');
  const gallerySlidesContainer = document.getElementById('gallerySlidesContainer');
  const gallerySliderThumbs = document.getElementById('gallerySliderThumbs');
  const gallerySliderProgressBar = document.getElementById('gallerySliderProgressBar');
  const gallerySliderStage = document.getElementById('gallerySliderStage');
  const gallerySliderPrev = document.getElementById('gallerySliderPrev');
  const gallerySliderNext = document.getElementById('gallerySliderNext');
  const gallerySliderPause = document.getElementById('gallerySliderPause');
  const gallerySlideCurrent = document.getElementById('gallerySlideCurrent');
  const gallerySlideTotal = document.getElementById('gallerySlideTotal');
  const btnViewSlider = document.getElementById('btnViewSlider');
  const btnViewGrid = document.getElementById('btnViewGrid');

  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGalleryData = [];
  let currentLightboxIdx = 0;

  // Extract all portfolio images from the DOM items
  const allPortfolioItems = Array.from(galleryItems).map((item, idx) => {
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-item-title')?.textContent.trim() || 'Salon Craft';
    const tag = item.querySelector('.gallery-item-tag')?.textContent.trim() || 'Studio';
    const cat = item.getAttribute('data-category') || 'all';
    return {
      index: idx,
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || title,
      title: title,
      tag: tag,
      category: cat,
      element: item
    };
  });

  function buildActiveGallery() {
    activeGalleryData = [];
    galleryItems.forEach((item) => {
      if (!item.classList.contains('hidden')) {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-item-title')?.textContent.trim() || '';
        const tag = item.querySelector('.gallery-item-tag')?.textContent.trim() || '';
        activeGalleryData.push({
          src: img?.getAttribute('src') || '',
          alt: img?.getAttribute('alt') || '',
          title: title,
          tag: tag,
          element: item
        });
      }
    });
  }
  buildActiveGallery();

  // ---------- GALLERY AUTO-SLIDER (4 Seconds Screen Time Per Image) ----------
  const SLIDE_DURATION = 4000; // Exactly 4 seconds screentime per slide
  let activeSliderList = [...allPortfolioItems];
  let currentSliderIdx = 0;
  let isSliderPaused = false;
  let isGalleryInViewport = false;
  let slideTimerId = null;
  let slideCycleStartTime = 0;
  let slideRemainingTime = SLIDE_DURATION;
  let isTimerRunning = false;

  // Populate slides and thumbs
  function buildSliderDOM() {
    if (!gallerySlidesContainer || !gallerySliderThumbs) return;
    gallerySlidesContainer.innerHTML = '';
    gallerySliderThumbs.innerHTML = '';

    allPortfolioItems.forEach((item, idx) => {
      // Slide
      const slide = document.createElement('div');
      slide.className = 'gallery-slider-slide' + (idx === 0 ? ' active' : '');
      slide.setAttribute('data-slider-idx', idx);
      slide.setAttribute('data-category', item.category);
      slide.setAttribute('data-src', item.src);
      slide.innerHTML = `
        <div class="slide-ambient-bg" style="background-image: url('${item.src}')"></div>
        <div class="slide-img-wrap">
          <img src="${item.src}" alt="${item.alt}" class="slide-main-img" loading="${idx < 3 ? 'eager' : 'lazy'}">
        </div>
        <div class="slide-caption-bar">
          <div class="slide-caption-info">
            <span class="slide-tag">${item.tag}</span>
            <h3 class="slide-title">${item.title}</h3>
          </div>
        </div>
      `;
      gallerySlidesContainer.appendChild(slide);

      // Thumbnail
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'gallery-slider-thumb-btn' + (idx === 0 ? ' active' : '');
      thumbBtn.setAttribute('data-thumb-idx', idx);
      thumbBtn.setAttribute('data-category', item.category);
      thumbBtn.setAttribute('aria-label', `View slide ${idx + 1}: ${item.title}`);
      thumbBtn.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy">`;
      thumbBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetPos = activeSliderList.findIndex(it => it.index === idx);
        if (targetPos !== -1) {
          goToSlide(targetPos);
        }
      });
      gallerySliderThumbs.appendChild(thumbBtn);
    });
  }

  function goToSlide(newIdx) {
    if (!activeSliderList.length) return;
    if (newIdx < 0) newIdx = activeSliderList.length - 1;
    if (newIdx >= activeSliderList.length) newIdx = 0;
    currentSliderIdx = newIdx;

    const currentItem = activeSliderList[currentSliderIdx];

    // Update slides
    const allSlides = gallerySlidesContainer?.querySelectorAll('.gallery-slider-slide');
    allSlides?.forEach(slide => {
      const sIdx = parseInt(slide.getAttribute('data-slider-idx'), 10);
      if (sIdx === currentItem.index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update thumbnails
    const allThumbs = gallerySliderThumbs?.querySelectorAll('.gallery-slider-thumb-btn');
    allThumbs?.forEach(thumb => {
      const tIdx = parseInt(thumb.getAttribute('data-thumb-idx'), 10);
      if (tIdx === currentItem.index) {
        thumb.classList.add('active');
        // Smoothly scroll ONLY the thumbnail rail horizontally without touching window scroll
        const thumbsWrap = document.querySelector('.gallery-slider-thumbs-wrap');
        if (thumbsWrap) {
          const thumbLeft = thumb.offsetLeft;
          const thumbWidth = thumb.offsetWidth;
          const wrapWidth = thumbsWrap.clientWidth;
          const targetLeft = thumbLeft - (wrapWidth / 2) + (thumbWidth / 2);
          thumbsWrap.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: 'smooth'
          });
        }
      } else {
        thumb.classList.remove('active');
      }
    });

    startSlideTimer(SLIDE_DURATION);
  }

  function nextSlide() {
    goToSlide(currentSliderIdx + 1);
  }

  function prevSlide() {
    goToSlide(currentSliderIdx - 1);
  }

  // 4-Second Exact Progress Timer (Smooth Hardware Accelerated CSS Fill + Timer)
  function startSlideTimer(time = SLIDE_DURATION) {
    clearTimeout(slideTimerId);
    if (!gallerySliderProgressBar) return;

    if (time >= SLIDE_DURATION) {
      slideRemainingTime = SLIDE_DURATION;
      gallerySliderProgressBar.style.transition = 'none';
      gallerySliderProgressBar.style.width = '0%';
      void gallerySliderProgressBar.offsetWidth; // Force layout repaint
    } else {
      slideRemainingTime = Math.max(200, time);
    }

    if (isSliderPaused || !isGalleryInViewport) {
      isTimerRunning = false;
      return;
    }

    isTimerRunning = true;
    slideCycleStartTime = performance.now();

    gallerySliderProgressBar.style.transition = `width ${slideRemainingTime}ms linear`;
    gallerySliderProgressBar.style.width = '100%';

    slideTimerId = setTimeout(() => {
      if (!isSliderPaused && isGalleryInViewport) {
        nextSlide();
      }
    }, slideRemainingTime);
  }

  function pauseSlideTimer() {
    if (!isTimerRunning) return;
    clearTimeout(slideTimerId);
    isTimerRunning = false;

    const elapsed = performance.now() - slideCycleStartTime;
    slideRemainingTime = Math.max(0, slideRemainingTime - elapsed);

    if (gallerySliderProgressBar) {
      const computedWidth = window.getComputedStyle(gallerySliderProgressBar).width;
      gallerySliderProgressBar.style.transition = 'none';
      gallerySliderProgressBar.style.width = computedWidth;
    }
  }

  function resumeSlideTimer() {
    if (isTimerRunning || isSliderPaused || !isGalleryInViewport) return;
    if (slideRemainingTime <= 100) {
      nextSlide();
    } else {
      startSlideTimer(slideRemainingTime);
    }
  }

  // Hover Pause & Resume on Desktop Only (prevents touch screen emulation from permanently pausing)
  const hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hasFinePointer && gallerySliderStage) {
    gallerySliderStage.addEventListener('mouseenter', () => {
      isSliderPaused = true;
      pauseSlideTimer();
    });
    gallerySliderStage.addEventListener('mouseleave', () => {
      isSliderPaused = false;
      resumeSlideTimer();
    });
  }

  // Click anywhere on active slide -> Open in Lightbox right there
  if (gallerySliderStage) {
    gallerySliderStage.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-slider-nav')) {
        return;
      }
      if (!activeSliderList.length) return;
      const curItem = activeSliderList[currentSliderIdx];
      buildActiveGallery();
      let lbIdx = activeGalleryData.findIndex(d => d.src === curItem.src);
      if (lbIdx === -1) {
        activeGalleryData = allPortfolioItems.map(p => ({
          src: p.src,
          alt: p.alt,
          title: p.title,
          tag: p.tag
        }));
        lbIdx = activeGalleryData.findIndex(d => d.src === curItem.src);
      }
      openLightbox(lbIdx !== -1 ? lbIdx : 0);
    });

    // Mobile Touch & Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchActive = false;

    gallerySliderStage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchActive = true;
        pauseSlideTimer();
      }
    }, { passive: true });

    const handleTouchFinish = (e) => {
      if (!isTouchActive) return;
      isTouchActive = false;

      let clientX = touchStartX;
      let clientY = touchStartY;
      if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      const diffX = clientX - touchStartX;
      const diffY = clientY - touchStartY;

      isSliderPaused = false;

      // If horizontal swipe greater than 40px and predominantly horizontal
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      } else {
        resumeSlideTimer();
      }
    };

    gallerySliderStage.addEventListener('touchend', handleTouchFinish, { passive: true });
    gallerySliderStage.addEventListener('touchcancel', () => {
      isTouchActive = false;
      isSliderPaused = false;
      resumeSlideTimer();
    }, { passive: true });
  }

  // Nav Arrows
  if (gallerySliderPrev) {
    gallerySliderPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }
  if (gallerySliderNext) {
    gallerySliderNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Category Filter Tabs
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter Grid items
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      buildActiveGallery();

      // Filter Auto-Slider items
      if (filter === 'all') {
        activeSliderList = [...allPortfolioItems];
      } else {
        activeSliderList = allPortfolioItems.filter(it => it.category === filter);
      }

      // Filter thumbnail visibility
      const allThumbs = gallerySliderThumbs?.querySelectorAll('.gallery-slider-thumb-btn');
      allThumbs?.forEach(thumb => {
        const tCat = thumb.getAttribute('data-category');
        if (filter === 'all' || tCat === filter) {
          thumb.style.display = '';
        } else {
          thumb.style.display = 'none';
        }
      });

      // Jump to first slide of filtered category and restart 4s cycle
      currentSliderIdx = 0;
      goToSlide(0);
    });
  });

  // Initialize the Auto-Slider
  buildSliderDOM();
  goToSlide(0);

  // Viewport Observer: only run 4s auto-slider when gallery section is in/near screen
  const sliderStageEl = document.getElementById('gallerySliderWrap') || document.getElementById('gallery');
  if (sliderStageEl && 'IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isGalleryInViewport = entry.isIntersecting;
        if (isGalleryInViewport) {
          resumeSlideTimer();
        } else {
          pauseSlideTimer();
        }
      });
    }, { threshold: 0.01, rootMargin: '120px 0px 120px 0px' });
    galleryObserver.observe(sliderStageEl);
  } else {
    isGalleryInViewport = true;
    startSlideTimer(SLIDE_DURATION);
  }

  // Handle Tab Switch / App Backgrounding
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseSlideTimer();
    } else if (isGalleryInViewport && !isSliderPaused) {
      resumeSlideTimer();
    }
  });

  // Lightbox Open & Navigation
  function updateLightbox(idx) {
    if (!activeGalleryData.length) return;
    if (idx < 0) idx = activeGalleryData.length - 1;
    if (idx >= activeGalleryData.length) idx = 0;
    currentLightboxIdx = idx;

    const data = activeGalleryData[currentLightboxIdx];
    if (lightboxImg && data) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      if (lightboxTitle) lightboxTitle.textContent = data.title;
      if (lightboxTag) lightboxTag.textContent = data.tag;
      if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${activeGalleryData.length}`;
    }
  }

  function openLightbox(idx) {
    updateLightbox(idx);
    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Pause slider while lightbox is open
      isSliderPaused = true;
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Resume slider when lightbox closes
      isSliderPaused = false;
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      buildActiveGallery();
      const currentSrc = item.querySelector('.gallery-img')?.getAttribute('src');
      const idx = activeGalleryData.findIndex(d => d.src === currentSrc);
      openLightbox(idx !== -1 ? idx : 0);
    });
  });

  // Service Card Photos Click -> Open directly in Lightbox without scrolling or redirecting
  const serviceThumbs = document.querySelectorAll('.service-gallery-thumb');
  serviceThumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const thumbImg = thumb.querySelector('img');
      const targetSrc = thumbImg ? thumbImg.getAttribute('src') : null;
      if (!targetSrc) return;

      activeGalleryData = allPortfolioItems.map(p => ({
        src: p.src,
        alt: p.alt,
        title: p.title,
        tag: p.tag
      }));

      const idx = activeGalleryData.findIndex(d => d.src === targetSrc);
      if (idx !== -1) {
        openLightbox(idx);
      } else {
        if (lightboxImg) {
          lightboxImg.src = targetSrc;
          lightboxImg.alt = thumbImg.alt || '';
        }
        if (lightboxTitle) lightboxTitle.textContent = thumb.getAttribute('title') || thumbImg.alt || 'Style Lounge Craft';
        if (lightboxTag) lightboxTag.textContent = 'Service Craft';
        if (lightboxCounter) lightboxCounter.textContent = '1 / 1';
        if (lightbox) {
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentLightboxIdx - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentLightboxIdx + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentLightboxIdx - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentLightboxIdx + 1);
  });


  // Floating Contact Dock - Native Mail on Mobile, Gmail Web Compose on Desktop
  const dockMailBtn = document.querySelector('.dock-mail');
  if (dockMailBtn) {
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      // On desktop, directly open Gmail Web Compose in a new tab
      dockMailBtn.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=styleloungenashik@gmail.com&su=Style%20Lounge%20Salon%20Inquiry';
      dockMailBtn.target = '_blank';
      dockMailBtn.rel = 'noopener noreferrer';
    }
  }

});
