import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { BirthdayTwin, AgeCategory } from '../../types/vela';
import { VelaIcon } from './VelaIcon';

interface TwinCardProps {
  twin: BirthdayTwin;
  onInvite: (id: string) => void;
  onMessage?: (twin: BirthdayTwin) => void;
}

const CATEGORY_META: Record<AgeCategory, { label: string; icon: string }> = {
  all: { label: 'All Ages', icon: 'globe-outline' },
  newborn: { label: 'Newborn (0-11m)', icon: 'heart-circle-outline' },
  toddler: { label: 'Toddler (1-3y)', icon: 'happy-outline' },
  kid: { label: 'Kid (4-12y)', icon: 'school-outline' },
  teen: { label: 'Teen (13-17y)', icon: 'headset-outline' },
  adult: { label: 'Adult (18+)', icon: 'wine-outline' },
};

export const TwinCard: React.FC<TwinCardProps> = ({ twin, onInvite, onMessage }) => {
  const catMeta = twin.ageCategory ? CATEGORY_META[twin.ageCategory] : CATEGORY_META.adult;

  return (
    <View style={styles.card}>
      {/* Profile Image with Overlay Badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: twin.avatar }} style={styles.avatarImage} />
        <View style={styles.topBadgeRow}>
          <View style={styles.categoryBadge}>
            <VelaIcon
              name={catMeta.icon}
              size={11}
              color={Colors.accent}
              style={styles.badgeIcon}
            />
            <Text style={styles.categoryBadgeText}>{catMeta.label}</Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{twin.matchScore}% SYNC</Text>
          </View>
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.nameText}>
            {twin.name}, {twin.age}
          </Text>
          <Text style={styles.occupationText}>{twin.occupation}</Text>
          {twin.isParentManaged && twin.parentGuardianName ? (
            <View style={styles.parentRow}>
              <VelaIcon
                name="shield-checkmark-outline"
                size={12}
                color={Colors.accent}
                style={styles.parentIcon}
              />
              <Text style={styles.parentText}>Managed by {twin.parentGuardianName}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Body Details */}
      <View style={styles.body}>
        <View style={styles.locationRow}>
          <VelaIcon
            name="location-outline"
            size={14}
            color={Colors.textMuted}
            style={styles.locationPin}
          />
          <Text style={styles.locationText}>{twin.location}</Text>
        </View>

        <Text style={styles.bioText}>{twin.bio}</Text>

        {/* Interests Pills */}
        <View style={styles.interestsRow}>
          {twin.mutualInterests.map((interest, idx) => (
            <View key={idx} style={styles.interestPill}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            disabled={twin.isInvited}
            onPress={() => onInvite(twin.id)}
            style={[
              styles.inviteButton,
              twin.isInvited && styles.inviteButtonSent,
            ]}>
            <VelaIcon
              name={twin.isInvited ? 'checkmark-circle-outline' : 'mail-outline'}
              size={15}
              color={twin.isInvited ? Colors.success : Colors.background}
              style={styles.inviteIcon}
            />
            <Text
              style={[
                styles.inviteButtonText,
                twin.isInvited && styles.inviteButtonTextSent,
              ]}>
              {twin.isInvited ? 'Celebration Invite Sent' : 'Invite to Celebrate'}
            </Text>
          </Pressable>

          {onMessage && (
            <Pressable
              onPress={() => onMessage(twin)}
              style={styles.messageButton}>
              <VelaIcon
                name="chatbubble-ellipses-outline"
                size={18}
                color={Colors.textPrimary}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 290,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topBadgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  badgeIcon: {
    marginRight: 4,
  },
  categoryBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePill: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  scoreText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#00000099',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: -0.3,
  },
  occupationText: {
    fontSize: 13,
    color: '#E5E7EB',
    marginTop: 2,
    fontWeight: '500',
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  parentIcon: {
    marginRight: 4,
  },
  parentText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '700',
  },
  body: {
    padding: 18,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationPin: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bioText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  interestPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  interestText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  inviteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteIcon: {
    marginRight: 6,
  },
  inviteButtonSent: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.background,
  },
  inviteButtonTextSent: {
    color: Colors.success,
  },
  messageButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
