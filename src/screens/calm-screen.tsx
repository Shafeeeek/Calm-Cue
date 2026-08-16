import React from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {
  groundingSteps,
  smallActions,
  worryChoices,
} from '../constants/calm-data';
import {styles} from '../styles/app-styles';
import type {CalmScreenProps} from '../types/app';

export function CalmScreen({
  anxietyLevel,
  breathOpacity,
  breathScale,
  completedGrounding,
  currentPhase,
  groundingCount,
  isBreathing,
  moodCopy,
  secondsLeft,
  selectedAction,
  selectedWorry,
  selectedWorryStep,
  onActionSelect,
  onBreathingPress,
  onGroundingReset,
  onGroundingToggle,
  onLevelSelect,
  onWorrySelect,
}: CalmScreenProps) {
  return (
    <View style={styles.sectionStack}>
      {/* 1. First, let the user name the intensity before choosing tools. */}
      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          How loud is the anxiety?
        </Text>
        <View style={styles.levelRow}>
          {[1, 2, 3, 4, 5].map(level => {
            const isSelected = anxietyLevel === level;

            return (
              <Pressable
                key={level}
                accessibilityRole="button"
                accessibilityLabel={`Anxiety level ${level}`}
                onPress={() => onLevelSelect(level)}
                style={[
                  styles.levelButton,
                  isSelected && styles.levelButtonSelected,
                ]}>
                <Text
                  selectable
                  style={[
                    styles.levelButtonText,
                    isSelected && styles.levelButtonTextSelected,
                  ]}>
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text selectable style={styles.bodyText}>
          {moodCopy}
        </Text>
      </View>

      {/* 2. Breath comes early because it is the quickest regulation tool. */}
      <View style={[styles.card, styles.breathCard]}>
        <View style={styles.cardHeader}>
          <View>
            <Text selectable style={styles.sectionTitle}>
              Box-to-soft breath
            </Text>
            <Text selectable style={styles.subtleText}>
              4 in, 4 hold, 6 out, 2 rest
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onBreathingPress}
            style={[
              styles.primaryButton,
              isBreathing && styles.primaryButtonActive,
            ]}>
            <Text selectable style={styles.primaryButtonText}>
              {isBreathing ? 'Pause' : 'Start'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.breathArea}>
          <Animated.View
            style={[
              styles.breathOrb,
              {opacity: breathOpacity, transform: [{scale: breathScale}]},
            ]}
          />
          <View style={styles.breathTextWrap}>
            <Text selectable style={styles.breathPhase}>
              {currentPhase.label}
            </Text>
            <Text selectable style={styles.breathSeconds}>
              {secondsLeft}
            </Text>
            <Text selectable style={styles.subtleText}>
              {currentPhase.cue}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Grounding moves attention from worry into the present room. */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text selectable style={styles.sectionTitle}>
              5-4-3-2-1 grounding
            </Text>
            <Text selectable style={styles.subtleText}>
              {groundingCount} of {groundingSteps.length} checked
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onGroundingReset}
            style={styles.ghostButton}>
            <Text selectable style={styles.ghostButtonText}>
              Reset
            </Text>
          </Pressable>
        </View>

        <View style={styles.groundingList}>
          {groundingSteps.map(step => {
            const isDone = completedGrounding[step.key];

            return (
              <Pressable
                key={step.key}
                accessibilityRole="checkbox"
                accessibilityState={{checked: Boolean(isDone)}}
                onPress={() => onGroundingToggle(step.key)}
                style={[
                  styles.groundingItem,
                  isDone && {
                    backgroundColor: step.color,
                    borderColor: step.color,
                  },
                ]}>
                <Text
                  selectable
                  style={[styles.groundingCount, isDone && styles.doneText]}>
                  {step.count}
                </Text>
                <View style={styles.groundingCopy}>
                  <Text
                    selectable
                    style={[styles.groundingTitle, isDone && styles.doneText]}>
                    {step.title}
                  </Text>
                  <Text
                    selectable
                    style={[styles.groundingCue, isDone && styles.doneText]}>
                    {step.cue}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 4. Sorting the worry turns a vague feeling into a next decision. */}
      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          Sort the worry
        </Text>
        <View style={styles.choiceWrap}>
          {worryChoices.map(choice => {
            const isSelected = selectedWorry === choice.key;

            return (
              <Pressable
                key={choice.key}
                accessibilityRole="button"
                onPress={() => onWorrySelect(choice.key)}
                style={[
                  styles.choiceButton,
                  isSelected && styles.choiceButtonSelected,
                ]}>
                <Text
                  selectable
                  style={[
                    styles.choiceButtonText,
                    isSelected && styles.choiceButtonTextSelected,
                  ]}>
                  {choice.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.nextStepPanel}>
          <Text selectable style={styles.nextStepLabel}>
            Next gentle step
          </Text>
          <Text selectable style={styles.nextStepText}>
            {selectedWorryStep}
          </Text>
        </View>
      </View>

      {/* 5. End with one concrete action so the screen closes with movement. */}
      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          One small regulation action
        </Text>
        <View style={styles.actionGrid}>
          {smallActions.map(action => {
            const isSelected = selectedAction === action;

            return (
              <Pressable
                key={action}
                accessibilityRole="button"
                onPress={() => onActionSelect(action)}
                style={[
                  styles.actionButton,
                  isSelected && styles.actionButtonSelected,
                ]}>
                <Text
                  selectable
                  style={[
                    styles.actionButtonText,
                    isSelected && styles.actionButtonTextSelected,
                  ]}>
                  {action}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.selectedActionPanel}>
          <Text selectable style={styles.nextStepLabel}>
            Right now
          </Text>
          <Text selectable style={styles.selectedActionText}>
            {selectedAction}
          </Text>
        </View>
      </View>
    </View>
  );
}
