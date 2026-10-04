import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { DetectionItem } from '../types/detection';
import { COMPONENT_COLORS } from '../services/demoPresets';

interface Props {
  detections: DetectionItem[];
  layoutWidth: number;
  layoutHeight: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

// 0ms Instantaneous AR Bounding Box
const DirectBox: React.FC<{
  item: DetectionItem;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  percent: number;
}> = ({ item, left, top, width, height, color, percent }) => {
  const isNearTop = top < 26;

  return (
    <View
      style={[
        styles.box,
        {
          left,
          top,
          width,
          height,
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
    </View>
  );
};

export const BoundingBoxOverlay: React.FC<Props> = ({
  detections,
  layoutWidth,
  layoutHeight,
  sourceWidth = 3,
  sourceHeight = 4,
}) => {
  if (layoutWidth === 0 || layoutHeight === 0) return null;

  // 60 FPS GPU Motion Tracking Values (Native Driver)
  const motionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const currentRotation = useRef<{ beta: number; gamma: number }>({ beta: 0, gamma: 0 });
  const anchorRotation = useRef<{ beta: number; gamma: number }>({ beta: 0, gamma: 0 });
  const hasAnchor = useRef<boolean>(false);

  // Calibrate anchor on every fresh detection frame from the neural model
  useEffect(() => {
    if (detections.length > 0 && currentRotation.current) {
      anchorRotation.current = {
        beta: currentRotation.current.beta,
        gamma: currentRotation.current.gamma,
      };
      hasAnchor.current = true;
      motionAnim.setValue({ x: 0, y: 0 });
    }
  }, [detections, motionAnim]);

  // 60 Hz Hardware Gyroscope / IMU Listener (16ms per frame = 60 FPS)
  useEffect(() => {
    DeviceMotion.setUpdateInterval(16); // 16ms = 60 FPS

    const subscription = DeviceMotion.addListener((data) => {
      if (!data?.rotation) return;
      const { beta, gamma } = data.rotation;
      currentRotation.current = { beta, gamma };

      if (!hasAnchor.current) {
        anchorRotation.current = { beta, gamma };
        hasAnchor.current = true;
        return;
      }

      // Compute perspective displacement from physical camera angular delta
      const deltaGamma = gamma - anchorRotation.current.gamma;
      const deltaBeta = beta - anchorRotation.current.beta;

      // Project angular shift to screen pixels (focal length multiplier ~1.3x)
      const shiftX = -Math.tan(deltaGamma) * (layoutWidth * 1.35);
      const shiftY = Math.tan(deltaBeta) * (layoutHeight * 1.35);

      // Instant GPU update on the native UI thread
      motionAnim.setValue({ x: shiftX, y: shiftY });
    });

    return () => {
      subscription.remove();
    };
  }, [layoutWidth, layoutHeight, motionAnim]);

  // Camera preview aspect ratio projection
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
          transform: [
            { translateX: motionAnim.x },
            { translateY: motionAnim.y },
          ],
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
          <DirectBox
            key={item.id}
            item={item}
            left={left}
            top={top}
            width={width}
            height={height}
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
