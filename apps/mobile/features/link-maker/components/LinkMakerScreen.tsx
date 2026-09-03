import React, { useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { ProfileEditorTab } from './ProfileEditorTab'
import { LinksEditorTab } from './LinksEditorTab'
import { ThemesEditorTab } from './ThemesEditorTab'
import { PhonePreviewView } from './PhonePreviewView'
import { Smartphone, User, Link2, Palette, X } from 'lucide-react-native'

export function LinkMakerScreen() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'themes'>('profile')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const editorContent = (
    <View style={styles.editorContainer}>
      {/* Sub Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setActiveTab('profile')}
          style={[
            styles.tabChip,
            activeTab === 'profile' && styles.tabChipActive,
          ]}
        >
          <User
            size={14}
            color={activeTab === 'profile' ? '#059669' : '#64748b'}
          />
          <Text
            style={[
              styles.tabChipText,
              activeTab === 'profile' && styles.tabChipTextActive,
            ]}
          >
            Profile
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('links')}
          style={[
            styles.tabChip,
            activeTab === 'links' && styles.tabChipActive,
          ]}
        >
          <Link2
            size={14}
            color={activeTab === 'links' ? '#059669' : '#64748b'}
          />
          <Text
            style={[
              styles.tabChipText,
              activeTab === 'links' && styles.tabChipTextActive,
            ]}
          >
            Links
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('themes')}
          style={[
            styles.tabChip,
            activeTab === 'themes' && styles.tabChipActive,
          ]}
        >
          <Palette
            size={14}
            color={activeTab === 'themes' ? '#059669' : '#64748b'}
          />
          <Text
            style={[
              styles.tabChipText,
              activeTab === 'themes' && styles.tabChipTextActive,
            ]}
          >
            Themes
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.editorScroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' && <ProfileEditorTab />}
        {activeTab === 'links' && <LinksEditorTab />}
        {activeTab === 'themes' && <ThemesEditorTab />}
      </ScrollView>
    </View>
  )

  return (
    <UniversalLayout
      title='Link Maker'
      headerChildren={
        !isDesktop ? (
          <Pressable
            onPress={() => setShowMobilePreview(true)}
            style={styles.previewHeaderBtn}
          >
            <Smartphone size={14} color='#059669' />
            <Text style={styles.previewHeaderBtnText}>Preview</Text>
          </Pressable>
        ) : null
      }
    >
      <View style={styles.container}>
        {isDesktop ? (
          <View style={styles.desktopLayout}>
            <View style={styles.desktopEditorPane}>{editorContent}</View>
            <View style={styles.desktopPreviewPane}>
              <Text style={styles.previewHeading}>LIVE PHONE PREVIEW</Text>
              <PhonePreviewView />
            </View>
          </View>
        ) : (
          <>
            {editorContent}
            {/* Mobile Preview Modal */}
            <Modal
              visible={showMobilePreview}
              animationType='slide'
              transparent
              onRequestClose={() => setShowMobilePreview(false)}
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Phone Preview</Text>
                    <Pressable
                      onPress={() => setShowMobilePreview(false)}
                      style={styles.closeBtn}
                      hitSlop={8}
                    >
                      <X size={18} color='#64748b' />
                    </Pressable>
                  </View>
                  <View style={styles.modalBody}>
                    <PhonePreviewView />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  previewHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewHeaderBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopEditorPane: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
  },
  desktopPreviewPane: {
    width: 380,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  previewHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  tabChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  tabChipTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  editorScroll: {
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    alignItems: 'center',
  },
})
