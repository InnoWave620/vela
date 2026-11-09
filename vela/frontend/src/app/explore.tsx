import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../theme/colors';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>V E L A</Text>
        <Text style={styles.tagline}>THE BIRTHDAY TWIN SOCIETY</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Core Premise &amp; Architecture</Text>
          <Text style={styles.cardBody}>
            Vela connects individuals sharing the exact same calendar birthday to celebrate together,
            collaborate on shared birthday galas, and build lifelong friendships.
          </Text>
        </View>

        <Pressable onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>Enter Vela Society</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 6,
    color: Colors.textPrimary,
    marginTop: 20,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.accentDark,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 14,
  },
});
