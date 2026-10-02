import { useState, useEffect } from "react";
import "./App.css";

import LandingPage from "./Components/LandingPage";
import CircuitChatPage from "./Components/CircuitChatPage";
import FloatingChatWidget from "./Components/FloatingChatWidget";
import {
  waterLevelAlarmCircuit,
  singleLedCircuit,
  dualLedButtonCircuit,
  joystickLedCircuit,
  oledDisplayCircuit,
} from "./data/mockCircuits";
import { generateProject } from "./services/api";

function App() {
  const [currentProject, setCurrentProject] = useState({
    circuit: waterLevelAlarmCircuit,
    code: waterLevelAlarmCircuit.code,
    instructions: waterLevelAlarmCircuit.instructions,
  });

  // Only 2 Pages: 'landing' (Landing Page) & 'chat' (All-in-One Circuit Chatbot Page)
  const [viewMode, setViewMode] = useState("landing");
  const [chatInitialQuery, setChatInitialQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blinky-theme") || "dark";
  });

  // Sync theme across entire app
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("blinky-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Switch between presets and transition directly to Chatbot Page
  const handleSelectPreset = (presetKey) => {
    if (presetKey === "flagship") {
      setCurrentProject({
        circuit: waterLevelAlarmCircuit,
        code: waterLevelAlarmCircuit.code,
        instructions: waterLevelAlarmCircuit.instructions,
      });
    } else if (presetKey === "preset1") {
      setCurrentProject({
        circuit: singleLedCircuit,
        code: singleLedCircuit.code,
        instructions: [
          "1. Place the ESP32 DevKit V1 onto the center of your breadboard.",
          "2. Connect a jumper wire from ESP32 GPIO2 to one leg of the 220Ω resistor.",
          "3. Connect the other leg of the resistor to the LED's longer lead (Anode, +).",
          "4. Connect the shorter lead of the LED (Cathode, -) directly to any ESP32 GND pin.",
          "5. Connect the ESP32 to your laptop via Micro-USB and upload the generated sketch.",
        ],
      });
    } else if (presetKey === "preset2") {
      setCurrentProject({
        circuit: dualLedButtonCircuit,
        code: dualLedButtonCircuit.code,
        instructions: [
          "1. Mount the ESP32 and tactile push button onto the breadboard.",
          "2. Connect tactile button terminal 1 to ESP32 GPIO4.",
          "3. Connect button terminal 2 directly to ESP32 GND (internal pull-up enabled in sketch).",
          "4. Connect current-limiting 220Ω resistor from GPIO2 to the LED anode A (+).",
          "5. Complete the loop by connecting the LED cathode K (-) to ESP32 GND.",
        ],
      });
    } else if (presetKey === "preset3" || presetKey === "joystick") {
      setCurrentProject({
        circuit: joystickLedCircuit,
        code: joystickLedCircuit.code,
        instructions: joystickLedCircuit.instructions,
      });
    } else if (presetKey === "oled_display") {
      setCurrentProject({
        circuit: oledDisplayCircuit,
        code: oledDisplayCircuit.code,
        instructions: oledDisplayCircuit.instructions,
      });
    }

    setChatInitialQuery("");
    setViewMode("chat");
  };

  // Handle generation triggered by Landing Page prompts
  const handleGenerate = async (promptText) => {
    setIsLoading(true);
    setChatInitialQuery(promptText || "");
    setViewMode("chat");

    try {
      const result = await generateProject({
        prompt: promptText,
        board: "ESP32",
      });
      setCurrentProject(result);
    } catch (err) {
      console.warn("Project generation fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= PAGE 1: LANDING PAGE =================
  if (viewMode === "landing") {
    return (
      <>
        <LandingPage
          onLaunchStudio={() => {
            setChatInitialQuery("");
            setViewMode("chat");
          }}
          onOpenChat={() => {
            setChatInitialQuery("");
            setViewMode("chat");
          }}
          onSelectPreset={(presetKey) => {
            handleSelectPreset(presetKey);
          }}
          onGeneratePrompt={(promptText) => {
            handleGenerate(promptText);
          }}
          onOpenStage={() => {
            setViewMode("chat");
          }}
          isLoading={isLoading}
        />

        {/* Floating Chatbot Side Button */}
        <FloatingChatWidget
          onOpenFullChat={(initialPrompt) => {
            setChatInitialQuery(initialPrompt || "");
            setViewMode("chat");
          }}
          onLaunchStudioWithProject={(project) => {
            setCurrentProject(project);
            setViewMode("chat");
          }}
          theme={theme}
        />
      </>
    );
  }

  // ================= PAGE 2: ALL-IN-ONE CIRCUIT CHATBOT PAGE =================
  return (
    <CircuitChatPage
      initialQuery={chatInitialQuery}
      currentProject={currentProject}
      onBackToLanding={() => setViewMode("landing")}
      onUpdateProject={(project) => setCurrentProject(project)}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;