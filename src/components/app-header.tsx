import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';
import {styles} from '../styles/app-styles';
import type {AppScreen} from '../types/app';

type AppHeaderProps = {
  activeScreen: AppScreen;
  anxietyLevel: number;
};

const screenTitles: Record<AppScreen, string> = {
  calm: 'Steady the next few minutes.',
  videos: 'Scroll into a calmer rhythm.',
  bot: 'Talk with Calm Bot.',
  registration: 'Create your calm profile.',
};

const screenBadges: Record<AppScreen, string> = {
  calm: 'Level',
  videos: 'Clips',
  bot: 'Chat',
  registration: 'Form',
};

export function AppHeader({activeScreen, anxietyLevel}: AppHeaderProps) {
  const heroMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroMotion, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(heroMotion, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [heroMotion]);

  const rotateY = heroMotion.interpolate({
    inputRange: [0, 1],
    outputRange: ['-4deg', '4deg'],
  });
  const rotateX = heroMotion.interpolate({
    inputRange: [0, 1],
    outputRange: ['2deg', '-2deg'],
  });
  const translateY = heroMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });
  const heroMotionStyle = {
    transform: [{perspective: 900}, {rotateX}, {rotateY}, {translateY}],
  };
  const statusValue =
    activeScreen === 'calm'
      ? anxietyLevel
      : activeScreen === 'videos'
      ? '4'
      : activeScreen === 'bot'
      ? 'AI'
      : 'ID';

  return (
    <Animated.View style={[styles.heroCard, heroMotionStyle]}>
      <View style={styles.heroLayerBack} />
      <View style={styles.heroLayerFront} />
      <View style={styles.heroContent}>
        <View style={styles.heroTextBlock}>
          <Text selectable style={styles.eyebrow}>
            CALM CUE
          </Text>
          <Text selectable style={styles.title}>
            {screenTitles[activeScreen]}
          </Text>
          <Text selectable style={styles.heroSubtitle}>
            Breathe, chat, and build a calmer rhythm.
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text selectable style={styles.statusLabel}>
            {screenBadges[activeScreen]}
          </Text>
          <Text selectable style={styles.statusNumber}>
            {statusValue}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
