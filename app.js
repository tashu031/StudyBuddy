/**
 * StudyBuddy App - Complete Logic
 * Pomodoro Timer, Flashcards, Quiz Generator, Ambient Sounds, and LocalStorage
 */

// ==========================================================================
// Default Data Sets
// ==========================================================================
const DEFAULT_DECKS = [
  {
    id: "deck-cs",
    name: "Web Dev & CS Concepts",
    desc: "Core fundamentals of modern web development and computing",
    cards: [
      {
        id: "c1",
        front: "What is a Closure in JavaScript?",
        back: "A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has returned.",
        mastered: false
      },
      {
        id: "c2",
        front: "What is the Event Loop?",
        back: "A mechanism that constantly checks if the call stack is empty, and if so, moves queued tasks from the microtask/macrotask queues onto the stack for execution.",
        mastered: true
      },
      {
        id: "c3",
        front: "What is the difference between CSS Flexbox and Grid?",
        back: "Flexbox is designed for one-dimensional layouts (row OR column), whereas CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously).",
        mastered: false
      },
      {
        id: "c4",
        front: "What does REST stand for and what are its key principles?",
        back: "Representational State Transfer. It is a stateless, client-server architectural style relying on standard HTTP methods (GET, POST, PUT, DELETE) and resource URIs.",
        mastered: false
      },
      {
        id: "c5",
        front: "What is Big O notation?",
        back: "A mathematical notation that describes the limiting behavior of a function, used in computer science to classify algorithms according to their time or space complexity as input size grows.",
        mastered: false
      },
      {
        id: "c6",
        front: "What is the DOM (Document Object Model)?",
        back: "A programming interface for web documents. It represents the page as nodes and objects so that programming languages (like JS) can interact with and modify the document structure and style.",
        mastered: false
      }
    ]
  },
  {
    id: "deck-science",
    name: "General Science & Biology",
    desc: "Key principles from biology, chemistry, and physics",
    cards: [
      {
        id: "s1",
        front: "What is Photosynthesis?",
        back: "The biological process by which green plants and organisms synthesize nutrients from carbon dioxide and water using sunlight and chlorophyll, releasing oxygen as a byproduct.",
        mastered: false
      },
      {
        id: "s2",
        front: "What is the role of Mitochondria in animal cells?",
        back: "Known as the powerhouse of the cell, mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions through ATP production.",
        mastered: true
      },
      {
        id: "s3",
        front: "State Newton's First Law of Motion.",
        back: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced external force (Inertia).",
        mastered: false
      },
      {
        id: "s4",
        front: "What are the four nucleotide bases found in DNA?",
        back: "Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). A pairs with T, and C pairs with G.",
        mastered: false
      },
      {
        id: "s5",
        front: "What is the Doppler Effect?",
        back: "The change in frequency or wavelength of a wave in relation to an observer who is moving relative to the wave source (e.g., siren pitch rising then falling as an ambulance passes).",
        mastered: false
      }
    ]
  },
  {
    id: "deck-study",
    name: "Study & Memory Techniques",
    desc: "Evidence-based methods to maximize learning efficiency",
    cards: [
      {
        id: "t1",
        front: "What is Active Recall?",
        back: "A learning principle where you actively stimulate memory retrieval during the learning process (e.g., flashcards or self-quizzing) rather than passively re-reading or highlighting.",
        mastered: true
      },
      {
        id: "t2",
        front: "What is Spaced Repetition?",
        back: "An evidence-based learning technique that incorporates increasing intervals of time between subsequent review of previously learned material to exploit the psychological spacing effect.",
        mastered: false
      },
      {
        id: "t3",
        front: "What is the Feynman Technique?",
        back: "A 4-step learning framework: 1. Choose a concept; 2. Teach it to a 10-year-old in simple words; 3. Identify gaps in your understanding; 4. Review and simplify further.",
        mastered: false
      },
      {
        id: "t4",
        front: "What is the Pomodoro Technique?",
        back: "A time management method that uses a timer to break work into intervals, typically 25 minutes in length, separated by 5-minute short breaks to maintain peak mental focus.",
        mastered: true
      }
    ]
  }
];

// ==========================================================================
// Application State
// ==========================================================================
class StudyBuddyApp {
  constructor() {
    this.decks = this.loadDecks();
    this.stats = this.loadStats();
    this.currentDeckId = this.decks[0]?.id || "";
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
    this.soundEnabled = localStorage.getItem("sb_sound") !== "false";

    // Pomodoro State
    this.timerMode = "work"; // 'work' | 'shortBreak' | 'longBreak'
    this.timerDurations = {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    };
    this.timeLeft = this.timerDurations.work;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.pomodoroCycles = 1;
    this.currentGoal = localStorage.getItem("sb_goal") || "Complete study session";
    this.goalDone = localStorage.getItem("sb_goal_done") === "true";

    // Ambient Sound
    this.audioCtx = null;
    this.ambientSource = null;
    this.currentAmbient = "none";

    // Quiz State
    this.quizQuestions = [];
    this.currentQuestionIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];

    // Initialize Web Audio
    this.initAudioContext();

    // DOM Binding & Setup
    this.cacheElements();
    this.bindEvents();
    this.initTheme();
    this.renderStats();
    this.renderDeckSelects();
    this.renderFlashcard();
    this.updateTimerDisplay();
  }

  // ------------------------------------------------------------------------
  // Storage Handlers
  // ------------------------------------------------------------------------
  loadDecks() {
    try {
      const saved = localStorage.getItem("sb_decks");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error reading decks from localStorage", e);
    }
    this.saveDecks(DEFAULT_DECKS);
    return DEFAULT_DECKS;
  }

  saveDecks(decksToSave = this.decks) {
    try {
      localStorage.setItem("sb_decks", JSON.stringify(decksToSave));
    } catch (e) {
      console.error("Failed to save decks", e);
    }
  }

  loadStats() {
    const defaults = {
      focusMinutes: 0,
      sessionsCompleted: 0,
      totalMastered: 0,
      bestQuizScore: null
    };
    try {
      const saved = localStorage.getItem("sb_stats");
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Error reading stats", e);
    }
    return defaults;
  }

  saveStats() {
    try {
      this.recalcMasteredStats();
      localStorage.setItem("sb_stats", JSON.stringify(this.stats));
      this.renderStats();
    } catch (e) {
      console.error("Failed to save stats", e);
    }
  }

  recalcMasteredStats() {
    let count = 0;
    this.decks.forEach(d => {
      d.cards.forEach(c => {
        if (c.mastered) count++;
      });
    });
    this.stats.totalMastered = count;
  }

  // ------------------------------------------------------------------------
  // Cache DOM Elements
  // ------------------------------------------------------------------------
  cacheElements() {
    // Navigation
    this.navTabs = document.querySelectorAll(".nav-tab");
    this.views = {
      pomodoro: document.getElementById("view-pomodoro"),
      flashcards: document.getElementById("view-flashcards"),
      quiz: document.getElementById("view-quiz")
    };
    this.themeToggle = document.getElementById("themeToggle");
    this.soundToggle = document.getElementById("soundToggle");
    this.soundIcon = document.getElementById("soundIcon");

    // Stats
    this.statFocusTime = document.getElementById("statFocusTime");
    this.statSessions = document.getElementById("statSessions");
    this.statMastered = document.getElementById("statMastered");
    this.statQuizScore = document.getElementById("statQuizScore");

    // Pomodoro Elements
    this.modePills = document.querySelectorAll(".mode-pill");
    this.timerDigits = document.getElementById("timerDigits");
    this.timerModeBadge = document.getElementById("timerModeBadge");
    this.timerCycleInfo = document.getElementById("timerCycleInfo");
    this.timerProgressRing = document.getElementById("timerProgressRing");
    this.btnTimerStart = document.getElementById("btnTimerStart");
    this.startBtnText = document.getElementById("startBtnText");
    this.startBtnIcon = document.getElementById("startBtnIcon");
    this.btnTimerReset = document.getElementById("btnTimerReset");
    this.btnTimerAdjustMinus = document.getElementById("btnTimerAdjustMinus");
    this.btnTimerAdjustPlus = document.getElementById("btnTimerAdjustPlus");

    // Task Elements
    this.taskForm = document.getElementById("taskForm");
    this.taskInput = document.getElementById("taskInput");
    this.activeGoalText = document.getElementById("activeGoalText");
    this.goalCompleteCheckbox = document.getElementById("goalCompleteCheckbox");
    this.btnDeleteGoal = document.getElementById("btnDeleteGoal");

    // Ambient Buttons
    this.ambientBtns = document.querySelectorAll(".ambient-btn");

    // Flashcard Elements
    this.deckSelect = document.getElementById("deckSelect");
    this.btnNewCardModal = document.getElementById("btnNewCardModal");
    this.btnNewDeckModal = document.getElementById("btnNewDeckModal");
    this.btnShuffleDeck = document.getElementById("btnShuffleDeck");
    this.btnResetMastery = document.getElementById("btnResetMastery");
    this.deckCardCountText = document.getElementById("deckCardCountText");
    this.deckMasteryPercent = document.getElementById("deckMasteryPercent");
    this.deckProgressBar = document.getElementById("deckProgressBar");

    this.flashcardScene = document.getElementById("flashcardScene");
    this.flashcardElement = document.getElementById("flashcardElement");
    this.cardCategoryBadge = document.getElementById("cardCategoryBadge");
    this.cardStatusPill = document.getElementById("cardStatusPill");
    this.cardStatusPillBack = document.getElementById("cardStatusPillBack");
    this.cardFrontText = document.getElementById("cardFrontText");
    this.cardBackText = document.getElementById("cardBackText");

    this.btnPrevCard = document.getElementById("btnPrevCard");
    this.btnNextCard = document.getElementById("btnNextCard");
    this.btnMarkNeedsReview = document.getElementById("btnMarkNeedsReview");
    this.btnMarkKnown = document.getElementById("btnMarkKnown");
    this.btnEditCurrentCard = document.getElementById("btnEditCurrentCard");
    this.btnDeleteCurrentCard = document.getElementById("btnDeleteCurrentCard");
    this.btnStartQuizFromDeck = document.getElementById("btnStartQuizFromDeck");

    // Quiz Elements
    this.quizDeckSelect = document.getElementById("quizDeckSelect");
    this.quizQuestionCount = document.getElementById("quizQuestionCount");
    this.btnStartQuiz = document.getElementById("btnStartQuiz");

    this.quizSetupView = document.getElementById("quizSetupView");
    this.quizActiveView = document.getElementById("quizActiveView");
    this.quizResultView = document.getElementById("quizResultView");

    this.quizQuestionNumber = document.getElementById("quizQuestionNumber");
    this.quizLiveScore = document.getElementById("quizLiveScore");
    this.quizProgressBar = document.getElementById("quizProgressBar");
    this.quizCategoryTag = document.getElementById("quizCategoryTag");
    this.quizQuestionPrompt = document.getElementById("quizQuestionPrompt");
    this.quizOptionsList = document.getElementById("quizOptionsList");

    this.quizFeedbackBox = document.getElementById("quizFeedbackBox");
    this.feedbackIndicator = document.getElementById("feedbackIndicator");
    this.feedbackExplanation = document.getElementById("feedbackExplanation");
    this.btnNextQuestion = document.getElementById("btnNextQuestion");

    this.resultGradeIcon = document.getElementById("resultGradeIcon");
    this.resultTitle = document.getElementById("resultTitle");
    this.resultScoreLarge = document.getElementById("resultScoreLarge");
    this.resultSummaryText = document.getElementById("resultSummaryText");
    this.quizResultsBreakdown = document.getElementById("quizResultsBreakdown");
    this.btnRetakeQuiz = document.getElementById("btnRetakeQuiz");
    this.btnBackToCards = document.getElementById("btnBackToCards");

    // Modals
    this.cardModal = document.getElementById("cardModal");
    this.cardModalTitle = document.getElementById("cardModalTitle");
    this.cardForm = document.getElementById("cardForm");
    this.editCardId = document.getElementById("editCardId");
    this.cardFormDeck = document.getElementById("cardFormDeck");
    this.cardFormQuestion = document.getElementById("cardFormQuestion");
    this.cardFormAnswer = document.getElementById("cardFormAnswer");
    this.btnCloseCardModal = document.getElementById("btnCloseCardModal");
    this.btnCancelCardModal = document.getElementById("btnCancelCardModal");

    this.deckModal = document.getElementById("deckModal");
    this.deckForm = document.getElementById("deckForm");
    this.deckFormName = document.getElementById("deckFormName");
    this.deckFormDesc = document.getElementById("deckFormDesc");
    this.btnCloseDeckModal = document.getElementById("btnCloseDeckModal");
    this.btnCancelDeckModal = document.getElementById("btnCancelDeckModal");

    // Toast
    this.toastEl = document.getElementById("toast");
  }

  // ------------------------------------------------------------------------
  // Audio System (Synthesized Web Audio API - 100% offline & reliable)
  // ------------------------------------------------------------------------
  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.audioCtx = new AudioCtx();
    }
  }

  ensureAudioRunning() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playChime(type = "complete") {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioRunning();

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === "complete") {
        // Melodic 2-tone pleasant chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (type === "correct") {
        // High cheery ding
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.1); // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "wrong") {
        // Low warm boop
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  setAmbientSound(soundType) {
    this.ensureAudioRunning();
    if (!this.audioCtx) return;

    // Stop current
    if (this.ambientSource) {
      try {
        if (this.ambientSource.stop) this.ambientSource.stop();
        if (this.ambientSource.osc1) this.ambientSource.osc1.stop();
        if (this.ambientSource.osc2) this.ambientSource.osc2.stop();
      } catch (e) {}
      this.ambientSource = null;
    }

    this.currentAmbient = soundType;

    // Highlight button
    this.ambientBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.sound === soundType);
    });

    if (soundType === "none") return;

    try {
      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (soundType === "rain") {
        // Pink-ish filtered noise with fluctuations
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.15;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1000;

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.2;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      } else if (soundType === "whitenoise") {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.07;
        }
        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.15;

        whiteNoise.connect(gain);
        gain.connect(this.audioCtx.destination);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      } else if (soundType === "binaural") {
        // Dual soothing sine waves (alpha focus frequency ~10Hz beat)
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.value = 216; // A3 base
        osc2.frequency.value = 226; // +10Hz Alpha beat

        gain.gain.value = 0.08;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start();
        osc2.start();

        this.ambientSource = { osc1, osc2 };
      }
    } catch (e) {
      console.warn("Ambient sound error:", e);
    }
  }

  // ------------------------------------------------------------------------
  // Event Bindings
  // ------------------------------------------------------------------------
  bindEvents() {
    // Nav Tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
    });

    // Theme Toggle
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Sound Toggle
    this.soundToggle.addEventListener("click", () => this.toggleSound());

    // Pomodoro Mode Selectors
    this.modePills.forEach(pill => {
      pill.addEventListener("click", () => this.setTimerMode(pill.dataset.mode));
    });

    // Timer Controls
    this.btnTimerStart.addEventListener("click", () => this.toggleTimer());
    this.btnTimerReset.addEventListener("click", () => this.resetTimer());
    this.btnTimerAdjustMinus.addEventListener("click", () => this.adjustTimer(-60));
    this.btnTimerAdjustPlus.addEventListener("click", () => this.adjustTimer(60));

    // Ambient buttons
    this.ambientBtns.forEach(btn => {
      btn.addEventListener("click", () => this.setAmbientSound(btn.dataset.sound));
    });

    // Task & Goal Events
    this.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = this.taskInput.value.trim();
      if (val) {
        this.setGoal(val);
        this.taskInput.value = "";
      }
    });

    this.goalCompleteCheckbox.addEventListener("change", () => {
      this.goalDone = this.goalCompleteCheckbox.checked;
      localStorage.setItem("sb_goal_done", this.goalDone.toString());
      if (this.goalDone) {
        this.showToast("Goal accomplished! Great work! 🎉");
        this.playChime("complete");
      }
    });

    this.btnDeleteGoal.addEventListener("click", () => {
      this.setGoal("Take a quick break or choose next topic");
      this.goalCompleteCheckbox.checked = false;
      this.goalDone = false;
      localStorage.setItem("sb_goal_done", "false");
    });

    // Flashcard Scene Flip
    this.flashcardScene.addEventListener("click", () => this.flipFlashcard());
    this.flashcardScene.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        this.flipFlashcard();
      }
    });

    // Flashcard Navigation
    this.btnPrevCard.addEventListener("click", () => this.prevCard());
    this.btnNextCard.addEventListener("click", () => this.nextCard());
    this.btnMarkNeedsReview.addEventListener("click", () => this.setCardMastery(false));
    this.btnMarkKnown.addEventListener("click", () => this.setCardMastery(true));

    // Flashcard Tools
    this.deckSelect.addEventListener("change", (e) => {
      this.currentDeckId = e.target.value;
      this.currentCardIndex = 0;
      this.isCardFlipped = false;
      this.flashcardElement.classList.remove("flipped");
      this.renderFlashcard();
    });

    this.btnShuffleDeck.addEventListener("click", () => this.shuffleCurrentDeck());
    this.btnResetMastery.addEventListener("click", () => this.resetDeckMastery());

    // Flashcard CRUD
    this.btnNewCardModal.addEventListener("click", () => this.openCardModal());
    this.btnEditCurrentCard.addEventListener("click", () => this.openCardModal(true));
    this.btnDeleteCurrentCard.addEventListener("click", () => this.deleteCurrentCard());
    this.btnStartQuizFromDeck.addEventListener("click", () => {
      this.quizDeckSelect.value = this.currentDeckId;
      this.switchTab("quiz");
    });

    // Card Modal
    this.btnCloseCardModal.addEventListener("click", () => this.closeCardModal());
    this.btnCancelCardModal.addEventListener("click", () => this.closeCardModal());
    this.cardForm.addEventListener("submit", (e) => this.handleSaveCard(e));

    // Deck Modal
    this.btnNewDeckModal.addEventListener("click", () => this.openDeckModal());
    this.btnCloseDeckModal.addEventListener("click", () => this.closeDeckModal());
    this.btnCancelDeckModal.addEventListener("click", () => this.closeDeckModal());
    this.deckForm.addEventListener("submit", (e) => this.handleCreateDeck(e));

    // Quiz Controls
    this.btnStartQuiz.addEventListener("click", () => this.startQuiz());
    this.btnNextQuestion.addEventListener("click", () => this.nextQuizQuestion());
    this.btnRetakeQuiz.addEventListener("click", () => this.startQuiz());
    this.btnBackToCards.addEventListener("click", () => this.switchTab("flashcards"));

    // Global Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      // Don't trigger if inside inputs/textareas
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      if (this.views.flashcards.classList.contains("active")) {
        if (e.code === "ArrowLeft") this.prevCard();
        if (e.code === "ArrowRight") this.nextCard();
        if (e.code === "KeyF") this.flipFlashcard();
        if (e.code === "Digit1") this.setCardMastery(false);
        if (e.code === "Digit2") this.setCardMastery(true);
      } else if (this.views.pomodoro.classList.contains("active")) {
        if (e.code === "Space") {
          e.preventDefault();
          this.toggleTimer();
        }
      }
    });

    // Sync saved goal state
    this.activeGoalText.textContent = this.currentGoal;
    this.goalCompleteCheckbox.checked = this.goalDone;
  }

  // ------------------------------------------------------------------------
  // Theme & Sound Setup
  // ------------------------------------------------------------------------
  initTheme() {
    const savedTheme = localStorage.getItem("sb_theme") || "theme-light";
    document.body.className = savedTheme;
    this.updateSoundIcon();
  }

  toggleTheme() {
    const isLight = document.body.classList.contains("theme-light");
    const nextTheme = isLight ? "theme-dark" : "theme-light";
    document.body.className = nextTheme;
    localStorage.setItem("sb_theme", nextTheme);
    this.showToast(`Switched to ${isLight ? "Dark" : "Light"} mode`);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem("sb_sound", this.soundEnabled.toString());
    this.updateSoundIcon();
    this.showToast(this.soundEnabled ? "Audio chimes enabled 🔔" : "Audio chimes muted 🔕");
    if (this.soundEnabled) this.playChime("correct");
  }

  updateSoundIcon() {
    this.soundIcon.textContent = this.soundEnabled ? "🔔" : "🔕";
  }

  // ------------------------------------------------------------------------
  // View Navigation
  // ------------------------------------------------------------------------
  switchTab(tabName) {
    this.navTabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
    Object.keys(this.views).forEach(key => {
      this.views[key].classList.toggle("active", key === tabName);
    });

    if (tabName === "flashcards") {
      this.renderFlashcard();
    }
  }

  // ------------------------------------------------------------------------
  // Stats Display
  // ------------------------------------------------------------------------
  renderStats() {
    this.recalcMasteredStats();
    this.statFocusTime.textContent = `${this.stats.focusMinutes}m`;
    this.statSessions.textContent = this.stats.sessionsCompleted;
    this.statMastered.textContent = this.stats.totalMastered;
    this.statQuizScore.textContent = this.stats.bestQuizScore !== null ? `${this.stats.bestQuizScore}%` : "-";
  }

  // ------------------------------------------------------------------------
  // Pomodoro Timer Logic
  // ------------------------------------------------------------------------
  setTimerMode(mode) {
    if (this.isTimerRunning) this.pauseTimer();
    this.timerMode = mode;
    this.timeLeft = this.timerDurations[mode];

    this.modePills.forEach(p => p.classList.toggle("active", p.dataset.mode === mode));

    const labels = {
      work: "Focus Session",
      shortBreak: "Short Break",
      longBreak: "Long Break"
    };
    this.timerModeBadge.textContent = labels[mode] || "Timer";

    // Change badge & ring color based on mode
    if (mode === "work") {
      this.timerProgressRing.style.stroke = "var(--primary)";
      this.timerModeBadge.style.color = "var(--primary)";
      this.timerModeBadge.style.backgroundColor = "var(--primary-light)";
    } else {
      this.timerProgressRing.style.stroke = "var(--success)";
      this.timerModeBadge.style.color = "var(--success)";
      this.timerModeBadge.style.backgroundColor = "var(--success-light)";
    }

    this.updateTimerDisplay();
  }

  toggleTimer() {
    this.ensureAudioRunning();
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isTimerRunning = true;
    this.startBtnText.textContent = "Pause";
    this.startBtnIcon.textContent = "⏸";
    this.btnTimerStart.classList.replace("btn-primary", "btn-warning");

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timerMode === "work" && (this.timerDurations.work - this.timeLeft) % 60 === 0) {
          this.stats.focusMinutes++;
          this.saveStats();
        }
        this.updateTimerDisplay();
      } else {
        this.onTimerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    this.startBtnText.textContent = this.timerMode === "work" ? "Resume Focus" : "Resume Break";
    this.startBtnIcon.textContent = "▶";
    this.btnTimerStart.classList.replace("btn-warning", "btn-primary");
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.timerDurations[this.timerMode];
    this.startBtnText.textContent = this.timerMode === "work" ? "Start Focus" : "Start Break";
    this.updateTimerDisplay();
    this.showToast("Timer reset");
  }

  adjustTimer(seconds) {
    const newTime = this.timeLeft + seconds;
    if (newTime >= 60 && newTime <= 7200) {
      this.timeLeft = newTime;
      // also adjust base duration for progress percentage
      if (this.timeLeft > this.timerDurations[this.timerMode]) {
        this.timerDurations[this.timerMode] = this.timeLeft;
      }
      this.updateTimerDisplay();
    }
  }

  onTimerComplete() {
    this.pauseTimer();
    this.playChime("complete");

    if (this.timerMode === "work") {
      this.stats.sessionsCompleted++;
      this.saveStats();

      if (this.pomodoroCycles < 4) {
        this.pomodoroCycles++;
        this.setTimerMode("shortBreak");
        this.showToast("Great focus! Time for a 5-minute break. ☕");
      } else {
        this.pomodoroCycles = 1;
        this.setTimerMode("longBreak");
        this.showToast("4 sessions finished! Take a well-deserved 15m break. 🌟");
      }
    } else {
      this.setTimerMode("work");
      this.showToast("Break over! Ready to focus again? 🚀");
    }

    this.timerCycleInfo.textContent = `Cycle: ${this.pomodoroCycles} of 4`;
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    this.timerDigits.textContent = formatted;
    document.title = `${formatted} - StudyBuddy`;

    // Progress circle strokeDashoffset (circumference = 2 * PI * 110 ≈ 691.15)
    const totalDuration = this.timerDurations[this.timerMode];
    const circumference = 2 * Math.PI * 110;
    const progress = (totalDuration - this.timeLeft) / totalDuration;
    const offset = circumference * (1 - progress);
    this.timerProgressRing.style.strokeDashoffset = offset;
  }

  setGoal(goalText) {
    this.currentGoal = goalText;
    this.goalDone = false;
    localStorage.setItem("sb_goal", goalText);
    localStorage.setItem("sb_goal_done", "false");
    this.activeGoalText.textContent = goalText;
    this.goalCompleteCheckbox.checked = false;
    this.showToast("Study goal set!");
  }

  // ------------------------------------------------------------------------
  // Flashcards Logic
  // ------------------------------------------------------------------------
  renderDeckSelects() {
    const optionsHtml = this.decks
      .map(d => `<option value="${d.id}">${d.name} (${d.cards.length} cards)</option>`)
      .join("");

    this.deckSelect.innerHTML = optionsHtml;
    this.quizDeckSelect.innerHTML = `<option value="all">All Decks Combined (${this.getTotalCardCount()} cards)</option>` + optionsHtml;
    this.cardFormDeck.innerHTML = optionsHtml;

    if (this.decks.some(d => d.id === this.currentDeckId)) {
      this.deckSelect.value = this.currentDeckId;
      this.cardFormDeck.value = this.currentDeckId;
    } else if (this.decks.length > 0) {
      this.currentDeckId = this.decks[0].id;
      this.deckSelect.value = this.currentDeckId;
      this.cardFormDeck.value = this.currentDeckId;
    }
  }

  getCurrentDeck() {
    return this.decks.find(d => d.id === this.currentDeckId) || this.decks[0];
  }

  getTotalCardCount() {
    return this.decks.reduce((sum, d) => sum + d.cards.length, 0);
  }

  renderFlashcard() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length === 0) {
      this.cardCategoryBadge.textContent = "Empty";
      this.cardFrontText.textContent = "No cards in this deck yet. Click '+ Add Card' above!";
      this.cardBackText.textContent = "Add your first card to begin studying.";
      this.deckCardCountText.textContent = "0 of 0";
      this.deckMasteryPercent.textContent = "0% Mastered";
      this.deckProgressBar.style.width = "0%";
      return;
    }

    if (this.currentCardIndex >= deck.cards.length) {
      this.currentCardIndex = 0;
    }

    const card = deck.cards[this.currentCardIndex];
    this.cardCategoryBadge.textContent = deck.name;
    this.cardFrontText.textContent = card.front;
    this.cardBackText.textContent = card.back;

    // Mastery badges
    const statusText = card.mastered ? "Mastered ✓" : "Needs Practice";
    this.cardStatusPill.textContent = statusText;
    this.cardStatusPillBack.textContent = statusText;
    this.cardStatusPill.classList.toggle("mastered", card.mastered);
    this.cardStatusPillBack.classList.toggle("mastered", card.mastered);

    // Progress
    const masteredCount = deck.cards.filter(c => c.mastered).length;
    const pct = Math.round((masteredCount / deck.cards.length) * 100);
    this.deckCardCountText.textContent = `Card ${this.currentCardIndex + 1} of ${deck.cards.length}`;
    this.deckMasteryPercent.textContent = `${pct}% Mastered`;
    this.deckProgressBar.style.width = `${pct}%`;

    // Ensure not flipped when changing card
    this.flashcardElement.classList.remove("flipped");
    this.isCardFlipped = false;
  }

  flipFlashcard() {
    this.isCardFlipped = !this.isCardFlipped;
    this.flashcardElement.classList.toggle("flipped", this.isCardFlipped);
  }

  nextCard() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length === 0) return;
    this.currentCardIndex = (this.currentCardIndex + 1) % deck.cards.length;
    this.renderFlashcard();
  }

  prevCard() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length === 0) return;
    this.currentCardIndex = (this.currentCardIndex - 1 + deck.cards.length) % deck.cards.length;
    this.renderFlashcard();
  }

  setCardMastery(isMastered) {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length === 0) return;
    deck.cards[this.currentCardIndex].mastered = isMastered;
    this.saveDecks();
    this.saveStats();
    this.renderFlashcard();
    if (isMastered) {
      this.playChime("correct");
      this.showToast("Marked as Mastered! ⭐");
    } else {
      this.showToast("Flagged for review");
    }
    // Auto advance smoothly
    setTimeout(() => this.nextCard(), 300);
  }

  shuffleCurrentDeck() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length <= 1) return;
    for (let i = deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
    }
    this.currentCardIndex = 0;
    this.renderFlashcard();
    this.showToast("Deck shuffled! 🔀");
  }

  resetDeckMastery() {
    const deck = this.getCurrentDeck();
    if (!deck) return;
    deck.cards.forEach(c => (c.mastered = false));
    this.saveDecks();
    this.saveStats();
    this.renderFlashcard();
    this.showToast("Reset deck mastery progress");
  }

  deleteCurrentCard() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length === 0) return;
    if (confirm("Are you sure you want to delete this flashcard?")) {
      deck.cards.splice(this.currentCardIndex, 1);
      if (this.currentCardIndex >= deck.cards.length) {
        this.currentCardIndex = Math.max(0, deck.cards.length - 1);
      }
      this.saveDecks();
      this.saveStats();
      this.renderDeckSelects();
      this.renderFlashcard();
      this.showToast("Card deleted");
    }
  }

  // ------------------------------------------------------------------------
  // Card & Deck CRUD Modals
  // ------------------------------------------------------------------------
  openCardModal(isEdit = false) {
    const deck = this.getCurrentDeck();
    this.cardModal.style.display = "flex";

    if (isEdit && deck && deck.cards.length > 0) {
      const card = deck.cards[this.currentCardIndex];
      this.cardModalTitle.textContent = "Edit Flashcard";
      this.editCardId.value = card.id;
      this.cardFormDeck.value = deck.id;
      this.cardFormQuestion.value = card.front;
      this.cardFormAnswer.value = card.back;
    } else {
      this.cardModalTitle.textContent = "Add New Flashcard";
      this.editCardId.value = "";
      this.cardFormDeck.value = this.currentDeckId;
      this.cardFormQuestion.value = "";
      this.cardFormAnswer.value = "";
    }
    this.cardFormQuestion.focus();
  }

  closeCardModal() {
    this.cardModal.style.display = "none";
    this.cardForm.reset();
  }

  handleSaveCard(e) {
    e.preventDefault();
    const deckId = this.cardFormDeck.value;
    const targetDeck = this.decks.find(d => d.id === deckId);
    if (!targetDeck) return;

    const front = this.cardFormQuestion.value.trim();
    const back = this.cardFormAnswer.value.trim();
    const cardId = this.editCardId.value;

    if (!front || !back) return;

    if (cardId) {
      // Edit existing
      const card = targetDeck.cards.find(c => c.id === cardId);
      if (card) {
        card.front = front;
        card.back = back;
      }
      this.showToast("Card updated!");
    } else {
      // Create new
      targetDeck.cards.push({
        id: "c_" + Date.now(),
        front,
        back,
        mastered: false
      });
      this.showToast("New card added!");
      this.currentCardIndex = targetDeck.cards.length - 1;
    }

    this.currentDeckId = deckId;
    this.saveDecks();
    this.saveStats();
    this.renderDeckSelects();
    this.renderFlashcard();
    this.closeCardModal();
  }

  openDeckModal() {
    this.deckModal.style.display = "flex";
    this.deckFormName.focus();
  }

  closeDeckModal() {
    this.deckModal.style.display = "none";
    this.deckForm.reset();
  }

  handleCreateDeck(e) {
    e.preventDefault();
    const name = this.deckFormName.value.trim();
    const desc = this.deckFormDesc.value.trim();
    if (!name) return;

    const newDeck = {
      id: "deck_" + Date.now(),
      name,
      desc: desc || "Custom study deck",
      cards: []
    };

    this.decks.push(newDeck);
    this.currentDeckId = newDeck.id;
    this.currentCardIndex = 0;
    this.saveDecks();
    this.renderDeckSelects();
    this.renderFlashcard();
    this.closeDeckModal();
    this.showToast(`Deck "${name}" created! Now add some cards.`);
    this.openCardModal();
  }

  // ------------------------------------------------------------------------
  // Quiz Mode Logic (Dynamic Multi-Choice Generator)
  // ------------------------------------------------------------------------
  startQuiz() {
    this.ensureAudioRunning();
    const selectedDeckVal = this.quizDeckSelect.value;
    const requestedCount = this.quizQuestionCount.value;

    // Gather cards pool
    let cardPool = [];
    if (selectedDeckVal === "all") {
      this.decks.forEach(d => cardPool.push(...d.cards.map(c => ({ ...c, deckName: d.name }))));
    } else {
      const deck = this.decks.find(d => d.id === selectedDeckVal);
      if (deck) {
        cardPool = deck.cards.map(c => ({ ...c, deckName: deck.name }));
      }
    }

    if (cardPool.length < 2) {
      alert("You need at least 2 cards in the deck to take a quiz! Please add more cards first.");
      return;
    }

    // Shuffle pool
    const shuffledPool = [...cardPool].sort(() => Math.random() - 0.5);
    const count = requestedCount === "all" ? shuffledPool.length : Math.min(parseInt(requestedCount, 10), shuffledPool.length);
    const quizCards = shuffledPool.slice(0, count);

    // Build questions with 4 distinct multiple choice answers
    const allAnswers = cardPool.map(c => c.back);

    this.quizQuestions = quizCards.map(card => {
      // Pick 3 distractors
      const distractors = allAnswers
        .filter(ans => ans !== card.back)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // If there are fewer than 3 distractors in current pool, add placeholder plausible options
      const fallbackDistractors = [
        "A synchronous blocking loop that intercepts network calls.",
        "An optimized hashing algorithm used for constant time index lookup.",
        "A declarative design pattern primarily used for visual transitions.",
        "A biological catalyst composed of ribonucleic acid."
      ];
      while (distractors.length < 3) {
        const fb = fallbackDistractors[distractors.length % fallbackDistractors.length];
        if (!distractors.includes(fb) && fb !== card.back) {
          distractors.push(fb);
        }
      }

      // Mix correct answer with distractors
      const options = [card.back, ...distractors].sort(() => Math.random() - 0.5);

      return {
        cardId: card.id,
        deckName: card.deckName || "Study Deck",
        question: card.front,
        correctAnswer: card.back,
        options
      };
    });

    this.currentQuestionIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];

    // Switch view states
    this.quizSetupView.style.display = "none";
    this.quizResultView.style.display = "none";
    this.quizActiveView.style.display = "block";

    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    const q = this.quizQuestions[this.currentQuestionIndex];
    const total = this.quizQuestions.length;

    this.quizQuestionNumber.textContent = `Question ${this.currentQuestionIndex + 1} of ${total}`;
    this.quizLiveScore.textContent = `Score: ${this.quizScore}`;
    const pct = Math.round(((this.currentQuestionIndex) / total) * 100);
    this.quizProgressBar.style.width = `${pct}%`;

    this.quizCategoryTag.textContent = q.deckName;
    this.quizQuestionPrompt.textContent = q.question;
    this.quizFeedbackBox.style.display = "none";

    const letters = ["A", "B", "C", "D"];
    this.quizOptionsList.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-option-btn" data-index="${i}">
        <span class="option-badge">${letters[i]}</span>
        <span>${this.escapeHtml(opt)}</span>
      </button>
    `).join("");

    // Bind option click
    const optionBtns = this.quizOptionsList.querySelectorAll(".quiz-option-btn");
    optionBtns.forEach(btn => {
      btn.addEventListener("click", () => this.handleAnswerSelect(btn, q));
    });
  }

  handleAnswerSelect(selectedBtn, q) {
    const optionBtns = this.quizOptionsList.querySelectorAll(".quiz-option-btn");
    optionBtns.forEach(b => (b.disabled = true));

    const selectedOptionText = q.options[parseInt(selectedBtn.dataset.index, 10)];
    const isCorrect = selectedOptionText === q.correctAnswer;

    if (isCorrect) {
      selectedBtn.classList.add("selected-correct");
      this.quizScore++;
      this.quizLiveScore.textContent = `Score: ${this.quizScore}`;
      this.feedbackIndicator.textContent = "✓ Correct! Outstanding!";
      this.feedbackIndicator.className = "feedback-indicator correct";
      this.playChime("correct");
    } else {
      selectedBtn.classList.add("selected-incorrect");
      this.feedbackIndicator.textContent = "✕ Not quite!";
      this.feedbackIndicator.className = "feedback-indicator incorrect";
      this.playChime("wrong");

      // Highlight the correct option
      optionBtns.forEach(b => {
        const text = q.options[parseInt(b.dataset.index, 10)];
        if (text === q.correctAnswer) {
          b.classList.add("should-have-selected");
        }
      });
    }

    this.feedbackExplanation.textContent = `Answer: ${q.correctAnswer}`;
    this.quizFeedbackBox.style.display = "flex";

    this.quizAnswers.push({
      question: q.question,
      selected: selectedOptionText,
      correct: q.correctAnswer,
      isCorrect
    });
  }

  nextQuizQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.quizQuestions.length) {
      this.renderCurrentQuestion();
    } else {
      this.showQuizResults();
    }
  }

  showQuizResults() {
    this.quizActiveView.style.display = "none";
    this.quizResultView.style.display = "block";

    const total = this.quizQuestions.length;
    const scorePct = Math.round((this.quizScore / total) * 100);

    // Save best score
    if (this.stats.bestQuizScore === null || scorePct > this.stats.bestQuizScore) {
      this.stats.bestQuizScore = scorePct;
      this.saveStats();
    }

    this.resultScoreLarge.textContent = `${scorePct}%`;
    this.resultSummaryText.textContent = `You correctly answered ${this.quizScore} out of ${total} questions.`;

    if (scorePct === 100) {
      this.resultGradeIcon.textContent = "🏆";
      this.resultTitle.textContent = "Perfect Mastery!";
    } else if (scorePct >= 80) {
      this.resultGradeIcon.textContent = "🎉";
      this.resultTitle.textContent = "Great Job!";
    } else if (scorePct >= 60) {
      this.resultGradeIcon.textContent = "👍";
      this.resultTitle.textContent = "Good Effort!";
    } else {
      this.resultGradeIcon.textContent = "💪";
      this.resultTitle.textContent = "Keep Practicing!";
    }

    // Question breakdown
    this.quizResultsBreakdown.innerHTML = this.quizAnswers.map(ans => `
      <div class="result-item ${ans.isCorrect ? "correct" : "incorrect"}">
        <span class="result-item-icon">${ans.isCorrect ? "✓" : "✕"}</span>
        <div class="result-item-info">
          <div class="result-item-q">${this.escapeHtml(ans.question)}</div>
          <div class="result-item-a">
            ${ans.isCorrect
              ? `<span style="color: var(--success)">Correct:</span> ${this.escapeHtml(ans.correct)}`
              : `<span style="color: var(--danger)">You chose:</span> ${this.escapeHtml(ans.selected)}<br><span style="color: var(--success)">Right answer:</span> ${this.escapeHtml(ans.correct)}`
            }
          </div>
        </div>
      </div>
    `).join("");

    this.playChime("complete");
  }

  // ------------------------------------------------------------------------
  // Utilities
  // ------------------------------------------------------------------------
  showToast(message) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add("show");
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove("show");
    }, 2800);
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Boot application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new StudyBuddyApp();
});
