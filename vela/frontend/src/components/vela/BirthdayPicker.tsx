import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { getZodiacSign, getMonthName } from '../../utils/dateUtils';
import { VelaIcon } from './VelaIcon';

interface BirthdayPickerProps {
  initialDate?: string; // YYYY-MM-DD
  onDateSelected: (date: string) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 45 }, (_, i) => 2006 - i); // 2006 down to 1962

export const BirthdayPicker: React.FC<BirthdayPickerProps> = ({
  initialDate = '1998-10-27',
  onDateSelected,
}) => {
  const parts = initialDate.split('-');
  const [selectedYear, setSelectedYear] = useState(parseInt(parts[0], 10) || 1998);
  const [selectedMonth, setSelectedMonth] = useState(parseInt(parts[1], 10) || 10);
  const [selectedDay, setSelectedDay] = useState(parseInt(parts[2], 10) || 27);

  const zodiac = getZodiacSign(selectedDay, selectedMonth);
  const fullMonthName = getMonthName(selectedMonth);

  const handleUpdate = (y: number, m: number, d: number) => {
    setSelectedYear(y);
    setSelectedMonth(m);
    setSelectedDay(d);
    const formatted = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    onDateSelected(formatted);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>EXACT DATE OF BIRTH</Text>
        <Text style={styles.instruction}>
          Every member in your circle is born on this exact calendar day.
        </Text>
      </View>

      {/* Prominent Selected Date Hero Pill */}
      <View style={styles.heroPreview}>
        <View style={styles.heroDateRow}>
          <Text style={styles.heroDayText}>{selectedDay}</Text>
          <View style={styles.heroMonthCol}>
            <Text style={styles.heroMonthText}>{fullMonthName.toUpperCase()}</Text>
            <Text style={styles.heroYearText}>{selectedYear}</Text>
          </View>
        </View>

        <View style={styles.zodiacBadge}>
          <VelaIcon
            name="planet-outline"
            size={12}
            color={Colors.accentDark}
            style={styles.zodiacIcon}
          />
          <Text style={styles.zodiacText}>{zodiac.toUpperCase()}</Text>
        </View>
      </View>

      {/* Month Selector */}
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>MONTH</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}>
          {MONTHS.map((m, idx) => {
            const monthNum = idx + 1;
            const isSelected = selectedMonth === monthNum;
            return (
              <Pressable
                key={m}
                onPress={() => handleUpdate(selectedYear, monthNum, selectedDay)}
                style={[styles.pill, isSelected && styles.pillActive]}>
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Day Selector */}
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>DAY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}>
          {DAYS.map((d) => {
            const isSelected = selectedDay === d;
            return (
              <Pressable
                key={d}
                onPress={() => handleUpdate(selectedYear, selectedMonth, d)}
                style={[styles.dayPill, isSelected && styles.dayPillActive]}>
                <Text style={[styles.dayPillText, isSelected && styles.dayPillTextActive]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Year Selector */}
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>BIRTH YEAR</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}>
          {YEARS.map((y) => {
            const isSelected = selectedYear === y;
            return (
              <Pressable
                key={y}
                onPress={() => handleUpdate(y, selectedMonth, selectedDay)}
                style={[styles.pill, isSelected && styles.pillActive]}>
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {y}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Value Proposition Twin Metric */}
      <View style={styles.metricBanner}>
        <View style={styles.metricDot} />
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>
            ~14,200 Potential Birthday Twins Globally
          </Text>
          <Text style={styles.metricSub}>
            28 verified Vela members are currently planning events for this date.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.accentDark,
    marginBottom: 4,
  },
  instruction: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  heroPreview: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20,
  },
  heroDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroDayText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  heroMonthCol: {
    justifyContent: 'center',
  },
  heroMonthText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  heroYearText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  zodiacBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  zodiacIcon: {
    marginRight: 4,
  },
  zodiacText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textPrimary,
  },
  pickerSection: {
    marginBottom: 14,
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  scrollRow: {
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.background,
    fontWeight: '800',
  },
  dayPill: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  dayPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayPillTextActive: {
    color: Colors.background,
    fontWeight: '800',
  },
  metricBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.goldAccent,
    marginTop: 6,
    gap: 10,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.goldAccent,
    marginTop: 5,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
});

