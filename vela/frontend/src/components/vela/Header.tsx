import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { useVela } from '../../context/VelaContext';
import { formatBirthday } from '../../utils/dateUtils';
import { VelaIcon } from './VelaIcon';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
  const { user, twins } = useVela();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.brandText}>V E L A</Text>
          <Text style={styles.brandTagline}>THE BIRTHDAY TWIN SOCIETY</Text>
        </View>

        {rightAction ? (
          rightAction
        ) : (
          <View style={styles.birthdayPill}>
            <View style={styles.glowDot} />
            <Text style={styles.birthdayPillText}>
              {formatBirthday(user.dateOfBirth).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {(title || subtitle) && (
        <View style={styles.titleSection}>
          {title && <Text style={styles.pageTitle}>{title}</Text>}
          {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
        </View>
      )}

      <View style={styles.metaRow}>
        <View style={styles.activeTwinsTag}>
          <VelaIcon
            name="pulse-outline"
            size={11}
            color={Colors.accentDark}
            style={styles.activeTwinsIcon}
          />
          <Text style={styles.activeTwinsText}>
            {twins.length} TWINS CONNECTED NEARBY
          </Text>
        </View>
        <Text style={styles.zodiacText}>
          {user.zodiacSign.toUpperCase()} • {user.birthYear}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    color: Colors.textPrimary,
  },
  brandTagline: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  birthdayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentDark,
    marginRight: 6,
  },
  birthdayPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textPrimary,
  },
  titleSection: {
    marginTop: 6,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  activeTwinsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeTwinsIcon: {
    marginRight: 4,
  },
  activeTwinsText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.textSecondary,
  },
  zodiacText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.textMuted,
  },
});

