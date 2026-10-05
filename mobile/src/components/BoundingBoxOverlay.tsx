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

// Direct Instantaneous AR Bounding Box
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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2.5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  labelTag: {
    position: 'absolute',
    left: -2.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  labelText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
