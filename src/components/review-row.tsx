import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/app-styles';

type ReviewRowProps = {
  label: string;
  value: string;
};

export function ReviewRow({label, value}: ReviewRowProps) {
  return (
    <View style={styles.reviewRow}>
      <Text selectable style={styles.reviewLabel}>
        {label}
      </Text>
      <Text selectable style={styles.reviewValue}>
        {value}
      </Text>
    </View>
  );
}
