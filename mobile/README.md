# Blinky AI Mobile AR Scanner 📱⚡

The companion mobile app for **Blinky AI IoT Studio**. Point your phone camera at physical electronics on your desk, and Blinky automatically detects microcontrollers, sensors, actuators, and LEDs with Augmented Reality (AR) HUD bounding boxes and live telemetry.

---

## 🚀 Killer Demo Flow

```
   1. Point phone at desk (ESP32, DHT11, LED)
                     ↓
   2. Real-time AR HUD draws neon bounding boxes & confidence
                     ↓
   3. Tap "⚡ SEND TO REACT & BUILD CIRCUIT"
                     ↓
   4. Desktop Blinky Studio automatically renders Wokwi schematic & generates Arduino code!
```

---

## 🛠 Tech Stack

- **Framework:** React Native + Expo (SDK 57)
- **Camera:** `expo-camera` (`CameraView`)
- **Icons:** `lucide-react-native`
- **UI Architecture:** Cybernetic Dark Obsidian (`#09080a`), Amber Gold (`#f59e0b`), Emerald (`#10b981`), Cyan (`#06b6d4`)
- **Inference Modes:**
  - **LIVE AI Mode:** Captures camera frames and queries FastAPI / Gemini Vision AI
  - **DEMO Fallback Mode:** Zero-latency preloaded hardware kits for stage/hackathon presentations

---

## 🏃‍♂️ How to Run on Physical Device

1. Navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. Open **Expo Go** on your iOS or Android phone and scan the QR code displayed in the terminal.

---

## 🛡️ Hackathon Stage Fallback (Demo Mode)

- Toggle the **LIVE CAMERA SCAN** / **DEMO MODE (HACKATHON)** pill at the top of the screen anytime.
- In Demo mode, you can tap **"Cycle Hardware Kit"** to demonstrate:
  1. **Smart Weather IoT Node** (ESP32 + DHT11 + Red LED + 220Ω Resistor)
  2. **Smart Distance & Water Level Alarm** (ESP32 + HC-SR04 Ultrasonic Sonar + Piezo Buzzer)
