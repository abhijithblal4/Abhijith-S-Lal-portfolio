/**
 * PORTFOLIO - RETRO NOTEBOOK INTERACTIVE ENGINE
 * Handcrafted with micro-interactions, Web Audio chimes, pixel art studio, & dynamic template customization
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO RETRO SOUND SYNTHESIZER (Pure JS, zero external audio assets)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silently ignored
    }
  }

  function playPop() {
    playTone(480, 'triangle', 0.06, 0.09);
  }

  function playChime() {
    playTone(523.25, 'sine', 0.1, 0.08);
    setTimeout(() => playTone(659.25, 'sine', 0.12, 0.08), 80);
    setTimeout(() => playTone(783.99, 'sine', 0.16, 0.08), 160);
  }

  function playClick() {
    playTone(320, 'square', 0.04, 0.04);
  }

  // =========================================================================
  // 2. NAVIGATION & ACTIVE SECTION HIGHLIGHTING
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksList = document.querySelector('.nav-links');

  // Sticky header shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Update active nav based on scroll position
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    if (window.scrollY < 200) {
      current = 'home';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('mobile-open');
      playClick();
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('mobile-open');
        playClick();
      });
    });
  }

  // Pink Smiley Button interaction
  const smileyBtn = document.querySelector('.smiley-btn');
  if (smileyBtn) {
    smileyBtn.addEventListener('click', () => {
      playChime();
      showToast('😊 Abhijith says hello! Enjoy your visit!');
      createConfettiAt(window.innerWidth / 2, 120);
    });
  }

  // =========================================================================
  // 3. CASE STUDIES FILTERING & MODAL VIEWER
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playClick();

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Case Study Details Data
  const caseStudyData = {
    pixelbrew: {
      title: 'Pixel Brew: Modern Coffee Ordering App',
      category: 'UI/UX Design • Mobile App • Figma Prototype',
      year: '2026',
      summary: 'Pixel Brew solves common coffee ordering problems by providing simple navigation, easy customization, a smooth checkout process, and convenient order tracking.',
      stats: '⚡ Simple navigation • Easy drink customization • Smooth checkout • Real-time order tracking',
      problem: 'Long waiting times for ordering, complicated menu navigation, difficulty customizing drinks, confusing ordering processes, and a lack of order updates.',
      solution: 'Enabled users to browse and order coffee easily, created clear categories, added custom drink options, designed a step-by-step ordering flow, and included live tracking.',
      problemSolutionList: [
        {
          problem: 'Long waiting times for ordering coffee',
          solution: 'Enabled users to browse and order coffee easily through the app.'
        },
        {
          problem: 'Complicated menu navigation',
          solution: 'Created clear categories and simple navigation.'
        },
        {
          problem: 'Difficulty customizing drinks',
          solution: 'Added easy customization options for coffee orders.'
        },
        {
          problem: 'Confusing ordering process',
          solution: 'Designed a simple step-by-step ordering flow.'
        },
        {
          problem: 'Lack of order updates',
          solution: 'Included order tracking to keep users informed.'
        }
      ],
      image: 'assets/pixel-brew-thumb.jpg',
      fullImage: 'assets/pixel-brew-full.jpg',
      figmaLink: 'https://www.figma.com/design/MLsNziMThRIg9sqso4pZzX/PIXEL-BREW?node-id=0-1&t=7HrbEVzLGbISiwXO-1'
    },
    linear: {
      title: 'Linear Mobile 2.0: Triage on the Move',
      category: 'Product Design & Mobile Systems',
      year: '2024 - 2025',
      summary: 'Re-architected Linear’s mobile app from a slow web-wrapper into a fluid, gestures-first native experience optimized for 1-thumb issue triaging.',
      stats: '+38% faster issue triage • 140k daily active engineers • 4.9★ App Store',
      problem: 'Engineers on call frequently triage critical issues while away from their desks. The legacy mobile interface required 4 taps and deep menus just to reassign or close a bug.',
      solution: 'Introduced directional swipe gestures, haptic feedback cues, an offline sync engine, and a bottom sheet quick-action drawer that puts 90% of frequent tasks within thumb reach.',
      image: 'assets/project-linear.svg'
    },
    canvas: {
      title: 'Canvas Flow: Spatial Design Critique',
      category: 'Interaction Design & Canvas API',
      year: '2023 - 2024',
      summary: 'Created an infinite spatial canvas tool enabling async design reviews with live multiplayer cursors, localized voice memos, and smart sticky grouping.',
      stats: '140,000+ monthly collaborators • Acquired in late 2024 • 85% review speedup',
      problem: 'Design feedback was scattered across Slack screenshots, Google Docs, and Figma threads with zero context.',
      solution: 'Built an ultra-responsive WebGL/Canvas spatial board where engineers and PMs can leave pinpointed sticky notes, video reactions, and drag wireframe cards seamlessly.',
      image: 'assets/project-canvas.svg'
    },
    palette: {
      title: 'Palette Studio: Accessible Color Tokens',
      category: 'Design Systems & Open Source',
      year: '2023',
      summary: 'An open-source design tool that algorithmically generates WCAG 3.0 & APCA compliant color scales for complex enterprise dark and light themes.',
      stats: '24,000+ GitHub Stars • Adopted by 40+ enterprise teams • Zero contrast regressions',
      problem: 'Design systems often break contrast when shifting between light, dark, and high-contrast modes, leading to severe accessibility violations.',
      solution: 'Formulated mathematical perceptual lightness curves that dynamically calculate text, surface, and border token pairs guaranteed to pass accessibility checks.',
      image: 'assets/project-palette.svg'
    },
    health: {
      title: 'Zenith EHR: Humane Clinical Charting',
      category: 'Healthcare UX & Cognitive Ergonomics',
      year: '2022 - 2023',
      summary: 'Redesigned bedside Electronic Health Records (EHR) software for intensive care units, drastically cutting medical click fatigue and cognitive load.',
      stats: '-42% fewer clicks per patient shift • 99.4% charting accuracy • Trusted across 12 hospitals',
      problem: 'Nurses were spending over 3 hours per 8-hour shift clicking through nested dialogs and alert fatigue boxes instead of caring for patients.',
      solution: 'Designed a high-contrast hemodynamic vitals card and 1-click voice dictation bar that surfaces immediate patient allergies, medications, and pending labs.',
      image: 'assets/project-health.svg'
    },
    nestpay: {
      title: 'NestPay: Smart Budget & Savings App',
      category: 'UI/UX Design • Fintech • Mobile App',
      year: '2026',
      summary: 'NestPay is a fintech app that helps users track budgets and savings effortlessly with a clean, intuitive dashboard and smart spending insights.',
      stats: '💰 Budget Tracker • 📊 Smart Insights • 🎯 Savings Goals • ⚡ Clean Dashboard',
      problem: 'People struggle to track their daily spending, set realistic savings goals, and understand where their money goes each month — leading to financial stress and poor habits.',
      solution: 'Designed an intuitive fintech dashboard with real-time balance tracking, categorized transactions, visual savings goals, and a minimal one-screen overview of financial health.',
      problemSolutionList: [
        {
          problem: 'Difficulty tracking daily spending habits',
          solution: 'Built a live transaction feed with auto-categorization and visual spending bars.'
        },
        {
          problem: 'No clear overview of total balance',
          solution: 'Designed a prominent dashboard card showing total balance with monthly change.'
        },
        {
          problem: 'Hard to set and monitor savings goals',
          solution: 'Added goal cards with progress rings and milestone notifications.'
        },
        {
          problem: 'Overwhelming financial data presentation',
          solution: 'Used a minimal dark-mode layout with green accents for key actions only.'
        },
        {
          problem: 'Sending and receiving money felt complicated',
          solution: 'Streamlined quick-action buttons: Send, Add Money, Activity — all one tap away.'
        }
      ],
      image: 'assets/nestpay-thumb.jpg',
      figmaLink: 'https://www.figma.com/design/PXlhtLyI7LUS4HXsEz8HPH/nestpay?node-id=0-1&t=dS8OvpuSu0DX7bks-1'
    },
    trekly: {
      title: 'Trekly: Kerala Heritage Travel Website',
      category: 'UI/UX Design • Web Design • Travel',
      year: '2026',
      summary: 'Trekly is a Kerala travel website that takes visitors deep into local traditions, hidden villages, waterways, and low-budget authentic experiences.',
      stats: '🌴 Kerala Heritage • 🗺️ Local Traditions • 🌿 Budget Travel • ✈️ Authentic Experiences',
      problem: 'Most travel websites focus only on luxury packages and famous tourist spots, missing the authentic, budget-friendly side of Kerala — its backwaters, villages, and lived traditions.',
      solution: 'Created an immersive, nature-inspired web design with lush visuals, clear package navigation, and a strong brand identity that connects travelers directly to real Kerala experiences.',
      problemSolutionList: [
        {
          problem: 'Generic travel sites ignore authentic Kerala experiences',
          solution: 'Focused content on villages, waterways, and traditional culture instead of tourist traps.'
        },
        {
          problem: 'Budget travelers can\'t find affordable Kerala options',
          solution: 'Designed a Packages section clearly highlighting low-budget trip options.'
        },
        {
          problem: 'Overwhelming and cluttered travel website designs',
          solution: 'Used a clean, full-screen hero with a single strong CTA — "Find your experience".'
        },
        {
          problem: 'Lack of local identity in travel branding',
          solution: 'Built a strong visual identity with tea plantation photography and earthy typography.'
        },
        {
          problem: 'Difficulty discovering places and itineraries',
          solution: 'Structured navigation into Home, Places, Packages, About Us, and Contact Us.'
        }
      ],
      image: 'assets/trekly-thumb.jpg',
      figmaLink: 'https://www.figma.com/design/VCeAckMxk9Su0OGNkd1Mns/treklu?node-id=0-1&t=TinSiIn2W0idHnXX-1'
    }
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on an external link directly
      if (e.target.tagName.toLowerCase() === 'a' && e.target.getAttribute('href')?.startsWith('http')) return;

      const projectId = card.getAttribute('data-project');
      const data = caseStudyData[projectId];
      if (data && modalBody && caseStudyModal) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 20px;">
            <span class="tape-title" style="margin-bottom: 10px;">${data.category} • ${data.year}</span>
            <h2 style="font-size: 28px; font-weight: 800; color: #111; margin-bottom: 8px;">${data.title}</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">${data.summary}</p>
          </div>
          
          <div style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 24px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; display: block;">
          </div>

          ${data.problemSolutionList ? `
            <div style="background: #FFF; border-radius: 12px; padding: 22px; border: 1px solid rgba(0,0,0,0.08); margin-bottom: 24px;">
              <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #111; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                <span>☕ Problem & Solution Breakdown</span>
              </h4>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${data.problemSolutionList.map((item, idx) => `
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; background: #FAF9F5; padding: 14px 18px; border-radius: 8px; border-left: 3px solid #EA580C;">
                    <div>
                      <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #DC2626; display: block; margin-bottom: 3px;">Problem 0${idx + 1}</span>
                      <span style="font-size: 13px; font-weight: 600; color: #2C1B14; line-height: 1.4;">${item.problem}</span>
                    </div>
                    <div>
                      <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #16A34A; display: block; margin-bottom: 3px;">Design Solution</span>
                      <span style="font-size: 13px; font-weight: 600; color: #166534; line-height: 1.4;">${item.solution}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
              <div style="background: #FFF; padding: 20px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08);">
                <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #EB5A3C; margin-bottom: 8px;">The Challenge</h4>
                <p style="font-size: 14px; color: #444; line-height: 1.5;">${data.problem}</p>
              </div>
              <div style="background: #FFF; padding: 20px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08);">
                <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0D825C; margin-bottom: 8px;">The Design Solution</h4>
                <p style="font-size: 14px; color: #444; line-height: 1.5;">${data.solution}</p>
              </div>
            </div>
          `}

          <div style="background: #FEF08A; padding: 16px 20px; border-radius: 8px; border: 1px solid #FDE047; margin-bottom: 20px;">
            <strong style="font-size: 13px; font-family: monospace; text-transform: uppercase; color: #854D0E; display: block; margin-bottom: 4px;">Verified Impact & Features:</strong>
            <span style="font-size: 15px; font-weight: 700; color: #111;">${data.stats}</span>
          </div>

          ${data.figmaLink ? `
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
              <a href="${data.figmaLink}" target="_blank" rel="noopener noreferrer" class="btn-submit-contact" style="background-color: #2C1B14; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <span>🎨 Open in Figma</span>
                <span>↗</span>
              </a>
              ${data.fullImage ? `
                <a href="${data.fullImage}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                  <span>🔍 View Full Design Sheet</span>
                  <span>↗</span>
                </a>
              ` : ''}
            </div>
          ` : ''}
        `;
        caseStudyModal.classList.add('open');
        playPop();
      }
    });
  });

  if (modalCloseBtn && caseStudyModal) {
    modalCloseBtn.addEventListener('click', () => {
      caseStudyModal.classList.remove('open');
      playClick();
    });

    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) {
        caseStudyModal.classList.remove('open');
        playClick();
      }
    });
  }

  // =========================================================================
  // 4. PLAYGROUND TOYS: STICKER BOARD & PIXEL ART STUDIO
  // =========================================================================

  // --- Toy 1: Interactive Sticker Board ---
  const stickerBoard = document.getElementById('stickerBoard');
  const trayStickers = document.querySelectorAll('.tray-sticker');
  const clearBoardBtn = document.getElementById('clearBoardBtn');
  const boardHint = document.querySelector('.sticker-board-hint');

  trayStickers.forEach(sticker => {
    sticker.addEventListener('click', () => {
      if (!stickerBoard) return;
      playPop();

      if (boardHint) {
        boardHint.style.display = 'none';
      }

      const emoji = sticker.getAttribute('data-emoji');
      const stickerEl = document.createElement('div');
      stickerEl.className = 'placed-sticker';
      stickerEl.textContent = emoji;
      stickerEl.style.fontSize = '32px';

      // Random position inside board
      const maxX = stickerBoard.clientWidth - 50;
      const maxY = stickerBoard.clientHeight - 50;
      const x = Math.max(10, Math.floor(Math.random() * maxX));
      const y = Math.max(10, Math.floor(Math.random() * maxY));
      const rot = Math.floor(Math.random() * 30) - 15;

      stickerEl.style.left = `${x}px`;
      stickerEl.style.top = `${y}px`;
      stickerEl.style.transform = `rotate(${rot}deg)`;

      // Make draggable
      let isDragging = false;
      let startX, startY, initLeft, initTop;

      stickerEl.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initLeft = parseInt(stickerEl.style.left) || 0;
        initTop = parseInt(stickerEl.style.top) || 0;
        stickerEl.style.zIndex = '20';
        playPop();
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        stickerEl.style.left = `${initLeft + dx}px`;
        stickerEl.style.top = `${initTop + dy}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          stickerEl.style.zIndex = '5';
        }
      });

      // Double-click to spin/remove
      stickerEl.addEventListener('dblclick', () => {
        stickerEl.style.transform = 'scale(0) rotate(180deg)';
        setTimeout(() => stickerEl.remove(), 200);
        playPop();
      });

      stickerBoard.appendChild(stickerEl);
    });
  });

  if (clearBoardBtn && stickerBoard) {
    clearBoardBtn.addEventListener('click', () => {
      const stickers = stickerBoard.querySelectorAll('.placed-sticker');
      stickers.forEach(s => s.remove());
      if (boardHint) boardHint.style.display = 'block';
      playClick();
      showToast('Sticker board cleared ✨');
    });
  }

  // --- Toy 2: 12x12 Pixel Art Studio ---
  const pixelGrid = document.getElementById('pixelGrid');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const clearPixelBtn = document.getElementById('clearPixelBtn');
  const savePixelBtn = document.getElementById('savePixelBtn');
  let selectedColor = '#111111';

  // Setup color swatch selector
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.getAttribute('data-color');
      playClick();
    });
  });

  // Generate 12x12 grid cells
  if (pixelGrid) {
    pixelGrid.innerHTML = '';
    const initialHeartMatrix = [
      0,0,1,1,0,0,0,1,1,0,0,0,
      0,1,1,1,1,0,1,1,1,1,0,0,
      1,1,1,1,1,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,1,1,1,0,
      0,1,1,1,1,1,1,1,1,1,0,0,
      0,0,1,1,1,1,1,1,1,0,0,0,
      0,0,0,1,1,1,1,1,0,0,0,0,
      0,0,0,0,1,1,1,0,0,0,0,0,
      0,0,0,0,0,1,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0
    ];

    for (let i = 0; i < 144; i++) {
      const cell = document.createElement('div');
      cell.className = 'pixel-cell';
      if (initialHeartMatrix[i] === 1) {
        cell.style.backgroundColor = '#FF4F81';
      }
      cell.addEventListener('mousedown', () => {
        cell.style.backgroundColor = selectedColor;
        playPop();
      });
      cell.addEventListener('mouseenter', (e) => {
        if (e.buttons === 1) {
          cell.style.backgroundColor = selectedColor;
          playPop();
        }
      });
      pixelGrid.appendChild(cell);
    }
  }

  if (clearPixelBtn && pixelGrid) {
    clearPixelBtn.addEventListener('click', () => {
      const cells = pixelGrid.querySelectorAll('.pixel-cell');
      cells.forEach(c => c.style.backgroundColor = '#FFFFFF');
      playClick();
      showToast('Pixel canvas reset 🎨');
    });
  }

  if (savePixelBtn && pixelGrid) {
    savePixelBtn.addEventListener('click', () => {
      // Render to offscreen canvas and export PNG
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      const cells = pixelGrid.querySelectorAll('.pixel-cell');

      cells.forEach((cell, idx) => {
        const x = (idx % 12) * 10;
        const y = Math.floor(idx / 12) * 10;
        ctx.fillStyle = cell.style.backgroundColor || '#FFFFFF';
        ctx.fillRect(x, y, 10, 10);
      });

      const a = document.createElement('a');
      a.download = 'robin-pixel-art.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      playChime();
      showToast('Pixel art downloaded! 👾');
    });
  }

  // =========================================================================
  // 5. LIVE KERALA (IST) CLOCK WIDGET
  // =========================================================================
  const chicagoClockEl = document.getElementById('chicagoClock');
  function updateChicagoTime() {
    if (!chicagoClockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      chicagoClockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    } catch (e) {
      chicagoClockEl.textContent = new Date().toLocaleTimeString();
    }
  }
  updateChicagoTime();
  setInterval(updateChicagoTime, 1000);

  // =========================================================================
  // 6. CONTACT FORM & EMAIL COPY TOAST
  // =========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'abhijithblal4@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`📋 Copied ${email} to clipboard!`);
          playChime();
        });
      } else {
        showToast(`Email: ${email}`);
        playChime();
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit-contact');

      const name = document.getElementById('contactName')?.value.trim() || 'A Visitor';
      const email = document.getElementById('contactEmail')?.value.trim() || 'Not provided';
      const subject = document.getElementById('contactSubject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('contactMessage')?.value.trim() || '';

      const waText = `*New Portfolio Inquiry for Abhijith S Lal*\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n\n*Message:*\n${message}`;
      const waUrl = `https://wa.me/918078380042?text=${encodeURIComponent(waText)}`;

      if (submitBtn) {
        submitBtn.innerHTML = 'Connecting to WhatsApp... 💬';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        playChime();
        createConfettiAt(window.innerWidth / 2, window.innerHeight / 2);
        showToast('💬 Opening WhatsApp to message Abhijith directly!');
        window.open(waUrl, '_blank');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Send via WhatsApp 💬</span> <span>↗</span>';
          submitBtn.disabled = false;
        }
      }, 700);
    });
  }

  // =========================================================================
  // 7. TOAST & CONFETTI CELEBRATIONS
  // =========================================================================
  const toast = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function createConfettiAt(x, y) {
    const colors = ['#FFCE38', '#FED053', '#FF4F81', '#0D825C', '#2563EB', '#EB5A3C'];
    for (let i = 0; i < 28; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'fixed';
      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
      piece.style.width = `${Math.floor(Math.random() * 8) + 6}px`;
      piece.style.height = `${Math.floor(Math.random() * 8) + 6}px`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.zIndex = '9999';
      piece.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 180 + 80;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      document.body.appendChild(piece);

      let startTime = null;
      function animateConfetti(ts) {
        if (!startTime) startTime = ts;
        const elapsed = (ts - startTime) / 1000;
        if (elapsed > 0.8) {
          piece.remove();
          return;
        }
        const curX = x + vx * elapsed;
        const curY = y + vy * elapsed + 300 * elapsed * elapsed;
        piece.style.transform = `translate(${curX - x}px, ${curY - y}px) rotate(${elapsed * 720}deg)`;
        piece.style.opacity = `${1 - elapsed / 0.8}`;
        requestAnimationFrame(animateConfetti);
      }
      requestAnimationFrame(animateConfetti);
    }
  }

  // Playful Parallax tilt on hero elements with mousemove
  const heroWrapper = document.querySelector('.hero-wrapper');
  if (heroWrapper && window.innerWidth > 960) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const tiltX = (y / rect.height) * -6;
      const tiltY = (x / rect.width) * 6;

      const robinBox = document.querySelector('.robin-sketch-box');
      if (robinBox) {
        robinBox.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    });

    heroWrapper.addEventListener('mouseleave', () => {
      const robinBox = document.querySelector('.robin-sketch-box');
      if (robinBox) {
        robinBox.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
      }
    });
  }
});
