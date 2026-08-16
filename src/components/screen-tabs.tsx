import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {styles} from '../styles/app-styles';
import type {AppScreen} from '../types/app';

const tabs: Array<{key: AppScreen; label: string; icon: string}> = [
  {key: 'calm', label: 'Calm', icon: 'B'},
  {key: 'videos', label: 'Videos', icon: 'V'},
  {key: 'bot', label: 'Bot', icon: 'AI'},
  {key: 'registration', label: 'Profile', icon: 'ID'},
];

type ScreenTabsProps = {
  activeScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
};

export function ScreenTabs({activeScreen, onScreenChange}: ScreenTabsProps) {
  const actionMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(actionMotion, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(actionMotion, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [actionMotion]);

  const actionScale = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const actionRotate = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  const blobOneShift = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 65],
  });
  const blobTwoShift = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [55, -60],
  });
  const sheenShift = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 190],
  });
  const liquidOpacity = actionMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0.38, 0.7],
  });
  const actionMotionStyle = {
    transform: [
      {perspective: 320},
      {scale: actionScale},
      {rotateZ: actionRotate},
    ],
  };
  const liquidBlobOneStyle = {
    opacity: liquidOpacity,
    transform: [
      {translateX: blobOneShift},
      {scale: actionScale},
      {rotateZ: actionRotate},
    ],
  };
  const liquidBlobTwoStyle = {
    opacity: liquidOpacity,
    transform: [{translateX: blobTwoShift}, {scale: actionScale}],
  };
  const liquidSheenStyle = {
    transform: [{translateX: sheenShift}, {rotateZ: '-14deg'}],
  };

  return (
    <View style={styles.appBarShell}>
      <View style={styles.screenTabs}>
        <Animated.View
          pointerEvents="none"
          style={[styles.liquidBlobOne, liquidBlobOneStyle]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.liquidBlobTwo, liquidBlobTwoStyle]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.liquidSheen, liquidSheenStyle]}
        />
        {tabs.map(tab => {
          const isSelected = activeScreen === tab.key;

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{selected: isSelected}}
              onPress={() => onScreenChange(tab.key)}
              style={[styles.screenTab, isSelected && styles.screenTabActive]}>
              <View
                style={[
                  styles.appBarIcon,
                  isSelected && styles.appBarIconActive,
                ]}>
                <Text
                  selectable
                  style={[
                    styles.appBarIconText,
                    isSelected && styles.appBarIconTextActive,
                  ]}>
                  {tab.icon}
                </Text>
              </View>
              <Text
                selectable
                style={[
                  styles.screenTabText,
                  isSelected && styles.screenTabTextActive,
                ]}>
                {tab.label}
              </Text>
              <View
                style={[
                  styles.activeTabLine,
                  isSelected && styles.activeTabLineVisible,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityLabel="Open Calm Bot help"
        accessibilityRole="button"
        onPress={() => onScreenChange('bot')}
        style={styles.appBarAction}>
        <Animated.Image
          accessibilityIgnoresInvertColors
          source={require('../assets/circle.png')}
          style={[styles.appBarActionIcon, actionMotionStyle]}
        />
      </Pressable>
    </View>
  );
}
