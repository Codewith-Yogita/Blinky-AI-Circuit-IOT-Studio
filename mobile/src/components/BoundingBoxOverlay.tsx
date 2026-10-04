import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DetectionItem } from '../types/detection';
import { COMPONENT_COLORS } from '../services/demoPresets';

interface Props {
  detections: DetectionItem[];
  layoutWidth: number;
  layoutHeight: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

export const BoundingBoxOverlay: React.FC<Props> = ({
  detections,
  layoutWidth,
  layoutHeight,
  sourceWidth = 3,
  sourceHeight = 4,
}) => {
  if (layoutWidth === 0 || layoutHeight === 0) return null;

  // Accurate Camera Preview "cover" coordinate mapping:
  // CameraView fills the entire screen, cropping whichever axis exceeds the aspect ratio.
  const viewAspect = layoutWidth / layoutHeight;
  const imgAspect = sourceWidth / sourceHeight;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (viewAspect < imgAspect) {
    // Screen is taller than image (typical portrait phone)
    // Preview scales to match layoutHeight, horizontal sides are cropped
    scale = layoutHeight / sourceHeight;
    const renderedWidth = sourceWidth * scale;
    offsetX = (renderedWidth - layoutWidth) / 2;
  } else {
    // Screen is wider than image (landscape or square)
    // Preview scales to match layoutWidth, vertical sides are cropped
    scale = layoutWidth / sourceWidth;
    const renderedHeight = sourceHeight * scale;
    offsetY = (renderedHeight - layoutHeight) / 2;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {detections.map((item) => {
        // Map normalized coordinates (0.0 to 1.0) into the screen's coordinate space
        const left = item.bbox.x * sourceWidth * scale - offsetX;
        const top = item.bbox.y * sourceHeight * scale - offsetY;
        const width = item.bbox.width * sourceWidth * scale;
        const height = item.bbox.height * sourceHeight * scale;

        const color = item.color || COMPONENT_COLORS[item.type] || '#10b981';
        const percent = Math.round((item.confidence || 0.95) * 100);

        return (
          <View
            key={item.id}
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
            {/* Text badge directly on top of the box (or inside if near top edge) */}
            <View
              style={[
                styles.labelTag,
                top < 26 ? { top: 0, borderTopLeftRadius: 0 } : { top: -24 },
                { backgroundColor: color },
              ]}
            >
              <Text style={styles.labelText}>
                {item.label} {percent}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
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
