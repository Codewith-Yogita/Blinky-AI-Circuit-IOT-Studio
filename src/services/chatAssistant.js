import { generateProject, sendMultimodalAiChat } from "./api";
import {
  waterLevelAlarmCircuit,
  singleLedCircuit,
  dualLedButtonCircuit,
  joystickLedCircuit,
  oledDisplayCircuit,
} from "../data/mockCircuits";

/**
 * Knowledge base for electronics & IoT conceptual questions
 */
const CIRCUIT_KNOWLEDGE_BASE = [
  {
    triggers: ["ldr", "light sensor", "photoresistor", "voltage divider"],
    title: "LDR (Light Dependent Resistor) Voltage Divider Circuit",
    content: `### 🌞 How an LDR Voltage Divider Works on ESP32

An **LDR (Light Dependent Resistor)** changes its resistance based on ambient light:
- **In bright light**: Resistance drops significantly (down to ~1kΩ–5kΩ).
- **In darkness**: Resistance skyrockets (up to 1MΩ or more).

#### 1. Why You Need a Voltage Divider
Microcontrollers like the **ESP32** cannot measure pure resistance directly; their **ADC (Analog-to-Digital Converter)** pins can only measure **voltage (0V to 3.3V)**. By placing the LDR in series with a fixed resistor (typically **10kΩ**) between **3.3V** and **GND**, you create a voltage divider:

$$\\text{V}_{\\text{out}} = 3.3\\text{V} \\times \\left(\\frac{R_{\\text{fixed}}}{R_{\\text{LDR}} + R_{\\text{fixed}}}\\right)$$

#### 2. ESP32 Pin Connections
| Component Pin | ESP32 Pin | Purpose |
| :--- | :--- | :--- |
| **LDR Pin 1** | **3V3** | Power supply (3.3V) |
| **LDR Pin 2** | **GPIO34 / GPIO36 (ADC1)** | Midpoint voltage signal |
| **10kΩ Resistor Pin 1** | **GPIO34 / GPIO36** | Connected to LDR Pin 2 |
| **10kΩ Resistor Pin 2** | **GND** | Ground reference |

#### 3. Recommended Firmware Snippet
\`\`\`cpp
#define LDR_PIN 34 // ADC1 pin (recommended with Wi-Fi active)

void setup() {
  Serial.begin(115200);
  analogReadResolution(12); // 0-4095 reading
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  Serial.print("Ambient Light ADC: ");
  Serial.println(lightLevel);
  delay(500);
}
\`\`\``,
  },
  {
    triggers: ["pullup", "pull-up", "pulldown", "floating", "button debounc", "input_pullup"],
    title: "Push Button Pull-Up Resistors & Debouncing",
    content: `### 🔘 Push Buttons: Why Pull-Up Resistors are Essential

When an ESP32 GPIO is configured as a standard \`INPUT\` and the tactile button is not pressed, the pin is electrically disconnected from everything. This creates a **floating state**, where electrical noise and electromagnetic interference cause the pin to randomly oscillate between \`HIGH\` and \`LOW\`.

#### 1. How a Pull-Up Fixes This
- **Unpressed**: A resistor ties the pin to **3.3V**, ensuring a stable, noise-immune \`HIGH\` (1).
- **Pressed**: The button contacts bridge the pin directly to **GND**, pulling it to \`LOW\` (0).

#### 2. Using ESP32 Built-in \`INPUT_PULLUP\`
You don't even need an external resistor! The ESP32 contains internal ~45kΩ pull-up resistors:
\`\`\`cpp
pinMode(BUTTON_PIN, INPUT_PULLUP);
// Unpressed = HIGH (true)
// Pressed   = LOW  (false)
\`\`\`

#### 3. Software Debounce
Mechanical button contacts vibrate (bounce) for 5–20 milliseconds upon closing. A basic hardware or millis debounce prevents false multiple triggers:
\`\`\`cpp
if (digitalRead(BUTTON_PIN) == LOW) {
  delay(25); // Debounce settle delay
  if (digitalRead(BUTTON_PIN) == LOW) {
    // Verified single button click!
  }
}
\`\`\``,
  },
  {
    triggers: ["resistor", "led resistor", "ohm", "current limit", "burn led"],
    title: "Sizing Current-Limiting Resistors for LEDs",
    content: `### 💡 How to Calculate LED Resistors with Ohm's Law

LEDs are non-linear diodes with almost zero internal resistance once their forward voltage ($V_f$) is exceeded. Without a current-limiting resistor, excessive current will instantly destroy the LED and damage the ESP32 GPIO pin.

#### 1. Ohm's Law Formula
$$R = \\frac{V_{\\text{source}} - V_{\\text{LED}}}{I_{\\text{LED}}}$$

Where:
- **$V_{\\text{source}}$** = ESP32 GPIO Output = **3.3V**
- **$V_{\\text{LED}}$** = Forward Voltage drop (Red: ~1.8V–2.0V, Blue/White/Green: ~3.0V–3.2V)
- **$I_{\\text{LED}}$** = Desired operating current (typically **10mA to 15mA** = **0.010A to 0.015A**)

#### 2. Standard Value for a Red LED
$$R = \\frac{3.3\\text{V} - 2.0\\text{V}}{0.010\\text{A}} = \\frac{1.3\\text{V}}{0.010\\text{A}} = 130\\,\\Omega$$

In real-world circuits, **220Ω** or **330Ω** is the ideal standard value. It provides bright illumination while keeping the GPIO pin well below its maximum 40mA source limit.`,
  },
  {
    triggers: ["oled", "ssd1306", "i2c", "sda", "scl", "display"],
    title: "ESP32 I2C OLED (SSD1306) Wiring & Architecture",
    content: `### 📺 I2C OLED (SSD1306 128x64) Wiring with ESP32

The **SSD1306 0.96-inch OLED** uses the two-wire **I2C communication protocol**, requiring only 4 total connections:

#### 1. Pin Map
| OLED Pin | ESP32 DevKit V1 Pin | Function |
| :--- | :--- | :--- |
| **VCC** | **3V3 (or 5V)** | Power (3.3V compatible) |
| **GND** | **GND** | Common Ground |
| **SCL** | **GPIO22** | Default Hardware I2C Clock |
| **SDA** | **GPIO21** | Default Hardware I2C Data |

#### 2. Arduino Libraries
- \`Adafruit_SSD1306.h\`
- \`Adafruit_GFX.h\`
- Default I2C Address: \`0x3C\` (or \`0x3D\`)`,
  },
  {
    triggers: ["gpio", "pinout", "analog", "adc", "dac", "esp32 pins", "best pins"],
    title: "ESP32 Pinout & Safe GPIO Selection Guide",
    content: `### ⚡ ESP32 GPIO Safety Guide: Which Pins to Use

Not all 30+ pins on an ESP32 are identical. Some have boot strapping requirements, while others are input-only:

#### 1. Best General-Purpose Digital Output / PWM Pins
- **GPIO 2** (Onboard LED on most boards, strapping pin - keep LOW during boot)
- **GPIO 4, 16, 17, 18, 19, 21, 22, 23** (Completely safe for LEDs, Relays, Buzzers, I2C, SPI)

#### 2. Safe Analog Inputs (ADC1)
When Wi-Fi is active, **ADC2 is unavailable** due to radio hardware sharing. Always use **ADC1**:
- **GPIO 32, 33, 34, 35, 36 (VP), 39 (VN)**

#### 3. Input-Only Pins (No Internal Pull-ups)
- **GPIO 34, 35, 36, 39**: These do NOT have internal pull-up/pull-down resistors and cannot output voltage. Perfect for analog sensors.`,
  },
];

/**
 * Checks if the user's prompt is requesting to build, make, or synthesize a circuit.
 */
export function isCircuitSynthesisRequest(text) {
  const lower = text.toLowerCase();
  const buildKeywords = [
    "make",
    "build",
    "create",
    "synthesize",
    "generate",
    "design",
    "connect",
    "wire",
    "schematic",
    "blink",
    "alarm",
    "controller",
    "joystick",
    "ultrasonic",
    "push button",
    "servo",
    "water level",
    "sensor circuit",
    "led",
  ];
  return buildKeywords.some((kw) => lower.includes(kw));
}

/**
 * Sends a chat message to the Circuit Assistant.
 * Accepts userMessage, conversationHistory, and optional scannedComponents list.
 * Returns { text: string, circuitProject: object | null, suggestedNextSteps: string[] }
 */
export async function sendChatMessage(userMessage, conversationHistory = [], scannedComponents = [], liveImage = null) {
  const trimmed = userMessage.trim();
  const lower = trimmed.toLowerCase();

  const hasScannedParts = Array.isArray(scannedComponents) && scannedComponents.length > 0;
  const scannedNames = hasScannedParts ? scannedComponents.map((c) => c.name || c.label || c).join(", ") : "";

  // 1. Send to Multimodal AI (Gemini 3.8 Flash) via FastAPI Backend
  try {
    const aiResult = await sendMultimodalAiChat({
      prompt: trimmed,
      image: liveImage,
      components: scannedComponents,
    });

    if (aiResult && aiResult.text) {
      return {
        text: aiResult.text,
        circuitProject: aiResult.circuitProject,
        suggestedNextSteps: aiResult.suggestedNextSteps?.length > 0
          ? aiResult.suggestedNextSteps
          : [
              "Open in Circuit Studio & Flash",
              "Explain the pin routing in detail",
              "What safety precautions should I take with this wiring?",
            ],
      };
    }
  } catch (err) {
    console.warn("[ChatAssistant] Multimodal AI error, falling back to local engine:", err);
  }

  // 2. Check if it matches an in-depth conceptual question from local knowledge base
  for (const item of CIRCUIT_KNOWLEDGE_BASE) {
    if (item.triggers.some((trigger) => lower.includes(trigger))) {
      let circuitProject = null;
      if (isCircuitSynthesisRequest(trimmed) || hasScannedParts) {
        try {
          circuitProject = await generateProject({ prompt: trimmed, board: "ESP32" });
        } catch (e) {
          console.warn("Synthesis fallback:", e);
        }
      }

      let extraContent = "";
      if (hasScannedParts) {
        extraContent = `\n\n> 📷 **Camera Inventory Detected**: Utilizing your scanned **${scannedNames}** for this circuit design.`;
      }

      return {
        text: item.content + extraContent,
        circuitProject,
        suggestedNextSteps: [
          "Open in Circuit Studio & Flash",
          "Explain the pin routing in detail",
          "What safety precautions should I take with this wiring?",
        ],
      };
    }
  }

  // 2. If it is a circuit creation / synthesis request OR user scanned components
  if (isCircuitSynthesisRequest(trimmed) || hasScannedParts) {
    try {
      const promptToUse = hasScannedParts
        ? `${trimmed}. Using scanned components: ${scannedNames}`
        : trimmed;

      const generated = await generateProject({ prompt: promptToUse, board: "ESP32" });
      const compNames = generated.circuit.components.map((c) => c.name).join(", ");

      const instructionsList = generated.instructions || [
        "1. Mount the ESP32 securely into the center of the breadboard across the center divider.",
        "2. Route power: Connect 3.3V / 5V rail and establish common GND rail on the breadboard.",
        "3. Wire peripheral signals to designated ESP32 GPIOs as listed in the connection map below.",
        "4. Verify that current-limiting resistors are in series with LEDs to prevent overcurrent.",
        "5. Launch the interactive simulation to verify sensor logic, then flash to hardware.",
      ];

      const responseText = `### 🚀 Circuit Synthesis Complete: ${generated.circuit.board.model}

I have planned and synthesized the circuit tailored to your request!
${hasScannedParts ? `\n> 📷 **Matched with Scanned Hardware**: ${scannedNames}\n` : ""}
#### 🛠️ Hardware Manifest
- **Controller**: ${generated.circuit.board.model} (3.3V logic, Wi-Fi & BLE enabled)
- **Connected Peripherals**: ${compNames || "Standard IoT Peripherals"}

#### 🔌 Pin Connection Netlist
${generated.circuit.connections
  .slice(0, 8)
  .map(
    (conn, i) =>
      `- **Wire ${i + 1}**: \`${conn.from.component}.${conn.from.pin}\` ➔ \`${conn.to.component}.${conn.to.pin}\``
  )
  .join("\n")}

#### 📋 Step-by-Step Assembly Instructions
${instructionsList.map((step, i) => `${i + 1}. ${step.replace(/^\d+[.)]\s*/, "")}`).join("\n")}

#### ⚡ Ready for Interactive Simulation & ESP32 Flashing
- The complete Arduino C++ firmware is prepared with pin definitions and debouncing logic.
- You can test it live in the interactive Wokwi simulation, then flash directly to your physical ESP32 via WebSerial!

👉 **Click "Open in Circuit Studio & Flash" below to view the live schematic simulation!**`;

      return {
        text: responseText,
        circuitProject: generated,
        suggestedNextSteps: [
          "Open in Circuit Studio & Flash",
          "Explain the pin routing in detail",
          "How do I add a power switch or push button?",
        ],
      };
    } catch (err) {
      console.warn("Synthesis failed, falling back to conversational advice:", err);
    }
  }

  // 3. General conversational fallback with IoT engineering advice
  return {
    text: `### 🤖 Blinky Circuit AI Architect

I'm ready to help you plan, debug, or synthesize your IoT hardware! Here is what I can do:

${hasScannedParts ? `> 📷 **Detected Hardware**: ${scannedNames}\n` : ""}- **Synthesize Hardware & Code**: Tell me what you want to build (e.g. *"Make an ESP32 distance alarm with buzzer"* or *"Dual-axis joystick controller"*).
- **Camera Hardware Scanner**: Use the camera icon to scan components on your desk via Webcam or Windows Phone Link.
- **Wiring & Pinout Consultations**: Ask about ESP32 pin capabilities, I2C / SPI busses, ADC resolution, or pull-up resistors.
- **Flashing & Simulation**: Verify your circuit in the live simulator, then flash the sketch directly to your ESP32 board!

What circuit would you like to build or simulate today?`,
    circuitProject: null,
    suggestedNextSteps: [
      "Blink an LED on ESP32 GPIO2 every second",
      "HC-SR04 ultrasonic distance alarm with buzzer & alert LED",
      "Dual-axis analog joystick controlling two servo motors",
      "How does an LDR voltage divider circuit work on ESP32?",
    ],
  };
}
