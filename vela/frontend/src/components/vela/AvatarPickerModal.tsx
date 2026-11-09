import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../theme/colors';
import { VelaIcon } from './VelaIcon';
import { CURATED_AVATARS } from '../../services/mockData';

interface AvatarPickerModalProps {
  visible: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  currentAvatar,
  onClose,
  onSelectAvatar,
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [selectedPreview, setSelectedPreview] = useState(currentAvatar);

  const handlePickFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Vela needs access to your photo library to set your profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        setSelectedPreview(uri);
        onSelectAvatar(uri);
        onClose();
      }
    } catch {
      Alert.alert('Error', 'Unable to pick photo from library. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Vela needs camera access to capture your verified member portrait.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        setSelectedPreview(uri);
        onSelectAvatar(uri);
        onClose();
      }
    } catch {
      Alert.alert('Error', 'Unable to capture photo. Please try again.');
    }
  };

  const handleSelectCurated = (url: string) => {
    setSelectedPreview(url);
    onSelectAvatar(url);
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedPreview(customUrl.trim());
    onSelectAvatar(customUrl.trim());
    setCustomUrl('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Update Profile Picture</Text>
              <Text style={styles.subtitle}>
                Choose a portrait from your device or select a curated society avatar
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <VelaIcon name="close-outline" size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Current Avatar Preview */}
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedPreview || currentAvatar }} style={styles.previewAvatar} />
              <View style={styles.previewBadge}>
                <VelaIcon name="checkmark" size={12} color={Colors.background} />
              </View>
            </View>

            {/* Device Actions */}
            <View style={styles.actionRow}>
              <Pressable onPress={handlePickFromLibrary} style={styles.deviceBtn}>
                <View style={styles.deviceBtnIconCircle}>
                  <VelaIcon name="images-outline" size={20} color={Colors.accentDark} />
                </View>
                <Text style={styles.deviceBtnTitle}>Photo Library</Text>
                <Text style={styles.deviceBtnSub}>Choose from gallery</Text>
              </Pressable>

              <Pressable onPress={handleTakePhoto} style={styles.deviceBtn}>
                <View style={[styles.deviceBtnIconCircle, styles.cameraIconCircle]}>
                  <VelaIcon name="camera-outline" size={20} color={Colors.goldAccent} />
                </View>
                <Text style={styles.deviceBtnTitle}>Take Photo</Text>
                <Text style={styles.deviceBtnSub}>Capture new portrait</Text>
              </Pressable>
            </View>

            {/* Curated Avatars Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CURATED SOCIETY PORTRAITS</Text>
              <Text style={styles.sectionSub}>Select an aesthetic representation for your life stage</Text>

              <View style={styles.curatedGrid}>
                {CURATED_AVATARS.map((item) => {
                  const isSelected = (selectedPreview || currentAvatar) === item.url;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleSelectCurated(item.url)}
                      style={[styles.curatedItem, isSelected && styles.curatedItemSelected]}>
                      <Image source={{ uri: item.url }} style={styles.curatedImage} />
                      <Text style={[styles.curatedLabel, isSelected && styles.curatedLabelSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Custom URL Input Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CUSTOM IMAGE URL</Text>
              <View style={styles.urlInputRow}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="https://images.example.com/photo.jpg"
                  placeholderTextColor={Colors.textMuted}
                  value={customUrl}
                  onChangeText={setCustomUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={handleApplyCustomUrl}
                  style={[styles.applyUrlBtn, !customUrl.trim() && styles.applyUrlBtnDisabled]}
                  disabled={!customUrl.trim()}>
                  <Text style={styles.applyUrlText}>Set</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
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
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 36,
  },
  previewContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  previewAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.goldAccent,
    backgroundColor: Colors.surface,
  },
  previewBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  deviceBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deviceBtnIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cameraIconCircle: {
    backgroundColor: Colors.goldLight,
  },
  deviceBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  deviceBtnSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  curatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  curatedItem: {
    width: '23%',
    alignItems: 'center',
    padding: 6,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  curatedItemSelected: {
    borderColor: Colors.goldAccent,
    backgroundColor: Colors.goldLight,
  },
  curatedImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.border,
    marginBottom: 6,
  },
  curatedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  curatedLabelSelected: {
    color: Colors.goldAccent,
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  applyUrlBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyUrlBtnDisabled: {
    opacity: 0.5,
  },
  applyUrlText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.background,
  },
});

