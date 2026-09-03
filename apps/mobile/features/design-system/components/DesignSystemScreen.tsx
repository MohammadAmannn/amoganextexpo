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
  Palette,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

type Viewport = 'desktop' | 'tablet' | 'mobile'

export function DesignSystemScreen() {
  const { openThemeDrawer, colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
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

  // Filter entries
  const filteredComponents = useMemo(() => {
    let result = galleryRegistry

    if (activeCategory !== 'All') {
      result = result.filter((item) => item.category === activeCategory)
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.filePath.toLowerCase().includes(q)
      )
    }

    return result
  }, [activeCategory, searchQuery])

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: galleryRegistry.length }
    for (const item of galleryRegistry) {
      counts[item.category] = (counts[item.category] || 0) + 1
    }
    return counts
  }, [])

  const handleCategorySelect = (cat: GalleryCategory) => {
    setActiveCategory(cat)
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

  const listContent = (
    <View style={[styles.navColumn, { backgroundColor: colors.background }]}>
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

      <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
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
    <View style={[styles.inspectorContainer, { backgroundColor: colors.background }]}>
      {/* Top Stage Control Header */}
      <View
        style={[
          styles.inspectorHeader,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.inspectorLeftHeader}>
          {!isDesktop && (
            <Pressable
              onPress={() => setIsMobileDetailOpen(false)}
              style={styles.backBtn}
              hitSlop={8}
            >
              <ArrowLeft size={18} color={colors.foreground} />
            </Pressable>
          )}

          <View style={styles.titleInfo}>
            <View style={styles.inspectorTitleRow}>
              <Text
                style={[styles.inspectorTitle, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {selectedEntry.name}
              </Text>
              <ComponentBadge
                category={selectedEntry.category}
                badgeText={selectedEntry.badge}
              />
            </View>
            <Text
              style={[
                styles.inspectorFilePath,
                { color: colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {selectedEntry.filePath}
            </Text>
          </View>
        </View>

        {/* Stage Toolbar */}
        <View style={styles.stageToolbar}>
          <View style={styles.tabGroup}>
            <Pressable
              onPress={() => setActiveTab('preview')}
              style={[
                styles.stageTabBtn,
                activeTab === 'preview' && {
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Eye
                size={13}
                color={
                  activeTab === 'preview'
                    ? colors.primary || colors.foreground
                    : colors.mutedForeground
                }
              />
              <Text
                style={[
                  styles.stageTabText,
                  {
                    color:
                      activeTab === 'preview'
                        ? colors.primary || colors.foreground
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'preview' ? '700' : '500',
                  },
                ]}
              >
                Preview
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('code')}
              style={[
                styles.stageTabBtn,
                activeTab === 'code' && {
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Code2
                size={13}
                color={
                  activeTab === 'code'
                    ? colors.primary || colors.foreground
                    : colors.mutedForeground
                }
              />
              <Text
                style={[
                  styles.stageTabText,
                  {
                    color:
                      activeTab === 'code'
                        ? colors.primary || colors.foreground
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'code' ? '700' : '500',
                  },
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
                  viewport === 'desktop' && {
                    backgroundColor: isDark ? colors.card : colors.secondary,
                  },
                ]}
                hitSlop={6}
              >
                <Monitor
                  size={14}
                  color={
                    viewport === 'desktop'
                      ? colors.foreground
                      : colors.mutedForeground
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => setViewport('tablet')}
                style={[
                  styles.vpBtn,
                  viewport === 'tablet' && {
                    backgroundColor: isDark ? colors.card : colors.secondary,
                  },
                ]}
                hitSlop={6}
              >
                <Tablet
                  size={14}
                  color={
                    viewport === 'tablet'
                      ? colors.foreground
                      : colors.mutedForeground
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => setViewport('mobile')}
                style={[
                  styles.vpBtn,
                  viewport === 'mobile' && {
                    backgroundColor: isDark ? colors.card : colors.secondary,
                  },
                ]}
                hitSlop={6}
              >
                <Smartphone
                  size={14}
                  color={
                    viewport === 'mobile'
                      ? colors.foreground
                      : colors.mutedForeground
                  }
                />
              </Pressable>
            </View>
          )}

          {/* Copy snippet button */}
          <Pressable
            onPress={handleCopyCode}
            style={({ pressed }) => [
              styles.copyBtn,
              {
                backgroundColor: isDark ? colors.card : colors.secondary,
                borderColor: colors.border,
              },
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
                <Copy size={12} color={colors.mutedForeground} />
                <Text style={[styles.copyBtnText, { color: colors.foreground }]}>
                  Snippet
                </Text>
              </>
            )}
          </Pressable>

          {/* Theme Settings Trigger Button */}
          <Pressable
            onPress={openThemeDrawer}
            style={({ pressed }) => [
              styles.copyBtn,
              {
                backgroundColor: isDark ? colors.card : colors.secondary,
                borderColor: colors.border,
              },
              pressed && styles.btnPressed,
            ]}
            accessibilityLabel='Theme Settings'
          >
            <Palette size={13} color={colors.primary} />
            <Text style={[styles.copyBtnText, { color: colors.foreground }]}>
              Theme
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Stage Canvas Area */}
      <View
        style={[
          styles.stageFullWrapper,
          { backgroundColor: colors.background },
        ]}
      >
        {activeTab === 'preview' ? (
          <StagePreviewRenderer entry={selectedEntry} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.codeScrollContent}
            style={styles.stageScroll}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.codeContainer,
                { borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.codeHeader,
                  {
                    backgroundColor: isDark ? '#18181b' : '#27272a',
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.dotGroup}>
                  <View
                    style={[styles.codeDot, { backgroundColor: '#ef4444' }]}
                  />
                  <View
                    style={[styles.codeDot, { backgroundColor: '#eab308' }]}
                  />
                  <View
                    style={[styles.codeDot, { backgroundColor: '#22c55e' }]}
                  />
                </View>
                <Text style={styles.codeHeaderText}>
                  {selectedEntry.name}.tsx
                </Text>
              </View>
              <View style={styles.codeBody}>
                <Text style={styles.codeText}>
                  {`// Import ${selectedEntry.name}\nimport { ${selectedEntry.name} } from '${selectedEntry.filePath}'\n\nexport default function Example() {\n  return <${selectedEntry.name} />\n}`}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  ) : (
    <View
      style={[
        styles.emptyInspector,
        { backgroundColor: colors.background },
      ]}
    >
      <Sparkles size={32} color={colors.mutedForeground} />
      <Text
        style={[
          styles.emptyInspectorText,
          { color: colors.mutedForeground },
        ]}
      >
        Select a component to inspect
      </Text>
    </View>
  )

  return (
    <UniversalLayout title='Design System' hideHeader={!isDesktop}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isDesktop ? (
          <View
            style={[
              styles.desktopLayout,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Left Nav Pane */}
            <View
              style={[
                styles.desktopNavPane,
                {
                  backgroundColor: colors.background,
                  borderRightColor: colors.border,
                },
              ]}
            >
              {listContent}
            </View>

            {/* Right Main Pane */}
            <View
              style={[
                styles.desktopMainPane,
                { backgroundColor: colors.background },
              ]}
            >
              {inspectorContent}
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.mobileLayout,
              { backgroundColor: colors.background },
            ]}
          >
            {listContent}
          </View>
        )}
      </KeyboardAvoidingView>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileLayout: {
    flex: 1,
  },
  desktopNavPane: {
    width: 320,
    borderRightWidth: 1,
  },
  desktopMainPane: {
    flex: 1,
  },
  navColumn: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  inspectorContainer: {
    flex: 1,
  },
  inspectorHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
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
    fontFamily: 'Open Sans',
  },
  inspectorFilePath: {
    fontSize: 10,
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
  stageTabText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
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
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
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
  },
  stageScroll: {
    flex: 1,
  },
  codeScrollContent: {
    padding: 16,
  },
  codeContainer: {
    backgroundColor: '#09090b',
    borderRadius: 10,
    borderWidth: 1,
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
    fontFamily: 'Open Sans',
  },
})
