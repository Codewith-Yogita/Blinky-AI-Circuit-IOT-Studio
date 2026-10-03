import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  User,
  Send,
  Loader2,
  Cpu,
  RefreshCw,
  Sun,
  Moon,
  ExternalLink,
  Code2,
  CheckCircle2,
  CircuitBoard,
  Layers,
  HelpCircle,
  Camera,
  Play,
  Terminal,
  Zap,
  Mic,
  MicOff,
  Flame,
  Radio,
  FileCode,
  Download,
  Copy,
  Sliders,
  Check,
} from "lucide-react";
import { sendChatMessage } from "../services/chatAssistant";
import { generateProject } from "../services/api";
import { waterLevelAlarmCircuit, joystickLedCircuit, singleLedCircuit } from "../data/mockCircuits";
import ComponentCameraScanner from "./ComponentCameraScanner";
import CircuitSimulationCard from "./CircuitSimulationCard";
import CodeGenerationCard from "./CodeGenerationCard";
import CodeFlashingCard from "./CodeFlashingCard";

const QUICK_STARTERS = [
  { label: "💡 Ultrasonic Distance Alarm", prompt: "Build an ESP32 HC-SR04 ultrasonic distance sensor with buzzer and alert LED" },
  { label: "🔘 Push Button Debounce & LED", prompt: "ESP32 push button with internal pull-up and status indicator LED" },
  { label: "🕹️ Dual-Axis Joystick Controller", prompt: "Dual-axis analog joystick controlling two servo motors with ESP32" },
  { label: "🌡️ DHT11 Temp & Humidity Sensor", prompt: "DHT11 temperature and humidity sensor reading telemetry on ESP32" },
  { label: "⚡ ESP32 GPIO Pinout & Safety", prompt: "Explain ESP32 pin capabilities, ADC1 vs ADC2, and safe pins for sensors" },
];

export default function CircuitChatPage({
  initialQuery = "",
  currentProject: parentProject,
  onBackToLanding,
  onUpdateProject,
  theme = "dark",
  toggleTheme,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [scannedComponents, setScannedComponents] = useState([]);
  const [activeProject, setActiveProject] = useState(parentProject || null);
  const [visibleComponents, setVisibleComponents] = useState({
    circuit: false,
    code: false,
    flash: false,
  });
  const [isListening, setIsListening] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const hasAutoSentRef = useRef(false);

  const isDark = theme === "dark";

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle incoming initialQuery
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  // Sync active project if parent updates
  useEffect(() => {
    if (parentProject) {
      setActiveProject(parentProject);
    }
  }, [parentProject]);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const handleToggleVoice = () => {
    if (!speechRecognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your request or click an example!");
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Speech recognition already running", e);
      }
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    setInputValue("");

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      scannedParts: [...scannedComponents],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = textToSend.toLowerCase();

    // Intent detection for component display
    const wantsCircuit =
      lower.includes("circuit") ||
      lower.includes("schematic") ||
      lower.includes("wire") ||
      lower.includes("wiring") ||
      lower.includes("diagram") ||
      lower.includes("simulation") ||
      lower.includes("wokwi");

    const wantsCode =
      lower.includes("code") ||
      lower.includes("firmware") ||
      lower.includes("sketch") ||
      lower.includes("c++") ||
      lower.includes("cpp") ||
      lower.includes("arduino") ||
      lower.includes(".ino");

    const wantsFlash =
      lower.includes("flash") ||
      lower.includes("upload") ||
      lower.includes("burn") ||
      lower.includes("webserial") ||
      lower.includes("serial monitor") ||
      lower.includes("baud");

    const wantsHideCircuit = lower.includes("hide circuit") || lower.includes("close circuit");
    const wantsHideCode = lower.includes("hide code") || lower.includes("close code");
    const wantsHideFlash = lower.includes("hide flash") || lower.includes("close flash") || lower.includes("close flasher");
    const wantsShowAll = lower.includes("show all") || lower.includes("show everything");
    const wantsHideAll = lower.includes("hide all") || lower.includes("close all");

    const wantsStepSimulation =
      lower.includes("step by step") ||
      lower.includes("step-by-step") ||
      lower.includes("step simulation") ||
      lower.includes("first esp32") ||
      lower.includes("assembly simulation") ||
      (lower.includes("step") && lower.includes("simulation"));

    if (wantsStepSimulation) {
      if (
        lower.includes("resistor") &&
        lower.includes("led") &&
        !lower.includes("sonar") &&
        !lower.includes("ultrasonic")
      ) {
        setActiveProject({
          circuit: singleLedCircuit,
          code: singleLedCircuit.code,
          instructions: singleLedCircuit.instructions,
        });
      }
      setVisibleComponents((prev) => ({ ...prev, circuit: true }));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `🚀 **Step-by-Step Circuit Assembly Simulation is Live!**

I have loaded the interactive simulation canvas in **Step-by-Step Assembly Mode** with all 7 guided stages:

1. **Mount ESP32 Microcontroller**: Places the ESP32 DevKit V1 board onto the workspace.
2. **Place 220Ω Resistor**: Positions the current-limiting resistor to protect the LED.
3. **Wire ESP32 [GPIO2] ➔ 220Ω Resistor [Pin 1]**: Jumper wire connected with highlighted pinout pads on **GPIO2** and **Pin 1**.
4. **Place Red LED**: Places the directional LED diode (longer leg is Anode +, shorter is Cathode -).
5. **Wire 220Ω Resistor [Pin 2] ➔ Red LED [Anode]**: Delivers safe ~15mA current from the resistor into the LED anode.
6. **Wire Red LED [Cathode] ➔ ESP32 [GND]**: Completes the closed electrical return path back to system ground.
7. **⚡ Circuit Complete & Live Power**: Power turns ON, firmware runs, and the LED blinks in real-time!

You can click **Play Simulation (▶)** on the canvas to watch it build automatically, or use **Next (➔)** / **Prev (⬅)** or keyboard arrows to step through each connection!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedNextSteps: [
            "Show Arduino code",
            "Flash to ESP32",
            "Explain resistor calculation",
            "Show full circuit diagram",
          ],
        },
      ]);
      return;
    }

    // Fast conversational intercept for component toggling when a project is already active
    const isShowOrHideCommand =
      wantsHideCircuit ||
      wantsHideCode ||
      wantsHideFlash ||
      wantsHideAll ||
      wantsShowAll ||
      ((wantsCircuit || wantsCode || wantsFlash) &&
        (lower.startsWith("show") ||
          lower.startsWith("view") ||
          lower.startsWith("open") ||
          lower.startsWith("give") ||
          lower.startsWith("flash") ||
          lower === "circuit" ||
          lower === "code" ||
          lower === "flash"));

    if (activeProject && isShowOrHideCommand) {
      if (wantsHideAll) {
        setVisibleComponents({ circuit: false, code: false, flash: false });
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "✅ Closed all hardware workspace components. Say **'Show circuit'**, **'Show code'**, or **'Flash it'** anytime to bring them back!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      if (wantsShowAll) {
        setVisibleComponents({ circuit: true, code: true, flash: true });
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "🚀 Showing all 3 components below:\n- ⚡ **Circuit Simulation & Wokwi Blueprint**\n- 💻 **Arduino C++ Firmware**\n- 🔥 **WebSerial Hardware Flasher**",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      if (wantsHideCircuit) {
        setVisibleComponents((prev) => ({ ...prev, circuit: false }));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "👌 Closed the **Circuit Simulation** component.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      if (wantsHideCode) {
        setVisibleComponents((prev) => ({ ...prev, code: false }));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "👌 Closed the **Arduino Code** viewer component.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      if (wantsHideFlash) {
        setVisibleComponents((prev) => ({ ...prev, flash: false }));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "👌 Closed the **Hardware Flasher** component.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      // Handle displaying individual components on demand
      let replyParts = [];
      if (wantsCircuit) {
        setVisibleComponents((prev) => ({ ...prev, circuit: true }));
        replyParts.push(
          `⚡ **Circuit Simulation Component Opened!**\nI've rendered the interactive **Wokwi breadboard simulation and schematic** for **${
            activeProject.circuit?.title || "your ESP32 circuit"
          }** below.`
        );
      }
      if (wantsCode) {
        setVisibleComponents((prev) => ({ ...prev, code: true }));
        replyParts.push(
          `💻 **Arduino C++ Code Component Opened!**\nHere is the verified non-blocking firmware with pin definitions. You can copy the code or download the \`.ino\` sketch below.`
        );
      }
      if (wantsFlash) {
        setVisibleComponents((prev) => ({ ...prev, flash: true }));
        replyParts.push(
          `🔥 **Hardware Flasher Component Opened!**\nConnect your physical **ESP32 DevKit** via USB and click **Flash Firmware** below to upload over WebSerial.`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: replyParts.join("\n\n"),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      return;
    }

    // Otherwise, perform AI circuit synthesis or answering
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend, messages, scannedComponents);

      if (response.circuitProject) {
        setActiveProject(response.circuitProject);
        if (onUpdateProject) {
          onUpdateProject(response.circuitProject);
        }

        // Only show components if the user's query specifically asked for that component!
        setVisibleComponents({
          circuit: wantsCircuit,
          code: wantsCode,
          flash: wantsFlash,
        });
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.text,
        circuitProject: response.circuitProject,
        suggestedNextSteps: response.suggestedNextSteps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `⚠️ **Error Processing Request**: Could not generate circuit. Please check your network connection and try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setScannedComponents([]);
    setActiveProject(null);
    setVisibleComponents({ circuit: false, code: false, flash: false });
  };

  const handleApplyScannedHardware = ({ components }) => {
    setScannedComponents(components);
    const names = components.map((c) => c.name).join(", ");
    handleSend(`Build an ESP32 circuit using scanned components: ${names}`);
  };

  const handleRunDemo = () => {
    handleSend("HC-SR04 ultrasonic distance alarm with buzzer & alert LED");
  };

  // Helper to format bot markdown text cleanly
  const renderFormattedText = (rawText) => {
    const lines = rawText.split("\n");

    return (
      <div className="space-y-2 leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h3
                key={idx}
                className="text-base sm:text-lg font-bold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mt-2 mb-1 flex items-center gap-2"
              >
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("#### ")) {
            return (
              <h4
                key={idx}
                className="text-xs sm:text-sm font-bold font-mono text-amber-300 uppercase tracking-wider mt-3 mb-1"
              >
                {line.replace("#### ", "")}
              </h4>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs sm:text-sm font-mono my-2"
                dangerouslySetInnerHTML={{
                  __html: formatInlineMarkdown(line.substring(2)),
                }}
              />
            );
          }
          if (line.startsWith("- ")) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 text-zinc-300">
                <span className="text-amber-400 mt-1 shrink-0">•</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatInlineMarkdown(line.substring(2)),
                  }}
                />
              </div>
            );
          }
          if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
            return (
              <div
                key={idx}
                className="font-mono text-xs sm:text-sm bg-black/40 px-2 py-1 rounded text-amber-200/90 overflow-x-auto"
              >
                {line}
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p
              key={idx}
              className="text-zinc-300"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(line),
              }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(
        /`(.*?)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-xs sm:text-sm">$1</code>'
      );
  };

  return (
    <div className="min-h-screen bg-[#040306] text-zinc-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-white w-full relative overflow-x-hidden">
      {/* ================= RETRO DIGITAL DOT MATRIX BACKGROUND ================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Scattered Ambient Pixel Stars (Matching Reference Screenshot) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle glowing star pixels */}
        <span className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_8px_cyan] animate-pulse" />
        <span className="absolute top-[32%] left-[8%] w-1 h-1 rounded-full bg-purple-400/50 shadow-[0_0_6px_purple]" />
        <span className="absolute top-[48%] left-[15%] w-1.5 h-1.5 rounded-full bg-amber-400/50 shadow-[0_0_6px_amber]" />
        <span className="absolute top-[22%] right-[14%] w-1 h-1 rounded-full bg-emerald-400/60 shadow-[0_0_6px_emerald]" />
        <span className="absolute top-[38%] right-[10%] w-1.5 h-1.5 rounded-full bg-pink-400/50 shadow-[0_0_8px_pink] animate-pulse" />
        <span className="absolute top-[65%] right-[16%] w-1 h-1 rounded-full bg-orange-400/60 shadow-[0_0_6px_orange]" />
        <span className="absolute top-[75%] left-[9%] w-1.5 h-1.5 rounded-full bg-teal-400/40 shadow-[0_0_6px_teal]" />
        <span className="absolute top-[82%] right-[24%] w-1 h-1 rounded-full bg-yellow-400/50 shadow-[0_0_6px_yellow]" />

        {/* Central Warm Ambient Aura Behind Mascot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-amber-600/15 via-orange-600/10 to-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Camera Scanner Modal Component */}
      <ComponentCameraScanner
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onApplyToChat={handleApplyScannedHardware}
      />

      {/* ================= TOP NAVIGATION HEADER (MATCHING SCREENSHOT) ================= */}
      <header className="sticky top-0 z-40 w-full px-5 sm:px-10 py-3.5 border-b border-white/[0.06] bg-[#040306]/85 backdrop-blur-2xl flex items-center justify-between transition-colors">
        {/* Left: Brand Logo Text */}
        <div
          className="flex items-center cursor-pointer group transition-transform hover:scale-105 active:scale-95"
          onClick={onBackToLanding}
        >
          <img
            src="/blinky-logo-text.png"
            alt="Blinky Logo"
            className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]"
          />
        </div>

        {/* Center: Nav links from reference image (Demo, Quick Actions, Features) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide">
          <button
            type="button"
            onClick={handleRunDemo}
            className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
          >
            <Play size={13} className="text-amber-400" />
            <span>Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQuickActionsModal(true)}
            className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
          >
            <Zap size={13} className="text-orange-400" />
            <span>Quick Actions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (messages.length === 0) {
                handleSend("Show me all Blinky capabilities: simulation, code generation, and ESP32 flashing");
              }
            }}
            className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            Features
          </button>
        </nav>

        {/* Right: Dashboard / Download Capsule Button (Matching Reference Image) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLanding}
            className="group flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-zinc-100 text-black font-bold text-xs sm:text-sm font-outfit shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Return to Landing Page Dashboard"
          >
            <span>Dashboard</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col justify-between w-full max-w-5xl mx-auto px-4 sm:px-6 relative z-10 py-6 sm:py-10">
        
        {/* ================= VIEW 1: HERO VIEW (EXACT MATCH OF UPLOADED SCREENSHOT) ================= */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6 sm:py-12">
            
            {/* Monumental Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-outfit leading-[1.08]">
              <span className="text-white block">Turn ideas into</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 block mt-1">
                working circuits.
              </span>
            </h1>

            {/* Subhead narrative */}
            <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl text-center mx-auto leading-relaxed mt-4 font-normal px-4">
              Tell Blinky what you want to connect. Get instant schematics, interactive simulations, and ready-to-flash firmware.
            </p>

            {/* Glowing 3D Mascot in Center */}
            <div className="relative my-8 sm:my-11 flex items-center justify-center">
              {/* Backglow Aura */}
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-600/25 to-red-500/15 blur-3xl pointer-events-none" />
              <img
                src="/blinky-mascot.png"
                alt="Blinky Mascot"
                className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_15px_35px_rgba(249,115,22,0.45)] hover:scale-110 hover:-rotate-3 transition-transform duration-300 cursor-pointer select-none"
                onClick={() => inputRef.current?.focus()}
                title="Blinky AI Mascot"
              />
            </div>

            {/* Wide Input Capsule (Matching Reference Screenshot) */}
            <div className="w-full max-w-2xl mx-auto mt-2">
              <div className="relative rounded-full bg-[#121118]/90 border border-zinc-800/80 hover:border-zinc-700 focus-within:border-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 transition-all backdrop-blur-2xl">
                
                {/* Camera Scan Button */}
                <button
                  type="button"
                  onClick={() => setShowCameraScanner(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-all flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95 border border-white/[0.05]"
                  title="Scan hardware components with Phone Link or Webcam"
                >
                  <Camera size={17} />
                </button>

                {/* Input Text Box */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the circuit you want to build (e.g. Ultrasonic sensor with buzzer on ESP32)..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm md:text-base placeholder-zinc-500 font-medium px-2"
                  disabled={isLoading}
                />

                {/* Microphone / "OR LISTEN" Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                    isListening
                      ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/[0.08]"
                  }`}
                  title="Voice command (Speech Recognition)"
                >
                  <Mic size={13} className={isListening ? "text-red-400" : "text-zinc-400"} />
                  <span className="hidden sm:inline">OR LISTEN</span>
                </button>

                {/* Submit / Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
              </div>

              {/* Quick Query Starters Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                {QUICK_STARTERS.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(starter.prompt)}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/30 text-[11px] sm:text-xs text-zinc-400 hover:text-amber-300 font-medium transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  >
                    {starter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: ACTIVE CONVERSATION & ALL-IN-ONE HARDWARE WORKSPACE ================= */
          <div className="flex-1 flex flex-col space-y-8 pb-32">
            
            {/* Header Actions for Conversation View */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs sm:text-sm font-bold font-outfit text-zinc-300">
                  Active Circuit Synthesis
                </span>
                {activeProject?.circuit?.title && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    {activeProject.circuit.title}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw size={12} className="text-amber-400" />
                <span>New Project</span>
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="space-y-6">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-2`}
                  >
                    {/* Timestamp & Sender */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 px-1">
                      {isUser ? (
                        <span>You • {msg.timestamp}</span>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Bot size={13} />
                          <span>Blinky AI • {msg.timestamp}</span>
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-[95%] sm:max-w-[85%] text-xs sm:text-sm shadow-xl ${
                        isUser
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-br-xs shadow-orange-500/20"
                          : "bg-[#110e19]/95 border border-white/[0.08] text-zinc-200 rounded-bl-xs shadow-black/80"
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? <p>{msg.text}</p> : renderFormattedText(msg.text)}

                      {/* Component Request Buttons on AI Messages */}
                      {!isUser && (msg.circuitProject || activeProject) && (
                        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400 mr-1 flex items-center gap-1">
                            <Sparkles size={12} className="text-amber-400" />
                            Show Component:
                          </span>

                          <button
                            type="button"
                            onClick={() => handleSend("Show circuit simulation")}
                            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                              visibleComponents.circuit
                                ? "bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white"
                            }`}
                          >
                            <Play size={12} className={visibleComponents.circuit ? "fill-amber-400 text-amber-400" : "text-amber-400"} />
                            <span>{visibleComponents.circuit ? "⚡ Circuit Active" : "⚡ Show Circuit"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSend("Show Arduino code")}
                            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                              visibleComponents.code
                                ? "bg-cyan-500/25 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white"
                            }`}
                          >
                            <Code2 size={12} className="text-cyan-400" />
                            <span>{visibleComponents.code ? "💻 Code Active" : "💻 Show Code"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSend("Flash to ESP32")}
                            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                              visibleComponents.flash
                                ? "bg-orange-500/25 border-orange-500 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white"
                            }`}
                          >
                            <Zap size={12} className={visibleComponents.flash ? "fill-orange-400 text-orange-400" : "text-orange-400"} />
                            <span>{visibleComponents.flash ? "🔥 Flasher Active" : "🔥 Flash ESP32"}</span>
                          </button>
                        </div>
                      )}

                      {/* If Bot message has Suggested Next Steps pills */}
                      {!isUser && msg.suggestedNextSteps?.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex flex-wrap gap-2">
                          {msg.suggestedNextSteps.map((step, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(step)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-zinc-300 hover:text-white transition-all cursor-pointer"
                            >
                              {step}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#110e19]/95 border border-amber-500/25 w-fit shadow-lg">
                  <Loader2 size={18} className="animate-spin text-amber-400" />
                  <span className="text-xs sm:text-sm font-medium text-zinc-300">
                    Blinky is synthesizing circuit, generating firmware, and preparing simulation...
                  </span>
                </div>
              )}
            </div>

            {/* ================= DEDICATED SEPARATE HARDWARE COMPONENTS ================= */}
            {/* Only shown when user specifically asks the AI for circuit, code, or flash */}

            {/* 1. Dedicated Circuit Simulation Component */}
            {visibleComponents.circuit && activeProject?.circuit && (
              <CircuitSimulationCard
                circuit={activeProject.circuit}
                onClose={() => setVisibleComponents((prev) => ({ ...prev, circuit: false }))}
                onOpenCode={() => setVisibleComponents((prev) => ({ ...prev, code: true }))}
                onOpenFlash={() => setVisibleComponents((prev) => ({ ...prev, flash: true }))}
              />
            )}

            {/* 2. Dedicated Code Generation Component */}
            {visibleComponents.code && activeProject?.code && (
              <CodeGenerationCard
                code={activeProject.code}
                circuit={activeProject.circuit}
                boardModel={activeProject.circuit?.board?.model || "ESP32 DevKit V1"}
                onClose={() => setVisibleComponents((prev) => ({ ...prev, code: false }))}
                onOpenCircuit={() => setVisibleComponents((prev) => ({ ...prev, circuit: true }))}
                onOpenFlash={() => setVisibleComponents((prev) => ({ ...prev, flash: true }))}
              />
            )}

            {/* 3. Dedicated Code Flashing Component */}
            {visibleComponents.flash && activeProject?.code && (
              <CodeFlashingCard
                code={activeProject.code}
                circuit={activeProject.circuit}
                onClose={() => setVisibleComponents((prev) => ({ ...prev, flash: false }))}
                onOpenCircuit={() => setVisibleComponents((prev) => ({ ...prev, circuit: true }))}
                onOpenCode={() => setVisibleComponents((prev) => ({ ...prev, code: true }))}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ================= STICKY BOTTOM INPUT CAPSULE (WHEN CHATTING) ================= */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#040306] via-[#040306]/95 to-transparent pt-6 pb-4 px-4 z-30">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Scanned components notification */}
            {scannedComponents.length > 0 && (
              <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                <span className="font-mono font-bold flex items-center gap-1.5">
                  <Camera size={13} />
                  Scanned: {scannedComponents.map((c) => c.name).join(", ")}
                </span>
                <button
                  type="button"
                  onClick={() => setScannedComponents([])}
                  className="text-zinc-400 hover:text-white underline text-[11px]"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Bottom Capsule Input Bar */}
            <div className="relative rounded-full bg-[#121118]/95 border border-zinc-800/80 focus-within:border-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 transition-all backdrop-blur-2xl">
              
              {/* Camera Scanner Trigger */}
              <button
                type="button"
                onClick={() => setShowCameraScanner(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-all flex items-center justify-center shrink-0 cursor-pointer border border-white/[0.05]"
                title="Scan hardware components with camera"
              >
                <Camera size={17} />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Blinky to modify circuit, add sensors, or change code..."
                className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-zinc-500 font-medium px-2"
                disabled={isLoading}
              />

              {/* Microphone / "OR LISTEN" */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                  isListening
                    ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/[0.08]"
                }`}
                title="Voice input"
              >
                <Mic size={13} className={isListening ? "text-red-400" : "text-zinc-400"} />
                <span className="hidden sm:inline">OR LISTEN</span>
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUICK ACTIONS MODAL ================= */}
      {showQuickActionsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#120e1c] border border-amber-500/30 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-outfit text-white flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                Quick Actions
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickActionsModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionsModal(false);
                  setShowCameraScanner(true);
                }}
                className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer text-zinc-200 hover:text-white"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Camera size={16} />
                </div>
                <div>
                  <div className="font-bold">Scan Physical Hardware</div>
                  <div className="text-[11px] text-zinc-400">Identify components via Phone Link or camera</div>
                </div>
              </button>

              {QUICK_STARTERS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setShowQuickActionsModal(false);
                    handleSend(s.prompt);
                  }}
                  className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer text-zinc-200 hover:text-white"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="font-bold">{s.label}</div>
                    <div className="text-[11px] text-zinc-400">{s.prompt.slice(0, 48)}...</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
