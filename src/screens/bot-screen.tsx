import React, {useMemo, useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import {
  botQuickPrompts,
  buildBotReply,
  initialBotMessages,
} from '../constants/bot-data';
import {colors} from '../constants/colors';
import {styles} from '../styles/app-styles';
import type {ChatMessage} from '../types/app';

export function BotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialBotMessages);
  const [draft, setDraft] = useState('');

  const canSend = draft.trim().length > 0;
  const latestBotHint = useMemo(
    () => messages.filter(message => message.role === 'bot').at(-1)?.text ?? '',
    [messages],
  );

  const sendMessage = (text: string) => {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: cleanText,
    };
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'bot',
      text: buildBotReply(cleanText),
    };

    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      botMessage,
    ]);
    setDraft('');
  };

  return (
    <View style={styles.sectionStack}>
      <View style={styles.botIntroPanel}>
        <Text selectable style={styles.sectionTitle}>
          Calm Bot
        </Text>
        <Text selectable style={styles.bodyText}>
          A gentle support chat for anxious moments. It can help you reflect,
          breathe, ground, and choose one next step.
        </Text>
      </View>

      <View style={styles.card}>
        <Text selectable style={styles.sectionTitle}>
          Start with a prompt
        </Text>
        <View style={styles.actionGrid}>
          {botQuickPrompts.map(prompt => (
            <Pressable
              key={prompt}
              accessibilityRole="button"
              onPress={() => sendMessage(prompt)}
              style={styles.actionButton}>
              <Text selectable style={styles.actionButtonText}>
                {prompt}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text selectable style={styles.sectionTitle}>
              Chat
            </Text>
            <Text selectable style={styles.subtleText}>
              Private support space
            </Text>
          </View>
          <View style={styles.registrationBadge}>
            <Text selectable style={styles.registrationBadgeText}>
              AI Bot
            </Text>
          </View>
        </View>

        <View style={styles.chatList}>
          {messages.map(message => {
            const isUser = message.role === 'user';

            return (
              <View
                key={message.id}
                style={[
                  styles.chatBubble,
                  isUser ? styles.userBubble : styles.botBubble,
                ]}>
                <Text
                  selectable
                  style={[
                    styles.chatSender,
                    isUser && styles.userChatSender,
                  ]}>
                  {isUser ? 'You' : 'Calm Bot'}
                </Text>
                <Text
                  selectable
                  style={[styles.chatText, isUser && styles.userChatText]}>
                  {message.text}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.chatComposer}>
          <TextInput
            accessibilityLabel="Message Calm Bot"
            multiline
            onChangeText={setDraft}
            placeholder="Tell Calm Bot what is happening..."
            placeholderTextColor={colors.placeholder}
            style={[styles.textInput, styles.chatInput]}
            value={draft}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!canSend}
            onPress={() => sendMessage(draft)}
            style={[
              styles.submitButton,
              styles.chatSendButton,
              !canSend && styles.submitButtonDisabled,
            ]}>
            <Text selectable style={styles.submitButtonText}>
              Send
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.nextStepPanel}>
        <Text selectable style={styles.nextStepLabel}>
          Last bot suggestion
        </Text>
        <Text selectable style={styles.nextStepText}>
          {latestBotHint}
        </Text>
      </View>
    </View>
  );
}
