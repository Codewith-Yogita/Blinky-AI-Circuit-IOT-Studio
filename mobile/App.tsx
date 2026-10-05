import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BoundingBoxOverlay } from './src/components/BoundingBoxOverlay';
import { DetectionItem } from './src/types/detection';
import {
  detectComponentsOnDevice,
  getOnDeviceModel,
  isNativeOnDeviceSupported,
} from './src/services/onDeviceVision';
import { detectComponentsFromFrame, BACKEND_URL } from './src/services/visionApi';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detections, setDetections] = useState<DetectionItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    isNativeOnDeviceSupported ? 'Offline AI • Initializing...' : 'Expo Go Mode • Ready'
  );
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);

  const [screenLayout, setScreenLayout] = useState<{ width: number; height: number }>({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  const [photoDimensions, setPhotoDimensions] = useState<{ width: number; height: number }>({
    width: 2448,
    height: 3264,
  });

  const cameraRef = useRef<any>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Pre-warm on-device TFLite neural model if native runtime is available
  useEffect(() => {
    if (isNativeOnDeviceSupported) {
      getOnDeviceModel().then((model) => {
        if (model) {
          setStatusMessage('Offline AI • Ready');
        } else {
          setStatusMessage('Offline AI • Model load fallback');
        }
      });
    } else {
      setStatusMessage('Expo Go Mode • Using PC Backend');
    }
  }, []);

  // Setup high-clarity camera picture size on ready
  const handleCameraReady = async () => {
    setIsCameraReady(true);
    try {
      if (cameraRef.current?.getAvailablePictureSizesAsync) {
        const sizes: string[] = await cameraRef.current.getAvailablePictureSizesAsync();
        const preferred = sizes.find((s) => s === '1920x1080' || s === '1280x720');
        if (preferred) {
          setPictureSize(preferred);
        }
      }
    } catch {
      // Fall back to default
    }
  };

  // Instantaneous frame capture & detection (Offline on-device or Expo Go backend)
  const captureAndScan = useCallback(async () => {
    if (!cameraRef.current || isProcessingRef.current || !isCameraReady) return;

    try {
      isProcessingRef.current = true;
      setIsScanning(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        base64: !isNativeOnDeviceSupported,
        skipProcessing: false,
        shutterSound: false,
      });

      if (photo?.width && photo?.height) {
        setPhotoDimensions({ width: photo.width, height: photo.height });
      }

      if (isNativeOnDeviceSupported && photo?.uri) {
        // 100% Offline On-Device Detection
        const items = await detectComponentsOnDevice(photo.uri);
        setDetections(items);

        if (items.length > 0) {
          setStatusMessage(`Tracking (On-Device): ${items.map((i) => i.label).join(', ')}`);
        } else {
          setStatusMessage('Scanning hardware (On-Device)...');
        }
      } else if (!isNativeOnDeviceSupported && photo?.base64) {
        // Fallback for Expo Go (which lacks native C++ TurboModules)
        const res = await detectComponentsFromFrame(photo.base64, BACKEND_URL, false);
        const items = res.detections || [];
        setDetections(items);

        if (items.length > 0) {
          setStatusMessage(`Tracking (Expo Go): ${items.map((i) => i.label).join(', ')}`);
        } else {
          setStatusMessage('Scanning hardware (Backend)...');
        }
      }
    } catch (err: any) {
      console.log('Capture error:', err);
    } finally {
      isProcessingRef.current = false;
      setIsScanning(false);
    }
  }, [isCameraReady]);

  // High-speed real-time detection pipeline for instantaneous tracking
  useEffect(() => {
    if (!isCameraReady) return;
    let isActive = true;

    const runPipeline = async () => {
      await new Promise((r) => setTimeout(r, 300));

      while (isActive) {
        await captureAndScan();
        // Zero-delay loop for instantaneous frame capture and streaming
        await new Promise((r) => setTimeout(r, 0));
      }
    };

    runPipeline();

    return () => {
      isActive = false;
    };
  }, [isCameraReady, captureAndScan]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setScreenLayout({ width, height });
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar hidden />
        <Text style={styles.permissionText}>Camera access required for component detection</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View onLayout={onLayout} style={styles.container}>
      <StatusBar hidden />

      {/* Fullscreen Camera Feed with Flash & Shutter Animation COMPLETELY DISABLED */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        flash="off"
        enableTorch={false}
        animateShutter={false}
        pictureSize={pictureSize}
        onCameraReady={handleCameraReady}
      />

      {/* Top Floating Status Indicator */}
      <View style={styles.statusPill}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: detections.length > 0 ? '#10b981' : isScanning ? '#06b6d4' : '#f59e0b' },
          ]}
        />
        <Text style={styles.statusText}>{statusMessage}</Text>
      </View>

      {/* Bounding Boxes with Text on Top */}
      {detections.length > 0 && (
        <BoundingBoxOverlay
          detections={detections}
          layoutWidth={screenLayout.width}
          layoutHeight={screenLayout.height}
          sourceWidth={photoDimensions.width}
          sourceHeight={photoDimensions.height}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusPill: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 8, 10, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#f4f4f5',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000000',
    fontWeight: '700',
  },
});
