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
  // 60 FPS Real-time Inertial Projection:
  // When phone moves, gyroscope instantly translates overlay at 60 FPS in lockstep with the desk
  const animGyroX = useRef(new Animated.Value(0)).current;
  const animGyroY = useRef(new Animated.Value(0)).current;
  const gyroOffset = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    Gyroscope.setUpdateInterval(16); // 60 FPS sensor updates (~16ms)
    let lastTime = Date.now();

    // Standard phone lens vertical FOV is ~60 deg, giving focal scale ~ layoutHeight * 1.15
    const FOCAL_SCALE = Math.max(500, layoutHeight * 1.15);

    const sub = Gyroscope.addListener((data) => {
      const now = Date.now();
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Noise Filter: Discard micro-tremors (<0.10 rad/s) so box stays rock-solid when holding still
      const angularSpeed = Math.hypot(data.x, data.y);
      if (angularSpeed < 0.10) {
        // Natural elastic centering to prevent cumulative drift
        gyroOffset.x *= 0.92;
        gyroOffset.y *= 0.92;
        if (Math.abs(gyroOffset.x) < 0.2) gyroOffset.x = 0;
        if (Math.abs(gyroOffset.y) < 0.2) gyroOffset.y = 0;
        animGyroX.setValue(gyroOffset.x);
        animGyroY.setValue(gyroOffset.y);
        return;
      }

      // 2. Active Motion: Translate overlay in lockstep with camera motion at 60 FPS
      // Panning right (data.y > 0) -> desk moves left (-X)
      // Tilting up (data.x > 0) -> desk moves down (+Y)
      gyroOffset.x -= data.y * FOCAL_SCALE * dt;
      gyroOffset.y += data.x * FOCAL_SCALE * dt;

      // Soft clamp displacement between vision anchors
      const MAX_DISP = layoutWidth * 0.4;
      gyroOffset.x = Math.max(-MAX_DISP, Math.min(MAX_DISP, gyroOffset.x));
      gyroOffset.y = Math.max(-MAX_DISP, Math.min(MAX_DISP, gyroOffset.y));

      animGyroX.setValue(gyroOffset.x);
      animGyroY.setValue(gyroOffset.y);
    });

    return () => {
      sub.remove();
    };
  }, [layoutWidth, layoutHeight]);

  // Complementary Fusion: When fresh vision detection arrives, smoothly reconcile drift
  // instead of a harsh pop
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animGyroX, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(animGyroY, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start(() => {
      gyroOffset.x = 0;
      gyroOffset.y = 0;
    });
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
