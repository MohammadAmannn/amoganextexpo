import React, { useMemo, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { CategoryFilter } from './CategoryFilter'
import { DesignSystemHeader } from './DesignSystemHeader'
import { DesignSystemList } from './DesignSystemList'
import { DesignSystemSearch } from './DesignSystemSearch'
import { ComponentBadge } from './ComponentBadge'
import { StagePreviewRenderer } from './StagePreviewRenderer'
import { GALLERY_CATEGORIES } from '../data/categories'
import { galleryRegistry } from '../data/registry'
import type { GalleryCategory, GalleryEntry } from '../types'
import {
  Code2,
  Copy,
  Check,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  X,
  ArrowLeft,
} from 'lucide-react-native'

type Viewport = 'desktop' | 'tablet' | 'mobile'

export function DesignSystemScreen() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<GalleryEntry | null>(
    galleryRegistry[0] || null
  )
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [copiedCode, setCopiedCode] = useState(false)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)

  const searchInputRef = useRef<TextInput | null>(null)

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: galleryRegistry.length,
    }
    for (const cat of GALLERY_CATEGORIES) {
      if (cat === 'All') continue
      counts[cat] = galleryRegistry.filter((item) => item.category === cat).length
    }
    return counts
  }, [])

  // Filter components matching category and query
  const filteredComponents = useMemo(() => {
    return galleryRegistry.filter((entry) => {
      const matchesCategory =
        activeCategory === 'All' || entry.category === activeCategory
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const handleCategorySelect = (cat: GalleryCategory) => {
    setActiveCategory(cat)
    setSearchQuery('')
    const firstMatch =
      cat === 'All'
        ? galleryRegistry[0]
        : galleryRegistry.find((c) => c.category === cat)
    if (firstMatch) {
      setSelectedEntry(firstMatch)
      setActiveTab('preview')
    }
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    setActiveCategory('All')
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setActiveCategory('All')
  }

  const handleHeaderSearchPress = () => {
    searchInputRef.current?.focus()
  }

  const handleSelectEntry = (entry: GalleryEntry) => {
    setSelectedEntry(entry)
    setActiveTab('preview')
    setIsMobileDetailOpen(true)
  }

  const handleCopyCode = () => {
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const viewportWidthStyle: { maxWidth?: number; width?: '100%' } =
    viewport === 'tablet'
      ? { maxWidth: 640 }
      : viewport === 'mobile'
      ? { maxWidth: 360 }
      : { width: '100%' }

  const listContent = (
    <View style={styles.navColumn}>
      {!isDesktop && (
        <DesignSystemHeader
          onSearchPress={handleHeaderSearchPress}
          onNotificationsPress={() => {}}
        />
      )}

      <DesignSystemSearch
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
        inputRef={searchInputRef}
      />

      <CategoryFilter
        activeCategory={activeCategory}
        categoryCounts={categoryCounts}
        onSelectCategory={handleCategorySelect}
      />

      <View style={styles.listContainer}>
        <DesignSystemList
          entries={filteredComponents}
          selectedId={selectedEntry?.id ?? null}
          searchQuery={searchQuery}
          onSelectEntry={handleSelectEntry}
          onClearSearch={handleClearSearch}
        />
      </View>
    </View>
  )

  const inspectorContent = selectedEntry ? (
    <View style={styles.inspectorContainer}>
      {/* Top Stage Control Header */}
      <View style={styles.inspectorHeader}>
        <View style={styles.inspectorLeftHeader}>
          {!isDesktop && (
            <Pressable
              onPress={() => setIsMobileDetailOpen(false)}
              style={styles.backBtn}
              hitSlop={8}
            >
              <ArrowLeft size={18} color='#0f172a' />
            </Pressable>
          )}

          <View style={styles.titleInfo}>
            <View style={styles.inspectorTitleRow}>
              <Text style={styles.inspectorTitle} numberOfLines={1}>
                {selectedEntry.name}
              </Text>
              <ComponentBadge
                category={selectedEntry.category}
                badgeText={selectedEntry.badge}
              />
            </View>
            <Text style={styles.inspectorFilePath} numberOfLines={1}>
              {selectedEntry.filePath}
            </Text>
          </View>
        </View>

        {/* Stage Toolbar (Preview / Code tabs + Viewport switcher + Copy) */}
        <View style={styles.stageToolbar}>
          <View style={styles.tabGroup}>
            <Pressable
              onPress={() => setActiveTab('preview')}
              style={[
                styles.stageTabBtn,
                activeTab === 'preview' && styles.stageTabBtnActive,
              ]}
            >
              <Eye
                size={13}
                color={activeTab === 'preview' ? '#0f172a' : '#64748b'}
              />
              <Text
                style={[
                  styles.stageTabText,
                  activeTab === 'preview' && styles.stageTabTextActive,
                ]}
              >
                Preview
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('code')}
              style={[
                styles.stageTabBtn,
                activeTab === 'code' && styles.stageTabBtnActive,
              ]}
            >
              <Code2
                size={13}
                color={activeTab === 'code' ? '#0f172a' : '#64748b'}
              />
              <Text
                style={[
                  styles.stageTabText,
                  activeTab === 'code' && styles.stageTabTextActive,
                ]}
              >
                Code
              </Text>
            </Pressable>
          </View>

          {/* Viewport switchers on wide screens */}
          {activeTab === 'preview' && isDesktop && (
            <View style={styles.viewportGroup}>
              <Pressable
                onPress={() => setViewport('desktop')}
                style={[
                  styles.vpBtn,
                  viewport === 'desktop' && styles.vpBtnActive,
                ]}
                hitSlop={6}
              >
                <Monitor
                  size={14}
                  color={viewport === 'desktop' ? '#0f172a' : '#94a3b8'}
                />
              </Pressable>
              <Pressable
                onPress={() => setViewport('tablet')}
                style={[
                  styles.vpBtn,
                  viewport === 'tablet' && styles.vpBtnActive,
                ]}
                hitSlop={6}
              >
                <Tablet
                  size={14}
                  color={viewport === 'tablet' ? '#0f172a' : '#94a3b8'}
                />
              </Pressable>
              <Pressable
                onPress={() => setViewport('mobile')}
                style={[
                  styles.vpBtn,
                  viewport === 'mobile' && styles.vpBtnActive,
                ]}
                hitSlop={6}
              >
                <Smartphone
                  size={14}
                  color={viewport === 'mobile' ? '#0f172a' : '#94a3b8'}
                />
              </Pressable>
            </View>
          )}

          {/* Copy snippet button */}
          <Pressable
            onPress={handleCopyCode}
            style={({ pressed }) => [
              styles.copyBtn,
              pressed && styles.btnPressed,
            ]}
          >
            {copiedCode ? (
              <>
                <Check size={12} color='#059669' strokeWidth={2.5} />
                <Text style={styles.copyBtnTextSuccess}>Copied</Text>
              </>
            ) : (
              <>
                <Copy size={12} color='#475569' />
                <Text style={styles.copyBtnText}>Snippet</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Stage Canvas Area */}
      <View style={styles.stageFullWrapper}>
        {activeTab === 'preview' ? (
          <StagePreviewRenderer entry={selectedEntry} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.codeScrollContent}
            style={styles.stageScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.codeContainer}>
              <View style={styles.codeHeader}>
                <View style={styles.dotGroup}>
                  <View style={[styles.codeDot, { backgroundColor: '#ef4444' }]} />
                  <View style={[styles.codeDot, { backgroundColor: '#f59e0b' }]} />
                  <View style={[styles.codeDot, { backgroundColor: '#10b981' }]} />
                </View>
                <Text style={styles.codeHeaderText}>
                  {selectedEntry.name} — usage snippet
                </Text>
              </View>
              <View style={styles.codeBody}>
                <Text style={styles.codeText}>
                  {`import { ${selectedEntry.name.replace(/\\s+/g, '')} } from '${selectedEntry.filePath}'\\n\\nexport function Example() {\\n  return (\\n    <${selectedEntry.name.replace(/\\s+/g, '')} />\\n  )\\n}`}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  ) : (
    <View style={styles.emptyInspector}>
      <Sparkles size={32} color='#94a3b8' />
      <Text style={styles.emptyInspectorText}>
        Select a component from the list to inspect
      </Text>
    </View>
  )

  return (
    <UniversalLayout
      title='Design System'
      hideHeader={!isDesktop}
      onSearchPress={handleHeaderSearchPress}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isDesktop ? (
          <View style={styles.desktopSplitView}>
            <View style={styles.desktopSidebarPane}>{listContent}</View>
            <View style={styles.desktopMainPane}>{inspectorContent}</View>
          </View>
        ) : isMobileDetailOpen ? (
          inspectorContent
        ) : (
          listContent
        )}
      </KeyboardAvoidingView>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  desktopSplitView: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebarPane: {
    width: 340,
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
  },
  desktopMainPane: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  navColumn: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inspectorContainer: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  inspectorHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  inspectorLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    padding: 6,
    borderRadius: 6,
  },
  titleInfo: {
    flex: 1,
  },
  inspectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inspectorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'Open Sans',
  },
  inspectorFilePath: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  stageToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  stageTabBtnActive: {
    borderBottomColor: '#0f172a',
  },
  stageTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Open Sans',
  },
  stageTabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  viewportGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vpBtn: {
    padding: 4,
    borderRadius: 4,
  },
  vpBtnActive: {
    backgroundColor: '#f1f5f9',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    fontFamily: 'Open Sans',
  },
  copyBtnTextSuccess: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'Open Sans',
  },
  btnPressed: {
    opacity: 0.7,
  },
  stageFullWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  stageScroll: {
    flex: 1,
  },
  stageScrollContent: {
    padding: 16,
    alignSelf: 'center',
    width: '100%',
  },
  codeScrollContent: {
    padding: 16,
  },
  codeContainer: {
    backgroundColor: '#09090b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
    overflow: 'hidden',
    marginTop: 8,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    backgroundColor: '#18181b',
  },
  dotGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  codeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  codeHeaderText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontFamily: 'Open Sans',
  },
  codeBody: {
    padding: 14,
  },
  codeText: {
    fontSize: 12,
    color: '#38bdf8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  emptyInspector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyInspectorText: {
    fontSize: 13,
    color: '#94a3b8',
    fontFamily: 'Open Sans',
  },
})
