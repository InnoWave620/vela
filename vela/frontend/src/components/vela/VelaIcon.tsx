import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export type VelaIconFamily = 'ion' | 'material';

export interface VelaIconProps {
  name: string;
  family?: VelaIconFamily;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const VelaIcon: React.FC<VelaIconProps> = ({
  name,
  family = 'ion',
  size = 20,
  color = Colors.textPrimary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {family === 'material' ? (
        <MaterialCommunityIcons
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={size}
          color={color}
        />
      ) : (
        <Ionicons
          name={name as keyof typeof Ionicons.glyphMap}
          size={size}
          color={color}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
