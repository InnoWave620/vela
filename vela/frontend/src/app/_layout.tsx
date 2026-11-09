import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VelaProvider } from '../context/VelaContext';
import { Colors } from '../theme/colors';

// Prevent splash screen from auto-hiding before components are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen immediately when root layout mounts
    async function dismissSplash() {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // Ignore if splash was already dismissed
      }
    }

    dismissSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <VelaProvider>
          <Slot />
        </VelaProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
