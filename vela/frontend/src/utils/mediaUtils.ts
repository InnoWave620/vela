import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export interface SaveMediaResult {
  success: boolean;
  error?: string;
  localUri?: string;
}

/**
 * Downloads and saves a video or image file to the device's public media gallery (Camera Roll).
 * Supports both remote URLs (http/https) and local file URIs (file://, content://).
 */
export async function saveMediaToGallery(
  mediaUri: string,
  mediaType: 'video' | 'image' = 'video'
): Promise<SaveMediaResult> {
  if (!mediaUri) {
    return { success: false, error: 'No media URI provided.' };
  }

  try {
    // 1. Request Media Library Permissions on native devices
    if (Platform.OS !== 'web') {
      const permission = await requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Gallery Permission Required',
          'Please allow VELA access to your media gallery in device settings to save videos and photos.',
          [{ text: 'OK' }]
        );
        return { success: false, error: 'Gallery permission was denied.' };
      }
    }

    let localFileUri = mediaUri;

    // 2. If it is a remote web URL, download it locally first using modern File API
    if (mediaUri.startsWith('http://') || mediaUri.startsWith('https://')) {
      const isVideo = mediaType === 'video' || mediaUri.endsWith('.mp4');
      const extension = isVideo ? '.mp4' : '.jpg';
      const filename = `vela_${Date.now()}_${Math.floor(Math.random() * 10000)}${extension}`;
      const destinationFile = new File(Paths.cache, filename);

      const downloadedFile = await File.downloadFileAsync(mediaUri, destinationFile);
      localFileUri = downloadedFile.uri;
    }

    // 3. Save to native media library using modern Asset.create
    if (Platform.OS !== 'web') {
      await Asset.create(localFileUri);
    }

    return {
      success: true,
      localUri: localFileUri,
    };
  } catch (error: any) {
    const errorMsg = error?.message || 'An error occurred while saving the media.';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
