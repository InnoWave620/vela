import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../theme/colors';
import {
  AgeCategory,
  MediaType,
  MediaFilterType,
  PostVisibility,
  MusicTrack,
} from '../../types/vela';
import { POPULAR_SOUNDTRACKS } from '../../services/mockData';
import { VelaIcon } from './VelaIcon';
import { VelaVideoPlayer } from './VelaVideoPlayer';
import { saveMediaToGallery } from '../../utils/mediaUtils';

interface Props {
  visible: boolean;
  initialMediaType?: MediaType;
  initialMediaUrl?: string;
  onClose: () => void;
  onPublish: (params: {
    content: string;
    mediaType: MediaType;
    mediaUrl?: string;
    thumbnailUrl?: string;
    videoDurationSeconds?: number;
    ageCategory: AgeCategory;
    visibility: PostVisibility;
    musicTitle?: string;
    musicArtist?: string;
    musicUrl?: string;
    musicAlbumCover?: string;
    filterApplied?: MediaFilterType;
    overlayText?: string;
    overlayEmoji?: string;
  }) => Promise<void>;
}

interface FilterOption {
  key: MediaFilterType;
  label: string;
  category: string;
  colorOverlayHex?: string;
  icon: string;
}

const FILTERS: FilterOption[] = [
  { key: 'normal', label: 'Normal', category: 'Original', icon: 'image-outline' },
  { key: 'celestial', label: 'Celestial', category: 'Vibe', colorOverlayHex: '#89CFF033', icon: 'planet-outline' },
  { key: 'golden', label: 'Golden Hour', category: 'Portrait', colorOverlayHex: '#F59E0B28', icon: 'sunny-outline' },
  { key: 'vintage', label: '35mm Film', category: 'Retro', colorOverlayHex: '#D4A37335', icon: 'film-outline' },
  { key: 'monochrome', label: 'B&W Noir', category: 'Classic', colorOverlayHex: '#00000075', icon: 'contrast-outline' },
  { key: 'pastel', label: 'Soft Pastel', category: 'Aesthetic', colorOverlayHex: '#F472B628', icon: 'color-palette-outline' },
  { key: 'neon', label: 'Neon Cyber', category: 'Night', colorOverlayHex: '#8B5CF635', icon: 'flash-outline' },
];

const BIRTHDAY_STICKERS = [
  'OCTOBER 27 TWINS',
  'CELEBRATING 28',
  '100% BIRTHDAY SYNC',
  'VELA WORLDWIDE TOAST',
  'GUEST HEADLINER SET',
  'ROOFTOP SOLSTICE GALA',
];

const CATEGORY_OPTIONS: { key: AgeCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All Generations', icon: 'globe-outline' },
  { key: 'newborn', label: 'Babies (0-11m)', icon: 'heart-circle-outline' },
  { key: 'toddler', label: 'Toddlers (1-3y)', icon: 'happy-outline' },
  { key: 'kid', label: 'Kids (4-12y)', icon: 'school-outline' },
  { key: 'teen', label: 'Teens (13-17y)', icon: 'headset-outline' },
  { key: 'adult', label: 'Adults (18+)', icon: 'wine-outline' },
];

const SAMPLE_MEDIA = {
  video: {
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    duration: 45,
  },
  image: {
    mediaUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: undefined,
    duration: 0,
  },
};

const TEXT_COLORS = [
  '#FFFFFF',
  '#89CFF0',
  '#C5A059',
  '#FE2C55',
  '#FACC15',
  '#A855F7',
  '#10B981',
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const VelaStudioModal: React.FC<Props> = ({
  visible,
  initialMediaType = 'video',
  onClose,
  onPublish,
}) => {
  const insets = useSafeAreaInsets();

  // Core Media State
  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
  const [customMediaUri, setCustomMediaUri] = useState<string | null>(null);

  // Overlays & Editing
  const [selectedFilter, setSelectedFilter] = useState<MediaFilterType>('celestial');
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(POPULAR_SOUNDTRACKS[0]);
  const [overlayText, setOverlayText] = useState('OCTOBER 27 TWINS');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  // Audience & Metadata
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('all');
  const [visibility, setVisibility] = useState<PostVisibility>('public_world');

  // Sub-Tool Drawers (Slide-up sheets)
  const [showFilterTray, setShowFilterTray] = useState(false);
  const [showMusicDrawer, setShowMusicDrawer] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [showAudienceSheet, setShowAudienceSheet] = useState(false);

  // Text Tool Styling
  const [tempText, setTempText] = useState(overlayText);
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF');
  const [textStyleMode, setTextStyleMode] = useState<'box' | 'glow' | 'plain'>('box');

  // Music Drawer Filter
  const [soundSearch, setSoundSearch] = useState('');
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingToGallery, setIsSavingToGallery] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);

  const activeMedia = mediaType === 'video' ? SAMPLE_MEDIA.video : SAMPLE_MEDIA.image;
  const currentMediaUri = customMediaUri || activeMedia.thumbnailUrl || activeMedia.mediaUrl;
  const currentFilter = FILTERS.find((f) => f.key === selectedFilter) || FILTERS[0];

  const handleSaveToGallery = async () => {
    const targetUri = customMediaUri || (mediaType === 'video' ? activeMedia.mediaUrl : activeMedia.thumbnailUrl);
    if (!targetUri) {
      Alert.alert('Notice', 'No media available to save to gallery.');
      return;
    }

    setIsSavingToGallery(true);
    const result = await saveMediaToGallery(targetUri, mediaType === 'video' ? 'video' : 'image');
    setIsSavingToGallery(false);

    if (result.success) {
      setSavedToGallery(true);
      Alert.alert(
        'Saved to Gallery',
        mediaType === 'video'
          ? 'Your edited video memory has been saved to your device gallery.'
          : 'Your edited photo memory has been saved to your device gallery.'
      );
      setTimeout(() => setSavedToGallery(false), 4000);
    } else {
      Alert.alert('Save Failed', result.error || 'Could not save media to device gallery.');
    }
  };

  // Pick real photo or video from device library
  const handlePickDeviceMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setCustomMediaUri(result.assets[0].uri);
        setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
      }
    } catch {
      Alert.alert('Notice', 'Unable to pick media from library.');
    }
  };

  const handleOpenTextEditor = () => {
    setTempText(overlayText);
    setShowTextEditor(true);
  };

  const handleApplyText = () => {
    setOverlayText(tempText.trim());
    setShowTextEditor(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish({
        content: caption.trim() || 'Unforgettable celebration moments captured with my twin circle!',
        mediaType,
        mediaUrl: customMediaUri || activeMedia.mediaUrl,
        thumbnailUrl: customMediaUri || activeMedia.thumbnailUrl,
        videoDurationSeconds: activeMedia.duration,
        ageCategory,
        visibility,
        musicTitle: selectedTrack?.title,
        musicArtist: selectedTrack?.artist,
        musicUrl: selectedTrack?.audioUrl,
        musicAlbumCover: selectedTrack?.albumCover,
        filterApplied: selectedFilter,
        overlayText: overlayText.trim() ? overlayText : undefined,
      });
      onClose();
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredSounds = POPULAR_SOUNDTRACKS.filter((t) => {
    if (!soundSearch.trim()) return true;
    const q = soundSearch.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q);
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* ========================================================= */}
        {/* 1. FULL-SCREEN CANVAS VIEWPORT */}
        {/* ========================================================= */}
        <View style={styles.canvasContainer}>
          {/* Main Media: Autoplaying Video or High-Res Photo */}
          {mediaType === 'video' && (customMediaUri || activeMedia.mediaUrl) ? (
            <VelaVideoPlayer
              videoUrl={customMediaUri || activeMedia.mediaUrl}
              autoPlay={true}
              filterOverlayHex={currentFilter.colorOverlayHex}
              style={styles.fullScreenVideo}
            />
          ) : (
            <>
              <Image source={{ uri: currentMediaUri }} style={styles.fullScreenMedia} />
              {currentFilter.colorOverlayHex ? (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: currentFilter.colorOverlayHex },
                  ]}
                  pointerEvents="none"
                />
              ) : null}
            </>
          )}

          {/* Subtle Top & Bottom Gradient Shadows for Legibility */}
          <View style={styles.topVignette} pointerEvents="none" />
          <View style={styles.bottomVignette} pointerEvents="none" />

          {/* Canvas Floating Text Sticker */}
          {overlayText ? (
            <TouchableOpacity
              onPress={handleOpenTextEditor}
              style={[
                styles.canvasTextStickerWrap,
                textStyleMode === 'box' && styles.canvasTextStickerBox,
                textStyleMode === 'glow' && styles.canvasTextStickerGlow,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.canvasTextStickerContent, { color: selectedTextColor }]}>
                {overlayText}
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* Canvas Milestone Celebration Badge */}
          {selectedSticker ? (
            <TouchableOpacity
              onPress={() => setSelectedSticker(null)}
              style={styles.canvasMilestoneSticker}
              activeOpacity={0.8}
            >
              <VelaIcon name="shield-outline" size={12} color={Colors.goldAccent} style={styles.stickerIcon} />
              <Text style={styles.canvasMilestoneStickerText}>{selectedSticker}</Text>
              <VelaIcon name="close-circle" size={14} color="#FFFFFF" style={styles.stickerClose} />
            </TouchableOpacity>
          ) : null}

          {/* Spinning Vinyl Music Disc (Bottom-Right Soundtrack Widget) */}
          {selectedTrack && (
            <TouchableOpacity
              onPress={() => setShowMusicDrawer(true)}
              style={styles.spinningVinylContainer}
              activeOpacity={0.8}
            >
              <View style={styles.vinylDisc}>
                <Image source={{ uri: selectedTrack.albumCover }} style={styles.vinylCoverThumb} />
                <View style={styles.vinylCenterPin} />
              </View>
              <View style={styles.musicNoteNote}>
                <VelaIcon name="musical-notes" size={10} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          )}

          {/* Caption & User Info (Bottom-Left Area) */}
          <View style={styles.bottomLeftOverlay}>
            <View style={styles.authorBadgeRow}>
              <Text style={styles.authorTag}>@birthday_twin</Text>
              <View style={styles.audiencePill}>
                <VelaIcon
                  name={visibility === 'public_world' ? 'globe-outline' : 'people-outline'}
                  size={10}
                  color="#FFFFFF"
                  style={styles.audiencePillIcon}
                />
                <Text style={styles.audiencePillText}>
                  {visibility === 'public_world' ? 'World' : 'Twins Only'}
                </Text>
              </View>
            </View>

            {/* Quick Caption Input Directly on Canvas */}
            <TextInput
              style={styles.canvasCaptionInput}
              placeholder="Add caption, #hashtags, @twins..."
              placeholderTextColor="#B0B0B0"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={150}
            />
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. TOP HEADER (FLOATING OVER MEDIA) */}
        {/* ========================================================= */}
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
          {/* Close / Cancel Button */}
          <TouchableOpacity onPress={onClose} style={styles.glassCircleBtn} hitSlop={12}>
            <VelaIcon name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* "Add Sound" Pill (Center Top Audio Selector) */}
          <TouchableOpacity
            style={styles.soundPillTop}
            onPress={() => setShowMusicDrawer(true)}
            activeOpacity={0.8}
          >
            <VelaIcon name="musical-notes" size={13} color="#FFFFFF" style={styles.soundPillIcon} />
            <Text style={styles.soundPillText} numberOfLines={1}>
              {selectedTrack ? `${selectedTrack.title}` : 'Add sound'}
            </Text>
            {selectedTrack && (
              <TouchableOpacity
                onPress={() => setSelectedTrack(null)}
                style={styles.soundClearBtn}
                hitSlop={8}
              >
                <VelaIcon name="close" size={11} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Switch Format or Upload From Gallery or Save */}
          <View style={styles.topRightControls}>
            <TouchableOpacity
              onPress={handleSaveToGallery}
              style={[styles.glassCircleBtn, savedToGallery && styles.glassCircleBtnSaved]}
              disabled={isSavingToGallery}
              hitSlop={8}>
              {isSavingToGallery ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <VelaIcon
                  name={savedToGallery ? 'checkmark' : 'download-outline'}
                  size={18}
                  color={savedToGallery ? '#10B981' : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePickDeviceMedia} style={styles.glassCircleBtn} hitSlop={8}>
              <VelaIcon name="images-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. RIGHT SIDEBAR (CREATIVE TOOLS RAIL) */}
        {/* ========================================================= */}
        <View style={[styles.rightSideRail, { top: Math.max(insets.top, 14) + 60 }]}>
          {/* 1. Filters */}
          <TouchableOpacity
            style={styles.railItem}
            onPress={() => {
              setShowFilterTray(true);
              setShowStickerDrawer(false);
              setShowAudienceSheet(false);
            }}
          >
            <View style={[styles.railIconCircle, showFilterTray && styles.railIconCircleActive]}>
              <VelaIcon name="color-filter-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.railItemLabel}>Filters</Text>
          </TouchableOpacity>

          {/* 2. Sound */}
          <TouchableOpacity style={styles.railItem} onPress={() => setShowMusicDrawer(true)}>
            <View style={styles.railIconCircle}>
              <VelaIcon name="musical-notes-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.railItemLabel}>Audio</Text>
          </TouchableOpacity>

          {/* 3. Text Overlay */}
          <TouchableOpacity style={styles.railItem} onPress={handleOpenTextEditor}>
            <View style={styles.railIconCircle}>
              <VelaIcon name="text" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.railItemLabel}>Text</Text>
          </TouchableOpacity>

          {/* 4. Birthday Stickers */}
          <TouchableOpacity
            style={styles.railItem}
            onPress={() => {
              setShowStickerDrawer(true);
              setShowFilterTray(false);
              setShowAudienceSheet(false);
            }}
          >
            <View style={[styles.railIconCircle, showStickerDrawer && styles.railIconCircleActive]}>
              <VelaIcon name="pricetag-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.railItemLabel}>Stickers</Text>
          </TouchableOpacity>

          {/* 5. Audience & Privacy */}
          <TouchableOpacity
            style={styles.railItem}
            onPress={() => {
              setShowAudienceSheet(true);
              setShowFilterTray(false);
              setShowStickerDrawer(false);
            }}
          >
            <View style={[styles.railIconCircle, showAudienceSheet && styles.railIconCircleActive]}>
              <VelaIcon name="globe-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.railItemLabel}>Privacy</Text>
          </TouchableOpacity>

          {/* 6. Switch Video / Photo */}
          <TouchableOpacity
            style={styles.railItem}
            onPress={() => setMediaType(mediaType === 'video' ? 'image' : 'video')}
          >
            <View style={styles.railIconCircle}>
              <VelaIcon
                name={mediaType === 'video' ? 'camera-outline' : 'videocam-outline'}
                size={20}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.railItemLabel}>{mediaType === 'video' ? 'Photo' : 'Video'}</Text>
          </TouchableOpacity>

          {/* 7. Save to Device Gallery */}
          <TouchableOpacity
            style={styles.railItem}
            onPress={handleSaveToGallery}
            disabled={isSavingToGallery}
          >
            <View style={[styles.railIconCircle, savedToGallery && styles.railIconCircleSaved]}>
              {isSavingToGallery ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <VelaIcon
                  name={savedToGallery ? 'checkmark' : 'download-outline'}
                  size={20}
                  color={savedToGallery ? '#10B981' : '#FFFFFF'}
                />
              )}
            </View>
            <Text style={styles.railItemLabel}>{savedToGallery ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 4. BOTTOM ACTION BAR (DRAFTS, SAVE TO GALLERY & POST BUTTON) */}
        {/* ========================================================= */}
        <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Drafts Button */}
          <TouchableOpacity onPress={onClose} style={styles.draftsButton} activeOpacity={0.8}>
            <VelaIcon name="bookmark-outline" size={16} color="#FFFFFF" style={styles.draftsIcon} />
            <Text style={styles.draftsButtonText}>Drafts</Text>
          </TouchableOpacity>

          {/* Save to Device Gallery Button */}
          <TouchableOpacity
            disabled={isSavingToGallery}
            onPress={handleSaveToGallery}
            style={[styles.saveGalleryButton, savedToGallery && styles.saveGalleryButtonSaved]}
            activeOpacity={0.85}
          >
            {isSavingToGallery ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.saveGalleryButtonInner}>
                <VelaIcon
                  name={savedToGallery ? 'checkmark-circle-outline' : 'download-outline'}
                  size={16}
                  color="#FFFFFF"
                  style={styles.saveGalleryIcon}
                />
                <Text style={[styles.saveGalleryButtonText, savedToGallery && styles.saveGalleryTextSaved]}>
                  {savedToGallery ? 'Saved' : 'Save to Gallery'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity
            disabled={isPublishing}
            onPress={handlePublish}
            style={[styles.postButton, isPublishing && styles.postButtonDisabled]}
            activeOpacity={0.85}
          >
            {isPublishing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.postButtonInner}>
                <Text style={styles.postButtonText}>Post</Text>
                <VelaIcon name="arrow-forward" size={16} color="#FFFFFF" style={styles.postIcon} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 5. SLIDE-UP FILTER TRAY (COVERS BOTTOM 28%) */}
        {/* ========================================================= */}
        {showFilterTray && (
          <View style={styles.filterTrayContainer}>
            <View style={styles.filterTrayHeader}>
              <Text style={styles.filterTrayTitle}>Visual Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterTray(false)} style={styles.filterTrayDoneBtn}>
                <VelaIcon name="checkmark-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {FILTERS.map((f) => {
                const isSelected = selectedFilter === f.key;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => setSelectedFilter(f.key)}
                    style={[styles.filterBubbleCard, isSelected && styles.filterBubbleCardSelected]}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.filterBubbleCircle,
                        f.colorOverlayHex
                          ? { backgroundColor: f.colorOverlayHex }
                          : { backgroundColor: '#262626' },
                        isSelected && styles.filterBubbleCircleSelected,
                      ]}
                    >
                      <VelaIcon name={f.icon} size={18} color={isSelected ? Colors.accent : '#FFFFFF'} />
                    </View>
                    <Text style={[styles.filterBubbleLabel, isSelected && styles.filterBubbleLabelSelected]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ========================================================= */}
        {/* 6. SLIDE-UP STICKERS TRAY */}
        {/* ========================================================= */}
        {showStickerDrawer && (
          <View style={styles.filterTrayContainer}>
            <View style={styles.filterTrayHeader}>
              <Text style={styles.filterTrayTitle}>Birthday Celebration Stickers</Text>
              <TouchableOpacity onPress={() => setShowStickerDrawer(false)} style={styles.filterTrayDoneBtn}>
                <VelaIcon name="checkmark-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {BIRTHDAY_STICKERS.map((sticker) => {
                const isSelected = selectedSticker === sticker;
                return (
                  <TouchableOpacity
                    key={sticker}
                    onPress={() => setSelectedSticker(isSelected ? null : sticker)}
                    style={[styles.stickerCard, isSelected && styles.stickerCardSelected]}
                  >
                    <VelaIcon
                      name="ribbon-outline"
                      size={14}
                      color={isSelected ? Colors.goldAccent : '#FFFFFF'}
                      style={styles.stickerCardIcon}
                    />
                    <Text style={[styles.stickerCardText, isSelected && styles.stickerCardTextSelected]}>
                      {sticker}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ========================================================= */}
        {/* 7. AUDIENCE & PRIVACY SHEET */}
        {/* ========================================================= */}
        {showAudienceSheet && (
          <View style={styles.audienceSheetContainer}>
            <View style={styles.filterTrayHeader}>
              <Text style={styles.filterTrayTitle}>Audience &amp; Life Stage</Text>
              <TouchableOpacity onPress={() => setShowAudienceSheet(false)} style={styles.filterTrayDoneBtn}>
                <VelaIcon name="checkmark-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSectionLabel}>WHO CAN VIEW THIS VIDEO</Text>
            <View style={styles.visRow}>
              <TouchableOpacity
                onPress={() => setVisibility('public_world')}
                style={[styles.visChoiceBtn, visibility === 'public_world' && styles.visChoiceBtnActive]}
              >
                <VelaIcon name="globe-outline" size={16} color="#FFFFFF" style={styles.visChoiceIcon} />
                <Text style={styles.visChoiceText}>Public Worldwide</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVisibility('twins_only')}
                style={[styles.visChoiceBtn, visibility === 'twins_only' && styles.visChoiceBtnActive]}
              >
                <VelaIcon name="people-outline" size={16} color="#FFFFFF" style={styles.visChoiceIcon} />
                <Text style={styles.visChoiceText}>Birthday Twins Only</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSectionLabel}>TARGET GENERATION CIRCLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
              {CATEGORY_OPTIONS.map((cat) => {
                const isSel = ageCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => setAgeCategory(cat.key)}
                    style={[styles.catPill, isSel && styles.catPillActive]}
                  >
                    <VelaIcon
                      name={cat.icon}
                      size={12}
                      color={isSel ? Colors.accentDark : '#9CA3AF'}
                      style={styles.catIcon}
                    />
                    <Text style={[styles.catLabel, isSel && styles.catLabelActive]}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ========================================================= */}
        {/* 8. SOUNDTRACK DRAWER (BOTTOM-SLIDING AUDIO LIBRARY) */}
        {/* ========================================================= */}
        <Modal visible={showMusicDrawer} animationType="slide" transparent onRequestClose={() => setShowMusicDrawer(false)}>
          <View style={styles.drawerBackdrop}>
            <View style={styles.musicDrawerCard}>
              {/* Drawer Drag Bar & Header */}
              <View style={styles.drawerDragHandle} />
              <View style={styles.musicDrawerHeader}>
                <Text style={styles.musicDrawerTitle}>Sounds</Text>
                <TouchableOpacity onPress={() => setShowMusicDrawer(false)} style={styles.musicDrawerCloseBtn}>
                  <VelaIcon name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Search Sound Input */}
              <View style={styles.soundSearchRow}>
                <VelaIcon name="search-outline" size={16} color="#8E8E93" style={styles.searchIcon} />
                <TextInput
                  style={styles.soundSearchInput}
                  placeholder="Search sounds or artists..."
                  placeholderTextColor="#8E8E93"
                  value={soundSearch}
                  onChangeText={setSoundSearch}
                />
                {soundSearch ? (
                  <TouchableOpacity onPress={() => setSoundSearch('')}>
                    <VelaIcon name="close-circle" size={16} color="#8E8E93" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Sound Tracks List */}
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.soundListContent}>
                {filteredSounds.map((track) => {
                  const isCurrent = selectedTrack?.id === track.id;
                  const isPreviewing = previewTrackId === track.id;

                  return (
                    <View key={track.id} style={[styles.trackItemCard, isCurrent && styles.trackItemCardCurrent]}>
                      {/* Album Cover & Play Indicator */}
                      <TouchableOpacity
                        onPress={() => setPreviewTrackId(isPreviewing ? null : track.id)}
                        style={styles.trackThumbArea}
                      >
                        <Image source={{ uri: track.albumCover }} style={styles.trackThumbImage} />
                        <View style={styles.trackPlayBadge}>
                          <VelaIcon name={isPreviewing ? 'pause' : 'play'} size={12} color="#FFFFFF" />
                        </View>
                      </TouchableOpacity>

                      {/* Track Details */}
                      <View style={styles.trackMetaInfo}>
                        <Text style={styles.trackTitleText} numberOfLines={1}>
                          {track.title}
                        </Text>
                        <Text style={styles.trackArtistText} numberOfLines={1}>
                          {track.artist} • {track.genre}
                        </Text>
                        <Text style={styles.trackDurationText}>{track.duration}</Text>
                      </View>

                      {/* "Use this sound" Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTrack(track);
                          setShowMusicDrawer(false);
                        }}
                        style={[styles.useSoundBtn, isCurrent && styles.useSoundBtnCurrent]}
                      >
                        <VelaIcon
                          name={isCurrent ? 'checkmark' : 'musical-note'}
                          size={14}
                          color="#FFFFFF"
                          style={styles.useSoundIcon}
                        />
                        <Text style={styles.useSoundBtnText}>{isCurrent ? 'Selected' : 'Use'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ========================================================= */}
        {/* 9. FULL-SCREEN TEXT STICKER COMPOSER */}
        {/* ========================================================= */}
        <Modal visible={showTextEditor} animationType="fade" transparent onRequestClose={() => setShowTextEditor(false)}>
          <View style={styles.textEditorBackdrop}>
            {/* Top Done Bar */}
            <View style={[styles.textEditorTopBar, { paddingTop: Math.max(insets.top, 16) }]}>
              <TouchableOpacity onPress={() => setShowTextEditor(false)} style={styles.textEditorCancelBtn}>
                <Text style={styles.textEditorCancelText}>Cancel</Text>
              </TouchableOpacity>

              {/* Style Toggle (Box Highlight vs Glow vs Plain) */}
              <View style={styles.textStyleToggleRow}>
                <TouchableOpacity
                  onPress={() => setTextStyleMode('box')}
                  style={[styles.textStyleTogglePill, textStyleMode === 'box' && styles.textStyleTogglePillActive]}
                >
                  <Text style={styles.textStyleToggleText}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTextStyleMode('glow')}
                  style={[styles.textStyleTogglePill, textStyleMode === 'glow' && styles.textStyleTogglePillActive]}
                >
                  <Text style={styles.textStyleToggleText}>Glow</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleApplyText} style={styles.textEditorDoneBtn}>
                <Text style={styles.textEditorDoneText}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Center Live Text Input */}
            <View style={styles.textEditorInputArea}>
              <TextInput
                style={[
                  styles.fullScreenTextInput,
                  { color: selectedTextColor },
                  textStyleMode === 'box' && styles.textInputWithBox,
                ]}
                placeholder="Type your sticker text..."
                placeholderTextColor="#A0A0A0"
                value={tempText}
                onChangeText={setTempText}
                multiline
                autoFocus
                textAlign="center"
              />
            </View>

            {/* Bottom Color Swatches Palette */}
            <View style={[styles.colorPaletteBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              {TEXT_COLORS.map((color) => {
                const isSelected = selectedTextColor === color;
                return (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedTextColor(color)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      isSelected && styles.colorSwatchSelected,
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* 1. Full Screen Canvas */
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  fullScreenMedia: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 0,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#00000055',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#00000075',
  },
  centerPlayTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayIndicator: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Canvas Text Sticker */
  canvasTextStickerWrap: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.38,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: SCREEN_WIDTH * 0.85,
  },
  canvasTextStickerBox: {
    backgroundColor: '#000000B3',
    borderWidth: 1,
    borderColor: '#333333',
  },
  canvasTextStickerGlow: {
    backgroundColor: '#89CFF033',
    borderWidth: 1.5,
    borderColor: '#89CFF0',
  },
  canvasTextStickerContent: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },

  /* Canvas Milestone Badge */
  canvasMilestoneSticker: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
  },
  stickerIcon: {
    marginRight: 6,
  },
  canvasMilestoneStickerText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.goldAccent,
    letterSpacing: 0.5,
  },
  stickerClose: {
    marginLeft: 6,
  },

  /* Spinning Vinyl Disc (Soundtrack Widget) */
  spinningVinylContainer: {
    position: 'absolute',
    right: 14,
    bottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E1E',
    borderWidth: 6,
    borderColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  vinylCoverThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  vinylCenterPin: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  musicNoteNote: {
    position: 'absolute',
    top: -10,
    right: 2,
  },

  /* Bottom Left Overlay */
  bottomLeftOverlay: {
    position: 'absolute',
    left: 14,
    bottom: 96,
    right: 80,
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorTag: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
  },
  audiencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000099',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444444',
  },
  audiencePillIcon: {
    marginRight: 3,
  },
  audiencePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  canvasCaptionInput: {
    backgroundColor: '#00000066',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#FFFFFF',
    maxHeight: 56,
    borderWidth: 1,
    borderColor: '#333333',
  },

  /* 2. Top Bar */
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    zIndex: 10,
  },
  glassCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  soundPillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000099',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.55,
    borderWidth: 1,
    borderColor: '#444444',
  },
  soundPillIcon: {
    marginRight: 6,
  },
  soundPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  soundClearBtn: {
    marginLeft: 6,
    padding: 2,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 8,
  },

  /* 3. Right Side Rail (Vertical tools column) */
  rightSideRail: {
    position: 'absolute',
    right: 12,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  railItem: {
    alignItems: 'center',
  },
  railIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00000088',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 3,
  },
  railIconCircleActive: {
    backgroundColor: Colors.accentDark,
    borderColor: Colors.accent,
  },
  railItemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* 4. Bottom Action Bar (Drafts + Post Button) */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#000000CC',
    zIndex: 10,
  },
  draftsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  draftsIcon: {
    marginRight: 6,
  },
  draftsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333333',
    marginLeft: 8,
  },
  saveGalleryButtonSaved: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  saveGalleryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveGalleryIcon: {
    marginRight: 6,
  },
  saveGalleryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveGalleryTextSaved: {
    color: '#34D399',
  },
  glassCircleBtnSaved: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  railIconCircleSaved: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  postButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FE2C55',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  postIcon: {
    marginLeft: 6,
  },

  /* 5. Slide-up Filter & Sticker Tray */
  filterTrayContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#121212F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#282828',
    zIndex: 20,
  },
  filterTrayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterTrayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  filterTrayDoneBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    paddingHorizontal: 14,
    gap: 12,
  },
  filterBubbleCard: {
    alignItems: 'center',
  },
  filterBubbleCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  filterBubbleCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  filterBubbleCircleSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  filterBubbleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterBubbleLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* Sticker Choice */
  stickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222222',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#383838',
  },
  stickerCardSelected: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldAccent,
  },
  stickerCardIcon: {
    marginRight: 6,
  },
  stickerCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stickerCardTextSelected: {
    color: Colors.goldAccent,
  },

  /* Audience Sheet */
  audienceSheetContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#121212F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#282828',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  sheetSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8E8E93',
    marginBottom: 8,
    marginTop: 6,
  },
  visRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  visChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#383838',
  },
  visChoiceBtnActive: {
    backgroundColor: Colors.accentDark,
    borderColor: Colors.accent,
  },
  visChoiceIcon: {
    marginRight: 6,
  },
  visChoiceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  catScroll: {
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#383838',
  },
  catPillActive: {
    backgroundColor: '#89CFF025',
    borderColor: Colors.accent,
  },
  catIcon: {
    marginRight: 4,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  catLabelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },

  /* 8. Soundtrack Library Drawer */
  drawerBackdrop: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  musicDrawerCard: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  drawerDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#404040',
    alignSelf: 'center',
    marginBottom: 10,
  },
  musicDrawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  musicDrawerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  musicDrawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  soundSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
  },
  soundListContent: {
    gap: 10,
  },
  trackItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  trackItemCardCurrent: {
    borderColor: '#FE2C55',
    backgroundColor: '#261619',
  },
  trackThumbArea: {
    position: 'relative',
    marginRight: 10,
  },
  trackThumbImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#333333',
  },
  trackPlayBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackMetaInfo: {
    flex: 1,
  },
  trackTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trackArtistText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  trackDurationText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  useSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FE2C55',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  useSoundBtnCurrent: {
    backgroundColor: Colors.accentDark,
  },
  useSoundIcon: {
    marginRight: 4,
  },
  useSoundBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 9. Full-screen Text Sticker Composer */
  textEditorBackdrop: {
    flex: 1,
    backgroundColor: '#000000B3',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  textEditorTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textEditorCancelBtn: {
    padding: 8,
  },
  textEditorCancelText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textStyleToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textStyleTogglePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#333333',
  },
  textStyleTogglePillActive: {
    backgroundColor: '#FFFFFF',
  },
  textStyleToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  textEditorDoneBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  textEditorDoneText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  textEditorInputArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fullScreenTextInput: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    maxWidth: SCREEN_WIDTH * 0.9,
  },
  textInputWithBox: {
    backgroundColor: '#000000B3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  colorPaletteBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333333',
  },
  colorSwatchSelected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.15 }],
  },
});
