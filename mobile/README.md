# Blinky AI Mobile AR Scanner 📱⚡

The companion mobile app for **Blinky AI IoT Studio**. Point your phone camera at physical electronics on your desk, and Blinky automatically detects microcontrollers, sensors, actuators, and LEDs with Augmented Reality (AR) HUD bounding boxes and live telemetry.

---

## Features

- **100% Offline On-Device AI Inference**: Powered by local TensorFlow Lite (`react-native-fast-tflite`) and C++ accelerated image preprocessing (`react-native-nitro-image`). Zero backend, network, or cloud connection required.
- **Zero Sensor Drift Optical HUD**: Pure optical perspective AR bounding boxes rendered instantaneously from direct neural inferences without unreliable gyroscope drift or accelerometer noise.
- **1080p Full HD Camera Pipeline**: High-clarity native photo capture with fine pin, trace, and chip detail preserved for accurate classification.
- **Stand-alone Edge Operation**: Works completely untethered on physical devices in the field with the PC turned off.
- **Dedicated Screenshots Directory**: Screenshots and sample captures can be saved in `mobile/screenshots/` (tracked with `.gitkeep`, raw images ignored by git).

---

## Tech Stack

- **Framework**: React Native + Expo (SDK 57 Native Prebuild)
- **On-Device Inference**: `react-native-fast-tflite` (native C++ TFLite engine)
- **Image Acceleration**: `react-native-nitro-image` & `react-native-nitro-modules`
- **Camera**: `expo-camera` (`CameraView`) configured for high-clarity capture
- **UI Design System**: Cybernetic Dark Obsidian (`#09080a`), Emerald (`#10b981`), Amber Gold (`#f59e0b`), Cyan (`#06b6d4`)

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
