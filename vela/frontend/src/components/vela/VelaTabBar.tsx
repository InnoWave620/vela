import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { useVela, VelaTab } from '../../context/VelaContext';
import { VelaIcon } from './VelaIcon';

interface TabItem {
  id: VelaTab;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}

const TABS: TabItem[] = [
  { id: 'feed', label: 'Feed', activeIcon: 'home', inactiveIcon: 'home-outline' },
  { id: 'twins', label: 'Twins', activeIcon: 'people', inactiveIcon: 'people-outline' },
  { id: 'events', label: 'Planner', activeIcon: 'calendar', inactiveIcon: 'calendar-outline' },
  { id: 'profile', label: 'Profile', activeIcon: 'person', inactiveIcon: 'person-outline' },
];

export const VelaTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useVela();

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconColor = isActive ? Colors.accentDark : Colors.textMuted;
          const iconName = isActive ? tab.activeIcon : tab.inactiveIcon;

          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}>
              <VelaIcon
                name={iconName}
                size={20}
                color={iconColor}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    minWidth: 70,
  },
  tabButtonActive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
});
