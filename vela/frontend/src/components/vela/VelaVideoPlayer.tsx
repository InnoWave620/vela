import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Colors } from '../../theme/colors';
import { VelaIcon } from './VelaIcon';

interface VelaVideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  style?: StyleProp<ViewStyle>;
  filterOverlayHex?: string;
  onDownloadPress?: () => void;
  isDownloading?: boolean;
}

// External helper to toggle audio without direct mutation inside component scope
function togglePlayerMuted(p: { muted: boolean }) {
  p.muted = !p.muted;
}

export const VelaVideoPlayer: React.FC<VelaVideoPlayerProps> = ({
  videoUrl,
  autoPlay = true,
  style,
  filterOverlayHex,
  onDownloadPress,
  isDownloading = false,
}) => {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = true; // start muted for smooth mobile autoplay
    if (autoPlay) {
      p.play();
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const { muted } = useEvent(player, 'mutedChange', {
    muted: player.muted,
  });

  const handleTogglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleToggleMute = (e: any) => {
    e.stopPropagation?.();
    togglePlayerMuted(player);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Native Video Rendering View */}
      <VideoView
        player={player}
        style={styles.videoView}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Optional Visual Filter Tint Overlay */}
      {filterOverlayHex ? (
        <View
          style={[styles.filterOverlayTint, { backgroundColor: filterOverlayHex }]}
          pointerEvents="none"
        />
      ) : null}

      {/* Touch Interaction Overlay */}
      <TouchableOpacity
        style={styles.touchOverlay}
        activeOpacity={1}
        onPress={handleTogglePlay}
      >
        {/* Top Badges Row: Audio Mute Toggle + Quick Save Action + 4K HD Badge */}
        <View style={styles.topControlRow}>
          <TouchableOpacity
            style={[styles.audioPillBtn, !muted && styles.audioPillBtnActive]}
            activeOpacity={0.8}
            onPress={handleToggleMute}
          >
            <VelaIcon
              name={muted ? 'volume-mute-outline' : 'volume-high-outline'}
              size={14}
              color={muted ? Colors.textPrimary : Colors.accentDark}
            />
            <Text
              style={[
                styles.audioPillText,
                !muted && styles.audioPillTextActive,
              ]}
            >
              {muted ? 'Muted' : 'Sound On'}
            </Text>
          </TouchableOpacity>

          <View style={styles.topRightRow}>
            {onDownloadPress ? (
              <TouchableOpacity
                style={styles.quickDownloadBtn}
                activeOpacity={0.8}
                onPress={(e) => {
                  e.stopPropagation();
                  onDownloadPress();
                }}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <VelaIcon
                      name="arrow-down-circle-outline"
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.quickDownloadText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : null}

            <View style={styles.hdBadge}>
              <Text style={styles.hdBadgeText}>4K HDR</Text>
            </View>
          </View>
        </View>

        {/* Center Play/Pause indicator when paused */}
        {!isPlaying ? (
          <View style={styles.centerPlayPrompt}>
            <View style={styles.playIconCircle}>
              <VelaIcon name="play" size={26} color="#000000" />
            </View>
            <Text style={styles.tapToResumeText}>Tap to Play Memory</Text>
          </View>
        ) : null}

        {/* Bottom Playback Status Bar */}
        <View style={styles.bottomStatusRow}>
          <View style={styles.playingIndicatorPill}>
            <View
              style={[
                styles.statusDot,
                isPlaying ? styles.statusDotLive : styles.statusDotPaused,
              ]}
            />
            <Text style={styles.playingIndicatorText}>
              {isPlaying ? 'AUTOPLAYING' : 'PAUSED'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    backgroundColor: '#0A0F1D',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  videoView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0A0F1D',
  },
  filterOverlayTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 15, 29, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  audioPillBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: Colors.accentDark,
  },
  audioPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  audioPillTextActive: {
    color: Colors.accentDark,
  },
  quickDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(10, 15, 29, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickDownloadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hdBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hdBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#D4AF37', // luxury gold
  },
  centerPlayPrompt: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
  },
  playIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  tapToResumeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomStatusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  playingIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotLive: {
    backgroundColor: '#10B981', // Emerald green
  },
  statusDotPaused: {
    backgroundColor: '#F59E0B', // Amber
  },
  playingIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
