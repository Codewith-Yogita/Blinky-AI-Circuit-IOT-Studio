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
  const [statusMessage, setStatusMessage] = useState<string>('Ready • Tap Scan to detect');
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [autoScan, setAutoScan] = useState<boolean>(true);

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

  // Silent frame capture & local detection
  const captureAndScan = useCallback(async () => {
    if (!cameraRef.current || isProcessingRef.current || !isCameraReady) return;

    try {
      isProcessingRef.current = true;
      setIsScanning(true);
      setStatusMessage('Scanning hardware...');

      // Silent capture: NO flash, NO shutter sound, NO shutter animation
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        base64: true,
        skipProcessing: true,
        shutterSound: false,
      });

      if (photo?.width && photo?.height) {
        setPhotoDimensions({ width: photo.width, height: photo.height });
      }

      if (photo?.base64) {
        const res = await detectComponentsFromFrame(photo.base64, BACKEND_URL, false);
        const items = res.detections || [];
        setDetections(items);

        if (items.length > 0) {
          setStatusMessage(`Locked: ${items.map((i) => i.label).join(', ')}`);
        } else {
          setStatusMessage('No component detected');
        }
      }
    } catch (err: any) {
      console.log('Capture error:', err);
    } finally {
      isProcessingRef.current = false;
      setIsScanning(false);
    }
  }, [isCameraReady]);

  // Gentle, silent auto-scan every 2.5 seconds (zero shutter sound/flash)
  useEffect(() => {
    if (!isCameraReady || !autoScan) return;

    const timer = setTimeout(() => {
      captureAndScan();
    }, 1200);

    const interval = setInterval(() => {
      captureAndScan();
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isCameraReady, autoScan, captureAndScan]);

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
    <TouchableOpacity activeOpacity={1} onPress={captureAndScan} onLayout={onLayout} style={styles.container}>
      <StatusBar hidden />

      {/* Fullscreen Camera Feed with Flash & Shutter Animation COMPLETELY DISABLED */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        flash="off"
        enableTorch={false}
        animateShutter={false}
        onCameraReady={() => setIsCameraReady(true)}
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

      {/* Tap anywhere on screen to trigger immediate scan */}
    </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
