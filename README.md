# 🎓 StudyBuddy App

> 🚀 **Live Demo:** [https://tashu031.github.io/StudyBuddy/](https://tashu031.github.io/StudyBuddy/)  
> 💻 **GitHub Repository:** [https://github.com/tashu031/StudyBuddy](https://github.com/tashu031/StudyBuddy)

A simple, beautiful, and distraction-free study companion with a **Pomodoro Timer**, interactive **Flashcards**, and an automatic **Knowledge Check Quiz**.

---

## ✨ Features

### 1. ⏱️ Pomodoro Focus Timer
- **Preset Modes**: Focus (25m), Short Break (5m), and Long Break (15m).
- **Smooth Visual Countdown**: Circular SVG progress ring with minute/second digital display.
- **Audio Chimes**: Pleasant synthesized tones via Web Audio API (100% offline, zero audio file dependencies).
- **Session Goals**: Set your current study task and check it off when accomplished.
- **Ambient Focus Noise**: Built-in sound generator for *Soft Rain*, *White Noise*, or *Focus Alpha Waves* to help block distractions.

### 2. 🗂️ Interactive 3D Flashcards
- **Flip Animation**: Click or press `Spacebar` / `F` to flip cards between question and answer.
- **Mastery Tracker**: Mark cards as *Mastered* (green check) or *Still Learning* (amber warning) to track your study progress.
- **Pre-Loaded Decks**:
  - *Web Dev & CS Concepts*
  - *General Science & Biology*
  - *Study & Memory Techniques*
- **Deck Management**: Create custom decks, add new flashcards, edit cards, shuffle, and reset progress.
- **Keyboard Shortcuts**:
  - `←` / `→` : Previous / Next card
  - `Space` or `F` : Flip card
  - `1` : Mark as Still Learning
  - `2` : Mark as Mastered

### 3. 📝 Dynamic Quiz Generator
- Turn any deck (or all decks combined) into a 4-option multiple choice quiz with a single click.
- Automatic distractor generation ensures plausible multiple-choice options.
- Instant feedback with color-coded answers and explanations.
- End-of-quiz score summary with grade badge and full question-by-question review.

### 4. 💾 Local Storage & Customization
- Automatically saves your decks, custom cards, mastery progress, daily focus time, and quiz scores.
- **Dark Mode / Light Mode** toggle.
- **Sound Toggle** to study silently or with chimes.

---

## 🚀 How to Run & View the App

### Option A: 🌐 Use the Live Web App (Instant)
Try StudyBuddy directly in your browser with zero install or setup:  
👉 **[https://tashu031.github.io/StudyBuddy/](https://tashu031.github.io/StudyBuddy/)**

### Option B: Open directly from local files
Simply double-click `index.html` or open it with your favorite browser (Chrome, Edge, Firefox, Brave).

### Option C: Run via Local Server (Recommended for development)
You can double-click `start.bat` or run:
```bash
python -m http.server 3000
```
Then visit: [http://localhost:3000](http://localhost:3000)
