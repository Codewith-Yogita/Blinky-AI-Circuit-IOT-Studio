import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, ShieldCheck, Flashlight, FlipHorizontal } from 'lucide-react-native';

interface Props {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  torchActive: boolean;
  onToggleTorch: () => void;
  onFlipCamera: () => void;
  backendConnected: boolean;
}

export const TopBar: React.FC<Props> = ({
  isDemoMode,
  onToggleDemoMode,
  torchActive,
  onToggleTorch,
  onFlipCamera,
  backendConnected,
}) => {
  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <View style={styles.logoBadge}>
            <Zap size={14} color="#f59e0b" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>BLINKY</Text>
              <Text style={styles.brandSubtitle}>AI VISION</Text>
            </View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusPulse,
                  { backgroundColor: isDemoMode ? '#06b6d4' : backendConnected ? '#10b981' : '#f59e0b' },
                ]}
              />
              <Text style={styles.statusText}>
                {isDemoMode ? 'OFFLINE DEMO' : backendConnected ? 'GEMINI FLASH LIVE' : 'AUTO-CONNECTING'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Camera Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, torchActive && styles.iconButtonActive]}
            onPress={onToggleTorch}
            activeOpacity={0.7}
          >
            <Flashlight size={16} color={torchActive ? '#f59e0b' : '#a1a1aa'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onFlipCamera}
            activeOpacity={0.7}
          >
            <FlipHorizontal size={16} color="#a1a1aa" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Switcher Pill */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleDemoMode}
          style={[
            styles.modePill,
            !isDemoMode ? styles.modePillActiveLive : styles.modePillInactive,
          ]}
        >
          <Zap size={12} color={!isDemoMode ? '#10b981' : '#71717a'} />
          <Text
            style={[
              styles.modePillText,
              !isDemoMode ? styles.modePillTextActive : styles.modePillTextInactive,
            ]}
          >
            LIVE CAMERA SCAN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleDemoMode}
          style={[
            styles.modePill,
            isDemoMode ? styles.modePillActiveDemo : styles.modePillInactive,
          ]}
        >
          <ShieldCheck size={12} color={isDemoMode ? '#06b6d4' : '#71717a'} />
          <Text
            style={[
              styles.modePillText,
              isDemoMode ? styles.modePillTextActiveDemo : styles.modePillTextInactive,
            ]}
          >
            DEMO MODE (HACKATHON)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: 'rgba(9, 8, 10, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#16121f',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#f59e0b',
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#120d1c',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  modePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  modePillActiveLive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  modePillActiveDemo: {
    backgroundColor: 'rgba(6, 182, 212, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.5)',
  },
  modePillInactive: {
    backgroundColor: 'transparent',
  },
  modePillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modePillTextActive: {
    color: '#10b981',
  },
  modePillTextActiveDemo: {
    color: '#06b6d4',
  },
  modePillTextInactive: {
    color: '#71717a',
  },
});
