# ⚡ Blinky — AI-Powered Circuit & IoT Coding Assistant

Autonomous Agentic IoT Workflow: **Circuit Design ➔ Firmware Generation ➔ ESP32 Flashing ➔ AI Self-Testing & Healing ➔ Verified Telemetry**.

---

## 📁 Clean Project Structure

```text
blinkyAntigravity/
├── public/
│   └── favicon.svg              # App favicon
├── src/
│   ├── Components/              # Modular UI Components
│   │   ├── nodes/               # SVG Schematic Component Nodes
│   │   │   ├── BuzzerNode.jsx
│   │   │   ├── ESP32Node.jsx
│   │   │   ├── GenericNode.jsx
│   │   │   ├── LEDNode.jsx
│   │   │   ├── ResistorNode.jsx
│   │   │   └── UltrasonicNode.jsx
│   │   ├── AiSelfHealingCard.jsx # Stage 4: AI Diagnostic & Self-Healing Loop
│   │   ├── circuitDiagram.jsx    # Stage 1: Interactive Wokwi Simulator & Schematic Canvas
│   │   ├── CodePanel.jsx         # Stage 2: Arduino C++ Firmware Viewer & Exporter
│   │   ├── ComponentRenderer.jsx # Dynamic Node Dispatcher
│   │   ├── HardwarePanel.jsx     # Stage 3: ESP32 Flasher & Serial Terminal
│   │   ├── InstructionPanel.jsx  # Breadboard Assembly & Wiring Netlist Guide
│   │   ├── PromptBar.jsx         # Natural Language AI Prompt & Preset Selector
│   │   ├── SuccessBanner.jsx     # Stage 5: Celebratory Verification Status
│   │   ├── TelemetryPanel.jsx    # Real-time Sensor Telemetry & DB Sync Feed
│   │   ├── VisionVoiceBar.jsx    # Gemini Vision AI & Voice Guidance Bar
│   │   └── wires.jsx             # Curved Collision-Free SVG Wire Renderer
│   ├── data/
│   │   └── mockCircuits.js       # Curated Circuit Schematics (Water Level, LED, Button)
│   ├── services/
│   │   ├── api.js                # FastAPI Backend Client & Resilient Fallback Engine
│   │   └── hardwareApi.js        # ESP32 Status & Flashing Service
│   ├── utils/
│   │   ├── layoutEngine.js       # Dynamic Coordinate & Pin Placement Engine
│   │   └── wokwiExporter.js      # Wokwi diagram.json Simulator Exporter
│   ├── App.css                   # Polished Cyberpunk / Dark Glassmorphism Stylesheet
│   ├── App.jsx                   # Central 5-Stage Agentic Controller
│   ├── index.css                 # Base Reset & Typography Styles
│   └── main.jsx                  # Application Entry Point
├── .env                          # Local Environment Variables
├── .env.example                  # Environment Configuration Template
├── .gitignore                    # Git Ignore Configuration
├── eslint.config.js              # ESLint Configuration
├── index.html                    # Root HTML Template
├── package.json                  # Dependencies & Scripts
└── vite.config.js                # Vite Bundler Configuration
```

---

##  Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` to customize the FastAPI backend endpoint:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_API=false
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build & Lint
```bash
npm run lint
npm run build
```
