import React, { useMemo, useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Check,
  CheckCircle2,
  RotateCcw,
  Search,
  X,
} from 'lucide-react-native'
import {
  DEFAULT_APPEARANCE_MODE,
  DEFAULT_COLOR_THEME,
  useTheme,
  type AppearanceMode,
} from '@/providers/theme-provider'
import {
  DarkModeSvg,
  LightModeSvg,
  SystemModeSvg,
} from './ThemeModePreviewSvg'

export function ThemeSettingsDrawer() {
  const {
    isThemeDrawerOpen,
    closeThemeDrawer,
    appearanceMode,
    setAppearanceMode,
    themeName,
    setThemeName,
    resetTheme,
    allThemes,
    colors,
    resolvedMode,
  } = useTheme()

  const { width } = useWindowDimensions()
  const isDesktop = width >= 768
  const [searchQuery, setSearchQuery] = useState('')

  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return allThemes
    const q = searchQuery.toLowerCase().trim()
    return allThemes.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    )
  }, [allThemes, searchQuery])

  const isDark = resolvedMode === 'dark'

  return (
    <Modal
      visible={isThemeDrawerOpen}
      transparent
      animationType='fade'
      onRequestClose={closeThemeDrawer}
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop dismiss */}
        <Pressable
          style={styles.backdropPressable}
          onPress={closeThemeDrawer}
        />

        {/* Sliding Panel Content */}
        <View
          style={[
            styles.drawerContainer,
            isDesktop ? styles.desktopDrawer : styles.mobileDrawer,
            {
              backgroundColor: isDark ? '#09090b' : '#ffffff',
              borderColor: isDark ? '#27272a' : '#e4e4e7',
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.drawerHeader,
              { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' },
            ]}
          >
            <View style={styles.headerTextGroup}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? '#fafafa' : '#09090b' },
                ]}
              >
                Theme Settings
              </Text>
              <Text
                style={[
                  styles.headerDescription,
                  { color: isDark ? '#a1a1aa' : '#71717a' },
                ]}
              >
                Customize the look and feel of your dashboard.
              </Text>
            </View>

            <Pressable
              onPress={closeThemeDrawer}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: isDark ? '#18181b' : '#f4f4f5' },
                pressed && { opacity: 0.7 },
              ]}
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel='Close Theme Settings'
            >
              <X size={18} color={isDark ? '#fafafa' : '#09090b'} />
            </Pressable>
          </View>

          {/* Body Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Section 1: Appearance Mode */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#a1a1aa' : '#71717a' },
                  ]}
                >
                  Theme
                </Text>
                {appearanceMode !== DEFAULT_APPEARANCE_MODE && (
                  <Pressable
                    onPress={() => setAppearanceMode(DEFAULT_APPEARANCE_MODE)}
                    style={styles.sectionResetBtn}
                    hitSlop={6}
                    accessibilityLabel='Reset appearance mode'
                  >
                    <RotateCcw size={12} color={isDark ? '#a1a1aa' : '#71717a'} />
                  </Pressable>
                )}
              </View>

              <View style={styles.modeCardsGrid}>
                {[
                  { mode: 'system' as AppearanceMode, label: 'System', Svg: SystemModeSvg },
                  { mode: 'light' as AppearanceMode, label: 'Light', Svg: LightModeSvg },
                  { mode: 'dark' as AppearanceMode, label: 'Dark', Svg: DarkModeSvg },
                ].map(({ mode, label, Svg }) => {
                  const isSelected = appearanceMode === mode
                  return (
                    <Pressable
                      key={mode}
                      onPress={() => setAppearanceMode(mode)}
                      style={[
                        styles.modeCard,
                        isSelected && {
                          borderColor: colors.primary,
                          borderWidth: 2,
                        },
                        !isSelected && {
                          borderColor: isDark ? '#27272a' : '#e4e4e7',
                        },
                      ]}
                    >
                      <View style={styles.modeSvgWrapper}>
                        <Svg width={96} height={60} />
                        {isSelected && (
                          <View
                            style={[
                              styles.checkBadge,
                              { backgroundColor: colors.primary },
                            ]}
                          >
                            <Check size={11} color='#ffffff' strokeWidth={3} />
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.modeLabel,
                          {
                            color: isSelected
                              ? isDark
                                ? '#fafafa'
                                : '#09090b'
                              : isDark
                              ? '#a1a1aa'
                              : '#71717a',
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            {/* Section 2: Color Theme */}
            <View style={[styles.section, { flex: 1, minHeight: 300 }]}>
              <View style={styles.sectionTitleRow}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#a1a1aa' : '#71717a' },
                  ]}
                >
                  Color Theme
                </Text>
                {themeName !== DEFAULT_COLOR_THEME && (
                  <Pressable
                    onPress={() => setThemeName(DEFAULT_COLOR_THEME)}
                    style={styles.sectionResetBtn}
                    hitSlop={6}
                    accessibilityLabel='Reset color theme'
                  >
                    <RotateCcw size={12} color={isDark ? '#a1a1aa' : '#71717a'} />
                  </Pressable>
                )}
              </View>

              {/* Search Bar */}
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                  },
                ]}
              >
                <Search
                  size={15}
                  color={isDark ? '#a1a1aa' : '#94a3b8'}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder='Search themes...'
                  placeholderTextColor={isDark ? '#71717a' : '#94a3b8'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={[
                    styles.searchInput,
                    { color: isDark ? '#fafafa' : '#09090b' },
                  ]}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearchBtn}
                    hitSlop={6}
                  >
                    <X size={13} color={isDark ? '#a1a1aa' : '#94a3b8'} />
                  </Pressable>
                )}
              </View>

              {/* Theme Count */}
              <Text
                style={[
                  styles.themeCountText,
                  { color: isDark ? '#a1a1aa' : '#71717a' },
                ]}
              >
                {filteredThemes.length} theme
                {filteredThemes.length !== 1 ? 's' : ''} available
              </Text>

              {/* Theme List */}
              <View style={styles.themeListContainer}>
                {filteredThemes.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text
                      style={[
                        styles.emptyText,
                        { color: isDark ? '#71717a' : '#94a3b8' },
                      ]}
                    >
                      No themes found
                    </Text>
                  </View>
                ) : (
                  filteredThemes.map((ct) => {
                    const isSelected = themeName === ct.name
                    return (
                      <Pressable
                        key={ct.name}
                        onPress={() => setThemeName(ct.name)}
                        style={({ pressed }) => [
                          styles.themeItem,
                          isSelected && {
                            backgroundColor: colors.primary,
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 2,
                          },
                          !isSelected && {
                            backgroundColor: pressed
                              ? isDark
                                ? '#27272a'
                                : '#f4f4f5'
                              : 'transparent',
                          },
                        ]}
                      >
                        {/* 5 Color Preview Dots */}
                        <View style={styles.swatchDotsRow}>
                          {ct.colors.map((color, i) => (
                            <View
                              key={i}
                              style={[
                                styles.swatchDot,
                                { backgroundColor: color },
                                isSelected
                                  ? { borderColor: 'rgba(255, 255, 255, 0.4)' }
                                  : { borderColor: 'rgba(0, 0, 0, 0.1)' },
                              ]}
                            />
                          ))}
                        </View>

                        {/* Theme Label */}
                        <Text
                          style={[
                            styles.themeItemLabel,
                            {
                              color: isSelected
                                ? '#ffffff'
                                : isDark
                                ? '#fafafa'
                                : '#09090b',
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {ct.label}
                        </Text>

                        {/* Selected Checkmark */}
                        {isSelected && (
                          <Check
                            size={16}
                            color='#ffffff'
                            strokeWidth={3}
                            style={styles.checkIcon}
                          />
                        )}
                      </Pressable>
                    )
                  })
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer: Reset Button */}
          <View
            style={[
              styles.drawerFooter,
              {
                borderTopColor: isDark ? '#27272a' : '#f4f4f5',
                backgroundColor: isDark ? '#09090b' : '#ffffff',
              },
            ]}
          >
            <Pressable
              onPress={() => {
                resetTheme()
                setSearchQuery('')
              }}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole='button'
              accessibilityLabel='Reset Theme Settings'
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContainer: {
    height: '100%',
    borderLeftWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
  },
  desktopDrawer: {
    width: 380,
    maxWidth: '100%',
  },
  mobileDrawer: {
    width: '100%',
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTextGroup: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
  },
  headerDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'Open Sans',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  sectionResetBtn: {
    padding: 4,
    borderRadius: 4,
  },
  modeCardsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  modeCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  modeSvgWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  modeLabel: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  themeCountText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  themeListContainer: {
    gap: 3,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 10,
  },
  swatchDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  themeItemLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
})
