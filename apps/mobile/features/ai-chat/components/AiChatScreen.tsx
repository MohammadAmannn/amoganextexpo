import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { Bot, Send, Sparkles, User, Zap } from 'lucide-react-native'
import type { AiMessage, AiModelOption } from '../types'

const MODELS: AiModelOption[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
]

const PROMPTS = [
  'Generate an interactive React Native component',
  'Summarize recent developments in AI agent frameworks',
  'Optimize SQL queries for Supabase Realtime',
  'Draft an enterprise SaaS software agreement',
]

export function AiChatScreen() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'ai-welcome',
      role: 'assistant',
      content:
        'Hello! I am your AI assistant powered by high-speed neural inference. How can I assist you with your software development, design systems, or data today?',
      timestamp: 'Just now',
      model: 'Gemini 2.5 Flash',
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || busy) return

    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setBusy(true)

    setTimeout(() => {
      const activeModelName =
        MODELS.find((m) => m.id === selectedModel)?.name || 'AI Assistant'

      const assistantMsg: AiMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Here is the response for: "${text}"\n\n1. Architecture Strategy: Cross-platform Universal architecture ensures full parity between Web, iOS, and Android.\n2. Design Token Consistency: Using centralized Tailwind/NativeWind classes maintains pixel-perfect fidelity.\n3. State Cohesion: Zustand stores keep client state lightweight, predictable, and fast.`,
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        model: activeModelName,
      }

      setMessages((prev) => [...prev, assistantMsg])
      setBusy(false)
    }, 800)
  }

  const renderMessage = ({ item }: { item: AiMessage }) => {
    const isUser = item.role === 'user'
    return (
      <View
        style={[
          styles.msgRow,
          isUser ? styles.msgRowUser : styles.msgRowAssistant,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Bot size={16} color='#059669' />
          </View>
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          {!isUser && (
            <View style={styles.aiMetaRow}>
              <Text style={styles.aiModelLabel}>{item.model}</Text>
              <Text style={styles.aiTimeLabel}>{item.timestamp}</Text>
            </View>
          )}

          <Text
            style={[
              styles.msgText,
              isUser ? styles.msgTextUser : styles.msgTextAssistant,
            ]}
          >
            {item.content}
          </Text>

          {isUser && (
            <Text style={styles.userTimeLabel}>{item.timestamp}</Text>
          )}
        </View>

        {isUser && (
          <View style={styles.userAvatar}>
            <User size={16} color='#ffffff' />
          </View>
        )}
      </View>
    )
  }

  return (
    <UniversalLayout title='AI Chat'>
      <View style={styles.container}>
        {/* Model Selector Bar */}
        <View style={styles.modelsBar}>
          <Text style={styles.modelsBarLabel}>MODEL:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modelsScroll}
          >
            {MODELS.map((m) => {
              const isActive = selectedModel === m.id
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedModel(m.id)}
                  style={[
                    styles.modelPill,
                    isActive && styles.modelPillActive,
                  ]}
                >
                  <Zap
                    size={12}
                    color={isActive ? '#059669' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.modelPillText,
                      isActive && styles.modelPillTextActive,
                    ]}
                  >
                    {m.name}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        {/* Message Stream */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            messages.length <= 1 ? (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>
                  Suggested prompts to get started:
                </Text>
                <View style={styles.promptChipsGrid}>
                  {PROMPTS.map((prompt, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSend(prompt)}
                      style={styles.promptChip}
                    >
                      <Sparkles size={14} color='#059669' />
                      <Text style={styles.promptChipText}>{prompt}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder='Ask anything...'
            placeholderTextColor='#94a3b8'
            style={styles.inputField}
            onSubmitEditing={() => handleSend()}
          />
          <Pressable
            disabled={busy || !input.trim()}
            onPress={() => handleSend()}
            style={[
              styles.sendBtn,
              (!input.trim() || busy) && styles.sendBtnDisabled,
            ]}
            hitSlop={8}
          >
            <Send size={16} color='#ffffff' strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modelsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  modelsBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  modelsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modelPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  modelPillText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  modelPillTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    gap: 16,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAssistant: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 12,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: '#0f172a',
  },
  bubbleAssistant: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aiMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  aiModelLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  aiTimeLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  userTimeLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextUser: {
    color: '#ffffff',
  },
  msgTextAssistant: {
    color: '#1e293b',
  },
  suggestionsContainer: {
    marginTop: 20,
    gap: 10,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  promptChipsGrid: {
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
  },
  promptChipText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
  },
  inputField: {
    flex: 1,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
})
