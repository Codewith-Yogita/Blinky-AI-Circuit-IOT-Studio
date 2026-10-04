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

// 60 FPS Animated Spring Bounding Box
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

  useEffect(() => {
    // Fast, responsive 60 FPS spring physics for instant tracking
    Animated.parallel([
      Animated.spring(animLeft, {
        toValue: targetLeft,
        friction: 8,
        tension: 140,
        useNativeDriver: false,
      }),
      Animated.spring(animTop, {
        toValue: targetTop,
        friction: 8,
        tension: 140,
        useNativeDriver: false,
      }),
      Animated.spring(animWidth, {
        toValue: targetWidth,
        friction: 8,
        tension: 140,
        useNativeDriver: false,
      }),
      Animated.spring(animHeight, {
        toValue: targetHeight,
        friction: 8,
        tension: 140,
        useNativeDriver: false,
      }),
    ]).start();
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
  // Gyroscope 60 FPS real-time motion compensation:
  // When phone moves, gyroscope instantly offsets the boxes in real-time between vision frames
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

      // Panning left/right (data.y) shifts overlay horizontally
      // Tilting up/down (data.x) shifts overlay vertically
      const SENSITIVITY = 400;
      gyroOffset.x -= data.y * SENSITIVITY * dt;
      gyroOffset.y += data.x * SENSITIVITY * dt;

      // Elastic decay back to zero to eliminate drift
      gyroOffset.x *= 0.94;
      gyroOffset.y *= 0.94;

      animGyroX.setValue(gyroOffset.x);
      animGyroY.setValue(gyroOffset.y);
    });

    return () => {
      sub.remove();
    };
  }, []);

  // When fresh vision detection arrives, reset gyro offset to lock onto verified coordinates
  useEffect(() => {
    gyroOffset.x *= 0.2;
    gyroOffset.y *= 0.2;
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
