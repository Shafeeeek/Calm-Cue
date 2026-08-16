import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {styles} from '../styles/app-styles';

type WelcomeScreenProps = {
  onEnterApp: () => void;
  onStartLogin: () => void;
};

export function WelcomeScreen({onEnterApp, onStartLogin}: WelcomeScreenProps) {
  return (
    <View style={styles.welcomeStage}>
      {/* The welcome screen introduces the calming purpose before asking for login. */}
      <View style={styles.welcomeMark}>
        <View style={styles.welcomeMarkPulse} />
        <Image
          accessibilityIgnoresInvertColors
          source={require('../assets/circle.png')}
          style={styles.welcomeMarkImage}
        />
      </View>

      <View style={styles.welcomeCopy}>
        <Text selectable style={styles.welcomeEyebrow}>
          Calm Cue
        </Text>
        <Text selectable style={styles.welcomeTitle}>
          Your quiet space before anxiety gets loud.
        </Text>
        <Text selectable style={styles.welcomeSubtitle}>
          Breathe, ground your senses, talk with Calm Bot, and save a profile
          that keeps support close.
        </Text>
      </View>

      <View style={styles.welcomeStatsRow}>
        <View style={styles.welcomeStat}>
          <Text selectable style={styles.welcomeStatValue}>
            4-4-6
          </Text>
          <Text selectable style={styles.welcomeStatLabel}>
            Breath
          </Text>
        </View>
        <View style={styles.welcomeStat}>
          <Text selectable style={styles.welcomeStatValue}>
            5
          </Text>
          <Text selectable style={styles.welcomeStatLabel}>
            Senses
          </Text>
        </View>
        <View style={styles.welcomeStat}>
          <Text selectable style={styles.welcomeStatValue}>
            AI
          </Text>
          <Text selectable style={styles.welcomeStatLabel}>
            Bot
          </Text>
        </View>
      </View>

      <View style={styles.authButtonStack}>
        <Pressable
          accessibilityRole="button"
          onPress={onStartLogin}
          style={styles.authPrimaryButton}>
          <Text selectable style={styles.authPrimaryButtonText}>
            Get started
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onEnterApp}
          style={styles.authSecondaryButton}>
          <Text selectable style={styles.authSecondaryButtonText}>
            Explore without login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
