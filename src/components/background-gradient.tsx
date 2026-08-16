import React from 'react';
import {View} from 'react-native';
import {styles} from '../styles/app-styles';

export function BackgroundGradient() {
  return (
    <View pointerEvents="none" style={styles.backgroundGradient}>
      {/* Layered soft shapes create a calm blue-to-black gradient without extra native packages. */}
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowMiddle} />
      <View style={styles.backgroundGlowBottom} />
      <View style={styles.backgroundShade} />
    </View>
  );
}
