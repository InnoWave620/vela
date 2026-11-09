import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useVela } from '../../context/VelaContext';
import { AgeCategory, MediaType, PostVisibility, MediaFilterType } from '../../types/vela';
import { VelaStudioModal } from './VelaStudioModal';
import { VelaIcon } from './VelaIcon';

const CATEGORY_CHOICES: { key: AgeCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'Everyone', icon: 'globe-outline' },
  { key: 'newborn', label: 'Newborn', icon: 'heart-circle-outline' },
  { key: 'toddler', label: 'Toddler', icon: 'happy-outline' },
  { key: 'kid', label: 'Kid', icon: 'school-outline' },
  { key: 'teen', label: 'Teen', icon: 'headset-outline' },
  { key: 'adult', label: 'Adult', icon: 'wine-outline' },
];

export const CreatePostBar: React.FC = () => {
  const { user, createPost, requireAuth } = useVela();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  // Post attributes
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [category, setCategory] = useState<AgeCategory>('all');
  const [visibility, setVisibility] = useState<PostVisibility>('public_world');

  const handlePost = async () => {
    if (!requireAuth('share birthday memories')) return;
    if (!content.trim()) return;
    setIsPosting(true);

    let mediaUrl: string | undefined;
    let thumbnailUrl: string | undefined;
    let videoDurationSeconds = 0;

    if (mediaType === 'video') {
      mediaUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      thumbnailUrl = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80';
      videoDurationSeconds = 45;
    } else if (mediaType === 'image') {
      mediaUrl = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80';
    }

    try {
      await createPost(content.trim(), {
        mediaType,
        mediaUrl,
        thumbnailUrl,
        videoDurationSeconds,
        ageCategory: category,
        visibility,
        filterApplied: 'celestial',
      });
      setContent('');
      setIsExpanded(false);
    } finally {
      setIsPosting(false);
    }
  };

  const handleStudioPublish = async (params: {
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
  }) => {
    await createPost(params.content, params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TextInput
          style={[styles.input, isExpanded && styles.inputExpanded]}
          placeholder="Share a memory with birthday twins & the world..."
          placeholderTextColor={Colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline={isExpanded}
          onFocus={() => setIsExpanded(true)}
        />
      </View>

      {/* Studio Shortcut Bar */}
      <View style={styles.shortcutRow}>
        <TouchableOpacity
          style={styles.studioLaunchPill}
          onPress={() => {
            if (!requireAuth('create and edit memories with music and filters in Vela Studio')) return;
            setShowStudio(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.studioIconBadge}>
            <VelaIcon
              name="videocam"
              size={14}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.studioTextWrap}>
            <Text style={styles.studioLaunchText}>Vela Studio &amp; Memory Creator</Text>
            <Text style={styles.studioLaunchSub}>Filters • Background Music • Stickers • Text Overlays</Text>
          </View>
          <VelaIcon name="chevron-forward" size={16} color={Colors.accentDark} />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.expandedControls}>
          {/* Media Format Picker */}
          <Text style={styles.sectionLabel}>Memory Format</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionPill, mediaType === 'video' && styles.optionPillActive]}
              onPress={() => setMediaType('video')}
            >
              <VelaIcon
                name="videocam-outline"
                size={13}
                color={mediaType === 'video' ? Colors.accentDark : Colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, mediaType === 'video' && styles.optionTextActive]}>
                Video Memory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionPill, mediaType === 'image' && styles.optionPillActive]}
              onPress={() => setMediaType('image')}
            >
              <VelaIcon
                name="camera-outline"
                size={13}
                color={mediaType === 'image' ? Colors.accentDark : Colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, mediaType === 'image' && styles.optionTextActive]}>
                Photo Memory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionPill, mediaType === 'none' && styles.optionPillActive]}
              onPress={() => setMediaType('none')}
            >
              <VelaIcon
                name="create-outline"
                size={13}
                color={mediaType === 'none' ? Colors.accentDark : Colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, mediaType === 'none' && styles.optionTextActive]}>
                Text Thought
              </Text>
            </TouchableOpacity>
          </View>

          {/* Life-Stage Category Picker */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.optionsRow}>
            {CATEGORY_CHOICES.map((cat) => {
              const isSelected = category === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.optionPill, isSelected && styles.optionPillActive]}
                  onPress={() => setCategory(cat.key)}
                >
                  <VelaIcon
                    name={cat.icon}
                    size={12}
                    color={isSelected ? Colors.accentDark : Colors.textSecondary}
                    style={styles.optionIcon}
                  />
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Global vs Twins Visibility */}
          <Text style={styles.sectionLabel}>Audience Visibility</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionPill, visibility === 'public_world' && styles.optionPillActive]}
              onPress={() => setVisibility('public_world')}
            >
              <VelaIcon
                name="globe-outline"
                size={13}
                color={visibility === 'public_world' ? Colors.accentDark : Colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, visibility === 'public_world' && styles.optionTextActive]}>
                Global / Worldwide
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionPill, visibility === 'twins_only' && styles.optionPillActive]}
              onPress={() => setVisibility('twins_only')}
            >
              <VelaIcon
                name="people-outline"
                size={13}
                color={visibility === 'twins_only' ? Colors.accentDark : Colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, visibility === 'twins_only' && styles.optionTextActive]}>
                Birthday Twins Only
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Bar: Cancel & Post */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={() => {
                setIsExpanded(false);
                setContent('');
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={!content.trim() || isPosting}
              onPress={handlePost}
              style={[
                styles.postBtn,
                (!content.trim() || isPosting) && styles.postBtnDisabled,
              ]}
            >
              {isPosting ? (
                <ActivityIndicator size="small" color={Colors.background} />
              ) : (
                <View style={styles.postBtnInner}>
                  <VelaIcon
                    name="paper-plane-outline"
                    size={13}
                    color={Colors.background}
                    style={styles.postBtnIcon}
                  />
                  <Text style={styles.postBtnText}>
                    {visibility === 'public_world' ? 'Broadcast Memory' : 'Post to Twins'}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* Full-featured Vela Studio Modal */}
      <VelaStudioModal
        visible={showStudio}
        initialMediaType={mediaType}
        onClose={() => setShowStudio(false)}
        onPublish={handleStudioPublish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputExpanded: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  shortcutRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  studioLaunchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4ECFA',
  },
  studioIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studioTextWrap: {
    flex: 1,
  },
  studioLaunchText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  studioLaunchSub: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  expandedControls: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionPillActive: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  optionIcon: {
    marginRight: 5,
  },
  optionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  postBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnDisabled: {
    backgroundColor: Colors.border,
  },
  postBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postBtnIcon: {
    marginRight: 6,
  },
  postBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.background,
  },
});
