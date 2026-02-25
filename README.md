# 🌸 BloomTide AI

> **Set the Tide. Let AI Bloom.**

An interactive creative web experience built for the **Jam the Web** competition. Every combination of words and tide level creates a unique, one-of-a-kind procedural flower — no two blooms are ever the same.

---

## 🎯 The 3 Theme Words & How We Used Them

Our three random theme words were: **Bloom**, **Tide**, and **AI**. Rather than treating them as simple labels, we made each word the **foundation of a core mechanic** — every interaction on the site is driven by all three working together.

---

### 🌸 Bloom — *The Visual Output*

**What it is:** The bloom is the centerpiece of the entire experience — a unique, beautiful procedural flower rendered live on an HTML5 Canvas.

**How it's used throughout the site:**

- **The Generator Page (`/`)** — The main experience revolves around generating a bloom. Users enter 3 words and set a tide level, then click "Generate Bloom" to create their unique flower on the canvas.
- **Petal Rendering** — Each bloom has multiple layers of bezier-curve petals, each with its own gradient fill. The petal count, curvature, and length are all procedurally determined by the user's input.
- **Stems & Leaves** — Every bloom grows a curved stem with optional leaves, adding to the botanical realism.
- **Sparkle Particles** — Glowing particles are scattered around the flower, with their count and brightness influenced by the chaos/mood parameter.
- **Center Gradient** — The flower's center uses a radial gradient that shifts based on the bloom's primary hue, creating a natural pistil effect.
- **Community Gallery** — Saved blooms appear in a gallery on both the generator page and the main website, where they're re-rendered from their saved parameters so they look identical every time.
- **Visual Identity** — The entire website's color scheme, animations, and aesthetic revolve around the blooming flower concept — from gradient accents to the preloader animation.

---

### 🌊 Tide — *The Creative Control*

**What it is:** The tide is the user's creative slider — a horizontal range input from 0% to 100% that controls the *intensity, mood, and personality* of the generated bloom.

**How it's used throughout the site:**

- **Slider Design** — The tide slider has a custom gradient track (dark navy → cyan → pink) and uses a **🌊 wave emoji** as the slider thumb that rides along the bar, creating a visual connection to the ocean/tide metaphor.
- **Bloom Intensity** — The tide level directly affects multiple bloom parameters:
  - **Low Tide (0–33%)** → Calm, gentle, soft flowers. Fewer petals, smaller size, pastel-like tones. Think of a delicate wildflower at dawn.
  - **Mid Tide (34–65%)** → Balanced, vibrant, natural-looking blooms. A harmonious mix of color and complexity.
  - **High Tide (66–100%)** → Powerful, dramatic, bold flowers. More petals, larger size, intense colors. Like a tropical flower in full bloom during a storm.
- **Wave Animations** — The entire site background features animated SVG ocean waves that flow continuously, reinforcing the tide theme.
- **Ocean Glow Effects** — Radial gradient "glows" are positioned across the page, simulating the shimmer of moonlight on water.
- **Tide Display** — Each bloom's tide level is shown below it in the gallery (`🌊 Tide: 75%`), making it part of the bloom's identity.
- **Canvas Waves** — At the bottom of each generated bloom canvas, subtle wave shapes are drawn with opacity influenced by the tide level.

---

### 🤖 AI — *The Intelligent Engine*

**What it is:** The AI is the smart algorithmic engine that interprets the user's 3 words and transforms them into meaningful bloom parameters. It's not random — it *understands* what the user types.

**How it's used throughout the site:**

- **Color Word Recognition (40+ words)** — The AI engine contains a dictionary that maps color-related words to specific hue values:
  - `"red"` → Hue 0° (true red petals)
  - `"ocean"`, `"sea"`, `"water"` → Hue 200-210° (deep blue tones)
  - `"golden"`, `"gold"`, `"sunshine"` → Hue 50° (warm golden glow)
  - `"emerald"`, `"forest"`, `"jade"` → Hue 135-145° (rich greens)
  - `"lavender"`, `"violet"`, `"purple"` → Hue 265-280° (purple spectrum)
  - `"rainbow"` → Each petal gets a different hue, creating a full-spectrum bloom
  - `"neon"` → Boosts saturation to 100% for electric, glowing colors
  - `"pastel"` → Reduces saturation, raises lightness for soft, muted tones

- **Mood & Style Parsing (30+ words)** — Beyond colors, the engine recognizes mood and emotion words that affect the bloom's structure:
  - `"wild"`, `"fierce"`, `"chaotic"` → High chaos (irregular petal angles), larger size
  - `"calm"`, `"serene"`, `"peaceful"` → Low chaos (symmetrical), smaller, delicate blooms
  - `"storm"`, `"thunder"`, `"power"` → Very high chaos and large size
  - `"gentle"`, `"soft"`, `"breeze"` → Minimal chaos, gentle curves
  - `"magic"`, `"dream"`, `"exotic"` → Moderate chaos with slightly larger-than-normal size
  - `"tiny"`, `"small"`, `"little"` → Reduced bloom size
  - `"huge"`, `"giant"`, `"big"` → Enlarged bloom size

- **Seeded Random Generation (Mulberry32)** — The engine uses a deterministic pseudo-random number generator called Mulberry32. This means:
  - The **same 3 words + same tide level = the same bloom every time**
  - Each bloom is reproducible and can be reliably saved and re-rendered
  - The seed is generated by hashing the combined words and tide level
  - Different word combinations create genuinely different blooms

- **Combined Parameter Synthesis** — All three inputs (color hue, mood modifiers, and tide level) are synthesized together to produce the final bloom:
  ```
  Input: "red" + "wild" + "storm" @ Tide 85%
  ↓
  AI Engine calculates:
  - Base hue: 0° (red from "red")
  - Chaos: 0.9 (wild + storm combined)
  - Size modifier: 1.3x (storm influence)
  - Tide multiplier: 0.6 + 0.85 * 0.6 = 1.11x (high tide boost)
  - Petal count: 12-15 (boosted by chaos)
  ↓
  Result: Large, dramatic red bloom with irregular, explosive petals
  ```

---

## 🖥️ Pages

| Page | Route | Description |
|------|-------|-------------|
| **Bloom Generator** | `/` | Interactive landing page — enter 3 words, set the tide, generate & save your bloom |
| **Main Website** | `/main` | Full themed website with About, Features, Community Gallery, and Reviews |

---

## ✨ Key Features

- **🌸 Smart Bloom Generation** — 70+ recognized words that directly influence your flower
- **🌊 Wave Emoji Slider** — Custom slider with a 🌊 thumb that rides the tide
- **🗑️ Delete from Gallery** — Hover over any saved bloom to reveal a delete button
- **🔁 Reproducible Art** — Same inputs always create the same bloom (deterministic seeded RNG)
- **📱 Fully Responsive** — Looks great on mobile, tablet, and desktop
- **🌙 Premium Dark Theme** — Glassmorphism cards, ocean waves, and glowing accents
- **⚡ Zero Dependencies on Frontend** — No React, no npm, just vanilla HTML/CSS/JS
- **🚀 Instant Generation** — No waiting for APIs, blooms render in milliseconds

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Structure** | HTML5 | Semantic markup, canvas element |
| **Styling** | CSS3 | Animations, glassmorphism, gradients, responsive grid |
| **Logic** | Vanilla JavaScript | Bloom engine, word parsing, gallery management |
| **Canvas** | HTML5 Canvas API | Procedural bloom rendering with bezier curves |
| **Backend** | Python Flask | API endpoints, static file serving |
| **Data** | JSON files | Bloom storage (`data/blooms.json`) |
| **Deployment** | Render.com + Gunicorn | Production WSGI server |

---

## 🚀 Run Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python server.py
```

Open **http://localhost:3000** → Bloom Generator  
Open **http://localhost:3000/main** → Main Website

---

## 📁 Project Structure

```
bloomtide-ai/
├── puzzle.html          # 🌸 Bloom Generator (landing page) — word inputs, canvas, gallery
├── index.html           # 🏠 Main themed website — about, features, reviews, gallery
├── style.css            # 🎨 Global stylesheet — ocean theme, glassmorphism, animations
├── script.js            # ⚡ Main site scripts — particles, scroll animations, typewriter
├── server.py            # 🐍 Flask backend — /api/blooms CRUD, static file serving
├── requirements.txt     # 📦 Python dependencies (flask, flask-cors, gunicorn)
├── .gitignore           # 🚫 Ignores .env, data/, node_modules/
├── README.md            # 📖 This file
└── data/
    ├── blooms.json      # 🌸 Saved bloom parameters (words, tide, seed)
    └── messages.json    # 📬 Contact message storage
```

---

## 🌊 How It Works — Step by Step

```
┌─────────────────────────────────────────────────┐
│  USER ENTERS 3 WORDS     e.g. "red wild ocean"  │
│  USER SETS TIDE LEVEL    e.g. 75%                │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  AI ENGINE PARSES WORDS                          │
│  ├── "red"   → hue: 0°  (color dictionary)      │
│  ├── "wild"  → chaos: 0.8, size: 1.2x (mood)    │
│  └── "ocean" → hue: 210° (but red takes priority)│
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  SEED GENERATOR (Mulberry32)                     │
│  hash("red-wild-ocean" + 75) → seed: 2847291    │
│  Creates deterministic random number sequence    │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  BLOOM RENDERER (HTML5 Canvas)                   │
│  ├── Draws background glow (radial gradient)     │
│  ├── Draws stem + leaves (quadratic curves)      │
│  ├── Draws petal layers (bezier curves)          │
│  ├── Draws center (radial gradient)              │
│  ├── Adds sparkle particles                      │
│  └── Adds tide waves at bottom                   │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  UNIQUE BLOOM ON CANVAS ✨                       │
│  User can save it to the community gallery       │
└─────────────────────────────────────────────────┘
```

---

## 🧪 Try These Word Combinations

| Words | Tide | What You'll Get |
|-------|------|----------------|
| `red` `fire` `wild` | 90% | A large, dramatic red bloom with chaotic petals |
| `blue` `calm` `ocean` | 20% | A small, serene blue flower with gentle curves |
| `rainbow` `magic` `storm` | 75% | A multicolored bloom with moderate chaos |
| `gold` `sun` `big` | 60% | A warm golden sunflower-like bloom |
| `purple` `gentle` `moon` | 35% | A soft purple bloom with delicate petals |
| `green` `forest` `wild` | 80% | A lush green bloom with wild petal angles |
| `pink` `love` `soft` | 40% | A delicate pink flower with symmetrical petals |
| `dark` `fierce` `storm` | 95% | An intense dark bloom with dramatic, explosive petals |

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blooms` | Get all saved blooms |
| `POST` | `/api/blooms` | Save a new bloom `{ words, tideLevel, seed }` |
| `DELETE` | `/api/blooms/:id` | Delete a bloom by ID |

---

Built with ❤️ for the **Jam the Web** competition.
