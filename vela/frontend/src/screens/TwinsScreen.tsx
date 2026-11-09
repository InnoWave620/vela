import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Header } from '../components/vela/Header';
import { TwinCard } from '../components/vela/TwinCard';
import { CategoryFilterPills } from '../components/vela/CategoryFilterPills';
import { VelaIcon } from '../components/vela/VelaIcon';
import { useVela } from '../context/VelaContext';
import { BirthdayTwin } from '../types/vela';
import { formatBirthday } from '../utils/dateUtils';

export const TwinsScreen: React.FC = () => {
  const { twins, user, inviteTwin, requireAuth, twinsCategory, setTwinsCategory } = useVela();
  const [filterRadius, setFilterRadius] = useState<'all' | 'nearby' | 'high_sync'>('all');
  const [activeTwinIndex, setActiveTwinIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'directory' | 'stack'>('directory');

  const filteredTwins = twins.filter((twin) => {
    if (filterRadius === 'nearby') return twin.distanceMiles <= 20;
    if (filterRadius === 'high_sync') return twin.matchScore >= 92;
    return true;
  });

  const handleInvite = (twinId: string) => {
    if (!requireAuth('connect with birthday twins and send celebration invitations')) return;
    inviteTwin(twinId);
  };

  const handleMessage = (twin: BirthdayTwin) => {
    if (!requireAuth('initiate encrypted twin correspondence')) return;
    const parentMsg = twin.isParentManaged && twin.parentGuardianName
      ? ` (Parent Managed by ${twin.parentGuardianName})`
      : '';
    Alert.alert(
      `Private Line to ${twin.name}${parentMsg}`,
      `Connected through shared birth date: ${formatBirthday(twin.birthDate)}. You can initiate encrypted correspondence to plan your joint celebration.`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const currentStackTwin = filteredTwins[activeTwinIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Birthday Twins"
        subtitle={`Members sharing your exact birth date: ${formatBirthday(user.dateOfBirth)}`}
      />

      {/* Life-Stage Category Selector */}
      <CategoryFilterPills
        selectedCategory={twinsCategory}
        onSelectCategory={setTwinsCategory}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* View Mode & Filter Bar */}
        <View style={styles.controlsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPills}>
            <Pressable
              onPress={() => setFilterRadius('all')}
              style={[styles.filterChip, filterRadius === 'all' && styles.filterChipActive]}>
              <Text style={[styles.filterText, filterRadius === 'all' && styles.filterTextActive]}>
                All Twins ({filteredTwins.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilterRadius('nearby')}
              style={[styles.filterChip, filterRadius === 'nearby' && styles.filterChipActive]}>
              <VelaIcon
                name="location-outline"
                size={12}
                color={filterRadius === 'nearby' ? Colors.accentDark : Colors.textSecondary}
                style={styles.chipIcon}
              />
              <Text style={[styles.filterText, filterRadius === 'nearby' && styles.filterTextActive]}>
                Nearby (&lt;20 mi)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilterRadius('high_sync')}
              style={[styles.filterChip, filterRadius === 'high_sync' && styles.filterChipActive]}>
              <VelaIcon
                name="sync-outline"
                size={11}
                color={filterRadius === 'high_sync' ? Colors.accentDark : Colors.textSecondary}
                style={styles.chipIcon}
              />
              <Text style={[styles.filterText, filterRadius === 'high_sync' && styles.filterTextActive]}>
                90%+ Sync
              </Text>
            </Pressable>
          </ScrollView>

          <View style={styles.viewToggle}>
            <Pressable
              onPress={() => setViewMode('directory')}
              style={[styles.modeBtn, viewMode === 'directory' && styles.modeBtnActive]}>
              <Text style={[styles.modeBtnText, viewMode === 'directory' && styles.modeBtnTextActive]}>
                Directory
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('stack')}
              style={[styles.modeBtn, viewMode === 'stack' && styles.modeBtnActive]}>
              <Text style={[styles.modeBtnText, viewMode === 'stack' && styles.modeBtnTextActive]}>
                Stack
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Directory View */}
        {viewMode === 'directory' && (
          <View style={styles.twinsList}>
            {filteredTwins.length > 0 ? (
              filteredTwins.map((twin) => (
                <TwinCard
                  key={twin.id}
                  twin={twin}
                  onInvite={handleInvite}
                  onMessage={handleMessage}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <VelaIcon
                  name="people-outline"
                  size={36}
                  color={Colors.textMuted}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No twins in this category yet</Text>
                <Text style={styles.emptyText}>
                  Invite friends and family born on {formatBirthday(user.dateOfBirth)} to build the circle!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Interactive Stack View */}
        {viewMode === 'stack' && (
          <View style={styles.stackContainer}>
            {currentStackTwin ? (
              <View>
                <TwinCard
                  twin={currentStackTwin}
                  onInvite={handleInvite}
                  onMessage={handleMessage}
                />
                <View style={styles.stackControls}>
                  <Pressable
                    onPress={() =>
                      setActiveTwinIndex((prev) => (prev > 0 ? prev - 1 : filteredTwins.length - 1))
                    }
                    style={styles.stackNavBtn}>
                    <VelaIcon
                      name="chevron-back"
                      size={14}
                      color={Colors.textSecondary}
                      style={styles.navIcon}
                    />
                    <Text style={styles.stackNavText}>Previous</Text>
                  </Pressable>
                  <Text style={styles.stackCounter}>
                    {activeTwinIndex + 1} of {filteredTwins.length}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setActiveTwinIndex((prev) => (prev < filteredTwins.length - 1 ? prev + 1 : 0))
                    }
                    style={[styles.stackNavBtn, styles.stackNavBtnPrimary]}>
                    <Text style={[styles.stackNavText, styles.stackNavTextPrimary]}>
                      Next Twin
                    </Text>
                    <VelaIcon
                      name="chevron-forward"
                      size={14}
                      color={Colors.background}
                      style={styles.navIconRight}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No twins matched this filter.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 100, // Space for custom tab bar
  },
  controlsRow: {
    marginBottom: 16,
    gap: 12,
  },
  filterPills: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipIcon: {
    marginRight: 4,
  },
  filterChipActive: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignSelf: 'flex-start',
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: Colors.background,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modeBtnTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  twinsList: {
    marginTop: 4,
  },
  stackContainer: {
    marginTop: 4,
  },
  stackControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },
  stackNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navIcon: {
    marginRight: 4,
  },
  navIconRight: {
    marginLeft: 4,
  },
  stackNavBtnPrimary: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  stackNavText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stackNavTextPrimary: {
    color: Colors.background,
  },
  stackCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
