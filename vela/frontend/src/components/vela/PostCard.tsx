import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FeedPost, AgeCategory, MediaFilterType } from '../../types/vela';
import { VelaIcon } from './VelaIcon';

interface PostCardProps {
  post: FeedPost;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

const CATEGORY_META: Record<AgeCategory, { label: string; icon: string }> = {
  all: { label: 'All Ages', icon: 'globe-outline' },
  newborn: { label: 'Newborn', icon: 'heart-circle-outline' },
  toddler: { label: 'Toddler', icon: 'happy-outline' },
  kid: { label: 'Kid', icon: 'school-outline' },
  teen: { label: 'Teen', icon: 'headset-outline' },
  adult: { label: 'Adult', icon: 'wine-outline' },
};

const FILTER_TINTS: Record<MediaFilterType, { name: string; overlayHex?: string }> = {
  normal: { name: 'Raw' },
  celestial: { name: 'Celestial', overlayHex: '#89CFF033' },
  vintage: { name: '35mm Film', overlayHex: '#D4A37330' },
  golden: { name: 'Golden Hour', overlayHex: '#F59E0B25' },
  monochrome: { name: 'B&W Noir', overlayHex: '#00000065' },
  pastel: { name: 'Soft Pastel', overlayHex: '#F472B622' },
  neon: { name: 'Neon Glow', overlayHex: '#8B5CF630' },
};

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleSendComment = () => {
    if (commentInput.trim().length === 0) return;
    onComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const isVideo = post.mediaType === 'video' || (post.videoDurationSeconds && post.videoDurationSeconds > 0);
  const displayImage = post.thumbnailUrl || post.mediaUrl;
  const categoryMeta = post.ageCategory ? CATEGORY_META[post.ageCategory] : CATEGORY_META.all;
  const filterMeta = post.filterApplied ? FILTER_TINTS[post.filterApplied] : undefined;

  return (
    <View style={styles.card}>
      {/* Author Header */}
      <View style={styles.headerRow}>
        <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
        <View style={styles.authorMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <View style={styles.twinBadge}>
              <VelaIcon
                name="ribbon-outline"
                size={10}
                color={Colors.accentDark}
                style={styles.badgeIcon}
              />
              <Text style={styles.twinBadgeText}>{post.authorBirthdayBadge}</Text>
            </View>
          </View>

          {/* Subtitle with parent managed info or location */}
          {post.isParentManaged && post.parentGuardianName ? (
            <View style={styles.parentRow}>
              <VelaIcon
                name="shield-checkmark-outline"
                size={11}
                color={Colors.accentDark}
                style={styles.parentIcon}
              />
              <Text style={styles.parentManagedText}>
                Managed by {post.parentGuardianName}
              </Text>
            </View>
          ) : null}

          <View style={styles.subMetaRow}>
            <Text style={styles.timestamp}>{post.createdAt}</Text>
            <View style={styles.bulletDot} />
            <View style={styles.categoryPill}>
              <VelaIcon
                name={categoryMeta.icon}
                size={11}
                color={Colors.textSecondary}
                style={styles.pillIcon}
              />
              <Text style={styles.categoryPillText}>{categoryMeta.label}</Text>
            </View>
            {filterMeta && filterMeta.name !== 'Raw' ? (
              <View style={styles.filterBadge}>
                <VelaIcon
                  name="color-filter-outline"
                  size={11}
                  color="#7E22CE"
                  style={styles.pillIcon}
                />
                <Text style={styles.filterBadgeText}>{filterMeta.name}</Text>
              </View>
            ) : null}
            {post.visibility === 'public_world' ? (
              <View style={styles.globalPill}>
                <VelaIcon
                  name="globe-outline"
                  size={11}
                  color="#047857"
                  style={styles.pillIcon}
                />
                <Text style={styles.globalPillText}>Worldwide</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Media: Video Memory or Photo Memory with Visual Filters & Overlays */}
      {displayImage ? (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: displayImage }} style={styles.mediaImage} />

          {/* Filter Tint Overlay */}
          {filterMeta?.overlayHex ? (
            <View
              style={[
                styles.filterOverlayTint,
                { backgroundColor: filterMeta.overlayHex },
              ]}
            />
          ) : null}

          {/* Text Sticker Overlay */}
          {post.overlayText ? (
            <View style={styles.stickerBadge}>
              <Text style={styles.stickerText}>{post.overlayText}</Text>
            </View>
          ) : null}

          {/* Video Play / Pause Controls */}
          {isVideo ? (
            <TouchableOpacity
              style={styles.videoOverlay}
              activeOpacity={0.9}
              onPress={() => setIsPlayingVideo(!isPlayingVideo)}
            >
              <View style={styles.playButtonCircle}>
                <VelaIcon
                  name={isPlayingVideo ? 'pause' : 'play'}
                  size={20}
                  color={Colors.black}
                />
              </View>
              <View style={styles.videoBadgeRow}>
                <View style={styles.videoDurationBadge}>
                  <Text style={styles.videoDurationText}>
                    {isPlayingVideo ? 'PLAYING MEMORY' : `0:${post.videoDurationSeconds || 30}`}
                  </Text>
                </View>
                <View style={styles.videoHdBadge}>
                  <Text style={styles.videoHdText}>4K MEMORY</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* Background Music Audio Pill */}
      {post.musicTitle ? (
        <TouchableOpacity
          style={[styles.audioPill, isPlayingMusic && styles.audioPillPlaying]}
          onPress={() => setIsPlayingMusic(!isPlayingMusic)}
          activeOpacity={0.8}
        >
          <View style={styles.discCircle}>
            <VelaIcon
              name={isPlayingMusic ? 'volume-high' : 'disc-outline'}
              size={14}
              color={isPlayingMusic ? Colors.accentDark : Colors.textPrimary}
            />
          </View>
          <View style={styles.musicMeta}>
            <Text style={styles.musicTitleText} numberOfLines={1}>
              {post.musicTitle}
            </Text>
            <Text style={styles.musicArtistText} numberOfLines={1}>
              {post.musicArtist} {isPlayingMusic ? '• Playing' : '• Tap to Listen'}
            </Text>
          </View>
          <View style={styles.musicWaveformBadge}>
            <VelaIcon
              name="musical-notes"
              size={14}
              color={isPlayingMusic ? Colors.accentDark : Colors.textMuted}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => onLike(post.id)}
          style={[styles.actionButton, post.isLiked && styles.actionButtonLiked]}>
          <VelaIcon
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={post.isLiked ? Colors.error : Colors.textSecondary}
          />
          <Text style={[styles.actionCount, post.isLiked && styles.actionCountLiked]}>
            {post.likesCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowComments(!showComments)}
          style={styles.actionButton}>
          <VelaIcon
            name="chatbubble-ellipses-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.actionCount}>
            {post.commentsCount > 0 ? `${post.commentsCount} Comments` : 'Comment'}
          </Text>
        </Pressable>

        <View style={styles.twinCelebrationTag}>
          <VelaIcon
            name={isVideo ? 'videocam-outline' : 'camera-outline'}
            size={12}
            color={Colors.goldAccent}
            style={styles.tagIcon}
          />
          <Text style={styles.twinCelebrationText}>
            {isVideo ? 'Video Memory' : 'Birthday Memory'}
          </Text>
        </View>
      </View>

      {/* Expandable Comments Section */}
      {showComments && (
        <View style={styles.commentsContainer}>
          {post.comments && post.comments.length > 0 ? (
            <View style={styles.commentsList}>
              {post.comments.map((c, idx) => (
                <View key={`${c.id || 'comment'}_${idx}`} style={styles.commentItem}>
                  <Image source={{ uri: c.authorAvatar }} style={styles.commentAvatar} />
                  <View style={styles.commentBubble}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{c.authorName}</Text>
                      <Text style={styles.commentTime}>{c.createdAt}</Text>
                    </View>
                    <Text style={styles.commentBody}>{c.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noCommentsText}>
              Be the first birthday twin to leave a celebratory note.
            </Text>
          )}

          {/* Comment Input */}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a birthday twin message..."
              placeholderTextColor={Colors.textMuted}
              value={commentInput}
              onChangeText={setCommentInput}
            />
            <Pressable
              onPress={handleSendComment}
              style={[
                styles.commentSendBtn,
                commentInput.trim().length === 0 && styles.commentSendBtnDisabled,
              ]}>
              <Text style={styles.commentSendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentLight,
  },
  authorMeta: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  twinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  badgeIcon: {
    marginRight: 3,
  },
  twinBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.textPrimary,
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  parentIcon: {
    marginRight: 4,
  },
  parentManagedText: {
    fontSize: 11,
    color: Colors.accentDark,
    fontWeight: '600',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap',
    gap: 6,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillIcon: {
    marginRight: 3,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7E22CE',
  },
  globalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  globalPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  mediaContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.black,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  filterOverlayTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stickerBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#000000B3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  stickerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFFEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  videoBadgeRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoDurationBadge: {
    backgroundColor: '#000000CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDurationText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  videoHdBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoHdText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  audioPillPlaying: {
    backgroundColor: '#E8F5FD',
    borderColor: Colors.accent,
  },
  discCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  musicMeta: {
    flex: 1,
  },
  musicTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  musicArtistText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  musicWaveformBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonLiked: {
    backgroundColor: '#FEE2E2',
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionCountLiked: {
    color: Colors.error,
    fontWeight: '700',
  },
  twinCelebrationTag: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagIcon: {
    marginRight: 4,
  },
  twinCelebrationText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.goldAccent,
  },
  commentsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  commentsList: {
    gap: 10,
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  commentTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  commentBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  noCommentsText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  commentSendBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  commentSendBtnDisabled: {
    backgroundColor: Colors.border,
  },
  commentSendText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
  },
});
