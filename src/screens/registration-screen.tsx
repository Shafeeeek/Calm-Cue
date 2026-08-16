import React, {useState} from 'react';
import {Pressable, Switch, Text, TextInput, View} from 'react-native';
import {ReviewRow} from '../components/review-row';
import {supportPreferenceOptions} from '../constants/calm-data';
import {colors} from '../constants/colors';
import {styles} from '../styles/app-styles';

export function RegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [supportContact, setSupportContact] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState(supportPreferenceOptions[0]);
  const [allowReminders, setAllowReminders] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completionCount = [
    fullName.trim(),
    email.trim(),
    phone.trim(),
    supportContact.trim(),
  ].filter(Boolean).length;
  const canSubmit = fullName.trim().length > 1 && email.includes('@');

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <View style={styles.sectionStack}>
      {/* 1. Collect only the core profile details needed for support. */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text selectable style={styles.sectionTitle}>
              Registration details
            </Text>
            <Text selectable style={styles.subtleText}>
              {completionCount} of 4 details added
            </Text>
          </View>
          <View style={styles.registrationBadge}>
            <Text selectable style={styles.registrationBadgeText}>
              Private
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Full name
          </Text>
          <TextInput
            accessibilityLabel="Full name"
            autoCapitalize="words"
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor={colors.placeholder}
            style={styles.textInput}
            value={fullName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Email
          </Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={colors.placeholder}
            style={styles.textInput}
            value={email}
          />
        </View>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Phone
          </Text>
          <TextInput
            accessibilityLabel="Phone"
            inputMode="tel"
            keyboardType="phone-pad"
            onChangeText={setPhone}
            placeholder="Optional"
            placeholderTextColor={colors.placeholder}
            style={styles.textInput}
            value={phone}
          />
        </View>

        <View style={styles.formGroup}>
          <Text selectable style={styles.inputLabel}>
            Trusted support contact
          </Text>
          <TextInput
            accessibilityLabel="Trusted support contact"
            autoCapitalize="words"
            onChangeText={setSupportContact}
            placeholder="Name or phone"
            placeholderTextColor={colors.placeholder}
            style={styles.textInput}
            value={supportContact}
          />
        </View>
      </View>

      {/* 2. Preferences decide how the calming tools should help later. */}
      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          What should the app help with?
        </Text>
        <View style={styles.actionGrid}>
          {supportPreferenceOptions.map(option => {
            const isSelected = primaryGoal === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => setPrimaryGoal(option)}
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
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text selectable style={styles.groundingTitle}>
              Gentle reminders
            </Text>
            <Text selectable style={styles.groundingCue}>
              Use calm prompts and check-ins during the day.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Gentle reminders"
            onValueChange={setAllowReminders}
            thumbColor={allowReminders ? colors.white : colors.thumbOff}
            trackColor={{false: colors.controlBorder, true: colors.green}}
            value={allowReminders}
          />
        </View>
      </View>

      {/* 3. Review comes last so registration ends with a clear confirmation. */}
      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          Review profile
        </Text>
        <View style={styles.reviewList}>
          <ReviewRow label="Name" value={fullName || 'Not added'} />
          <ReviewRow label="Email" value={email || 'Not added'} />
          <ReviewRow label="Goal" value={primaryGoal} />
          <ReviewRow
            label="Reminders"
            value={allowReminders ? 'On' : 'Off'}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}>
          <Text selectable style={styles.submitButtonText}>
            Complete registration
          </Text>
        </Pressable>
        {!canSubmit && (
          <Text selectable style={styles.formHint}>
            Add at least a name and valid email to finish.
          </Text>
        )}
        {isSubmitted && (
          <View style={styles.successPanel}>
            <Text selectable style={styles.successTitle}>
              Registration saved
            </Text>
            <Text selectable style={styles.successText}>
              Your calm profile is ready for reminders, grounding, and support
              check-ins.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
