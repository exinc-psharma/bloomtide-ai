# 🌸 BloomTide AI

> **Set the Tide. Let AI Bloom.**

A creative web experience built for the **Jam the Web** competition, where every combination of words and tide creates a unique, living flower.

---

## 🎯 The 3 Theme Words

Our three random words were: **Bloom**, **Tide**, and **AI**. Here's how each one became an integral part of the website's core mechanic — not just decoration, but the **entire experience**.

### 🌸 Bloom — *The Output*
The **bloom** is what the user creates. It's a unique procedural flower generated on an HTML canvas, with petals, stems, leaves, and sparkles that are different every time. No two blooms are alike — each one is shaped by the user's words and tide level. The entire visual identity of the site revolves around blooming flowers, from the generated art to the community gallery.

### 🌊 Tide — *The Creative Control*
The **tide** is the user's creative slider. It controls the *intensity* and *mood* of the generated bloom:
- **Low Tide** (0–33%) → calm, gentle, soft pastel flowers with fewer petals
- **Mid Tide** (34–65%) → balanced, natural, vibrant blooms
- **High Tide** (66–100%) → powerful, dramatic, tropical flowers with bold colors and more petals

The tide metaphor extends to the entire UI — animated ocean waves flow across the background, and the slider thumb is a 🌊 wave emoji that rides along the gradient bar.

### 🤖 AI — *The Engine*
The **AI** is the intelligent algorithmic engine that interprets the user's 3 words and transforms them into bloom parameters:
- **Color words** like "red", "blue", "golden", "rainbow" directly set the flower's hue
- **Mood words** like "wild", "calm", "fierce", "gentle" control petal chaos and size
- **Nature words** like "storm", "sun", "moon" influence the bloom's personality
- The engine uses a **seeded random number generator** (Mulberry32) so the same inputs always produce the same unique bloom — making each creation reproducible and shareable

The AI parses a dictionary of **70+ recognized words** across colors, moods, emotions, and nature to create flowers that truly reflect what the user typed.

---

## 🖥️ Pages

| Page | Route | Description |
|------|-------|-------------|
| **Bloom Generator** | `/` | Interactive landing page where users enter 3 words, set the tide, and generate their bloom |
| **Main Website** | `/main` | Full themed website with About, Features, Community Gallery, and Reviews |

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Python Flask
- **Canvas**: HTML5 Canvas for procedural bloom generation
- **Data**: JSON file storage for blooms and messages
- **Deployment**: Render.com with Gunicorn

---

## 🚀 Run Locally

```bash
pip install -r requirements.txt
python server.py
```

Open **http://localhost:3000** → Bloom Generator

---

## 📁 Project Structure

```
├── puzzle.html      # 🌸 Bloom Generator (landing page)
├── index.html       # 🏠 Main themed website
├── style.css        # 🎨 Global styles + ocean theme
├── script.js        # ⚡ Animations, particles, typewriter
├── server.py        # 🐍 Flask backend + API
├── requirements.txt # 📦 Python dependencies
├── data/
│   ├── blooms.json  # 🌸 Saved bloom data
│   └── messages.json# 📬 Contact form messages
└── README.md        # 📖 This file
```

---

## 🌊 How It Works

1. **User enters 3 words** — e.g. "Red", "Wild", "Storm"
2. **Sets the Tide slider** — controls intensity from gentle to powerful
3. **AI engine parses the words** — maps colors, moods, and styles to bloom parameters
4. **Procedural bloom generates** — unique flower on canvas based on the combined seed
5. **Save to Gallery** — bloom data is stored and displayed in the community gallery

Every unique combination of words + tide level = a one-of-a-kind bloom that can be saved and shared.

---

Built with ❤️ for the **Jam the Web** competition.
