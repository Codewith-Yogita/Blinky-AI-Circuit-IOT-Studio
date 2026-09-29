import { singleLedCircuit, dualLedButtonCircuit, joystickLedCircuit } from "../data/mockCircuits";

// Configurable FastAPI backend base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

/**
 * Validates and sanitizes the backend response to ensure frontend components never crash.
 */
function sanitizeProjectResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response received from backend AI agent.");
  }

  // Support both nested circuit: { ... } or top-level board/components
  const rawCircuit = data.circuit || data;

  const board = rawCircuit.board || {
    id: "esp32",
    type: "ESP32",
    model: "ESP32 DevKit V1",
  };

  const components = Array.isArray(rawCircuit.components)
    ? rawCircuit.components.map((c, i) => ({
        id: c.id || `comp_${i + 1}`,
        type: c.type || "generic",
        name: c.name || c.id || "Electronic Component",
        ...c,
      }))
    : [];

  const connections = Array.isArray(rawCircuit.connections)
    ? rawCircuit.connections.filter(
        (conn) =>
          conn &&
          conn.from &&
          conn.from.component &&
          conn.from.pin &&
          conn.to &&
          conn.to.component &&
          conn.to.pin
      )
    : [];

  const code =
    typeof data.code === "string" && data.code.trim().length > 0
      ? data.code
      : "// No Arduino C++ code returned by the backend.";

  const instructions = Array.isArray(data.instructions)
    ? data.instructions
    : typeof data.instructions === "string"
    ? data.instructions.split("\n").filter((line) => line.trim().length > 0)
    : [
        "1. Place your ESP32 DevKit V1 securely onto the breadboard.",
        "2. Connect component pins exactly as highlighted in the interactive schematic.",
        "3. Review the generated Arduino sketch and flash it to the board.",
      ];

  return {
    circuit: {
      board,
      components,
      connections,
    },
    code,
    instructions,
    rawBackendData: data,
  };
}

/**
 * Generates an IoT project (circuit + code + instructions) from user natural language prompt.
 *
 * NOTE FOR BACKEND TEAMMATE:
 * Expected Endpoint: POST /api/generate
 * Request Body:
 * {
 *   "prompt": string,
 *   "board": string (e.g. "ESP32")
 * }
 * Response Body:
 * {
 *   "circuit": {
 *      "board": { "id": "esp32", "type": "ESP32", "model": "ESP32 DevKit V1" },
 *      "components": [ { "id": "resistor_1", "type": "resistor", "name": "220Ω Resistor" }, ... ],
 *      "connections": [ { "from": { "component": "esp32", "pin": "GPIO2" }, "to": { "component": "resistor_1", "pin": "1" } } ]
 *   },
 *   "code": "// Arduino C++ string ...",
 *   "instructions": ["Step 1...", "Step 2..."]
 * }
 */
export async function generateProject({ prompt, board = "ESP32" }) {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("Please enter a description for your IoT project.");
  }

  // If forced mock mode is configured in .env
  if (FORCE_MOCK) {
    console.info("[API Service] FORCE_MOCK is active. Using simulated response.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return resolveMockProject(prompt);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        board,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Backend API error (${response.status}): ${
          errorText || response.statusText || "Server failed to process request"
        }`
      );
    }

    const data = await response.json();
    return sanitizeProjectResponse(data);
  } catch (error) {
    // Check if network failed (FastAPI server is not currently running)
    const isNetworkError =
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError") ||
      error.name === "TypeError";

    if (isNetworkError) {
      console.warn(
        `[API Service] Could not connect to FastAPI at ${API_BASE_URL}. Falling back to dynamic mock generator for hackathon demo resilience.`
      );
      // Fallback to simulated AI response for demo continuity
      await new Promise((resolve) => setTimeout(resolve, 700));
      const mockResult = resolveMockProject(prompt);
      return {
        ...mockResult,
        isMockFallback: true,
        networkWarning: `FastAPI server at ${API_BASE_URL} is unreachable. Displaying simulated AI result.`,
      };
    }

    throw error;
  }
}

/**
 * Dynamic mock resolver based on user input keywords
 */
function resolveMockProject(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("joy") || lower.includes("joystick") || lower.includes("stick")) {
    return sanitizeProjectResponse(joystickLedCircuit);
  }

  if (lower.includes("button") || lower.includes("switch") || lower.includes("press")) {
    return sanitizeProjectResponse({
      ...dualLedButtonCircuit,
      instructions: [
        "1. Mount the ESP32 and tactile push button onto the breadboard.",
        "2. Connect tactile button terminal 1 to ESP32 GPIO4.",
        "3. Connect button terminal 2 directly to ESP32 GND (internal pull-up enabled in sketch).",
        "4. Connect current-limiting 220Ω resistor from GPIO2 to the LED anode A (+).",
        "5. Complete the loop by connecting the LED cathode K (-) to ESP32 GND.",
      ],
    });
  }

  // Default LED Blink circuit
  return sanitizeProjectResponse({
    ...singleLedCircuit,
    instructions: [
      "1. Place the ESP32 DevKit V1 onto the center of your breadboard.",
      "2. Connect a jumper wire from ESP32 GPIO2 to one leg of the 220Ω resistor.",
      "3. Connect the other leg of the resistor to the LED's longer lead (Anode, +).",
      "4. Connect the shorter lead of the LED (Cathode, -) directly to any ESP32 GND pin.",
      "5. Connect the ESP32 to your laptop via Micro-USB and upload the generated sketch.",
    ],
  });
}
