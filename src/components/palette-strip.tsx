import React from 'react';
import {View} from 'react-native';
import {paletteSwatches} from '../constants/colors';
import {styles} from '../styles/app-styles';

export function PaletteStrip() {
  return (
    <View accessibilityLabel="Reference color palette" style={styles.paletteStrip}>
      {paletteSwatches.map(color => (
        <View
          key={color}
          style={[styles.paletteSwatch, {backgroundColor: color}]}
        />
      ))}
    </View>
  );
}
