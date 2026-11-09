import React from 'react';
import { StyleSheet, View } from 'react-native';
import { VelaMainNavigator } from '../navigation/VelaMainNavigator';
import { Colors } from '../theme/colors';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <VelaMainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
