*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

I built **StudyBuddy** — a simple, unified, and distraction-free study companion designed to help my close friend stay calm, focused, and confident during intensive study sessions.

> 🚀 **Live Demo:** [https://tashu031.github.io/StudyBuddy/](https://tashu031.github.io/StudyBuddy/)  
> 💻 **GitHub Repository:** [https://github.com/tashu031/StudyBuddy](https://github.com/tashu031/StudyBuddy)

### Who I Built It For & The Problem It Solves

My friend has been cramming for software engineering interviews and university exams. Like many learners, they were constantly fighting against modern "study app fatigue":
- **Bloated Subscriptions & Paywalls:** Everyday flashcard apps have started locking basic features like quiz modes, dark mode, or offline review behind pricey monthly paywalls.
- **Context-Switching Chaos:** They were juggling three separate browser tabs: a random web Pomodoro timer, a flashcard app, and a practice quiz site.
- **Distraction & Data Tracking:** Popups, login screens, streaks that induce anxiety, and ad banners constantly break deep work flow.

**StudyBuddy** solves this by unifying the entire study routine into a single, light-weight, zero-friction app that works completely offline:
1. **⏱️ Pomodoro Clock:** A visual circular timer with 25m Focus, 5m Short Break, and 15m Long Break intervals, customizable durations, task goal setting, and built-in ambient sound generators (Soft Rain, White Noise, Alpha Focus Waves).
2. **🗂️ Interactive 3D Flashcards:** Smooth flip animations, card mastery progression (`Mastered` vs `Still Learning`), deck management, and keyboard shortcuts (`Space`, `←`, `→`, `1`, `2`).
3. **📝 Dynamic Quiz Generator:** Automatically transforms flashcards from any deck into randomized 4-option multiple-choice quizzes with smart distractor generation and instant feedback.

No sign-ups, no monthly fees, no tracking — just pure, peaceful focus.

---

## Demo

- 🚀 **Live Deployed App (GitHub Pages):** [https://tashu031.github.io/StudyBuddy/](https://tashu031.github.io/StudyBuddy/)
- 💻 **Local Execution:** Run locally via `start.bat` or `python -m http.server 3000` ([http://localhost:3000](http://localhost:3000))
- 📹 **Walkthrough / Screenshots:**
<!-- Add your 1-2 minute Loom, YouTube, or GIF walkthrough showing the timer, 3D flip card, and quiz in action! -->

![StudyBuddy Preview](https://raw.githubusercontent.com/tashu031/StudyBuddy/main/preview.png)

### Key Highlights
- **100% Offline Audio:** Uses the browser's native **Web Audio API** to synthesize peaceful completion chimes and ambient sound frequencies in real-time — zero external MP3 downloads required!
- **Local Persistence:** All custom flashcards, decks, session streaks, and quiz high scores are stored securely in `localStorage`.
- **Keyboard-First Navigation:** Study with rapid keyboard flow without touching your mouse.

---

## Code

**GitHub Repository:** [https://github.com/tashu031/StudyBuddy](https://github.com/tashu031/StudyBuddy)

{% github tashu031/StudyBuddy %}

The project is built entirely with clean, vanilla web technologies for longevity and lightning performance:
- **`index.html`**: Accessible, semantic markup structure for tabbed productivity views.
- **`styles.css`**: Modern CSS design system featuring CSS Custom Properties, 3D flip card transformations, circular SVG countdown math, and adaptive Dark/Light themes.
- **`app.js`**: Modular state-driven JavaScript containing the timer cycle engine, Web Audio frequency synthesis, deck CRUD logic, and algorithmic multiple-choice distractor generation.

---

## How I Built It

To bring StudyBuddy from concept to a polished, ready-to-run tool in a single weekend, I leveraged an autonomous agentic pair-programming workflow powered by Google DeepMind's **Antigravity** agent harness and cutting-edge open AI tools:

1. **Architecture & Rapid Scaffolding:**
   - Guided by agentic workflows, we structured the app into three cohesive pillars (Timer, Flashcards, Quiz) ensuring they shared a reactive state and local storage layer.
2. **Offline-First Audio Engineering:**
   - Rather than relying on third-party audio CDNs that fail without internet access, we utilized the agent to synthesize harmonic sine-wave chimes and pink/white noise filters using the native `AudioContext` pipeline.
3. **Algorithmic Quiz Generation:**
   - Built a dynamic distractor selection algorithm that takes any flashcard deck, extracts answers from peer cards to act as plausible multiple-choice options, and ensures every question remains challenging and educational.
4. **Zero-Build Deployment:**
   - Kept the stack strictly dependency-free (no complex build tools, `node_modules` overhead, or bundle steps) so anyone can open `index.html` or double-click `start.bat` and run it instantly on any device.

---

## Why Does Open Innovation Matter?

Open innovation is what ensures technology remains a public good rather than a gated tollbooth. 

For educational software in particular, open innovation matters because:
1. **Equitable Access to Learning:** A student in a remote area with spotty internet or limited financial resources should never be locked out of essential recall and focus tools. Open tools guarantee that anyone can inspect, host, modify, and benefit from the software offline.
2. **Longevity & Data Sovereignty:** Proprietary SaaS study apps frequently shut down, pivot, or hold user notes hostage behind paywalls. Building with open standards ensures notes and flashcard decks belong to the user forever.
3. **Collaborative Evolution:** With open innovation, educators and developers across the world can fork StudyBuddy to add language decks, spaced-repetition algorithms (like SM-2), or custom audio soundscapes without asking for permission.

---

## My Agent Session

*StudyBuddy was designed and developed through an autonomous agentic pair-programming workflow with AI. During the development session, the agent and I designed the complete user journey, tested the SVG progress stroke calculations, fine-tuned the 3D card perspective matrix, and verified offline audio synthesis in real time.*

---

## Prize Categories

- **Build for a Friend** (Primary Category)
- **Open Source / Local-First Productivity & Education**

---

<!-- Team Submissions: Built with passion by @tashu031 -->
*Built with passion by [@tashu031](https://github.com/tashu031)*
