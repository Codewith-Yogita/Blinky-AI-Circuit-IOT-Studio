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
import { detectComponentsFromFrame, BACKEND_URL } from './src/services/visionApi';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detections, setDetections] = useState<DetectionItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Ready • Scanning...');
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [streamMode, setStreamMode] = useState<'all' | 'balanced'>('all'); // 'all' = Stream All Frames (Instantaneous)
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);
  const [fpsCount, setFpsCount] = useState<number>(0);

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
  const frameCounterRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(Date.now());

  // Setup efficient camera picture size on ready
  const handleCameraReady = async () => {
    setIsCameraReady(true);
    try {
      if (cameraRef.current?.getAvailablePictureSizesAsync) {
        const sizes: string[] = await cameraRef.current.getAvailablePictureSizesAsync();
        const preferred = sizes.find((s) => s === '1280x720' || s === '640x480' || s === '800x600');
        if (preferred) {
          setPictureSize(preferred);
        }
      }
    } catch {
      // Fall back to default
    }
  };

  // Instantaneous frame capture & local detection
  const captureAndScan = useCallback(async () => {
    if (!cameraRef.current || isProcessingRef.current || !isCameraReady) return;

    try {
      isProcessingRef.current = true;
      setIsScanning(true);

      // Fast silent capture: skipProcessing: false enables high-speed JPEG compression (~25 KB)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.15,
        base64: true,
        skipProcessing: false,
        shutterSound: false,
      });

      if (photo?.width && photo?.height) {
        setPhotoDimensions({ width: photo.width, height: photo.height });
      }

      if (photo?.base64) {
        const res = await detectComponentsFromFrame(photo.base64, BACKEND_URL, false);
        const items = res.detections || [];
        setDetections(items);

        // Update FPS counter
        frameCounterRef.current += 1;
        const now = Date.now();
        if (now - lastFpsTimeRef.current >= 1000) {
          setFpsCount(frameCounterRef.current);
          frameCounterRef.current = 0;
          lastFpsTimeRef.current = now;
        }

        if (items.length > 0) {
          setStatusMessage(`Tracking: ${items.map((i) => i.label).join(', ')}`);
        } else {
          setStatusMessage('Scanning hardware...');
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
        // In 'all' mode: send all frames immediately (0ms delay) for instantaneous tracking
        const delay = streamMode === 'all' ? 0 : 800;
        await new Promise((r) => setTimeout(r, delay));
      }
    };

    runPipeline();

    return () => {
      isActive = false;
    };
  }, [isCameraReady, streamMode, captureAndScan]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setScreenLayout({ width, height });
    }
  };

  const toggleStreamMode = () => {
    setStreamMode((prev) => (prev === 'all' ? 'balanced' : 'all'));
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

      {/* Top Floating Controls: Status & Mode Toggle */}
      <View style={styles.topBar}>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: detections.length > 0 ? '#10b981' : isScanning ? '#06b6d4' : '#f59e0b' },
            ]}
          />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        {/* Option to stream all frames vs balanced */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.modeToggle, streamMode === 'all' ? styles.modeActive : styles.modeBalanced]}
          onPress={toggleStreamMode}
        >
          <Text style={[styles.modeToggleText, streamMode === 'all' ? styles.textActive : styles.textBalanced]}>
            {streamMode === 'all' ? `⚡ ALL FRAMES (${fpsCount} FPS)` : '🌿 BALANCED (1 FPS)'}
          </Text>
        </TouchableOpacity>
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
  topBar: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 8, 10, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  modeBalanced: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#f59e0b',
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  textActive: {
    color: '#10b981',
  },
  textBalanced: {
    color: '#f59e0b',
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
