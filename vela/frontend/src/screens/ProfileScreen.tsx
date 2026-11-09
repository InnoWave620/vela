import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Header } from '../components/vela/Header';
import { BirthdayCountdownBanner } from '../components/vela/BirthdayCountdownBanner';
import { BirthdayPicker } from '../components/vela/BirthdayPicker';
import { AvatarPickerModal } from '../components/vela/AvatarPickerModal';
import { VelaIcon } from '../components/vela/VelaIcon';
import { useVela } from '../context/VelaContext';
import { formatBirthday } from '../utils/dateUtils';

interface Props {
  onOpenOnboarding?: () => void;
}

const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  newborn: { label: 'Newborn', icon: 'heart-circle-outline' },
  toddler: { label: 'Toddler', icon: 'happy-outline' },
  kid: { label: 'Kid', icon: 'school-outline' },
  teen: { label: 'Teen', icon: 'headset-outline' },
  adult: { label: 'Adult', icon: 'wine-outline' },
  all: { label: 'Everyone', icon: 'globe-outline' },
};

export const ProfileScreen: React.FC<Props> = ({ onOpenOnboarding }) => {
  const {
    user,
    countdown,
    updateBirthday,
    updateAvatar,
    logout,
    isAuthenticated,
    openAuthModal,
    requireAuth,
  } = useVela();

  const [showEditBday, setShowEditBday] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleBdayChange = (newDob: string) => {
    updateBirthday(newDob);
  };

  const handleAvatarPress = () => {
    if (!requireAuth('customize your profile picture and verified member avatar')) {
      return;
    }
    setShowAvatarModal(true);
  };

  const categoryMeta = user.ageCategory
    ? CATEGORY_MAP[user.ageCategory] || CATEGORY_MAP.adult
    : CATEGORY_MAP.adult;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isAuthenticated ? 'Member Dossier' : 'Guest Dossier'}
        subtitle={
          isAuthenticated
            ? 'Your verified profile within the society'
            : 'Free browsing mode • Sign in to unlock full member features'
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Guest Notification Banner */}
        {!isAuthenticated && (
          <View style={styles.guestBannerCard}>
            <View style={styles.guestBannerHeader}>
              <View style={styles.guestIconCircle}>
                <VelaIcon name="shield-outline" size={18} color={Colors.goldAccent} />
              </View>
              <View style={styles.guestHeaderTextContainer}>
                <Text style={styles.guestTitle}>Free Browsing Active</Text>
                <Text style={styles.guestSubtitle}>
                  You have full free access to view the twin feed, events, and rosters.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => openAuthModal('host events, post memories, and message birthday twins')}
              style={styles.guestAuthBtn}>
              <VelaIcon name="key-outline" size={15} color={Colors.background} style={styles.btnIcon} />
              <Text style={styles.guestAuthBtnText}>Sign In / Request Member Invitation</Text>
            </Pressable>
          </View>
        )}

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.topProfileRow}>
            {/* Interactive Avatar with Camera Badge */}
            <Pressable onPress={handleAvatarPress} style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.avatarEditBadge}>
                <VelaIcon name="camera-outline" size={13} color={Colors.background} />
              </View>
            </Pressable>

            <View style={styles.mainInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.tierPill}>
                  <VelaIcon
                    name="shield-outline"
                    size={9}
                    color={Colors.goldAccent}
                    style={styles.tierIcon}
                  />
                  <Text style={styles.tierText}>{user.membershipTier.toUpperCase()}</Text>
                </View>
                <View style={styles.categoryPill}>
                  <VelaIcon
                    name={categoryMeta.icon}
                    size={10}
                    color={Colors.accentDark}
                    style={styles.tierIcon}
                  />
                  <Text style={styles.categoryPillText}>{categoryMeta.label}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              {user.isParentManaged && user.parentGuardianName ? (
                <View style={styles.parentRow}>
                  <VelaIcon
                    name="shield-checkmark-outline"
                    size={11}
                    color={Colors.accentDark}
                    style={styles.inlineIcon}
                  />
                  <Text style={styles.parentText}>Managed by {user.parentGuardianName}</Text>
                </View>
              ) : null}
              <Text style={styles.occupation}>{user.occupation}</Text>
              <View style={styles.locationRow}>
                <VelaIcon
                  name="location-outline"
                  size={12}
                  color={Colors.textMuted}
                  style={styles.inlineIcon}
                />
                <Text style={styles.location}>{user.location}</Text>
              </View>
            </View>
          </View>

          {/* Tap to change avatar helper notice */}
          <Pressable onPress={handleAvatarPress} style={styles.changeAvatarTrigger}>
            <VelaIcon name="image-outline" size={13} color={Colors.accentDark} style={styles.triggerIcon} />
            <Text style={styles.changeAvatarTriggerText}>Change Profile Picture &amp; Avatar</Text>
          </Pressable>

          <Text style={styles.bioText}>{user.bio}</Text>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.twinsConnected}</Text>
              <Text style={styles.statLabel}>TWINS CONNECTED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.eventsAttended}</Text>
              <Text style={styles.statLabel}>GALAS ATTENDED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>DATE SYNC</Text>
            </View>
          </View>
        </View>

        {/* Exact Birthday Banner & Countdown */}
        <View style={styles.bdaySection}>
          <View style={styles.bdayHeaderRow}>
            <View>
              <Text style={styles.bdaySectionTag}>AUTHENTICATED DATE</Text>
              <Text style={styles.bdayMainText}>
                {formatBirthday(user.dateOfBirth)}, {user.birthYear}
              </Text>
            </View>
            <Pressable
              onPress={() => setShowEditBday(true)}
              style={styles.changeBdayBtn}>
              <Text style={styles.changeBdayText}>Simulate New Date</Text>
            </Pressable>
          </View>

          <BirthdayCountdownBanner countdown={countdown} />
        </View>

        {/* Memories / Photo Grid */}
        <View style={styles.gallerySection}>
          <Text style={styles.galleryTitle}>BIRTHDAY ARCHIVE &amp; MEMORIES</Text>
          <Text style={styles.gallerySubtitle}>
            Moments captured at joint Vela birthday celebrations.
          </Text>

          <View style={styles.photoGrid}>
            {user.photos.map((photoUrl, idx) => (
              <Image key={idx} source={{ uri: photoUrl }} style={styles.gridImage} />
            ))}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsContainer}>
          {isAuthenticated ? (
            <>
              {onOpenOnboarding && (
                <Pressable
                  onPress={onOpenOnboarding}
                  style={styles.secondaryActionBtn}>
                  <Text style={styles.secondaryActionText}>
                    Switch Account / Sign In with Another Profile
                  </Text>
                </Pressable>
              )}

              <Pressable onPress={logout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Sign Out to Guest Mode</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => openAuthModal('access member privileges')}
              style={styles.primaryAuthActionBtn}>
              <VelaIcon name="key-outline" size={16} color={Colors.background} style={styles.btnIcon} />
              <Text style={styles.primaryAuthActionBtnText}>Sign In / Member Access</Text>
            </Pressable>
          )}
        </View>

        {/* Edit Birthday Modal */}
        <Modal visible={showEditBday} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Text style={styles.modalTitle}>Select Different Birthday</Text>
                <Pressable onPress={() => setShowEditBday(false)}>
                  <VelaIcon name="close-outline" size={20} color={Colors.textSecondary} />
                </Pressable>
              </View>
              <Text style={styles.modalSub}>
                Testing: Changing your birth date dynamically swaps your feed, twins, and events!
              </Text>
              <BirthdayPicker
                initialDate={user.dateOfBirth}
                onDateSelected={handleBdayChange}
              />
              <Pressable
                onPress={() => setShowEditBday(false)}
                style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply Date</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Avatar Picker Modal */}
        <AvatarPickerModal
          visible={showAvatarModal}
          currentAvatar={user.avatar}
          onClose={() => setShowAvatarModal(false)}
          onSelectAvatar={(newUrl) => updateAvatar(newUrl)}
        />
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

  /* Guest Banner */
  guestBannerCard: {
    backgroundColor: Colors.goldLight,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  guestBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.goldAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  guestHeaderTextContainer: {
    flex: 1,
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  guestSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  guestAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textPrimary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  guestAuthBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.background,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  topProfileRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  changeAvatarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  triggerIcon: {
    marginRight: 6,
  },
  changeAvatarTriggerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  tierIcon: {
    marginRight: 3,
  },
  tierText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.goldAccent,
    letterSpacing: 0.5,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.accentDark,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accentDark,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  parentText: {
    fontSize: 11,
    color: Colors.accentDark,
    fontWeight: '700',
  },
  occupation: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  inlineIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bioText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  bdaySection: {
    marginBottom: 20,
  },
  bdayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bdaySectionTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.accentDark,
  },
  bdayMainText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  changeBdayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changeBdayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  gallerySection: {
    marginBottom: 24,
  },
  galleryTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  gallerySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridImage: {
    width: '31.5%',
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 30,
  },
  secondaryActionBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  primaryAuthActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  primaryAuthActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.error,
  },
  btnIcon: {
    marginRight: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '80%',
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 16,
  },
  applyBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
});
