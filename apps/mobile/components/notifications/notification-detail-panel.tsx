import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Bell,
  Download,
  FileText,
  Trash2,
  X,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { NotificationItem } from './notification-card-item'

interface NotificationDetailPanelProps {
  notification: NotificationItem
  onClose?: () => void
  onDelete?: () => void
  onDownloadFile?: (url: string, fileName: string) => void
  style?: any
}

export function NotificationDetailPanel({
  notification,
  onClose,
  onDelete,
  onDownloadFile,
  style,
}: NotificationDetailPanelProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const messageDetail = notification.messageDetail
  const senderName =
    messageDetail?.sender?.name ||
    notification.sender?.name ||
    notification.message_text.split(' send you a msg')[0] ||
    'System Alert'

  const senderEmail =
    messageDetail?.sender?.email ||
    notification.sender?.email ||
    'notification@system.local'

  const initials =
    senderName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'NA'

  const messageText =
    messageDetail?.message || notification.message_text

  const fileName = messageDetail?.file_name
  const fileSize = messageDetail?.file_size
    ? `${(messageDetail.file_size / (1024 * 1024)).toFixed(2)} MB`
    : null

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Panel Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            borderBottomColor: isDark ? colors.border : '#f1f5f9',
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(99, 102, 241, 0.1)',
                borderColor: isDark
                  ? 'rgba(99, 102, 241, 0.35)'
                  : 'rgba(199, 210, 254, 0.6)',
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: isDark ? '#a5b4fc' : '#4f46e5' },
              ]}
            >
              {initials}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text
              style={[styles.headerName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {senderName}
            </Text>
            <Text
              style={[styles.headerEmail, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {senderEmail}
            </Text>
          </View>
        </View>

        {/* Header Actions */}
        <View style={styles.headerActions}>
          {onDelete && (
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconActionBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Trash2 size={16} color={colors.mutedForeground} strokeWidth={1.8} />
            </Pressable>
          )}

          {onClose && (
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconActionBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <X size={17} color={colors.mutedForeground} strokeWidth={1.8} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Main Body */}
      <ScrollView
        style={[
          styles.contentScroll,
          { backgroundColor: isDark ? '#121215' : '#f8fafc' },
        ]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              borderColor: isDark ? colors.border : '#e2e8f0',
            },
          ]}
        >
          {/* Card Top Meta */}
          <View
            style={[
              styles.cardTopMeta,
              { borderBottomColor: isDark ? colors.border : '#f1f5f9' },
            ]}
          >
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.18)'
                    : 'rgba(99, 102, 241, 0.1)',
                  borderColor: isDark
                    ? 'rgba(99, 102, 241, 0.35)'
                    : 'rgba(199, 210, 254, 0.6)',
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  { color: isDark ? '#a5b4fc' : '#4f46e5' },
                ]}
              >
                {messageDetail?.message_type ? messageDetail.message_type.toUpperCase() : 'NOTIFICATION'}
              </Text>
            </View>

            <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>
              {new Date(notification.created_at).toLocaleString()}
            </Text>
          </View>

          {/* Message Text */}
          <Text
            style={[
              styles.messageBody,
              { color: colors.foreground },
            ]}
          >
            {messageText}
          </Text>

          {/* File Attachment Details */}
          {fileName && (
            <View
              style={[
                styles.attachmentCard,
                {
                  backgroundColor: isDark ? '#27272a' : '#f8fafc',
                  borderColor: isDark ? colors.border : '#e2e8f0',
                },
              ]}
            >
              <View style={styles.attachmentLeft}>
                <View
                  style={[
                    styles.fileIconBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(99, 102, 241, 0.1)',
                    },
                  ]}
                >
                  <FileText
                    size={18}
                    color={isDark ? '#a5b4fc' : '#4f46e5'}
                    strokeWidth={1.8}
                  />
                </View>

                <View style={styles.fileInfo}>
                  <Text
                    style={[styles.fileName, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {fileName}
                  </Text>
                  {fileSize && (
                    <Text
                      style={[
                        styles.fileSize,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {fileSize}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                onPress={() =>
                  onDownloadFile?.(
                    messageDetail?.file_url || '',
                    fileName
                  )
                }
                style={({ pressed }) => [
                  styles.downloadBtn,
                  {
                    backgroundColor: isDark ? '#27272a' : '#ffffff',
                    borderColor: isDark ? colors.border : '#cbd5e1',
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Download
                  size={13}
                  color={colors.foreground}
                  strokeWidth={1.8}
                />
                <Text
                  style={[styles.downloadBtnText, { color: colors.foreground }]}
                >
                  Download
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  headerName: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    lineHeight: 18,
  },
  headerEmail: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  detailCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cardTopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  messageBody: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    lineHeight: 20,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    gap: 10,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  fileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  fileName: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  downloadBtnText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
})
