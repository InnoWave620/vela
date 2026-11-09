import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { VelaEvent, AgeCategory } from '../../types/vela';
import { VelaIcon } from './VelaIcon';

interface EventCardProps {
  event: VelaEvent;
  onToggleJoin: (eventId: string) => void;
  onBookArtist?: (event: VelaEvent) => void;
}

const CATEGORY_META: Record<AgeCategory, { label: string; icon: string }> = {
  all: { label: 'All Generations', icon: 'globe-outline' },
  newborn: { label: 'Babies & Toddlers', icon: 'heart-circle-outline' },
  toddler: { label: 'Toddlers (1-3y)', icon: 'happy-outline' },
  kid: { label: 'Kids (4-12y)', icon: 'school-outline' },
  teen: { label: 'Teens (13-17y)', icon: 'headset-outline' },
  adult: { label: 'Adults (18+)', icon: 'wine-outline' },
};

export const EventCard: React.FC<EventCardProps> = ({ event, onToggleJoin, onBookArtist }) => {
  const catMeta = event.ageCategory ? CATEGORY_META[event.ageCategory] : CATEGORY_META.all;
  const headline = event.headlineArtist;
  const isSponsored = event.isVelaSponsored || headline?.isVelaSponsored;

  return (
    <View style={styles.card}>
      {/* Event Cover Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.coverImage }} style={styles.coverImage} />
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{event.celebrationDate}</Text>
        </View>
        <View style={styles.categoryPill}>
          <VelaIcon
            name={catMeta.icon}
            size={11}
            color={Colors.accent}
            style={styles.pillIcon}
          />
          <Text style={styles.categoryPillText}>{catMeta.label}</Text>
        </View>
        <View style={styles.dressCodePill}>
          <VelaIcon
            name="shirt-outline"
            size={11}
            color={Colors.accent}
            style={styles.pillIcon}
          />
          <Text style={styles.dressCodeText}>{event.dressCode}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.hostText}>Hosted by {event.hostName}</Text>

        <View style={styles.infoRow}>
          <VelaIcon
            name="location-outline"
            size={14}
            color={Colors.accentDark}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            {event.venue}, {event.city}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <VelaIcon
            name="time-outline"
            size={14}
            color={Colors.accentDark}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>{event.time}</Text>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        {/* HEADLINE ARTIST / VELA SPONSORSHIP SECTION */}
        {headline ? (
          <View
            style={[
              styles.artistBox,
              isSponsored ? styles.artistBoxSponsored : styles.artistBoxRegular,
            ]}>
            {/* Header Badge */}
            <View style={styles.artistHeaderRow}>
              <View
                style={[
                  styles.artistStatusBadge,
                  isSponsored
                    ? styles.artistStatusBadgeSponsored
                    : styles.artistStatusBadgeRegular,
                ]}>
                <VelaIcon
                  name={isSponsored ? 'ribbon-outline' : 'musical-notes-outline'}
                  size={12}
                  color={isSponsored ? Colors.goldAccent : Colors.accentDark}
                  style={styles.artistStatusIcon}
                />
                <Text
                  style={[
                    styles.artistStatusText,
                    isSponsored
                      ? styles.artistStatusTextSponsored
                      : styles.artistStatusTextRegular,
                  ]}>
                  {isSponsored
                    ? 'VELA SPONSORED GUEST HEADLINER'
                    : 'CONFIRMED HEADLINE ACT'}
                </Text>
              </View>

              {onBookArtist && (
                <Pressable
                  onPress={() => onBookArtist(event)}
                  style={styles.artistManageBtn}
                  hitSlop={8}>
                  <Text style={styles.artistManageBtnText}>Manage</Text>
                </Pressable>
              )}
            </View>

            {/* Artist Detail Card */}
            <View style={styles.artistContentRow}>
              <Image
                source={{ uri: headline.avatar }}
                style={[
                  styles.artistAvatar,
                  isSponsored && styles.artistAvatarSponsored,
                ]}
              />
              <View style={styles.artistMeta}>
                <Text style={styles.artistName}>{headline.name}</Text>
                <Text style={styles.artistGenre}>
                  {headline.genre}
                  {headline.setTime ? ` • ${headline.setTime}` : ''}
                </Text>
                {headline.bookingFee && (
                  <View style={styles.artistFeeRow}>
                    <VelaIcon
                      name="cash-outline"
                      size={12}
                      color={Colors.textMuted}
                      style={styles.artistFeeIcon}
                    />
                    <Text style={styles.artistFeeText}>
                      {isSponsored
                        ? 'Fully Funded by VELA Society Grant'
                        : `Pooled Budget: ${headline.bookingFee}`}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Sponsor Grant Note */}
            {(headline.sponsorGrantDetails || event.sponsorGrantDetails) && (
              <View style={styles.sponsorGrantBox}>
                <VelaIcon
                  name="shield-checkmark-outline"
                  size={14}
                  color={Colors.goldAccent}
                  style={styles.sponsorGrantIcon}
                />
                <Text style={styles.sponsorGrantText}>
                  {headline.sponsorGrantDetails || event.sponsorGrantDetails}
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* Option to Book Artist or Apply for Sponsorship */
          onBookArtist && (
            <Pressable
              onPress={() => onBookArtist(event)}
              style={styles.bookArtistTrigger}>
              <View style={styles.bookArtistIconCircle}>
                <VelaIcon
                  name="musical-notes-outline"
                  size={16}
                  color={Colors.goldAccent}
                />
              </View>
              <View style={styles.bookArtistTriggerContent}>
                <Text style={styles.bookArtistTriggerTitle}>
                  Book Celebrity Artist or Request Sponsorship
                </Text>
                <Text style={styles.bookArtistTriggerSubtitle}>
                  Pool funds with twins or apply for a VELA Society Guest Grant
                </Text>
              </View>
              <VelaIcon
                name="chevron-forward-outline"
                size={16}
                color={Colors.textMuted}
              />
            </Pressable>
          )
        )}

        {/* RSVP List of Birthday Twins */}
        <View style={styles.rsvpSection}>
          <Text style={styles.rsvpLabel}>
            TWINS ATTENDING ({event.attendees.length}/{event.maxAttendees})
          </Text>
          <View style={styles.avatarStack}>
            {event.attendees.map((attendee, idx) => (
              <Image
                key={attendee.id + idx}
                source={{ uri: attendee.avatar }}
                style={[styles.attendeeAvatar, { marginLeft: idx === 0 ? 0 : -10 }]}
              />
            ))}
            <View style={[styles.avatarMore, { marginLeft: -10 }]}>
              <Text style={styles.avatarMoreText}>
                +{Math.max(0, event.attendees.length - 4)}
              </Text>
            </View>
          </View>
        </View>

        {/* Join / Attending Button */}
        <Pressable
          onPress={() => onToggleJoin(event.id)}
          style={[
            styles.joinButton,
            event.isJoined && styles.joinedButton,
          ]}>
          <VelaIcon
            name={event.isJoined ? 'checkmark-circle-outline' : 'ticket-outline'}
            size={16}
            color={event.isJoined ? Colors.success : Colors.background}
            style={styles.btnIcon}
          />
          <Text
            style={[
              styles.joinButtonText,
              event.isJoined && styles.joinedButtonText,
            ]}>
            {event.isJoined ? 'You are Attending' : 'Join Celebration'}
          </Text>
        </Pressable>
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
    height: 190,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dateBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  categoryPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.videoBadge,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  pillIcon: {
    marginRight: 4,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
  },
  dressCodePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.videoBadge,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dressCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.background,
  },
  body: {
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  hostText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },

  /* Artist Showcase Styles */
  artistBox: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  artistBoxSponsored: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldAccent,
  },
  artistBoxRegular: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  artistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  artistStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  artistStatusBadgeSponsored: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  artistStatusBadgeRegular: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accentDark,
  },
  artistStatusIcon: {
    marginRight: 4,
  },
  artistStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  artistStatusTextSponsored: {
    color: Colors.goldAccent,
  },
  artistStatusTextRegular: {
    color: Colors.accentDark,
  },
  artistManageBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  artistManageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  artistContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  artistAvatarSponsored: {
    borderColor: Colors.goldAccent,
    borderWidth: 1.5,
  },
  artistMeta: {
    flex: 1,
  },
  artistName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  artistGenre: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  artistFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  artistFeeIcon: {
    marginRight: 4,
  },
  artistFeeText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  sponsorGrantBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EBD8B8',
  },
  sponsorGrantIcon: {
    marginRight: 8,
  },
  sponsorGrantText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    fontWeight: '600',
  },

  /* Empty Book Artist Trigger */
  bookArtistTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  bookArtistIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.goldLight,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bookArtistTriggerContent: {
    flex: 1,
  },
  bookArtistTriggerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bookArtistTriggerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  /* RSVP section */
  rsvpSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  rsvpLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.background,
    backgroundColor: Colors.surface,
  },
  avatarMore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 6,
  },
  joinedButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.background,
  },
  joinedButtonText: {
    color: Colors.success,
  },
});
