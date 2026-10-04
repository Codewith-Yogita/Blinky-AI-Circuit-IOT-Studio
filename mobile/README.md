# Blinky AI Mobile AR Scanner 📱⚡

The companion mobile app for **Blinky AI IoT Studio**. Point your phone camera at physical electronics on your desk, and Blinky automatically detects microcontrollers, sensors, actuators, and LEDs with Augmented Reality (AR) HUD bounding boxes and live telemetry.

---

## Features

- **60 FPS Gyroscope Motion Tracking**: Hardware IMU gyroscope sensor fusion (`expo-sensors` DeviceMotion at 60 Hz) renders perspective-projected bounding boxes on the native GPU UI thread with zero damping lag.
- **1080p Full HD Camera Pipeline**: High-clarity photo stream at 0.85 JPEG quality, capturing fine board traces, pins, and component labels without blocky compression artifacts.
- **Smart Dual Networking**: Automatically routes traffic through zero-latency USB port forwarding (`http://localhost:8000`) and seamlessly falls back to Wi-Fi LAN IP (`http://192.168.1.x:8000`).
- **Hands-Free Detection**: Continuous automatic detection loop running without manual shutter buttons.
- **Dedicated Screenshots Directory**: Screenshots and sample captures can be saved in `mobile/screenshots/` (tracked with `.gitkeep`, raw images ignored by git).

---

## Tech Stack

- **Framework**: React Native + Expo (SDK 57 Native Prebuild)
- **Camera**: `expo-camera` (`CameraView`) configured for 1080p Full HD capture
- **Motion Sensors**: `expo-sensors` (`DeviceMotion` 60 Hz)
- **Native Modules**: `react-native-vision-camera`, `react-native-fast-tflite`, `react-native-nitro-modules`
- **UI Design System**: Cybernetic Dark Obsidian (`#09080a`), Amber Gold (`#f59e0b`), Emerald (`#10b981`), Cyan (`#06b6d4`)

---

## Getting Started

### 1. Prerequisites
- Android Studio / Android SDK (API 34+, NDK 27 recommended)
- Node.js (v18+)

### 2. Install Dependencies
```bash
cd mobile
npm install
```

### 3. Run Development Build on Physical Device
```bash
# Set up reverse port forwarding (USB connection)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8000 tcp:8000

# Start Metro bundler
npm start

# In a separate terminal, launch the native Android build
npx expo run:android
```

---

## Architecture & AI Documentation

For detailed information on the vision models, gyroscope perspective projection, and dataset collection pipelines, refer to the project documentation:
- [AI & Vision Architecture Guide](../docs/ai_architecture.md)
- [Model Training & Dataset Pipeline](../docs/model_training.md)
