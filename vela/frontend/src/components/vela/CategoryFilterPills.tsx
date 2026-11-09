import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AgeCategory } from '../../types/vela';
import { COLORS } from '../../theme/colors';
import { VelaIcon } from './VelaIcon';

interface CategoryOption {
  key: AgeCategory;
  label: string;
  iconName: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'Everyone', iconName: 'globe-outline' },
  { key: 'newborn', label: 'Newborns (0-11m)', iconName: 'heart-circle-outline' },
  { key: 'toddler', label: 'Toddlers (1-3y)', iconName: 'happy-outline' },
  { key: 'kid', label: 'Kids (4-12y)', iconName: 'school-outline' },
  { key: 'teen', label: 'Teens (13-17y)', iconName: 'headset-outline' },
  { key: 'adult', label: 'Adults (18+)', iconName: 'wine-outline' },
];

interface Props {
  selectedCategory: AgeCategory;
  onSelectCategory: (category: AgeCategory) => void;
}

export const CategoryFilterPills: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const iconColor = isSelected ? COLORS.black : COLORS.textSecondary;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.pill,
                isSelected ? styles.pillActive : styles.pillInactive,
              ]}
              onPress={() => onSelectCategory(cat.key)}
              activeOpacity={0.8}
            >
              <VelaIcon
                name={cat.iconName}
                size={14}
                color={iconColor}
                style={styles.pillIcon}
              />
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  pillInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  pillIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  pillTextInactive: {
    color: COLORS.textSecondary,
  },
});

