/**
 * Uddalok Bhattacharya — Portfolio Application Logic
 * Exact Vintage Toggle Switch, Dual-Oscillator Audio Physics & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initVintageSwitch();
  initNavigationLinks();
  initMobileMenu();
  initStatusIndicator();
  initMultilingualGreetings();
  initAboutScrollReveal();
  initVideoPlayerModal();
  initHoverVideoPreviews();
  initEmailCopy();
  initBackToTop();
  initInteractiveAvatar();
  initSegmentedFilterBar();
});

/* --------------------------------------------------------------------------
   EXACT ACOUSTIC SOUND SYNTHESIZER FOR VINTAGE TOGGLE SWITCH
   Extracted directly from reference portfolio (dual-oscillator physics)
   -------------------------------------------------------------------------- */
function playVintageSwitchSound(isTurningOn) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;

    // High metallic ping oscillator (triangle wave)
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'triangle';
    oscHigh.frequency.setValueAtTime(isTurningOn ? 1600 : 1200, t);
    oscHigh.frequency.exponentialRampToValueAtTime(320, t + 0.022);
    gainHigh.gain.setValueAtTime(0.09, t);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(t);
    oscHigh.stop(t + 0.03);

    // Low mechanical chassis thud oscillator (sine wave)
    const oscLow = ctx.createOscillator();
    const gainLow = ctx.createGain();
    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(isTurningOn ? 210 : 180, t);
    oscLow.frequency.exponentialRampToValueAtTime(45, t + 0.04);
    gainLow.gain.setValueAtTime(0.12, t);
    gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    oscLow.connect(gainLow);
    gainLow.connect(ctx.destination);
    oscLow.start(t);
    oscLow.stop(t + 0.05);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 100);
  } catch (err) {
    // Silently ignore if audio context is blocked
  }
}

/* --------------------------------------------------------------------------
   VINTAGE SKEUOMORPHIC SWITCH & THEME CONTROLLER
   -------------------------------------------------------------------------- */
function initVintageSwitch() {
  const switchBtn = document.getElementById('nav-vintage-toggle-btn');
  if (!switchBtn) return;

  const savedTheme = localStorage.getItem('uddalok_theme') || 'dark';
  applyThemeState(savedTheme);

  switchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isCurrentlyPurple = currentTheme === 'purple';
    const nextTheme = isCurrentlyPurple ? 'dark' : 'purple';

    // Play dual-oscillator acoustic switch snap
    playVintageSwitchSound(!isCurrentlyPurple);

    applyThemeState(nextTheme);
    localStorage.setItem('uddalok_theme', nextTheme);
  });

  switchBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      switchBtn.click();
    }
  });
}

function applyThemeState(theme) {
  const switchBtn = document.getElementById('nav-vintage-toggle-btn');
  if (theme === 'purple') {
    document.documentElement.setAttribute('data-theme', 'purple');
    if (switchBtn) {
      switchBtn.setAttribute('aria-checked', 'true');
      switchBtn.setAttribute('title', 'Flip switch to Night Mode');
      switchBtn.setAttribute('aria-label', 'Vintage toggle switch: currently in Purple mode. Click to toggle to Dark mode.');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (switchBtn) {
      switchBtn.setAttribute('aria-checked', 'false');
      switchBtn.setAttribute('title', 'Flip switch to Day / Purple Mode');
      switchBtn.setAttribute('aria-label', 'Vintage toggle switch: currently in Dark mode. Click to toggle to Purple mode.');
    }
  }
}

/* --------------------------------------------------------------------------
   NAVBAR LINKS (About, Work, Contact)
   -------------------------------------------------------------------------- */
function initNavigationLinks() {
  const navBtns = document.querySelectorAll('.nav-btn-link');
  const logoLink = document.getElementById('nav-logo-link');
  const standaloneLogoLink = document.getElementById('standalone-logo-link');

  function scrollToTop(e) {
    if (window.location.pathname.endsWith('work.html') || window.location.pathname.endsWith('services.html')) return;
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-section') === 'hero');
    });
  }

  if (logoLink) {
    logoLink.addEventListener('click', scrollToTop);
  }
  if (standaloneLogoLink) {
    standaloneLogoLink.addEventListener('click', scrollToTop);
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-section');
      
      // Update active state
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetId === 'hero') {
        scrollToTop(e);
        return;
      }

      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  });

  // Track scroll position to update active nav link (60fps throttled with requestAnimationFrame)
  const sections = [
    { id: 'about', name: 'About' },
    { id: 'services', name: 'Services' },
    { id: 'work', name: 'Work' },
    { id: 'contact', name: 'Contact' }
  ];

  let navTicking = false;
  function updateNavOnScroll() {
    const scrollPos = window.scrollY + 200;
    const aboutEl = document.getElementById('about');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // If near the top hero/intro section, set Intro active
    if (aboutEl && (scrollPos < aboutEl.offsetTop + 40)) {
      navBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-section') === 'hero' || b.textContent.trim() === 'Intro');
      });
      mobileNavItems.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-section') === 'hero');
      });
      return;
    }

    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navBtns.forEach(b => {
            b.classList.toggle('active', b.textContent.trim() === sec.name);
          });
          mobileNavItems.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-section') === sec.id);
          });
          break;
        }
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(() => {
        updateNavOnScroll();
        navTicking = false;
      });
      navTicking = true;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   RESPONSIVE MOBILE NAVIGATION DRAWER & ACCESSIBLE HAMBURGER CONTROLLER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!toggleBtn || !drawer) return;

  function openMenu() {
    toggleBtn.classList.add('is-open');
    drawer.classList.add('show');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    toggleBtn.classList.remove('is-open');
    drawer.classList.remove('show');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = toggleBtn.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Handle mobile drawer links
  const drawerItems = drawer.querySelectorAll('.mobile-nav-item');
  drawerItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const sectionId = item.getAttribute('data-section');
      if (sectionId) {
        if (sectionId === 'hero') {
          const heroEl = document.getElementById('hero');
          if (heroEl) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          const targetEl = document.getElementById(sectionId);
          if (targetEl) {
            e.preventDefault();
            const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        }
      }
      closeMenu();
    });
  });

  // Close when tapping outside drawer
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Auto-close when resized to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && toggleBtn.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   LIVE CONTINUOUS IST CLOCK (WB, IND · IST [TIME] · RESTING)
   Continuously updates with real Indian Standard Time (Asia/Kolkata)
   -------------------------------------------------------------------------- */
function initStatusIndicator() {
  const statusEl = document.getElementById('statusText');
  if (!statusEl) return;

  function updateIST() {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(now);

      statusEl.textContent = `WB, IND · IST ${timeStr} · RESTING`;
    } catch (err) {
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      let hours = istDate.getHours();
      const minutes = istDate.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      statusEl.textContent = `WB, IND · IST ${hours}:${minutes} ${ampm} · RESTING`;
    }
  }

  // Update immediately on page load
  updateIST();

  // Continuously refresh every second so the IST minute flips in real-time
  setInterval(updateIST, 1000);
}

/* --------------------------------------------------------------------------
   ABOUT SECTION SCROLL-DRIVEN WORD REVEAL (Matching To & ry from reference)
   Words smoothly fade in from dimOpacity (0.22) to 1.0 based on scroll
   -------------------------------------------------------------------------- */
function initAboutScrollReveal() {
  const bioContainer = document.getElementById('about-bio-statement');
  if (!bioContainer) return;

  const rawText = bioContainer.textContent.trim();
  const words = rawText.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  if (totalWords === 0) return;

  // Clear and populate with wrapped word spans
  bioContainer.innerHTML = '';
  const wordSpans = [];

  words.forEach((word) => {
    const wrap = document.createElement('span');
    wrap.className = 'about-word-wrap';

    const wordSpan = document.createElement('span');
    wordSpan.className = 'about-word';
    wordSpan.textContent = word;
    wordSpan.style.opacity = '0.22'; // initial dim state

    wrap.appendChild(wordSpan);
    bioContainer.appendChild(wrap);
    wordSpans.push(wordSpan);
  });

  const b = 0.82;
  const j = Math.max(0.12, 1.8 / Math.max(1, totalWords));
  const dimOpacity = 0.22;

  let ticking = false;
  let lastProgress = -1;

  function onScroll() {
    const rect = bioContainer.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Fast culling: if completely out of viewport and already pegged at 0 or 1, skip calculation
    if (rect.bottom < 0 && lastProgress === 1) return;
    if (rect.top > windowH && lastProgress === 0) return;

    // Offset: start at 88% viewport, complete at 32% viewport
    const startPx = windowH * 0.88;
    const endPx = windowH * 0.32;

    let progress = (startPx - rect.top) / (startPx - endPx);
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Skip if no visible change
    if (Math.abs(progress - lastProgress) < 0.004 && (progress === 0 || progress === 1)) {
      return;
    }
    lastProgress = progress;

    wordSpans.forEach((span, idx) => {
      const wordStart = (idx / Math.max(1, totalWords)) * b;
      const wordEnd = Math.min(1, wordStart + j);

      let opacity;
      if (progress <= wordStart) {
        opacity = dimOpacity;
      } else if (progress >= wordEnd) {
        opacity = 1.0;
      } else {
        const fraction = (progress - wordStart) / (wordEnd - wordStart);
        opacity = dimOpacity + (1.0 - dimOpacity) * fraction;
      }

      span.style.opacity = opacity.toFixed(3);
    });
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  // Initial calculation
  onScroll();
}

/* --------------------------------------------------------------------------
   VIDEO MODAL & HOVER PREVIEW
   -------------------------------------------------------------------------- */
function initVideoPlayerModal() {
  const modal = document.getElementById('videoModal');
  const modalBox = modal ? modal.querySelector('.modal-content') : null;
  const player = document.getElementById('modalVideoPlayer');
  const closeBtn = document.getElementById('closeModalBtn');
  const cards = document.querySelectorAll('.reel-card, .work-feature-card, .work-project-item');

  if (!modal || !closeBtn || !player) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on an actual link inside the card
      if (e.target.closest('a')) return;

      const videoSrc = card.getAttribute('data-video-src');
      const isShort = card.getAttribute('data-type') === 'shorts';

      // Set aspect ratio class on modal content
      if (modalBox) {
        if (isShort) {
          modalBox.classList.remove('wide-ratio');
          modalBox.classList.add('vertical-ratio');
        } else {
          modalBox.classList.remove('vertical-ratio');
          modalBox.classList.add('wide-ratio');
        }
      }

      if (videoSrc) {
        player.style.display = 'block';
        player.src = videoSrc;
        player.currentTime = 0;
        player.play().catch(() => {});
        modal.classList.add('active');
      }
    });
  });

  function hideModal() {
    modal.classList.remove('active');
    player.pause();
    player.src = '';
    player.style.display = 'none';
  }

  closeBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) hideModal();
  });
}

function initHoverVideoPreviews() {
  const cards = document.querySelectorAll('.reel-card, .work-feature-card, .work-project-item');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.muted = true;
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
    });
  });
}

/* --------------------------------------------------------------------------
   MULTILINGUAL TYPEWRITER GREETING
   Cycles continuously through greetings in different languages:
   Hei -> Bonjour -> Hello -> Hola -> নমস্কার -> नमस्ते -> Nín hǎo -> Konnichiwa -> Ciao -> Hej
   Exact timing from reference: 90ms typing, 45ms deleting, 1800ms pause
   -------------------------------------------------------------------------- */
function initMultilingualGreetings() {
  const greetingEl = document.getElementById('multilingualGreeting');
  if (!greetingEl) return;

  const greetings = [
    "Hei",
    "Bonjour",
    "Hello",
    "Hola",
    "নমস্কার",
    "नमस्ते",
    "Nín hǎo",
    "Konnichiwa",
    "Ciao",
    "Hej"
  ];

  let currentIdx = 0;
  let currentText = "Hei";
  let isDeleting = false;

  function tick() {
    const targetWord = greetings[currentIdx];
    const targetChars = Array.from(targetWord);
    const currentChars = Array.from(currentText);

    if (isDeleting) {
      if (currentChars.length > 0) {
        currentText = targetChars.slice(0, currentChars.length - 1).join('');
        greetingEl.textContent = currentText;
        setTimeout(tick, 45); // 45ms deleting speed
      } else {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % greetings.length;
        setTimeout(tick, 250); // brief rest before typing next language
      }
    } else {
      if (currentChars.length < targetChars.length) {
        currentText = targetChars.slice(0, currentChars.length + 1).join('');
        greetingEl.textContent = currentText;
        setTimeout(tick, 90); // 90ms typing speed
      } else {
        isDeleting = true;
        setTimeout(tick, 1800); // 1.8s hold time so user can read
      }
    }
  }

  // Start cycle after initial hold of 1.8 seconds
  setTimeout(() => {
    isDeleting = true;
    tick();
  }, 1800);
}

/* --------------------------------------------------------------------------
   EMAIL COPY & TOOLTIP (Matching media_1792092103157.png)
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const btn = document.getElementById('copyEmailBtn');
  const tooltip = document.getElementById('copyTooltip');
  const email = 'workxuddalok@gmail.com';

  if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const ta = document.createElement('textarea');
          ta.value = email;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        if (tooltip) {
          tooltip.classList.add('show');
          setTimeout(() => tooltip.classList.remove('show'), 2000);
        }
        showToast(`Copied ${email} to clipboard!`);
      } catch {
        showToast(`Email: ${email}`);
      }
    });
  }

  // Discord profile click handler: copies handle and informs user as profile opens
  const discordBtn = document.getElementById('exploreDiscord');
  if (discordBtn) {
    discordBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('uddalok.visual').catch(() => {});
      }
      showToast('Copied Discord handle: uddalok.visual (Opening Discord profile...)');
    });
  }
}

/* --------------------------------------------------------------------------
   BACK TO TOP SMOOTH SCROLL (Matching media_1792092103157.png capsule button)
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* --------------------------------------------------------------------------
   SEGMENTED FILTER BAR CONTROLLER (media_1792088440773.jpg)
   Supports dual [ All ▾ | Niche ▾ ] dropdown filtering with arrow flip up
   Options: Format (Videos, Shorts), Niche (Gaming, Gaming montage, etc.)
   -------------------------------------------------------------------------- */
function initSegmentedFilterBar() {
  const bar = document.getElementById('segmentedFilterBar');
  if (!bar) return;

  const catBtn = document.getElementById('categorySegmentBtn');
  const catMenu = document.getElementById('categoryDropdownMenu');
  const catLabel = document.getElementById('categorySegmentLabel');

  const nicheBtn = document.getElementById('nicheSegmentBtn');
  const nicheMenu = document.getElementById('nicheDropdownMenu');
  const nicheLabel = document.getElementById('nicheSegmentLabel');

  const emptyState = document.getElementById('filterEmptyState');
  const projectItems = document.querySelectorAll('.work-project-item');

  let currentFormat = 'all'; // 'all', 'videos', 'shorts'
  let currentNiche = 'all';  // 'all', 'gaming', 'gaming-montage', etc.

  function closeAllDropdowns() {
    if (catMenu) catMenu.classList.remove('show');
    if (catBtn) {
      catBtn.setAttribute('aria-expanded', 'false');
      catBtn.classList.remove('active');
    }
    if (nicheMenu) nicheMenu.classList.remove('show');
    if (nicheBtn) {
      nicheBtn.setAttribute('aria-expanded', 'false');
      nicheBtn.classList.remove('active');
    }
  }

  // Format segment click (flips arrow UP when opened)
  if (catBtn && catMenu) {
    catBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = catMenu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        catMenu.classList.add('show');
        catBtn.setAttribute('aria-expanded', 'true');
        catBtn.classList.add('active');
      }
    });
  }

  // Niche segment click (flips arrow UP when opened)
  if (nicheBtn && nicheMenu) {
    nicheBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nicheMenu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        nicheMenu.classList.add('show');
        nicheBtn.setAttribute('aria-expanded', 'true');
        nicheBtn.classList.add('active');
      }
    });
  }

  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Category (Format) dropdown items: exactly Videos & Shorts
  if (catMenu) {
    catMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-filter-value');
        
        // Toggle selection: if already selected, reset to 'all'
        if (currentFormat === val) {
          currentFormat = 'all';
          item.classList.remove('selected');
          if (catLabel) catLabel.textContent = 'All';
        } else {
          catMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          currentFormat = val;
          const labelText = item.querySelector('span')?.textContent.trim() || 'All';
          if (catLabel) catLabel.textContent = labelText;
        }

        closeAllDropdowns();
        applyFilters();
      });
    });
  }

  // Niche dropdown items: Gaming, Gaming montage, etc.
  if (nicheMenu) {
    nicheMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-filter-value') || 'all';

        if (val === 'all') {
          currentNiche = 'all';
          nicheMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          if (nicheLabel) nicheLabel.textContent = 'Niche';
        } else if (currentNiche === val) {
          // Toggle off
          currentNiche = 'all';
          item.classList.remove('selected');
          const allItem = nicheMenu.querySelector('[data-filter-value="all"]');
          if (allItem) allItem.classList.add('selected');
          if (nicheLabel) nicheLabel.textContent = 'Niche';
        } else {
          nicheMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          currentNiche = val;
          const labelText = item.querySelector('span')?.textContent.trim() || 'Niche';
          if (nicheLabel) nicheLabel.textContent = labelText;
        }

        closeAllDropdowns();
        applyFilters();
      });
    });
  }

  function applyFilters() {
    let visibleCount = 0;

    projectItems.forEach(item => {
      const itemType = item.getAttribute('data-type'); // 'videos' or 'shorts'
      const itemNiche = item.getAttribute('data-niche');

      const matchesFormat = (currentFormat === 'all') || (itemType === currentFormat);
      const matchesNiche = (currentNiche === 'all') || (itemNiche === currentNiche);

      if (matchesFormat && matchesNiche) {
        item.classList.remove('hidden-by-filter');
        item.style.opacity = '0';
        item.style.transform = 'translateY(8px)';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 30);
        visibleCount++;
      } else {
        item.classList.add('hidden-by-filter');
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('show');
      } else {
        emptyState.classList.remove('show');
      }
    }
  }
}

/* --------------------------------------------------------------------------
   INTERACTIVE AVATAR (Hover/Touch Reactions: Blink & Smile at Same Time)
   - Before moving mouse on avatar: remains in calm NORMAL resting state
   - As you move mouse anywhere on that avatar: blinks and smiles at the same time!
   - On mouse leave: resets back to normal
   - Idle breathing: natural occasional blink every 4-6.5 seconds when resting
   -------------------------------------------------------------------------- */
function initInteractiveAvatar() {
  const avatar = document.getElementById('interactiveAvatar');
  const avatarImg = document.getElementById('heroAvatarImg');
  if (!avatar || !avatarImg) return;

  const FRAMES = {
    normal: 'assets/avatar_normal.png',
    blink: 'assets/avatar_blink.png',
    smile: 'assets/avatar_smile.png',
    wink: 'assets/avatar_wink.png',
    blinkSmile: 'assets/avatar_blink_smile.png'
  };

  // Preload all frames into browser cache for instant 0ms switching
  Object.values(FRAMES).forEach((src) => {
    const preloader = new Image();
    preloader.src = src;
  });

  let currentFrame = 'normal';
  let isHovered = false;
  let isManualReacting = false;
  let pauseTimer = null;
  let idleBlinkTimeout = null;

  function setFrame(frameName) {
    if (!FRAMES[frameName]) frameName = 'normal';
    currentFrame = frameName;
    avatarImg.src = FRAMES[frameName];

    avatar.classList.toggle('is-winking', frameName === 'wink');
    avatar.classList.toggle('is-smiling', frameName === 'smile' || frameName === 'blinkSmile');
  }

  // 1. As you move mouse anywhere on that avatar -> blink and smile at same time!
  function triggerBlinkAndSmile() {
    if (isManualReacting) return;
    isHovered = true;
    clearTimeout(pauseTimer);
    clearTimeout(idleBlinkTimeout);

    // Blink and smile at same time!
    setFrame('blinkSmile');

    // If mouse pauses on avatar, transition to open-eye smile after 450ms
    pauseTimer = setTimeout(() => {
      if (isHovered && !isManualReacting) {
        setFrame('smile');
      }
    }, 450);
  }

  avatar.addEventListener('mousemove', triggerBlinkAndSmile);
  avatar.addEventListener('mouseenter', triggerBlinkAndSmile);

  // 2. When mouse leaves: resets back to normal
  avatar.addEventListener('mouseleave', () => {
    isHovered = false;
    clearTimeout(pauseTimer);

    if (!isManualReacting) {
      setFrame('normal');
      scheduleIdleBlink();
    }
  });

  // 3. Click or Mobile Touch Tap: full animated reaction sequence
  function triggerTapReaction(e) {
    isManualReacting = true;
    clearTimeout(pauseTimer);
    clearTimeout(idleBlinkTimeout);

    // Blink & Smile at same time -> Wink -> Normal
    setFrame('blinkSmile');
    setTimeout(() => {
      setFrame('wink');
      setTimeout(() => {
        isManualReacting = false;
        if (isHovered) {
          setFrame('smile');
        } else {
          setFrame('normal');
          scheduleIdleBlink();
        }
      }, 600);
    }, 450);
  }

  avatar.addEventListener('click', triggerTapReaction);
  avatar.addEventListener('touchstart', triggerTapReaction, { passive: true });

  // 4. Natural Resting Blinking (every 4.2 to 6.5s when cursor is elsewhere)
  function scheduleIdleBlink() {
    clearTimeout(idleBlinkTimeout);
    const nextInterval = 4200 + Math.random() * 2500;
    idleBlinkTimeout = setTimeout(() => {
      if (!isHovered && !isManualReacting && currentFrame === 'normal') {
        setFrame('blink');
        setTimeout(() => {
          if (!isHovered && !isManualReacting) {
            setFrame('normal');
          }
          scheduleIdleBlink();
        }, 140);
      } else {
        scheduleIdleBlink();
      }
    }, nextInterval);
  }

  scheduleIdleBlink();
}
