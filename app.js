// ==========================================================
// HARUN CONSULTING / THERAPIST HARUN - INTERACTIVE SCRIPTS
// Bilingual System (Bangla & English) with Geo-Detection
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  const config = window.SITE_CONFIG || {
    name: "Therapist Harun",
    whatsappNumber: "+8801700000000",
    displayPhone: "+880 1700-000000",
    email: "contact.harunconsulting@gmail.com",
    totalPeopleHelped: "4+",
  };

  const translations = window.TRANSLATIONS || {};
  let currentLang = "en"; // Default fallback before detection
  let isSoundPlaying = false;

  // 1. Language Detection & Storage
  function detectInitialLanguage() {
    // Saved preference takes highest priority
    const saved = localStorage.getItem("harun_lang");
    if (saved && (saved === "bn" || saved === "en")) {
      return saved;
    }

    // Zero-latency local check: Timezone (Asia/Dhaka) & Browser Languages
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Dhaka")) {
        return "bn";
      }
    } catch (e) {
      console.warn("Timezone check failed", e);
    }

    // Check navigator languages
    const navLangs = navigator.languages || [navigator.language || ""];
    for (const lang of navLangs) {
      if (lang && lang.toLowerCase().startsWith("bn")) {
        return "bn";
      }
    }

    // Default to 'bn' if local timezone suggests Bangladesh, otherwise 'en'
    return "en";
  }

  // Asynchronous Geo-IP check for accurate country detection
  async function checkGeoCountry() {
    if (localStorage.getItem("harun_lang")) return; // Don't override user's manual choice

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      
      const res = await fetch("https://api.country.is", { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.country === "BD") {
          if (currentLang !== "bn") {
            setLanguage("bn", false);
          }
        } else if (data && data.country) {
          if (currentLang !== "en") {
            setLanguage("en", false);
          }
        }
      }
    } catch (err) {
      // Fallback already handled by timezone / navigator
    }
  }

  // 2. Language Switcher Engine
  function setLanguage(lang, userInitiated = true) {
    if (!translations[lang]) return;
    currentLang = lang;
    if (userInitiated) {
      localStorage.setItem("harun_lang", lang);
    }

    const t = translations[lang];

    // Translate textContent
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Translate innerHTML (for markup like <span> or <strong>)
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // Translate Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Update Language Toggle Button Label
    const langLabel = document.getElementById("langLabel");
    if (langLabel) {
      langLabel.textContent = t.langToggle;
    }

    // Update Sound Button Label
    const soundLabel = document.getElementById("soundLabel");
    if (soundLabel) {
      soundLabel.textContent = isSoundPlaying ? t.rainOn : t.rainOff;
    }

    // Update Quick Chip text and current selection preview
    updateQuickChips(lang);

    // Refresh dynamic links
    updateContactLinks();
  }

  // 3. Populate Dynamic Config Elements
  document.querySelectorAll("[data-config-name]").forEach(el => el.textContent = config.name);
  document.querySelectorAll("[data-config-phone]").forEach(el => el.textContent = config.displayPhone);
  document.querySelectorAll("[data-config-email]").forEach(el => el.textContent = config.email);
  document.querySelectorAll("[data-config-helped]").forEach(el => {
    el.textContent = (currentLang === "bn") ? "৪+" : config.totalPeopleHelped;
  });

  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
  
  function getWhatsAppUrl(text) {
    const defaultMsg = (currentLang === "bn") 
      ? "সালাম/নমস্কার হারুন ভাই, আমি আপনার ওয়েবসাইট দেখে মেসেজ দিচ্ছি। আমার কিছু কথা শেয়ার করার জন্য একজন বিশ্বস্ত মানুষ প্রয়োজন।" 
      : "Salam/Hello Harun, I came across your website. I need someone safe to talk to privately.";
    const encoded = encodeURIComponent(text || defaultMsg);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }

  function updateContactLinks() {
    document.querySelectorAll(".wa-direct-link").forEach(el => {
      // Don't override quick-whatsapp button if it has a custom prefill
      if (el.id !== "quickWhatsAppBtn") {
        el.href = getWhatsAppUrl();
      }
    });

    document.querySelectorAll(".email-direct-link").forEach(el => {
      const subject = (currentLang === "bn") 
        ? "ব্যক্তিগত ও গোপনীয় পরামর্শের অনুরোধ - হারুন কনসাল্টিং"
        : "Private & Confidential Talk Request - Harun Consulting";
      el.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}`;
    });

    document.querySelectorAll(".phone-direct-link").forEach(el => {
      el.href = `tel:${config.whatsappNumber}`;
    });
  }

  // 4. Quick WhatsApp Chips Manager
  let selectedChipKey = "chip1";
  const quickWhatsAppBtn = document.getElementById("quickWhatsAppBtn");
  const quickMsgPreview = document.getElementById("quickMsgPreview");

  function updateQuickChips(lang) {
    const t = translations[lang] || translations.en;
    
    // Update chip buttons
    document.querySelectorAll(".quick-chip").forEach(chip => {
      const key = chip.getAttribute("data-chip-key");
      if (key && t[key]) {
        chip.textContent = t[key];
      }
    });

    // Update preview with currently selected chip message
    const msgKey = selectedChipKey + "Msg";
    const currentMsg = t[msgKey] || "";
    if (quickMsgPreview) {
      quickMsgPreview.textContent = `"${currentMsg}"`;
    }
    if (quickWhatsAppBtn) {
      quickWhatsAppBtn.href = getWhatsAppUrl(currentMsg);
    }
  }

  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedChipKey = chip.getAttribute("data-chip-key") || "chip1";
      updateQuickChips(currentLang);
    });
  });

  // Language Switch Button
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const nextLang = (currentLang === "bn") ? "en" : "bn";
      setLanguage(nextLang, true);
    });
  }

  // 5. Mobile Nav Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => navLinks.classList.remove("show"));
    });
  }

  // 6. Interactive Safe Vent Box
  const ventInput = document.getElementById("ventInput");
  const releaseBtn = document.getElementById("releaseBtn");
  const sendVentBtn = document.getElementById("sendVentBtn");
  const ventFeedback = document.getElementById("ventFeedback");

  if (releaseBtn && ventInput) {
    releaseBtn.addEventListener("click", () => {
      const text = ventInput.value.trim();
      const t = translations[currentLang] || translations.en;
      if (!text) {
        alert(t.ventAlertNeedText);
        return;
      }

      ventInput.classList.add("dissolving");
      releaseBtn.disabled = true;

      setTimeout(() => {
        ventInput.value = "";
        ventInput.classList.remove("dissolving");
        releaseBtn.disabled = false;
        
        if (ventFeedback) {
          ventFeedback.style.display = "block";
          ventFeedback.innerHTML = t.ventReliefFeedback;
        }
      }, 1400);
    });
  }

  if (sendVentBtn && ventInput) {
    sendVentBtn.addEventListener("click", () => {
      const text = ventInput.value.trim();
      const t = translations[currentLang] || translations.en;
      if (!text) {
        alert(t.ventAlertNeedSend);
        return;
      }

      const formatted = (currentLang === "bn")
        ? `সালাম হারুন ভাই,\nআমি আপনার ওয়েবসাইটের গোপন ভেন্ট বক্সে এটি লিখেছি এবং আপনার সাথে কথা বলতে চাই:\n\n"${text}"\n\n(দয়া করে এটি ১০০% গোপন রাখবেন)`
        : `Salam/Hello Harun,\nI wrote this in your private vent box on the website and would like to talk with you:\n\n"${text}"\n\n(Please keep this strictly confidential)`;
        
      window.open(getWhatsAppUrl(formatted), "_blank");
    });
  }

  // 7. Contact / Booking Form
  const consultationForm = document.getElementById("consultationForm");
  const formSuccessAlert = document.getElementById("formSuccessAlert");

  if (consultationForm) {
    consultationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const isBn = (currentLang === "bn");
      const name = document.getElementById("userName").value.trim() || (isBn ? "একজন শুভাকাঙ্ক্ষী" : "Anonymous Friend");
      const method = document.getElementById("contactMethod").value;
      const contactInfo = document.getElementById("userContact").value.trim() || (isBn ? "হোয়াটসঅ্যাপে যোগাযোগ করবেন" : "Will reply on WhatsApp");
      const story = document.getElementById("userStory").value.trim();

      const messageContent = isBn ?
`সালাম হারুন ভাই,
আমি আপনার সাথে একান্ত ও গোপনীয়ভাবে কথা বলতে চাই:

• নাম/ছদ্মনাম: ${name}
• যোগাযোগের পছন্দের মাধ্যম: ${method}
• যোগাযোগের ঠিকানা: ${contactInfo}
• আমার সমস্যা/যা শেয়ার করতে চাই:
${story}

(আমি জানি এটি ১০০% গোপন থাকবে এবং কোনো তিরস্কার করা হবে না।)` :
`Salam/Hello Harun,
I'd like to reach out for a confidential talk:

• Name/Alias: ${name}
• Preferred Contact Method: ${method}
• My Details: ${contactInfo}
• What's on my mind:
${story}

(I understand this is 100% confidential and non-judgmental.)`;

      if (method === "Email") {
        const mailto = `mailto:${config.email}?subject=${encodeURIComponent(isBn ? "গোপনীয় বার্তা - " + name : "Confidential Request - " + name)}&body=${encodeURIComponent(messageContent)}`;
        window.location.href = mailto;
      } else {
        window.open(getWhatsAppUrl(messageContent), "_blank");
      }

      if (formSuccessAlert) {
        formSuccessAlert.style.display = "block";
      }
      consultationForm.reset();
    });
  }

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach(i => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    }
  });

  // 9. Calming Ambient Sound (Rain / Pink Noise Generator)
  const soundBtn = document.getElementById("soundToggle");
  let audioCtx = null;
  let noiseNode = null;
  let gainNode = null;

  function createSoothingRainSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start();

    return whiteNoise;
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const t = translations[currentLang] || translations.en;
      const soundLabel = document.getElementById("soundLabel");

      if (!isSoundPlaying) {
        try {
          noiseNode = createSoothingRainSound();
          isSoundPlaying = true;
          soundBtn.classList.add("active");
          if (soundLabel) soundLabel.textContent = t.rainOn;
        } catch (e) {
          console.error("Audio error:", e);
        }
      } else {
        if (gainNode && audioCtx) {
          gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
          setTimeout(() => {
            if (noiseNode) noiseNode.stop();
            if (audioCtx) audioCtx.close();
            isSoundPlaying = false;
            soundBtn.classList.remove("active");
            if (soundLabel) soundLabel.textContent = t.rainOff;
          }, 800);
        }
      }
    });
  }

  // Initial detection & setup
  const initLang = detectInitialLanguage();
  setLanguage(initLang, false);
  checkGeoCountry(); // Check IP in background if first visit
});
