import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Send, Smile, Paperclip, User, Users } from 'lucide-react-native'

interface ChatMessageItem {
  id: string
  sender: string
  content: string
  time: string
  isOwn: boolean
}

export function MessageChatView() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'm1',
      sender: 'Sarah Chen',
      content: 'Hey everyone, have you reviewed the latest sprint deliverables?',
      time: '10:14 AM',
      isOwn: false,
    },
    {
      id: 'm2',
      sender: 'Alex Rivera',
      content: 'Yes! The responsive layout tests for Expo Universal are passing cleanly on iOS, Android, and Web.',
      time: '10:18 AM',
      isOwn: true,
    },
    {
      id: 'm3',
      sender: 'Sarah Chen',
      content: 'Awesome! Let us deploy the preview build to staging so the design team can do a visual pass.',
      time: '10:20 AM',
      isOwn: false,
    },
  ])

  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'Alex Rivera',
      content: inputText.trim(),
      time: new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
    }

    setMessages((prev) => [...prev, newMsg])
    setInputText('')
  }

  const renderItem = ({ item }: { item: ChatMessageItem }) => {
    return (
      <View
        style={[
          styles.msgRow,
          item.isOwn ? styles.msgRowOwn : styles.msgRowOther,
        ]}
      >
        {!item.isOwn && (
          <View style={styles.senderAvatar}>
            <Text style={styles.senderAvatarText}>{item.sender[0]}</Text>
          </View>
        )}

        <View
          style={[
            styles.bubble,
            item.isOwn ? styles.bubbleOwn : styles.bubbleOther,
          ]}
        >
          {!item.isOwn && (
            <Text style={styles.bubbleSender}>{item.sender}</Text>
          )}
          <Text
            style={[
              styles.bubbleContent,
              item.isOwn ? styles.bubbleContentOwn : styles.bubbleContentOther,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.bubbleTime,
              item.isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Chat header */}
      <View style={styles.chatHeader}>
        <View style={styles.groupIconBox}>
          <Users size={16} color='#059669' />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.groupTitle}>Engineering Sprint Team</Text>
          <Text style={styles.groupSubtitle}>8 members • 4 online</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message input */}
      <View style={styles.inputBar}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder='Write a message...'
          placeholderTextColor='#94a3b8'
          style={styles.inputField}
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed]}
          hitSlop={8}
        >
          <Send size={16} color='#ffffff' strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chatHeader: {
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  groupIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  groupSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowOwn: {
    justifyContent: 'flex-end',
  },
  msgRowOther: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleOwn: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 2,
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  bubbleContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleContentOwn: {
    color: '#ffffff',
  },
  bubbleContentOther: {
    color: '#0f172a',
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bubbleTimeOther: {
    color: '#94a3b8',
  },
  inputBar: {
    height: 56,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  inputField: {
    flex: 1,
    height: 38,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnPressed: {
    opacity: 0.85,
  },
})
