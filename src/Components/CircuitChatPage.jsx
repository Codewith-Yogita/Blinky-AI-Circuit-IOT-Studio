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
} from "lucide-react";
import { sendChatMessage } from "../services/chatAssistant";
import ComponentCameraScanner from "./ComponentCameraScanner";

const BASE_EXAMPLE_QUERIES = [
  "Blink an LED on ESP32 GPIO2 every second",
  "HC-SR04 ultrasonic distance alarm with buzzer & alert LED",
  "Dual-axis analog joystick controlling two servo motors",
  "How does an LDR voltage divider circuit work on ESP32?",
  "Why do tactile buttons need a pull-up resistor or INPUT_PULLUP?",
  "I2C SSD1306 OLED display pinouts and telemetry code",
];

export default function CircuitChatPage({
  initialQuery = "",
  onBackToLanding,
  onLaunchStudioWithProject,
  onOpenStudio,
  theme,
  toggleTheme,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [scannedComponents, setScannedComponents] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const hasAutoSentRef = useRef(false);
  const isDark = theme === "dark";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle auto-resizing textarea
  const handleTextareaChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    // Reset input
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      scannedParts: [...scannedComponents],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend, messages, scannedComponents);

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
      console.error("Chat error:", err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I encountered an error while synthesizing your circuit. Please verify the hardware description and try again.",
        circuitProject: null,
        suggestedNextSteps: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
  };

  const handleApplyScannedHardware = ({ components }) => {
    setScannedComponents(components);
    const names = components.map((c) => c.name).join(", ");
    setInputValue(
      `I scanned my components: ${names}. Build a complete circuit with simulation and step-by-step wiring instructions.`
    );
  };

  // Auto-send initial query if transferred from floating chat widget
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  // Helper to format bot markdown text cleanly
  const renderFormattedText = (rawText) => {
    const lines = rawText.split("\n");
    return (
      <div className="space-y-3 leading-relaxed text-sm sm:text-base">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold text-amber-300 mt-2 mb-1">
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("#### ")) {
            return (
              <h4 key={idx} className="text-sm sm:text-base font-semibold text-zinc-200 mt-2 mb-0.5">
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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#080709] text-zinc-100" : "bg-[#fbf9f6] text-zinc-900"
      } flex flex-col antialiased selection:bg-amber-500/30 selection:text-white w-full`}
    >
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/10 via-orange-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Camera Scanner Modal Component */}
      <ComponentCameraScanner
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onApplyToChat={handleApplyScannedHardware}
      />

      {/* ================= HEADER BAR ================= */}
      <header
        className={`sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 border-b backdrop-blur-xl flex items-center justify-between transition-colors duration-300 ${
          isDark
            ? "bg-[#080709]/90 border-white/[0.08]"
            : "bg-[#fbf9f6]/90 border-amber-900/10 shadow-sm"
        }`}
      >
        {/* Left: Brand + Navigation to Landing */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onBackToLanding}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold font-outfit text-zinc-300 hover:text-white transition-all duration-300 py-1 cursor-pointer hover:scale-105 active:scale-95"
            title="Return to Landing Page"
          >
            <ArrowLeft
              size={15}
              className="text-amber-400 transition-transform duration-300 group-hover:-translate-x-1.5"
            />
            <span className="relative">
              Dashboard
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </span>
          </button>

          <div
            className={`flex items-center gap-2.5 cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 ${
              isDark
                ? "py-0.5"
                : "bg-[#0d0a14] px-2.5 py-1 rounded-xl shadow-sm border border-amber-500/20"
            }`}
            onClick={onBackToLanding}
          >
            <img
              src="/blinky-logo-text.png"
              alt="Blinky Logo"
              className="h-6 sm:h-7.5 w-auto object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            />
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
              AI Chat
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Direct Camera Button in Header */}
          <button
            type="button"
            onClick={() => setShowCameraScanner(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold font-outfit transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95"
            title="Scan physical components via Phone Link or Webcam"
          >
            <Camera size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Scan Hardware</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Start a new chat session"
            >
              <RefreshCw size={13} className="text-amber-400" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {/* Jump to Studio */}
          <button
            type="button"
            onClick={onOpenStudio}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 hover:text-white text-xs font-bold font-outfit transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Open Circuit Studio Workspace"
          >
            <CircuitBoard size={14} className="text-amber-400" />
            <span>Circuit Studio</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-zinc-400 hover:text-amber-400 hover:scale-110 active:scale-90 transition-all cursor-pointer"
            title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-500" />
            ) : (
              <Moon className="w-4 h-4 text-amber-600 hover:-rotate-45 transition-transform duration-500" />
            )}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col justify-between w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10 py-6 sm:py-8">
        
        {/* VIEW 1: EMPTY / INITIAL STATE (MATCHING USER SCREENSHOT) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10">
            {/* Title & Subtitle */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-outfit text-white drop-shadow-md">
                Investigate Your Circuit
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Scan your physical components or describe your desired circuit. We calculate pinouts,
                verify electrical safety, synthesize live schematics, and flash production Arduino C++ to your ESP32.
              </p>
            </div>

            {/* Mascot Perched on Top of Chatbar */}
            <div className="flex justify-center -mb-5 z-20">
              <div
                className="relative group cursor-pointer transition-transform duration-300 hover:scale-110"
                onClick={() => textareaRef.current?.focus()}
                title="Blinky AI Mascot"
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/blinky-mascot.png"
                  alt="Blinky Mascot"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl hover:-rotate-3 transition-transform"
                />
              </div>
            </div>

            {/* Central Chatbox Container (Matching user reference layout) */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="relative rounded-2xl sm:rounded-3xl bg-[#13111a]/95 border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.06)] focus-within:border-amber-500/50 focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.18)] transition-all p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[160px]">
                
                {/* Active Scanned Hardware Pill Tray */}
                {scannedComponents.length > 0 && (
                  <div className="flex items-center justify-between px-3 py-1.5 mb-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                      <span className="font-mono font-bold flex items-center gap-1 shrink-0 text-emerald-400">
                        <Camera size={13} />
                        Scanned Hardware ({scannedComponents.length}):
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {scannedComponents.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-black/40 text-[11px] font-mono border border-amber-500/20 text-zinc-200"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScannedComponents([])}
                      className="text-zinc-400 hover:text-white text-[11px] underline ml-2 shrink-0 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    scannedComponents.length > 0
                      ? "Tell me what circuit to build with your scanned components..."
                      : "Describe an IoT project, or click 'Scan Camera' to auto-detect hardware..."
                  }
                  className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-sm sm:text-base resize-none font-medium leading-relaxed"
                  rows={2}
                  disabled={isLoading}
                />

                {/* Bottom Bar inside Chatbox */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] mt-2 gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Mascot on Chatbar */}
                    <img
                      src="/blinky-mascot.png"
                      alt="Blinky Mascot"
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-md select-none hover:rotate-12 transition-transform cursor-pointer"
                      title="Blinky Mascot"
                      onClick={() => textareaRef.current?.focus()}
                    />

                    {/* Camera Scanner Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowCameraScanner(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95 shrink-0"
                      title="Scan components with webcam or phone link"
                    >
                      <Camera size={14} className="text-amber-400" />
                      <span>Scan Camera</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 select-none">
                      <Sparkles size={13} className="text-amber-400 shrink-0" />
                      <span>Press Enter to synthesize</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className="group relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs sm:text-sm font-outfit shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-amber-200" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <span>Investigate &amp; Build</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Example Demo Queries Section (Matching user reference layout) */}
              <div className="mt-8 text-left">
                <div className="text-[11px] font-mono font-bold tracking-widest text-zinc-500 uppercase mb-3 px-1">
                  Or Try An Example Demo Query:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCameraScanner(true)}
                    className="px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_16px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera size={13} className="text-amber-400" />
                    <span>Scan physical components with camera</span>
                  </button>

                  {BASE_EXAMPLE_QUERIES.map((query, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(query)}
                      className="px-3.5 py-2 rounded-full bg-[#16121f]/90 hover:bg-[#201830] border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-white text-xs font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_16px_rgba(245,158,11,0.18)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-left"
                    >
                      &ldquo;{query}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ACTIVE CONVERSATION STREAM (CHATGPT STYLE) */
          <div className="flex-1 flex flex-col justify-between w-full">
            <div className="space-y-6 pb-32">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 sm:gap-4 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        : "bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    }`}
                  >
                    {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                      msg.sender === "user"
                        ? "bg-[#1f192b] text-zinc-100 border border-amber-500/20"
                        : "bg-[#13111a]/95 text-zinc-200 border border-zinc-800/90"
                    }`}
                  >
                    {/* Timestamp & Sender */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                      <span className="font-bold text-amber-400/90">
                        {msg.sender === "user" ? "You" : "Blinky AI Architect"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Scanned Badge on User Bubble */}
                    {msg.scannedParts?.length > 0 && (
                      <div className="mb-2 text-[11px] font-mono text-amber-300 bg-black/30 px-2 py-1 rounded-md border border-amber-500/20">
                        📷 Attached Scanned Components: {msg.scannedParts.map((p) => p.name).join(", ")}
                      </div>
                    )}

                    {/* Formatted Content */}
                    <div className="text-zinc-200">
                      {msg.sender === "user" ? (
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}
                    </div>

                    {/* Integrated Synthesized Circuit & Flash Action Card */}
                    {msg.circuitProject && (
                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#1a1224] to-[#100b17] border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                              Simulation &amp; Firmware Ready
                            </span>
                          </div>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                            {msg.circuitProject.circuit?.board?.model || "ESP32 DevKit V1"}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                          The interactive Wokwi simulation schematic and production Arduino C++ firmware have been verified.
                        </p>

                        {/* Dual Action Buttons: Interactive Simulation OR Direct Flash */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => onLaunchStudioWithProject(msg.circuitProject, "circuit")}
                            className="group flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs sm:text-sm font-outfit shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_24px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                          >
                            <Play size={15} className="fill-white" />
                            <span>Run Live Simulation</span>
                            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onLaunchStudioWithProject(msg.circuitProject, "flash")}
                            className="group flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#231735] hover:bg-[#2c1d42] border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs sm:text-sm font-outfit shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                          >
                            <Terminal size={15} />
                            <span>Flash to Physical ESP32</span>
                            <Zap size={13} className="text-amber-400" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Suggested Next Steps Chips */}
                    {msg.suggestedNextSteps?.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                        {msg.suggestedNextSteps.map((step, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (step.includes("Open in Circuit Studio") && msg.circuitProject) {
                                onLaunchStudioWithProject(msg.circuitProject, "circuit");
                              } else {
                                handleSend(step);
                              }
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/[0.06] text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            ↳ {step}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-2xl p-4 bg-[#13111a]/95 border border-zinc-800/90 text-zinc-300 flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                    <span className="text-xs sm:text-sm font-medium">
                      Consulting hardware rules, synthesizing pinouts &amp; verifying schematic...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Pinned Bottom Chatbar (ChatGPT Style) */}
            <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#080709] via-[#080709]/95 to-transparent pt-6 pb-4 px-4 z-30">
              <div className="max-w-4xl mx-auto space-y-2">
                
                {/* Active Scanned Hardware Pill Tray on bottom chatbar */}
                {scannedComponents.length > 0 && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#13111a]/95 border border-amber-500/30 text-amber-300 text-xs shadow-lg">
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                      <span className="font-mono font-bold flex items-center gap-1 shrink-0 text-emerald-400">
                        <Camera size={13} />
                        Scanned Hardware ({scannedComponents.length}):
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {scannedComponents.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-black/40 text-[11px] font-mono border border-amber-500/20 text-zinc-200"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScannedComponents([])}
                      className="text-zinc-400 hover:text-white text-[11px] underline ml-2 shrink-0 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="relative rounded-2xl bg-[#13111a]/95 border border-zinc-800 focus-within:border-amber-500/40 p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5">
                  {/* Mascot on Bottom Chatbar */}
                  <div className="relative shrink-0 group">
                    <img
                      src="/blinky-mascot.png"
                      alt="Blinky Mascot"
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md select-none group-hover:scale-110 group-hover:-rotate-6 transition-transform cursor-pointer"
                      title="Blinky AI Mascot"
                      onClick={() => textareaRef.current?.focus()}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
                  </div>

                  {/* Camera Scanner Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowCameraScanner(true)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 font-bold text-xs"
                    title="Scan components with camera (Phone Link / Webcam)"
                  >
                    <Camera size={16} />
                    <span className="hidden sm:inline">Scan</span>
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up or request modifications (e.g. 'Can we add a push button?')..."
                    className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm resize-none font-medium max-h-[120px]"
                    rows={1}
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs font-outfit shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    title="Send message"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="hidden sm:inline">Send</span>
                        <Send size={14} />
                      </div>
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-zinc-400 font-mono">
                  Blinky AI verifies electronic design constraints, generates Wokwi simulations, and writes Arduino C++.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
