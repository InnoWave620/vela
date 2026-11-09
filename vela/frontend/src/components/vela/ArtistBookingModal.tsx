import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { CelebrityArtist, VelaEvent } from '../../types/vela';
import { eventsService } from '../../services/eventsService';
import { VelaIcon } from './VelaIcon';

interface ArtistBookingModalProps {
  visible: boolean;
  event: VelaEvent | null;
  onClose: () => void;
  onBookingComplete: (updatedEvent: VelaEvent) => void;
}

const GENRE_FILTERS = [
  'All',
  'Afro House',
  'Soul & R&B',
  'Techno & House',
  'Classical',
  'Amapiano',
  'Acoustic',
];

export const ArtistBookingModal: React.FC<ArtistBookingModalProps> = ({
  visible,
  event,
  onClose,
  onBookingComplete,
}) => {
  const [artists, setArtists] = useState<CelebrityArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState<CelebrityArtist | null>(null);
  const [isSponsorshipMode, setIsSponsorshipMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadArtists();
      setSelectedArtist(null);
      setIsSponsorshipMode(false);
      setNotes('');
    }
  }, [visible]);

  const loadArtists = async (genre?: string) => {
    setLoading(true);
    try {
      const data = await eventsService.getArtists(genre);
      setArtists(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(genre);
    loadArtists(genre === 'All' ? undefined : genre);
  };

  const handleInitiateBooking = (artist: CelebrityArtist, isSponsored: boolean) => {
    setSelectedArtist(artist);
    setIsSponsorshipMode(isSponsored);
    setNotes(
      isSponsored
        ? `Requesting VELA Society Patron Foundation to sponsor ${artist.name} as our milestone guest celebrity headliner.`
        : `Twin co-funding proposal for ${artist.name} headline performance.`
    );
  };

  const handleConfirmBooking = async () => {
    if (!event || !selectedArtist) return;

    setSubmitting(true);
    try {
      const updated = await eventsService.bookArtistForEvent(
        event.id,
        selectedArtist.id,
        isSponsorshipMode,
        notes
      );

      if (updated) {
        Alert.alert(
          isSponsorshipMode ? 'VELA Sponsorship Requested' : 'Artist Booking Initiated',
          isSponsorshipMode
            ? `VELA Society Concierge has received your sponsorship request for ${selectedArtist.name}. The grant is approved for this milestone twin celebration!`
            : `${selectedArtist.name} has been reserved. Birthday twins can now contribute to the pooled artist fee.`
        );
        onBookingComplete(updated);
        onClose();
      }
    } catch {
      Alert.alert('Booking Error', 'Unable to complete artist booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Celebrity Artist Roster</Text>
            <Text style={styles.subtitle}>
              Book famous performers or request VELA Society Sponsorship
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
            <VelaIcon name="close-outline" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        {/* Target Event Context */}
        {event && (
          <View style={styles.eventContextBanner}>
            <VelaIcon name="calendar-outline" size={16} color={Colors.accentDark} style={styles.bannerIcon} />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerEventTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.bannerEventMeta}>
                {event.celebrationDate} • {event.city}
              </Text>
            </View>
          </View>
        )}

        {/* Confirmation Sheet Overlay */}
        {selectedArtist ? (
          <View style={styles.confirmContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.confirmContent}>
              <View
                style={[
                  styles.confirmHeaderBox,
                  isSponsorshipMode ? styles.confirmHeaderBoxSponsored : styles.confirmHeaderBoxPooled,
                ]}>
                <VelaIcon
                  name={isSponsorshipMode ? 'ribbon-outline' : 'musical-notes-outline'}
                  size={20}
                  color={isSponsorshipMode ? Colors.goldAccent : Colors.accentDark}
                  style={styles.confirmHeaderIcon}
                />
                <Text
                  style={[
                    styles.confirmHeaderTitle,
                    isSponsorshipMode ? styles.confirmHeaderTitleSponsored : styles.confirmHeaderTitlePooled,
                  ]}>
                  {isSponsorshipMode
                    ? 'VELA SOCIETY GUEST SPONSORSHIP'
                    : 'TWIN POOLED ARTIST BOOKING'}
                </Text>
              </View>

              <View style={styles.confirmArtistCard}>
                <Image source={{ uri: selectedArtist.avatar }} style={styles.confirmArtistAvatar} />
                <View style={styles.confirmArtistDetails}>
                  <Text style={styles.confirmArtistName}>{selectedArtist.name}</Text>
                  <Text style={styles.confirmArtistStageTitle}>{selectedArtist.stageTitle}</Text>
                  <Text style={styles.confirmArtistFee}>
                    {isSponsorshipMode ? 'Fully Funded (VELA Grant)' : selectedArtist.bookingFeeEstimate}
                  </Text>
                </View>
              </View>

              <View style={styles.sponsorPerksBox}>
                <Text style={styles.sponsorPerksTitle}>
                  {isSponsorshipMode ? 'Patron Sponsorship Terms' : 'Pooled Twin Funding Details'}
                </Text>
                <View style={styles.perkRow}>
                  <VelaIcon name="checkmark-circle-outline" size={16} color={Colors.success} style={styles.perkIcon} />
                  <Text style={styles.perkText}>
                    {isSponsorshipMode
                      ? 'VELA Society covers 100% of performance & rider fees'
                      : 'Attendees split fee proportionally based on RSVP count'}
                  </Text>
                </View>
                <View style={styles.perkRow}>
                  <VelaIcon name="checkmark-circle-outline" size={16} color={Colors.success} style={styles.perkIcon} />
                  <Text style={styles.perkText}>
                    {selectedArtist.performanceDuration || '60-90 min headline performance set'}
                  </Text>
                </View>
                <View style={styles.perkRow}>
                  <VelaIcon name="checkmark-circle-outline" size={16} color={Colors.success} style={styles.perkIcon} />
                  <Text style={styles.perkText}>
                    Includes high-fidelity sound engineering & VIP twin photo-op
                  </Text>
                </View>
              </View>

              <Text style={styles.notesLabel}>Celebration Request / Special Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="E.g., dedicate midnight birthday toast, specific song request..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
              />

              <View style={styles.confirmActionRow}>
                <Pressable
                  onPress={() => setSelectedArtist(null)}
                  style={styles.cancelConfirmBtn}
                  disabled={submitting}>
                  <Text style={styles.cancelConfirmBtnText}>Back</Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirmBooking}
                  style={[
                    styles.submitConfirmBtn,
                    isSponsorshipMode ? styles.submitConfirmBtnGold : styles.submitConfirmBtnAccent,
                  ]}
                  disabled={submitting}>
                  {submitting ? (
                    <ActivityIndicator color={Colors.background} />
                  ) : (
                    <>
                      <VelaIcon
                        name={isSponsorshipMode ? 'ribbon-outline' : 'checkmark-outline'}
                        size={16}
                        color={isSponsorshipMode ? Colors.textPrimary : Colors.background}
                        style={styles.btnIcon}
                      />
                      <Text
                        style={[
                          styles.submitConfirmBtnText,
                          isSponsorshipMode && styles.submitConfirmBtnTextDark,
                        ]}>
                        {isSponsorshipMode ? 'Confirm VELA Sponsorship' : 'Confirm Artist Booking'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        ) : (
          <>
            {/* Genre Filter Horizontal Scroll */}
            <View style={styles.genreFilterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreScroll}>
                {GENRE_FILTERS.map((genre) => {
                  const isSelected = selectedGenre === genre;
                  return (
                    <Pressable
                      key={genre}
                      onPress={() => handleSelectGenre(genre)}
                      style={[styles.genreChip, isSelected && styles.genreChipSelected]}>
                      <Text style={[styles.genreChipText, isSelected && styles.genreChipTextSelected]}>
                        {genre}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Artists List */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accentDark} />
                <Text style={styles.loadingText}>Curating Famous Artists...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.artistsScroll}
                contentContainerStyle={styles.artistsContent}
                showsVerticalScrollIndicator={false}>
                {artists.map((artist) => (
                  <View key={artist.id} style={styles.artistCard}>
                    {/* Artist Header Info */}
                    <View style={styles.artistTopRow}>
                      <Image source={{ uri: artist.avatar }} style={styles.artistAvatar} />
                      <View style={styles.artistHeaderDetails}>
                        <View style={styles.nameBadgeRow}>
                          <Text style={styles.artistName}>{artist.name}</Text>
                          {artist.isVelaPartner && (
                            <View style={styles.partnerBadge}>
                              <VelaIcon name="shield-outline" size={10} color={Colors.goldAccent} style={styles.badgeIcon} />
                              <Text style={styles.partnerBadgeText}>PARTNER</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.stageTitle}>{artist.stageTitle}</Text>
                        <View style={styles.artistMetaRow}>
                          <View style={styles.metaPill}>
                            <VelaIcon name="musical-notes-outline" size={11} color={Colors.accentDark} style={styles.pillIcon} />
                            <Text style={styles.metaPillText}>{artist.genre}</Text>
                          </View>
                          <View style={styles.ratingRow}>
                            <VelaIcon name="star" size={12} color={Colors.goldAccent} style={styles.ratingIcon} />
                            <Text style={styles.ratingText}>{artist.rating.toFixed(1)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Artist Bio */}
                    <Text style={styles.artistBio}>{artist.bio}</Text>

                    {/* Sample Track & Performance Details */}
                    {artist.sampleTrackTitle && (
                      <View style={styles.trackBox}>
                        <View style={styles.trackIconCircle}>
                          <VelaIcon name="play-outline" size={14} color={Colors.accentDark} />
                        </View>
                        <View style={styles.trackDetails}>
                          <Text style={styles.trackTitle}>{artist.sampleTrackTitle}</Text>
                          <Text style={styles.trackDuration}>
                            {artist.performanceDuration} • {artist.location}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Fee and Action Buttons */}
                    <View style={styles.actionSection}>
                      <View style={styles.feeContainer}>
                        <Text style={styles.feeLabel}>ESTIMATED FEE</Text>
                        <Text style={styles.feeAmount}>{artist.bookingFeeEstimate}</Text>
                      </View>

                      <View style={styles.buttonsColumn}>
                        {/* 1. Apply for VELA Sponsorship (Luxury Gold) */}
                        <Pressable
                          onPress={() => handleInitiateBooking(artist, true)}
                          style={styles.sponsorBtn}>
                          <VelaIcon name="ribbon-outline" size={14} color={Colors.goldAccent} style={styles.btnIcon} />
                          <Text style={styles.sponsorBtnText}>Apply for VELA Sponsorship</Text>
                        </Pressable>

                        {/* 2. Book with Twin Pool */}
                        <Pressable
                          onPress={() => handleInitiateBooking(artist, false)}
                          style={styles.poolBtn}>
                          <VelaIcon name="cash-outline" size={14} color={Colors.background} style={styles.btnIcon} />
                          <Text style={styles.poolBtnText}>Book with Twin Pool</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4ECFA',
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerEventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bannerEventMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  genreFilterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  genreScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genreChipSelected: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  genreChipTextSelected: {
    color: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  artistsScroll: {
    flex: 1,
  },
  artistsContent: {
    padding: 16,
    paddingBottom: 40,
  },
  artistCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  artistTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  artistHeaderDetails: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  badgeIcon: {
    marginRight: 3,
  },
  partnerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.goldAccent,
    letterSpacing: 0.5,
  },
  stageTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  artistMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  pillIcon: {
    marginRight: 4,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  artistBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 12,
  },
  trackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  trackIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  trackDuration: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  actionSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  buttonsColumn: {
    gap: 8,
  },
  sponsorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.goldLight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  sponsorBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.goldAccent,
  },
  poolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
  },
  poolBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.background,
  },
  btnIcon: {
    marginRight: 6,
  },

  /* Confirm Booking Form View */
  confirmContainer: {
    flex: 1,
  },
  confirmContent: {
    padding: 20,
    paddingBottom: 40,
  },
  confirmHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  confirmHeaderBoxSponsored: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldAccent,
  },
  confirmHeaderBoxPooled: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentDark,
  },
  confirmHeaderIcon: {
    marginRight: 8,
  },
  confirmHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  confirmHeaderTitleSponsored: {
    color: Colors.goldAccent,
  },
  confirmHeaderTitlePooled: {
    color: Colors.accentDark,
  },
  confirmArtistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  confirmArtistAvatar: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginRight: 12,
  },
  confirmArtistDetails: {
    flex: 1,
  },
  confirmArtistName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmArtistStageTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  confirmArtistFee: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.goldAccent,
    marginTop: 4,
  },
  sponsorPerksBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  sponsorPerksTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  perkIcon: {
    marginRight: 8,
  },
  perkText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 13,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 20,
  },
  confirmActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  submitConfirmBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitConfirmBtnAccent: {
    backgroundColor: Colors.accent,
  },
  submitConfirmBtnGold: {
    backgroundColor: Colors.goldAccent,
  },
  submitConfirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.background,
  },
  submitConfirmBtnTextDark: {
    color: '#000000',
  },
});

