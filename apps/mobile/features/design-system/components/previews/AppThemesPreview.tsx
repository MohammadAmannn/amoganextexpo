import React from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Palette,
  Check,
  Bell,
  Bookmark,
  MoreVertical,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export function AppThemesPreview() {
  const { themeName, setThemeName, allThemes, colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const { width } = useWindowDimensions()
  const numColumns = width >= 900 ? 3 : width >= 600 ? 2 : 1

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDark
                  ? 'rgba(129, 140, 248, 0.15)'
                  : 'rgba(99, 102, 241, 0.12)',
                borderColor: isDark
                  ? 'rgba(129, 140, 248, 0.3)'
                  : 'rgba(199, 210, 254, 0.6)',
              },
            ]}
          >
            <Palette size={18} color={colors.primary} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              App Theme & Accent Colors
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              Dynamic design system theme customizer matching email settings.
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: colors.secondary },
            ]}
            hitSlop={6}
          >
            <Bell size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: colors.secondary },
            ]}
            hitSlop={6}
          >
            <Bookmark size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: colors.secondary },
            ]}
            hitSlop={6}
          >
            <MoreVertical size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: isDark ? colors.card : '#ffffff',
              borderColor: colors.border,
            },
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Palette size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                Themes & Design Settings
              </Text>
            </View>
            <Text
              style={[
                styles.cardDescription,
                { color: colors.mutedForeground },
              ]}
            >
              Customize the appearance and accent color of your email workspace
              and mobile preview mockup.
            </Text>
          </View>

          {/* Accent Color Theme Section */}
          <View style={styles.themeSection}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Accent Color Theme
            </Text>

            <View style={styles.themesGrid}>
              {allThemes.map((ct) => {
                const isActive = themeName === ct.name
                return (
                  <Pressable
                    key={ct.name}
                    onPress={() => setThemeName(ct.name)}
                    style={({ pressed }) => [
                      styles.themeCard,
                      {
                        width:
                          numColumns === 3
                            ? '31.8%'
                            : numColumns === 2
                            ? '48.5%'
                            : '100%',
                        backgroundColor: isActive
                          ? isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(99, 102, 241, 0.06)'
                          : isDark
                          ? colors.card
                          : '#ffffff',
                        borderColor: isActive ? colors.primary : colors.border,
                        borderWidth: isActive ? 1.5 : 1,
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                    accessibilityRole='button'
                    accessibilityState={{ selected: isActive }}
                  >
                    {/* Color Dots */}
                    <View style={styles.colorDotsRow}>
                      {ct.colors.slice(0, 4).map((color, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            {
                              backgroundColor: color,
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Theme Label */}
                    <Text
                      style={[
                        styles.themeLabel,
                        {
                          color: isActive
                            ? colors.primary || colors.foreground
                            : colors.foreground,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {ct.label}
                    </Text>

                    {/* Active Checkmark */}
                    {isActive && (
                      <Check
                        size={16}
                        color={colors.primary}
                        strokeWidth={3}
                        style={styles.checkIcon}
                      />
                    )}
                  </Pressable>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  settingsCard: {
    width: '100%',
    maxWidth: 960,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  themeSection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
  },
  colorDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
})
