import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Maximize2,
  Sparkles,
  Camera,
  Cpu,
  Zap,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Bot,
  Play,
  CheckCircle2,
} from "lucide-react";
import { sendChatMessage } from "../services/chatAssistant";
import ComponentCameraScanner from "./ComponentCameraScanner";

const QUICK_SUGGESTIONS = [
  "💡 Water level alarm with buzzer",
  "📷 Scan my desk components",
  "HC-SR04 ultrasonic distance sensor",
  "⚡ ESP32 GPIO pinout & safety",
];

export default function FloatingChatWidget({
  onOpenFullChat,
  onLaunchStudioWithProject,
  theme = "dark",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: `### 👋 Hey there! I'm Blinky AI
I can design IoT circuits, generate Arduino C++ firmware, and flash directly to your ESP32.

What would you like to build or wire today?`,
      circuitProject: null,
      suggestedNextSteps: QUICK_SUGGESTIONS,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedComponents, setScannedComponents] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isDark = theme === "dark";

  // Auto-scroll when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowCallout(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async (customText = null) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    // Check if user specifically requested camera scan
    if (textToSend.toLowerCase().includes("scan") && textToSend.toLowerCase().includes("desk")) {
      setShowScanner(true);
      setInputValue("");
      return;
    }

    setInputValue("");

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
      console.error("Floating chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `⚠️ **Error**: Failed to generate a response. Please check your network connection and try again.`,
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

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `### 🔄 Chat Reset\nReady for your next circuit idea! Ask me anything or scan hardware on your desk.`,
        suggestedNextSteps: QUICK_SUGGESTIONS,
        timestamp: "Just now",
      },
    ]);
  };

  // When components are scanned from camera
  const handleApplyScannedComponents = (components) => {
    setScannedComponents(components);
    setShowScanner(false);

    const partsList = components.map((c) => c.name).join(", ");
    const autoPrompt = `Build an ESP32 circuit using scanned components: ${partsList}`;
    handleSend(autoPrompt);
  };

  return (
    <>
      {/* ================= FLOATING CHAT CARD (DRAWER) ================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Blinky AI Chatbot"
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7.5rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6),0_0_35px_rgba(249,115,22,0.2)] border transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 ${
            isDark
              ? "bg-[#0d0b12]/95 border-amber-500/25 text-zinc-100 backdrop-blur-2xl"
              : "bg-white/95 border-amber-500/30 text-zinc-900 backdrop-blur-2xl shadow-2xl"
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3.5 border-b flex items-center justify-between shrink-0 ${
              isDark
                ? "bg-[#14101d]/90 border-white/[0.08]"
                : "bg-amber-50/80 border-amber-900/10"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Bot Icon */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/blinky-mascot.png"
                      alt="Blinky Bot"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                </div>
                {/* Active pulse dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0d0b12] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-outfit text-zinc-100 dark:text-zinc-100">
                    Blinky AI
                  </h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Copilot
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Circuit & Firmware Synthesizer
                </p>
              </div>
            </div>

            {/* Actions: Expand to Full Screen / Reset / Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenFullChat) {
                    onOpenFullChat(inputValue);
                  }
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/10"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                }`}
                title="Expand to Full Page AI Chat"
              >
                <Maximize2 size={16} />
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/10"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                }`}
                title="Restart Conversation"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/10"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                }`}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            className={`flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-[13px] leading-relaxed select-text ${
              isDark ? "bg-[#0a080f]/70" : "bg-[#fcfbf9]/80"
            }`}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 px-1">
                    <span>{isUser ? "You" : "Blinky"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 max-w-[90%] break-words ${
                      isUser
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-br-xs shadow-md shadow-orange-500/20"
                        : isDark
                        ? "bg-[#181324] border border-white/[0.08] text-zinc-200 rounded-bl-xs shadow-sm"
                        : "bg-white border border-amber-900/10 text-zinc-800 rounded-bl-xs shadow-sm"
                    }`}
                  >
                    {/* Markdown rendering simulation */}
                    <div className="space-y-2">
                      {msg.text.split("\n\n").map((paragraph, pIdx) => {
                        if (paragraph.startsWith("### ")) {
                          return (
                            <h4
                              key={pIdx}
                              className="font-bold text-sm text-amber-400 dark:text-amber-300 mt-0.5"
                            >
                              {paragraph.replace("### ", "")}
                            </h4>
                          );
                        }
                        if (paragraph.startsWith("#### ")) {
                          return (
                            <h5
                              key={pIdx}
                              className="font-semibold text-xs text-orange-400 mt-2"
                            >
                              {paragraph.replace("#### ", "")}
                            </h5>
                          );
                        }
                        if (paragraph.startsWith("- ")) {
                          return (
                            <ul key={pIdx} className="list-disc pl-4 space-y-1 text-zinc-300">
                              {paragraph.split("\n").map((line, lIdx) => (
                                <li key={lIdx}>{line.replace(/^-\s*/, "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={pIdx}>{paragraph}</p>;
                      })}
                    </div>

                    {/* Synthesized Circuit Card */}
                    {msg.circuitProject && (
                      <div className="mt-3 pt-3 border-t border-white/10 dark:border-white/10">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <Cpu size={14} className="text-amber-400" />
                              {msg.circuitProject.circuit?.board?.model || "ESP32 Circuit"}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                              Simulation Ready
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-300 mb-3">
                            Hardware synthesized with Arduino C++ sketch and complete netlist.
                          </p>

                          <div className="flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                if (onLaunchStudioWithProject) {
                                  onLaunchStudioWithProject(msg.circuitProject, "circuit");
                                }
                              }}
                              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
                            >
                              <Play size={13} fill="currentColor" />
                              <span>Open in Studio Simulator</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                if (onLaunchStudioWithProject) {
                                  onLaunchStudioWithProject(msg.circuitProject, "flash");
                                }
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-[11px] flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer transition-colors"
                            >
                              <Zap size={12} className="text-amber-400" />
                              <span>Flash Directly to ESP32</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-zinc-400 py-2 px-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-fit">
                <Loader2 size={15} className="animate-spin text-amber-400" />
                <span className="text-xs font-medium">Blinky is synthesizing circuit...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
              isDark ? "bg-[#110e19] border-white/[0.06]" : "bg-amber-50/50 border-amber-900/10"
            }`}
          >
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(suggestion)}
                className={`text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-white"
                    : "bg-white border-amber-900/10 text-zinc-700 hover:bg-amber-100 hover:border-amber-500/40"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Scanned Components Active Indicator */}
          {scannedComponents.length > 0 && (
            <div className="px-3 py-1 bg-amber-500/15 border-t border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {scannedComponents.length} components scanned via camera
              </span>
              <button
                type="button"
                onClick={() => setScannedComponents([])}
                className="text-[10px] underline hover:text-white"
              >
                Clear
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div
            className={`p-3 border-t flex items-center gap-2 shrink-0 ${
              isDark ? "bg-[#14101d] border-white/[0.08]" : "bg-white border-amber-900/10"
            }`}
          >
            {/* Mascot on Chatbar */}
            <div
              className="shrink-0 cursor-pointer group"
              onClick={() => inputRef.current?.focus()}
              title="Blinky AI Mascot"
            >
              <img
                src="/blinky-mascot.png"
                alt="Blinky Mascot"
                className="w-7 h-7 object-contain drop-shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform select-none"
              />
            </div>

            {/* Camera Scanner Trigger */}
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark
                  ? "bg-white/5 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-400 border border-white/10"
                  : "bg-zinc-100 hover:bg-amber-100 text-zinc-600 hover:text-amber-600 border border-zinc-200"
              }`}
              title="Scan Components via Phone Link or Webcam"
            >
              <Camera size={16} />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Blinky or describe a circuit..."
                disabled={isLoading}
                className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                  isDark
                    ? "bg-[#0c0a12] border-white/10 text-zinc-100 placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400"
                }`}
              />
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= FLOATING CALLOUT WELCOME BUBBLE ================= */}
      {!isOpen && showCallout && (
        <div
          className={`fixed bottom-24 right-5 sm:right-7 z-50 p-3.5 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.45)] border backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-[260px] ${
            isDark
              ? "bg-[#14101e]/95 border-amber-500/30 text-zinc-200"
              : "bg-white/95 border-amber-500/40 text-zinc-800 shadow-xl"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400 animate-spin-slow" />
              Blinky AI Assistant
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCallout(false);
              }}
              className="text-zinc-400 hover:text-zinc-200 p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
          <p className="text-[11px] leading-snug text-zinc-300 dark:text-zinc-300 mb-2">
            Need circuit wiring advice or want to scan hardware components? Click to chat!
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group cursor-pointer"
          >
            <span>Ask Blinky</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ================= THE FLOATING BOT BUTTON (MATCHING USER'S IMAGE) ================= */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center group">
        {/* Tooltip on hover when closed */}
        {!isOpen && (
          <div
            className={`hidden md:block mr-3 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 ${
              isDark
                ? "bg-[#120e1c] border-amber-500/30 text-amber-300 shadow-black/50"
                : "bg-white border-amber-500/30 text-amber-700 shadow-amber-500/10"
            }`}
          >
            Chat with Blinky AI
          </div>
        )}

        {/* The Circular Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close Blinky AI Chatbot" : "Open Blinky AI Chatbot"}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center p-[3.5px] ${
            isOpen
              ? "bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 shadow-[0_8px_30px_rgba(249,115,22,0.6)] rotate-90"
              : "bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-[0_8px_30px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_45px_rgba(249,115,22,0.7)]"
          }`}
        >
          {/* Inner white circle like user image */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden shadow-inner">
            {isOpen ? (
              // When open, display crisp close X inside
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 text-white -rotate-90 transition-transform">
                <X size={26} strokeWidth={2.8} />
              </div>
            ) : (
              // When closed: 3D Blinky Mascot!
              <div className="w-full h-full flex items-center justify-center p-1.5 relative">
                <img
                  src="/blinky-mascot.png"
                  alt="Blinky Mascot"
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm transition-transform group-hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Pulse notification badge */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#080709] animate-pulse shadow-md" />
          )}
        </button>
      </div>

      {/* ================= COMPONENT CAMERA SCANNER MODAL ================= */}
      <ComponentCameraScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onApplyToChat={handleApplyScannedComponents}
      />
    </>
  );
}
