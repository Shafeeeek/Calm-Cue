import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  breathPhases,
  groundingSteps,
  smallActions,
  worryChoices,
} from '../constants/calm-data';
import {BotScreen} from '../screens/bot-screen';
import {CalmScreen} from '../screens/calm-screen';
import {LoginScreen} from '../screens/login-screen';
import {RegistrationScreen} from '../screens/registration-screen';
import {VideosScreen} from '../screens/videos-screen';
import {WelcomeScreen} from '../screens/welcome-screen';
import {styles} from '../styles/app-styles';
import type {AppScreen, AuthScreen} from '../types/app';
import {AppHeader} from './app-header';
import {BackgroundGradient} from './background-gradient';
import {PaletteStrip} from './palette-strip';
import {ScreenTabs} from './screen-tabs';

export function AppShell() {
  const insets = useSafeAreaInsets();
  const breathValue = useRef(new Animated.Value(0)).current;
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('calm');
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(breathPhases[0].duration);
  const [completedGrounding, setCompletedGrounding] = useState<
    Record<string, boolean>
  >({});
  const [selectedAction, setSelectedAction] = useState(smallActions[0]);
  const [selectedWorry, setSelectedWorry] = useState(worryChoices[1].key);

  const currentPhase = breathPhases[phaseIndex];
  const groundingCount = groundingSteps.filter(
    step => completedGrounding[step.key],
  ).length;

  const selectedWorryStep = useMemo(
    () =>
      worryChoices.find(choice => choice.key === selectedWorry)?.step ??
      worryChoices[1].step,
    [selectedWorry],
  );

  const moodCopy = useMemo(() => {
    if (anxietyLevel <= 2) {
      return 'Keep the pace gentle and protect the calm you have.';
    }

    if (anxietyLevel === 3) {
      return 'You are not behind. Start with breath, then pick one next step.';
    }

    return 'Shrink the moment. Breathe first, ground second, ask for support if needed.';
  }, [anxietyLevel]);

  // Animate the orb toward each phase target so breathing feels guided.
  useEffect(() => {
    if (!isBreathing) {
      breathValue.stopAnimation();
      Animated.timing(breathValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(breathValue, {
      toValue: currentPhase.target,
      duration: currentPhase.duration * 1000,
      useNativeDriver: true,
    }).start();
  }, [breathValue, currentPhase, isBreathing]);

  // Keep the countdown and phase label in sync with the animation cycle.
  useEffect(() => {
    if (!isBreathing) {
      return;
    }

    const timeout = setTimeout(() => {
      if (secondsLeft > 1) {
        setSecondsLeft(secondsLeft - 1);
        return;
      }

      const nextPhaseIndex = (phaseIndex + 1) % breathPhases.length;
      setPhaseIndex(nextPhaseIndex);
      setSecondsLeft(breathPhases[nextPhaseIndex].duration);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isBreathing, phaseIndex, secondsLeft]);

  const breathScale = breathValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.18],
  });

  const breathOpacity = breathValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.58, 0.92],
  });

  const handleBreathingPress = () => {
    const nextBreathingState = !isBreathing;
    setIsBreathing(nextBreathingState);
    setPhaseIndex(0);
    setSecondsLeft(breathPhases[0].duration);
  };

  const toggleGroundingStep = (key: string) => {
    setCompletedGrounding(current => ({
      ...current,
      [key]: !current[key],
    }));
  };
  const scrollInsetStyle = {paddingTop: insets.top + 20};
  const authInsetStyle = {
    paddingBottom: insets.bottom + 28,
    paddingTop: insets.top + 20,
  };
  const bottomBarInsetStyle = {paddingBottom: insets.bottom + 4};

  const enterApp = () => {
    setIsSignedIn(true);
    setActiveScreen('calm');
  };

  if (!isSignedIn) {
    return (
      <View style={styles.screen}>
        <BackgroundGradient />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          style={styles.scrollArea}
          contentContainerStyle={[styles.authContent, authInsetStyle]}>
          {authScreen === 'welcome' ? (
            <WelcomeScreen
              onEnterApp={enterApp}
              onStartLogin={() => setAuthScreen('login')}
            />
          ) : (
            <LoginScreen
              onBack={() => setAuthScreen('welcome')}
              onLoginComplete={enterApp}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <BackgroundGradient />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.content,
          styles.scrollContentBottomSpacing,
          scrollInsetStyle,
        ]}>
        <AppHeader activeScreen={activeScreen} anxietyLevel={anxietyLevel} />
        <PaletteStrip />

        {activeScreen === 'calm' && (
          <CalmScreen
            anxietyLevel={anxietyLevel}
            breathOpacity={breathOpacity}
            breathScale={breathScale}
            completedGrounding={completedGrounding}
            currentPhase={currentPhase}
            groundingCount={groundingCount}
            isBreathing={isBreathing}
            moodCopy={moodCopy}
            secondsLeft={secondsLeft}
            selectedAction={selectedAction}
            selectedWorry={selectedWorry}
            selectedWorryStep={selectedWorryStep}
            onActionSelect={setSelectedAction}
            onBreathingPress={handleBreathingPress}
            onGroundingReset={() => setCompletedGrounding({})}
            onGroundingToggle={toggleGroundingStep}
            onLevelSelect={setAnxietyLevel}
            onWorrySelect={setSelectedWorry}
          />
        )}

        {activeScreen === 'bot' && <BotScreen />}

        {activeScreen === 'videos' && <VideosScreen />}

        {activeScreen === 'registration' && <RegistrationScreen />}

        <View style={styles.footerPanel}>
          <Text selectable style={styles.footerText}>
            This is a support tool, not medical care. If you are in immediate
            danger, contact local emergency services now.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomAppBarWrap, bottomBarInsetStyle]}>
        <ScreenTabs
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
        />
      </View>
    </View>
  );
}
