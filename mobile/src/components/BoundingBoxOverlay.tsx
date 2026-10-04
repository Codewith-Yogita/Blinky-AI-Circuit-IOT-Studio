import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { DetectionItem } from '../types/detection';
import { COMPONENT_COLORS } from '../services/demoPresets';

interface Props {
  detections: DetectionItem[];
  layoutWidth: number;
  layoutHeight: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

// Rock-Solid AR Bounding Box with Lock-In Hysteresis
// For small movements / sensor noise: keeps target 100% locked in place without moving
// For real movements (camera / component motion): moves instantly to new target
const SmoothBox: React.FC<{
  item: DetectionItem;
  targetLeft: number;
  targetTop: number;
  targetWidth: number;
  targetHeight: number;
  color: string;
  percent: number;
}> = ({ item, targetLeft, targetTop, targetWidth, targetHeight, color, percent }) => {
  const animLeft = useRef(new Animated.Value(targetLeft)).current;
  const animTop = useRef(new Animated.Value(targetTop)).current;
  const animWidth = useRef(new Animated.Value(targetWidth)).current;
  const animHeight = useRef(new Animated.Value(targetHeight)).current;

  // Stably locked anchor coordinates
  const lockedRef = useRef({
    left: targetLeft,
    top: targetTop,
    width: targetWidth,
    height: targetHeight,
  });

  useEffect(() => {
    const cur = lockedRef.current;
    const deltaX = Math.abs(targetLeft - cur.left);
    const deltaY = Math.abs(targetTop - cur.top);
    const deltaW = Math.abs(targetWidth - cur.width);
    const deltaH = Math.abs(targetHeight - cur.height);

    // HYSTERESIS DEADZONE:
    // If movement is small (<16px position, <16px dimension), KEEP TARGET INTACT & LOCKED!
    // Zero drift, zero micro-wobble when in one place.
    const DEADZONE = 16;
    const isSignificantMove = deltaX > DEADZONE || deltaY > DEADZONE || deltaW > DEADZONE || deltaH > DEADZONE;

    if (!isSignificantMove) {
      // Stay firmly locked at anchor coordinates
      return;
    }

    // DELIBERATE MOVEMENT:
    // User moved component or camera: update anchor and snap/glide instantly!
    lockedRef.current = {
      left: targetLeft,
      top: targetTop,
      width: targetWidth,
      height: targetHeight,
    };

    const isLargeJump = deltaX > 50 || deltaY > 50;

    if (isLargeJump) {
      // Instant snap for rapid motion
      animLeft.setValue(targetLeft);
      animTop.setValue(targetTop);
      animWidth.setValue(targetWidth);
      animHeight.setValue(targetHeight);
    } else {
      // Ultra-crisp high-tension spring for fast glide
      Animated.parallel([
        Animated.spring(animLeft, {
          toValue: targetLeft,
          friction: 12,
          tension: 240,
          useNativeDriver: false,
        }),
        Animated.spring(animTop, {
          toValue: targetTop,
          friction: 12,
          tension: 240,
          useNativeDriver: false,
        }),
        Animated.spring(animWidth, {
          toValue: targetWidth,
          friction: 12,
          tension: 240,
          useNativeDriver: false,
        }),
        Animated.spring(animHeight, {
          toValue: targetHeight,
          friction: 12,
          tension: 240,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [targetLeft, targetTop, targetWidth, targetHeight]);

  const isNearTop = targetTop < 26;

  return (
    <Animated.View
      style={[
        styles.box,
        {
          left: animLeft,
          top: animTop,
          width: animWidth,
          height: animHeight,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.labelTag,
          isNearTop ? { top: 0, borderTopLeftRadius: 0 } : { top: -24 },
          { backgroundColor: color },
        ]}
      >
        <Text style={styles.labelText}>
          {item.label} {percent}%
        </Text>
      </View>
    </Animated.View>
  );
};

export const BoundingBoxOverlay: React.FC<Props> = ({
  detections,
  layoutWidth,
  layoutHeight,
  sourceWidth = 3,
  sourceHeight = 4,
}) => {
  // Gyroscope 60 FPS real-time motion compensation with noise suppression:
  // Discards small hand micro-tremors to keep box rock-solid stationary,
  // while tracking fast deliberate pans immediately.
  const animGyroX = useRef(new Animated.Value(0)).current;
  const animGyroY = useRef(new Animated.Value(0)).current;
  const gyroOffset = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    Gyroscope.setUpdateInterval(16); // 60 FPS updates (~16ms)
    let lastTime = Date.now();

    const sub = Gyroscope.addListener((data) => {
      const now = Date.now();
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      // Gyro noise filter: ignore baseline hand tremors (<0.14 rad/s)
      const angularSpeed = Math.hypot(data.x, data.y);
      if (angularSpeed < 0.14) {
        // Smoothly decay to zero when holding still so box stays firmly intact
        gyroOffset.x *= 0.88;
        gyroOffset.y *= 0.88;
        if (Math.abs(gyroOffset.x) < 0.3) gyroOffset.x = 0;
        if (Math.abs(gyroOffset.y) < 0.3) gyroOffset.y = 0;
        animGyroX.setValue(gyroOffset.x);
        animGyroY.setValue(gyroOffset.y);
        return;
      }

      // Deliberate motion: translate overlay in 60 FPS
      const SENSITIVITY = 350;
      gyroOffset.x -= data.y * SENSITIVITY * dt;
      gyroOffset.y += data.x * SENSITIVITY * dt;

      // Clamp max displacement between vision frames
      gyroOffset.x = Math.max(-80, Math.min(80, gyroOffset.x));
      gyroOffset.y = Math.max(-80, Math.min(80, gyroOffset.y));

      animGyroX.setValue(gyroOffset.x);
      animGyroY.setValue(gyroOffset.y);
    });

    return () => {
      sub.remove();
    };
  }, []);

  // When fresh vision detection arrives, lock onto verified vision coordinates
  useEffect(() => {
    gyroOffset.x *= 0.1;
    gyroOffset.y *= 0.1;
    animGyroX.setValue(gyroOffset.x);
    animGyroY.setValue(gyroOffset.y);
  }, [detections]);

  if (layoutWidth === 0 || layoutHeight === 0) return null;

  // Camera preview "cover" aspect ratio projection
  const viewAspect = layoutWidth / layoutHeight;
  const imgAspect = sourceWidth / sourceHeight;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (viewAspect < imgAspect) {
    scale = layoutHeight / sourceHeight;
    const renderedWidth = sourceWidth * scale;
    offsetX = (renderedWidth - layoutWidth) / 2;
  } else {
    scale = layoutWidth / sourceWidth;
    const renderedHeight = sourceHeight * scale;
    offsetY = (renderedHeight - layoutHeight) / 2;
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [{ translateX: animGyroX }, { translateY: animGyroY }],
        },
      ]}
      pointerEvents="none"
    >
      {detections.map((item) => {
        const left = item.bbox.x * sourceWidth * scale - offsetX;
        const top = item.bbox.y * sourceHeight * scale - offsetY;
        const width = item.bbox.width * sourceWidth * scale;
        const height = item.bbox.height * sourceHeight * scale;

        const color = item.color || COMPONENT_COLORS[item.type] || '#10b981';
        const percent = Math.round((item.confidence || 0.95) * 100);

        return (
          <SmoothBox
            key={item.id}
            item={item}
            targetLeft={left}
            targetTop={top}
            targetWidth={width}
            targetHeight={height}
            color={color}
            percent={percent}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  labelTag: {
    position: 'absolute',
    left: -2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  labelText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
});
