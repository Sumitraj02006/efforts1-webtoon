/* ==========================================================================
   EFFORTS 1 — CINEMATIC INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. INITIAL RENDERING OF HERO ELEMENTS
     ------------------------------------------------------------- */
  revealHeroElements();

  function revealHeroElements() {
    // Add active animation trigger classes to hero typography instantly or with very tiny, snappy offsets
    setTimeout(() => {
      document.querySelector('.hero-eyebrow')?.classList.add('scroll-revealed');
    }, 10);
    setTimeout(() => {
      document.querySelector('.hero-title')?.classList.add('scroll-revealed');
    }, 50);
    setTimeout(() => {
      document.getElementById('hero-title')?.classList.add('scroll-revealed');
    }, 100);
    setTimeout(() => {
      document.querySelector('.hero-description')?.classList.add('scroll-revealed');
    }, 150);
    setTimeout(() => {
      document.querySelector('.hero-actions')?.classList.add('scroll-revealed');
    }, 200);
  }


  /* -------------------------------------------------------------
     2. DYNAMIC CUSTOM CURSOR TRAIL ENGINE
     ------------------------------------------------------------- */
  const cursorPoint = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Inertial smooth cursor trail loop
  function tickCursor() {
    // Standard Follower
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    if (cursorPoint) {
      cursorPoint.style.left = `${cursorX}px`;
      cursorPoint.style.top = `${cursorY}px`;
    }

    // Lazy Outer Glow
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    if (cursorGlow) {
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  // Hover styling detectors
  const interactiveElements = document.querySelectorAll('a, button, .attrib-card, .why-card, .audio-panel, .timeline-card, .mobile-menu-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-link');
    });
  });

  // Click Animation behaviors
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-clicking');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-clicking');
  });


  /* -------------------------------------------------------------
     3. HIGH RESIDUAL INTERACTIVE HERO CANVAS (RAIN + DUST)
     ------------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle Classes setup
    class RainDrop {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 10;
        this.vy = Math.random() * 15 + 12; // High-velocity falling
        this.vx = Math.random() * -1.5 - 0.5; // Slight slant path
        this.length = Math.random() * 25 + 15;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx, this.y + this.length);
        ctx.stroke();
      }
    }

    class DustParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // Distribute initially
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 2.5 + 0.5;
        this.vy = Math.random() * -1.2 - 0.3; // Upward drift
        this.vx = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.45 + 0.15;
        this.waveSpeed = Math.random() * 0.02 + 0.005;
        this.waveAngle = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.vy;
        this.waveAngle += this.waveSpeed;
        this.x += Math.sin(this.waveAngle) * 0.2 + this.vx;
        
        // Mouse avoidance factor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x -= dx / dist * force * 2;
          this.y -= dy / dist * force * 2;
        }

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`; // Golden Floating dust
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Clear shadow
      }
    }

    const raindrops = Array.from({ length: 90 }, () => new RainDrop());
    const dustParticles = Array.from({ length: 45 }, () => new DustParticle());

    function animLoop() {
      ctx.fillStyle = 'rgba(4, 9, 18, 0.2)'; // Clear trace back to generate motion blur
      ctx.fillRect(0, 0, width, height);

      // Render loops
      raindrops.forEach(drop => {
        drop.update();
        drop.draw();
      });

      dustParticles.forEach(dust => {
        dust.update();
        dust.draw();
      });

      requestAnimationFrame(animLoop);
    }
    animLoop();
  }


  /* -------------------------------------------------------------
     4. MOUSE PARALLAX ON HERO TITLE & ELEMENTS
     ------------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const heroTitle = document.getElementById('hero-title');
  
  if (heroSection && heroTitle) {
    heroSection.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX; // Rate -1 to 1
      const moveY = (e.clientY - centerY) / centerY;

      // Subtle 3D tilt
      heroTitle.style.transform = `translateX(${moveX * 18}px) translateY(${moveY * 14}px) rotateY(${moveX * 8}deg) rotateX(${-moveY * 6}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroTitle.style.transform = 'none';
    });
  }


  /* -------------------------------------------------------------
     5. STICKY GLASS NAVBAR & MOBILE RESPONSIVENESS
     ------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile drawer opening interactions
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('active');
      });
    });
  }


  /* -------------------------------------------------------------
     6. INTERSECTION OBSERVER FOR PREMIUM SCROLL REVEALS
     ------------------------------------------------------------- */
  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-revealed');
        observer.unobserve(entry.target); // Once is enough
      }
    });
  }, revealOptions);

  // Bind various target elements
  const revealTargets = document.querySelectorAll(
    '.scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-fade, .scroll-reveal-card, .scroll-reveal-grid'
  );
  revealTargets.forEach(target => revealObserver.observe(target));

  // Auto active state navigation highlighter
  const menuObserverOptions = {
    threshold: 0.5,
    root: null
  };

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-item').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, menuObserverOptions);

  document.querySelectorAll('section').forEach(section => activeSectionObserver.observe(section));


  /* -------------------------------------------------------------
     7. STYLED 3D CARD HOVER PARALLAX (ROHIT & CREATOR ART)
     ------------------------------------------------------------- */
  const limit = 15; // Max tilting degree
  
  function applyCardTiltParallax(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate inside element
        const y = e.clientY - rect.top;  // y coordinate inside element
        
        const positionX = x / rect.width; // 0 to 1 ratio
        const positionY = y / rect.height;
        
        const tiltX = (limit / 2) - (positionY * limit);
        const tiltY = (positionX * limit) - (limit / 2);

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // Tilt cards
  applyCardTiltParallax('.attrib-card');
  applyCardTiltParallax('.creator-frame');


  /* -------------------------------------------------------------
     8. THE EPIC TIMELINE PROGRESS TRACKER
     ------------------------------------------------------------- */
  const timeline = document.getElementById('timeline');
  const activeLine = document.getElementById('timeline-active-line');
  const steps = document.querySelectorAll('.timeline-step');

  function calculateTimelineHeight() {
    if (!timeline || !activeLine) return;

    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top + window.scrollY;
    const timelineHeight = timelineRect.height;
    
    const viewportHeight = window.innerHeight;
    const scrollAmount = window.scrollY + (viewportHeight / 1.7); // Progress pivot point

    let progressFraction = (scrollAmount - timelineTop) / timelineHeight;
    progressFraction = Math.max(0, Math.min(1, progressFraction)); // Clamp between 0 and 1

    activeLine.style.height = `${progressFraction * 100}%`;

    // Glow single node cards as they transition
    steps.forEach((step, index) => {
      const stepRect = step.getBoundingClientRect();
      const stepTriggerVal = stepRect.top + window.scrollY;
      if (scrollAmount >= stepTriggerVal) {
        step.classList.add('passed-glow');
        step.querySelector('.timeline-card')?.classList.add('scroll-revealed');
      } else {
        step.classList.remove('passed-glow');
      }
    });
  }

  window.addEventListener('scroll', calculateTimelineHeight);
  window.addEventListener('resize', calculateTimelineHeight);
  calculateTimelineHeight(); // Run initially


  /* -------------------------------------------------------------
     9. SECTION 5: SEQUENTIAL WORD-BY-WORD REVEAL ENGINE
     ------------------------------------------------------------- */
  const quoteSection = document.getElementById('featured-quote');
  const splittedWords = document.querySelectorAll('.split-word');

  const quoteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Sequential animation trigger with staggering
        splittedWords.forEach((word, index) => {
          setTimeout(() => {
            word.classList.add('revealed');
          }, index * 200); // 200ms stagger between each word
        });
        quoteObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  if (quoteSection) quoteObserver.observe(quoteSection);


  /* -------------------------------------------------------------
     10. COMIC SHOWCASE PARALLAX GLARE & ROTATION
     ------------------------------------------------------------- */
  const comicContainer = document.getElementById('showcase-container');
  const comicCard = document.getElementById('comic-card-3D');
  const glare = document.getElementById('cover-glare');

  if (comicContainer && comicCard && glare) {
    comicContainer.addEventListener('mousemove', (e) => {
      const rect = comicContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;

      // Tilt rotation angles
      const rotateY = ((x - halfWidth) / halfWidth) * -18;
      const rotateX = ((y - halfHeight) / halfHeight) * 12;

      comicCard.style.transform = `rotateY(${rotateY - 22}deg) rotateX(${rotateX + 10}deg) translateY(-8px)`;

      // Dynamic glare tracking
      const glarePositionX = (x / rect.width) * 100;
      const glarePositionY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glarePositionX}% ${glarePositionY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 75%)`;
    });

    comicContainer.addEventListener('mouseleave', () => {
      comicCard.style.transform = 'rotateY(-22deg) rotateX(10deg)';
      glare.style.background = 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)';
    });
  }


  /* -------------------------------------------------------------
     11. AUDIO MODULE: PREMIUM SYNTHESIZER WITH WEB AUDIO API
     ------------------------------------------------------------- */
  const audioCtrl = document.getElementById('ambient-audio-ctrl');
  const eqBars = document.getElementById('eq-bars');
  
  let audioCtx = null;
  let masterGain = null;
  let synthInterval = null;
  let isPlaying = false;
  let oscillators = [];

  function initSynthEngine() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Master volume envelope control
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    // Lowpass dynamic resonance filter
    const biQuadFilter = audioCtx.createBiquadFilter();
    biQuadFilter.type = 'lowpass';
    biQuadFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
    biQuadFilter.Q.setValueAtTime(5, audioCtx.currentTime);
    
    // Safe compressor to avoid volume clipping
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

    // Patch nodes together
    masterGain.connect(biQuadFilter);
    biQuadFilter.connect(compressor);
    compressor.connect(audioCtx.destination);

    // Synthesis of standard minor pad chords (D minor atmospheric theme)
    // Notes: D2 (73.4Hz), A2 (110Hz), D3 (146.8Hz), F3 (174.6Hz), A3 (220Hz), C4 (261.6Hz), E4 (329.6Hz)
    const chordFrequencies = [73.4, 110.0, 146.8, 174.6, 220.0, 261.6, 329.6];

    chordFrequencies.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      
      // Use different oscillator profiles for dimensional thickness
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, audioCtx.currentTime); // Fine detuned frequencies
      
      // Fine volumes
      const gainVal = (1 / chordFrequencies.length) * 0.28;
      oscGain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    // LFO (Low Frequency Oscillator) to modulate Filter frequency for sweeping ambient pads
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // Very slow swirling sweep
    lfoGain.gain.setValueAtTime(250, audioCtx.currentTime); // Swirl amount
    
    lfo.connect(lfoGain);
    lfoGain.connect(biQuadFilter.frequency);
    lfo.start();
    oscillators.push(lfo);
  }

  function toggleAudio() {
    if (!audioCtx) {
      initSynthEngine();
    }

    if (!isPlaying) {
      // Start/Resume Synth audio context
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // Fade Master volume in beautifully over 2.5 seconds to prevent pops
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.65, audioCtx.currentTime + 2.5);
      
      audioCtrl.classList.add('playing');
      isPlaying = true;
    } else {
      // Fade out Master volume over 1.2 seconds, keeping synth running silently
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
      
      audioCtrl.classList.remove('playing');
      isPlaying = false;
    }
  }

  if (audioCtrl) {
    audioCtrl.addEventListener('click', toggleAudio);
  }

  // Click start journey automatically plays standard minor pad synthesis context if not running
  const startJourneyBtn = document.getElementById('hero-secondary-btn');
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      if (!isPlaying) {
        toggleAudio();
      }
    });
  }


  /* -------------------------------------------------------------
     12. PREMIUM PROGRESS BACK TO TOP ENGAGEMENT
     ------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  const ringCircle = document.querySelector('.progress-ring-circle');

  if (backToTopBtn && ringCircle) {
    // Math logic calculation
    const radius = ringCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; // 125.6
    
    ringCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    ringCircle.style.strokeDashoffset = circumference;

    function updateScrollProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Progress from 0 to 1
      const progressFraction = scrollHeight > 0 ? scrollPosition / scrollHeight : 0;
      const offset = circumference - (progressFraction * circumference);
      
      ringCircle.style.strokeDashoffset = offset;

      // Reveal selector buttons
      if (scrollPosition > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial execution

    // Click back to top with inertial scroll
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

// Register Service Worker for offline capability & fast loading
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('STORYVERSE Service Worker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('STORYVERSE Service Worker registration failed:', error);
      });
  });
}

