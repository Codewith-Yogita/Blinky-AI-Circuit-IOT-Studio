import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Send, RefreshCw, Layers, CheckCircle2 } from 'lucide-react-native';
import { DetectionItem } from '../types/detection';
import { COMPONENT_COLORS } from '../services/demoPresets';

interface Props {
  detections: DetectionItem[];
  selectedId: string | null;
  onSelectComponent: (item: DetectionItem) => void;
  onSendToStudio: () => void;
  isSending: boolean;
  sendSuccess: boolean;
  isDemoMode: boolean;
  onNextPreset?: () => void;
  presetName?: string;
}

export const BottomControls: React.FC<Props> = ({
  detections,
  selectedId,
  onSelectComponent,
  onSendToStudio,
  isSending,
  sendSuccess,
  isDemoMode,
  onNextPreset,
  presetName,
}) => {
  return (
    <View style={styles.container}>
      {/* Demo Preset Bar (Only shown in Demo Mode) */}
      {isDemoMode && (
        <View style={styles.presetBar}>
          <View style={styles.presetLeft}>
            <Layers size={13} color="#06b6d4" />
            <Text style={styles.presetLabel}>Preset: {presetName || 'Weather Station'}</Text>
          </View>
          <TouchableOpacity
            style={styles.cycleButton}
            onPress={onNextPreset}
            activeOpacity={0.7}
          >
            <RefreshCw size={11} color="#06b6d4" />
            <Text style={styles.cycleButtonText}>Cycle Hardware Kit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Detected Components Horizontal Badge Stream */}
      <View style={styles.streamHeader}>
        <View style={styles.streamTitleRow}>
          <Text style={styles.streamTitle}>DETECTED HARDWARE</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{detections.length} components</Text>
          </View>
        </View>
        <Text style={styles.streamSubtitle}>Tap component to inspect GPIO pins</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {detections.map((item) => {
          const isSelected = selectedId === item.id;
          const color = item.color || COMPONENT_COLORS[item.type] || '#10b981';
          const percent = Math.round((item.confidence || 0.95) * 100);

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelectComponent(item)}
              style={[
                styles.chip,
                {
                  borderColor: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#140f1d',
                },
              ]}
            >
              <View style={[styles.chipDot, { backgroundColor: color }]} />
              <Text style={styles.chipText}>{item.label}</Text>
              <Text style={[styles.chipPercent, { color }]}>{percent}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Killer Demo CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onSendToStudio}
        disabled={isSending || detections.length === 0}
        style={[
          styles.actionButton,
          sendSuccess && styles.actionButtonSuccess,
          (isSending || detections.length === 0) && styles.actionButtonDisabled,
        ]}
      >
        {sendSuccess ? (
          <>
            <CheckCircle2 size={18} color="#10b981" />
            <Text style={styles.actionButtonSuccessText}>SYNCED TO PC BLINKY STUDIO</Text>
          </>
        ) : (
          <>
            <Send size={18} color="#09080a" />
            <Text style={styles.actionButtonText}>
              {isSending ? 'TRANSMITTING TO REACT...' : 'SEND TO REACT & BUILD CIRCUIT'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: 'rgba(9, 8, 10, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  presetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presetLabel: {
    color: '#06b6d4',
    fontSize: 11,
    fontWeight: '700',
  },
  cycleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cycleButtonText: {
    color: '#67e8f9',
    fontSize: 10,
    fontWeight: '700',
  },
  streamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streamTitle: {
    color: '#e4e4e7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  countBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countBadgeText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  streamSubtitle: {
    color: '#71717a',
    fontSize: 10,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  chipPercent: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  actionButtonSuccess: {
    backgroundColor: '#140f1d',
    borderWidth: 1.5,
    borderColor: '#10b981',
    shadowColor: '#10b981',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#09080a',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionButtonSuccessText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
