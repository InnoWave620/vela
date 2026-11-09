import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Header } from '../components/vela/Header';
import { EventCard } from '../components/vela/EventCard';
import { CategoryFilterPills } from '../components/vela/CategoryFilterPills';
import { ArtistBookingModal } from '../components/vela/ArtistBookingModal';
import { VelaIcon } from '../components/vela/VelaIcon';
import { useVela } from '../context/VelaContext';
import { formatBirthday } from '../utils/dateUtils';
import { AgeCategory, VelaEvent } from '../types/vela';

const CATEGORY_CHOICES: { key: AgeCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All Generations', icon: 'globe-outline' },
  { key: 'newborn', label: 'Babies (0-11m)', icon: 'heart-circle-outline' },
  { key: 'toddler', label: 'Toddlers (1-3y)', icon: 'happy-outline' },
  { key: 'kid', label: 'Kids (4-12y)', icon: 'school-outline' },
  { key: 'teen', label: 'Teens (13-17y)', icon: 'headset-outline' },
  { key: 'adult', label: 'Adults (18+)', icon: 'wine-outline' },
];

export const EventsScreen: React.FC = () => {
  const {
    events,
    user,
    toggleJoinEvent,
    updateEvent,
    eventsCategory,
    setEventsCategory,
    requireAuth,
  } = useVela();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [dressCode, setDressCode] = useState('Cocktail & Celestial');
  const [eventCategory, setEventCategory] = useState<AgeCategory>('all');
  const [requestSponsorship, setRequestSponsorship] = useState(false);

  // Artist Booking Modal State
  const [selectedEventForArtist, setSelectedEventForArtist] = useState<VelaEvent | null>(null);
  const [showArtistModal, setShowArtistModal] = useState(false);

  // Filter mode: all vs sponsored / headliners
  const [curationFilter, setCurationFilter] = useState<'all' | 'sponsored'>('all');

  const filteredEvents = useMemo(() => {
    if (curationFilter === 'sponsored') {
      return events.filter((e) => e.isVelaSponsored || e.headlineArtist);
    }
    return events;
  }, [events, curationFilter]);

  const sponsoredCount = useMemo(() => {
    return events.filter((e) => e.isVelaSponsored || e.headlineArtist).length;
  }, [events]);

  const handleCreateSubmit = () => {
    setShowCreateModal(false);
    setEventTitle('');
    setVenue('');
    setRequestSponsorship(false);
  };

  const handleOpenArtistBooking = (event: VelaEvent) => {
    if (!requireAuth('book celebrity headline artists or apply for VELA sponsorship')) return;
    setSelectedEventForArtist(event);
    setShowArtistModal(true);
  };

  const handleOpenHostModal = () => {
    if (!requireAuth('propose and host milestone twin celebrations')) return;
    setShowCreateModal(true);
  };

  const handleToggleJoin = (eventId: string) => {
    if (!requireAuth('RSVP and attend twin celebrations')) return;
    toggleJoinEvent(eventId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Event Planner"
        subtitle={`Collaborative celebrations for ${formatBirthday(user.dateOfBirth)} twins`}
      />

      {/* Life-Stage Category Filter */}
      <CategoryFilterPills
        selectedCategory={eventsCategory}
        onSelectCategory={setEventsCategory}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Collective Planning Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <View style={styles.heroBadgeRow}>
              <Text style={styles.heroBadge}>JOINT CELEBRATION PROTOCOL</Text>
              <View style={styles.patronGrantPill}>
                <VelaIcon name="ribbon-outline" size={10} color={Colors.goldAccent} style={styles.grantIcon} />
                <Text style={styles.patronGrantText}>VELA PATRON GRANTS ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Why Celebrate Alone?</Text>
            <Text style={styles.heroSub}>
              Pool your milestones. Book world-class headline artists or apply for VELA Society to sponsor guest celebrities for your birthday gala.
            </Text>
          </View>

          <View style={styles.heroActionRow}>
            <Pressable
              onPress={handleOpenHostModal}
              style={styles.hostButton}>
              <VelaIcon
                name="add"
                size={14}
                color={Colors.background}
                style={styles.hostIcon}
              />
              <Text style={styles.hostButtonText}>Host Celebration</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                const target = events.find((e) => !e.headlineArtist) || events[0];
                if (target) {
                  handleOpenArtistBooking(target);
                }
              }}
              style={styles.browseArtistsBtn}>
              <VelaIcon
                name="musical-notes-outline"
                size={14}
                color={Colors.goldAccent}
                style={styles.hostIcon}
              />
              <Text style={styles.browseArtistsBtnText}>Browse Artists</Text>
            </Pressable>
          </View>
        </View>

        {/* Curation Filter (All vs VELA Sponsored & Headliners) */}
        <View style={styles.curationFilterBar}>
          <Pressable
            onPress={() => setCurationFilter('all')}
            style={[
              styles.curationFilterPill,
              curationFilter === 'all' && styles.curationFilterPillActive,
            ]}>
            <Text
              style={[
                styles.curationFilterText,
                curationFilter === 'all' && styles.curationFilterTextActive,
              ]}>
              All Celebrations ({events.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCurationFilter('sponsored')}
            style={[
              styles.curationFilterPill,
              curationFilter === 'sponsored' && styles.curationFilterPillSponsoredActive,
            ]}>
            <VelaIcon
              name="ribbon-outline"
              size={12}
              color={curationFilter === 'sponsored' ? Colors.goldAccent : Colors.textMuted}
              style={styles.curationFilterIcon}
            />
            <Text
              style={[
                styles.curationFilterText,
                curationFilter === 'sponsored' && styles.curationFilterTextSponsoredActive,
              ]}>
              VELA Sponsored &amp; Headliners ({sponsoredCount})
            </Text>
          </Pressable>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            {curationFilter === 'sponsored'
              ? 'VELA SPONSORED &amp; HEADLINE GALAS'
              : 'UPCOMING TWIN MEETUPS &amp; EXPERIENCES'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {curationFilter === 'sponsored'
              ? 'Events with confirmed celebrity artists or VELA Patron Foundation sponsorship grants.'
              : 'Verified celebrations exclusively for members sharing your birth date.'}
          </Text>
        </View>

        {/* Event Cards */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleJoin={handleToggleJoin}
              onBookArtist={handleOpenArtistBooking}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <VelaIcon
              name="calendar-outline"
              size={36}
              color={Colors.textMuted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>
              {curationFilter === 'sponsored'
                ? 'No Sponsored Headliners in this Category'
                : 'No events in this category yet'}
            </Text>
            <Text style={styles.emptySub}>
              {curationFilter === 'sponsored'
                ? 'Select any celebration card to request a VELA Society Guest Celebrity sponsorship grant!'
                : 'Be the first to propose a gathering for this life stage circle!'}
            </Text>
          </View>
        )}

        {/* Modal for Creating / Proposing an Event */}
        <Modal visible={showCreateModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Propose Twin Celebration</Text>
                <Pressable onPress={() => setShowCreateModal(false)}>
                  <VelaIcon name="close-outline" size={20} color={Colors.textSecondary} />
                </Pressable>
              </View>

              <Text style={styles.modalIntro}>
                Create an exclusive meetup for members born on {formatBirthday(user.dateOfBirth)}.
              </Text>

              <View style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT TITLE</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. October 27 Rooftop Gala or Little Stars Picnic"
                    placeholderTextColor={Colors.textMuted}
                    value={eventTitle}
                    onChangeText={setEventTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>TARGET AGE CATEGORY</Text>
                  <View style={styles.categoryPickerRow}>
                    {CATEGORY_CHOICES.map((cat) => {
                      const isSel = eventCategory === cat.key;
                      return (
                        <TouchableOpacity
                          key={cat.key}
                          style={[styles.pickerPill, isSel && styles.pickerPillActive]}
                          onPress={() => setEventCategory(cat.key)}>
                          <VelaIcon
                            name={cat.icon}
                            size={12}
                            color={isSel ? Colors.accentDark : Colors.textSecondary}
                            style={styles.pickerIcon}
                          />
                          <Text style={[styles.pickerText, isSel && styles.pickerTextActive]}>
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>VENUE / LOCATION</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. Soho House Rooftop or Kensington Gardens"
                    placeholderTextColor={Colors.textMuted}
                    value={venue}
                    onChangeText={setVenue}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>DRESS CODE</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. Black Tie, Casual Pastel, Celestial"
                    placeholderTextColor={Colors.textMuted}
                    value={dressCode}
                    onChangeText={setDressCode}
                  />
                </View>

                {/* Sponsorship Preference */}
                <Pressable
                  onPress={() => setRequestSponsorship(!requestSponsorship)}
                  style={[
                    styles.sponsorOptionBox,
                    requestSponsorship && styles.sponsorOptionBoxActive,
                  ]}>
                  <View style={styles.sponsorOptionLeft}>
                    <VelaIcon
                      name="ribbon-outline"
                      size={18}
                      color={requestSponsorship ? Colors.goldAccent : Colors.textMuted}
                      style={styles.sponsorOptionIcon}
                    />
                    <View style={styles.sponsorOptionTextContainer}>
                      <Text style={styles.sponsorOptionTitle}>
                        Apply for VELA Society Celebrity Sponsorship
                      </Text>
                      <Text style={styles.sponsorOptionSub}>
                        Request Vela to book and sponsor a guest artist for this gala
                      </Text>
                    </View>
                  </View>
                  <VelaIcon
                    name={requestSponsorship ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={requestSponsorship ? Colors.goldAccent : Colors.border}
                  />
                </Pressable>

                <Pressable
                  onPress={handleCreateSubmit}
                  style={styles.submitModalBtn}>
                  <Text style={styles.submitModalText}>
                    Publish to Birthday Twins
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Celebrity Artist Booking & Sponsorship Modal */}
        <ArtistBookingModal
          visible={showArtistModal}
          event={selectedEventForArtist}
          onClose={() => {
            setShowArtistModal(false);
            setSelectedEventForArtist(null);
          }}
          onBookingComplete={(updated) => {
            updateEvent(updated);
          }}
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
  heroBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroLeft: {
    marginBottom: 14,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  heroBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.accentDark,
  },
  patronGrantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  grantIcon: {
    marginRight: 3,
  },
  patronGrantText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.goldAccent,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hostButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  hostIcon: {
    marginRight: 6,
  },
  hostButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: 0.5,
  },
  browseArtistsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.goldLight,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  browseArtistsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.goldAccent,
  },

  /* Curation Filter Bar */
  curationFilterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  curationFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  curationFilterPillActive: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  curationFilterPillSponsoredActive: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldAccent,
  },
  curationFilterIcon: {
    marginRight: 4,
  },
  curationFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  curationFilterTextActive: {
    color: Colors.background,
  },
  curationFilterTextSponsoredActive: {
    color: Colors.goldAccent,
  },

  sectionHeading: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.accentDark,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: 18,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 22,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalIntro: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalForm: {
    gap: 12,
  },
  inputGroup: {},
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerPillActive: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  pickerIcon: {
    marginRight: 4,
  },
  pickerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pickerTextActive: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  sponsorOptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  sponsorOptionBoxActive: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldAccent,
  },
  sponsorOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  sponsorOptionIcon: {
    marginRight: 10,
  },
  sponsorOptionTextContainer: {
    flex: 1,
  },
  sponsorOptionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sponsorOptionSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  submitModalBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitModalText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.background,
  },
});
