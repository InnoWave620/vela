import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { BirthdayCountdown } from '../../types/vela';
import { VelaIcon } from './VelaIcon';

interface Props {
  countdown: BirthdayCountdown;
}

export const BirthdayCountdownBanner: React.FC<Props> = ({ countdown }) => {
  if (countdown.isToday) {
    return (
      <View style={[styles.container, styles.celebrationContainer]}>
        <VelaIcon
          name="gift-outline"
          size={32}
          color={Colors.accentDark}
          style={styles.celebrationIcon}
        />
        <Text style={styles.celebrationTitle}>TODAY IS YOUR SHARED BIRTHDAY</Text>
        <Text style={styles.celebrationSub}>
          Celebrate in high style with your global and local Vela twins!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <VelaIcon
            name="timer-outline"
            size={12}
            color={Colors.accentDark}
            style={styles.sparkleIcon}
          />
          <Text style={styles.badgeText}>NEXT COLLECTIVE CELEBRATION</Text>
        </View>
        <Text style={styles.dateLabel}>{countdown.formattedDate}</Text>
      </View>

      <View style={styles.timerRow}>
        <View style={styles.timerBlock}>
          <Text style={styles.numberText}>{countdown.days}</Text>
          <Text style={styles.unitText}>DAYS</Text>
        </View>
        <Text style={styles.colonText}>:</Text>

        <View style={styles.timerBlock}>
          <Text style={styles.numberText}>
            {countdown.hours.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.unitText}>HOURS</Text>
        </View>
        <Text style={styles.colonText}>:</Text>

        <View style={styles.timerBlock}>
          <Text style={styles.numberText}>
            {countdown.minutes.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.unitText}>MINS</Text>
        </View>
        <Text style={styles.colonText}>:</Text>

        <View style={styles.timerBlock}>
          <Text style={styles.numberText}>
            {countdown.seconds.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.unitText}>SECS</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 6,
  },
  celebrationContainer: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
    alignItems: 'center',
    paddingVertical: 20,
  },
  celebrationIcon: {
    marginBottom: 6,
  },
  celebrationTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textPrimary,
  },
  celebrationSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.accentDark,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerBlock: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 64,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  numberText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  colonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 10,
  },
});
