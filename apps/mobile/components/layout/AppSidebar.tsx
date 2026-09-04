import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import {
  Command,
  Mail,
  Settings,
  Ticket,
  Bot,
  Search,
  BarChart3,
  Map,
  Link as LinkIcon,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  ChevronsUpDown,
  User,
  Bell,
  MessageCircle,
  CreditCard,
  ShoppingBag,
  Palette,
} from 'lucide-react-native'
import { useAuthStore } from '../../stores/auth-store'
import { useAuth } from '../../providers/auth-provider'
import { useTheme } from '../../providers/theme-provider'

interface AppSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onNavigate?: () => void
}

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
}: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { auth } = useAuthStore()
  const authContext = useAuth()
  const { openThemeDrawer, colors, resolvedMode } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const activeUser = authContext?.user || auth.user
  const userMetadata = authContext?.user?.user_metadata

  const userName =
    userMetadata?.full_name ||
    userMetadata?.name ||
    userMetadata?.user_name ||
    auth.user?.name ||
    activeUser?.email?.split('@')[0] ||
    'User'

  const userEmail =
    activeUser?.email ||
    auth.user?.email ||
    ''

  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || (userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U')

  const menuItems = [
    {
      title: 'Message',
      url: '/message',
      icon: Mail,
      comingSoon: true,
    },
    {
      title: 'App Settings',
      url: '/app-settings',
      icon: Settings,
      comingSoon: true,
    },
    {
      title: 'Design System',
      url: '/design-system',
      icon: Command,
      comingSoon: false,
    },
    {
      title: 'Vouchers',
      url: '/vouchers',
      icon: Ticket,
      comingSoon: true,
    },
    {
      title: 'AI Chat',
      url: '/ai-chat',
      icon: Bot,
      comingSoon: true,
    },
    {
      title: 'AI Search',
      url: '/ai-search',
      icon: Search,
      comingSoon: true,
    },
    {
      title: 'Chart Template',
      url: '/charttemplate',
      icon: BarChart3,
      comingSoon: true,
    },
    {
      title: 'Map Template',
      url: '/map',
      icon: Map,
      comingSoon: true,
    },
    {
      title: 'Link Maker',
      url: '/link-maker',
      icon: LinkIcon,
      comingSoon: true,
    },
  ]

  const otherItems = [
    {
      title: 'Settings',
      url: '/app-settings',
      icon: Settings,
      comingSoon: true,
    },
    {
      title: 'Help Center',
      url: '/help-center',
      icon: HelpCircle,
      comingSoon: true,
    },
  ]

  const handlePress = (url: string) => {
    router.push(url as any)
    if (onNavigate) onNavigate()
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    try {
      if (authContext?.signOut) {
        await authContext.signOut()
      }
    } catch {}
    useAuthStore.getState().auth.reset()
    router.replace('/(auth)/sign-in' as any)
    if (onNavigate) onNavigate()
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.sidebar || colors.background,
          borderRightColor: colors.sidebarBorder || colors.border,
        },
        isCollapsed && styles.containerCollapsed,
      ]}
    >
      {/* Team Switcher Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.sidebarBorder || colors.border },
          isCollapsed && styles.headerCollapsed,
        ]}
      >
        <Pressable
          onPress={isCollapsed ? onToggleCollapse : undefined}
          style={[styles.teamBox, isCollapsed && styles.teamBoxCollapsed]}
          hitSlop={6}
          accessibilityRole='button'
          accessibilityLabel={isCollapsed ? 'Expand Sidebar' : 'Team Switcher'}
        >
          <View style={[styles.teamLogo, { backgroundColor: colors.primary }]}>
            <Command
              size={18}
              color={colors.primaryForeground || '#ffffff'}
              strokeWidth={2.4}
            />
          </View>
          {!isCollapsed && (
            <View style={styles.teamInfo}>
              <Text
                style={[styles.teamName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                Amoga App
              </Text>
              <Text
                style={[styles.teamPlan, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                Demo Company
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Nav List */}
      <ScrollView
        style={styles.navScrollView}
        contentContainerStyle={styles.navContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Expanded: Menu label + Toggle button on the right */}
        {!isCollapsed ? (
          <View style={styles.menuHeaderContainer}>
            <View style={styles.menuHeaderRow}>
              <Text
                style={[styles.groupHeader, { color: colors.mutedForeground }]}
              >
                Menu
              </Text>
              {onToggleCollapse && (
                <Pressable
                  onPress={onToggleCollapse}
                  style={({ pressed }) => [
                    styles.toggleBtn,
                    pressed && { backgroundColor: colors.secondary },
                  ]}
                  accessibilityRole='button'
                  accessibilityLabel='Collapse Sidebar'
                  hitSlop={8}
                >
                  <PanelLeftClose
                    size={16}
                    color={colors.mutedForeground}
                    strokeWidth={2}
                  />
                </Pressable>
              )}
            </View>
            <View
              style={[
                styles.menuHeaderDivider,
                { backgroundColor: colors.sidebarBorder || colors.border },
              ]}
            />
          </View>
        ) : (
          /* Collapsed: Toggle button aligned vertically with menu item icons */
          onToggleCollapse && (
            <Pressable
              onPress={onToggleCollapse}
              style={({ pressed }) => [
                styles.navItem,
                styles.navItemCollapsed,
                pressed && { backgroundColor: colors.secondary },
                { marginBottom: 6 },
              ]}
              accessibilityRole='button'
              accessibilityLabel='Expand Sidebar'
              hitSlop={8}
            >
              <PanelLeftClose
                size={18}
                color={colors.mutedForeground}
                strokeWidth={2}
              />
            </Pressable>
          )
        )}

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.url ||
            (item.url === '/design-system' &&
              (pathname === '/' ||
                pathname === '/(app)' ||
                pathname === '/(app)/index' ||
                pathname === '/(app)/design-system')) ||
            (item.url === '/ai-chat' && pathname === '/ai_chat') ||
            (item.url === '/ai-search' && pathname === '/ai_search')

          return (
            <Pressable
              key={item.title}
              onPress={() => handlePress(item.url)}
              style={({ pressed }) => [
                styles.navItem,
                isActive && {
                  backgroundColor: colors.sidebarAccent || colors.secondary,
                },
                pressed && { opacity: 0.8 },
                isCollapsed && styles.navItemCollapsed,
              ]}
              accessibilityRole='button'
              accessibilityState={{ selected: isActive }}
            >
              <Icon
                size={16}
                color={
                  isActive
                    ? colors.primary || colors.foreground
                    : colors.mutedForeground
                }
                strokeWidth={2}
              />
              {!isCollapsed && (
                <>
                  <Text
                    style={[
                      styles.navItemText,
                      {
                        color: isActive
                          ? colors.primary || colors.foreground
                          : colors.mutedForeground,
                        fontWeight: isActive ? '500' : '400',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.comingSoon && (
                    <View
                      style={[
                        styles.soonBadge,
                        {
                          backgroundColor: colors.secondary,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.soonBadgeText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        Soon
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Pressable>
          )
        })}

        {!isCollapsed && (
          <Text
            style={[
              styles.groupHeader,
              { color: colors.mutedForeground, marginTop: 18 },
            ]}
          >
            OTHER
          </Text>
        )}

        {otherItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.url
          return (
            <Pressable
              key={item.title}
              onPress={() => handlePress(item.url)}
              style={({ pressed }) => [
                styles.navItem,
                isActive && {
                  backgroundColor: colors.sidebarAccent || colors.secondary,
                },
                pressed && { opacity: 0.8 },
                isCollapsed && styles.navItemCollapsed,
              ]}
            >
              <Icon
                size={16}
                color={
                  isActive
                    ? colors.primary || colors.foreground
                    : colors.mutedForeground
                }
                strokeWidth={2}
              />
              {!isCollapsed && (
                <>
                  <Text
                    style={[
                      styles.navItemText,
                      {
                        color: isActive
                          ? colors.primary || colors.foreground
                          : colors.mutedForeground,
                        fontWeight: isActive ? '500' : '400',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.comingSoon && (
                    <View
                      style={[
                        styles.soonBadge,
                        {
                          backgroundColor: colors.secondary,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.soonBadgeText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        Soon
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Pressable>
          )
        })}
      </ScrollView>

      {/* NavUser Footer */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.sidebarBorder || colors.border },
          isCollapsed && styles.footerCollapsed,
        ]}
      >
        <Pressable
          onPress={() => setIsUserMenuOpen(true)}
          style={({ pressed }) => [
            styles.userBox,
            isCollapsed && styles.userBoxCollapsed,
            pressed && { backgroundColor: colors.secondary },
          ]}
          hitSlop={6}
          accessibilityRole='button'
          accessibilityLabel='User Account Menu'
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.foreground }]}>
              {userInitials}
            </Text>
          </View>
          {!isCollapsed && (
            <>
              <View style={styles.userInfo}>
                <Text
                  style={[styles.userName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[styles.userEmail, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {userEmail}
                </Text>
              </View>
              <ChevronsUpDown size={14} color={colors.mutedForeground} />
            </>
          )}
        </Pressable>
      </View>

      {/* USER DROPDOWN MODAL */}
      <Modal
        visible={isUserMenuOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsUserMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsUserMenuOpen(false)}
        >
          <Pressable
            style={[
              styles.dropdownCard,
              {
                backgroundColor: colors.card || colors.background,
                borderColor: colors.border,
                left: isCollapsed ? 70 : 16,
                bottom: 20,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header: Avatar + Name + Email */}
            <View style={styles.dropdownHeader}>
              <View
                style={[
                  styles.dropdownAvatar,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownAvatarText,
                    { color: colors.foreground },
                  ]}
                >
                  {userInitials}
                </Text>
              </View>
              <View style={styles.dropdownUserInfo}>
                <Text
                  style={[
                    styles.dropdownUserName,
                    { color: colors.foreground },
                  ]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[
                    styles.dropdownUserEmail,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {userEmail}
                </Text>
              </View>
            </View>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            {/* Section 1 */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/app-settings' as any)
              }}
            >
              <User size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                My Profile
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/message' as any)
              }}
            >
              <Bell size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Notifications
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/help-center' as any)
              }}
            >
              <MessageCircle size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Help & Support
              </Text>
            </Pressable>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            {/* Section 2 */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/vouchers' as any)
              }}
            >
              <CreditCard size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Subscriptions
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/link-maker' as any)
              }}
            >
              <ShoppingBag size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Buy Apps
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                openThemeDrawer()
              }}
            >
              <Palette size={15} color={colors.primary} />
              <Text
                style={[
                  styles.menuItemText,
                  { color: colors.foreground, fontWeight: '600' },
                ]}
              >
                Theme Settings
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/app-settings' as any)
              }}
            >
              <Settings size={15} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Settings
              </Text>
            </Pressable>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            {/* Section 3: Sign Out */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={handleSignOut}
            >
              <LogOut size={15} color='#ef4444' strokeWidth={2} />
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
    display: 'flex',
    flexDirection: 'column',
  },
  containerCollapsed: {
    width: 64,
  },
  header: {
    height: 56,
    borderBottomWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerCollapsed: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  teamBoxCollapsed: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: undefined,
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    lineHeight: 17,
    fontFamily: 'Open Sans',
  },
  teamPlan: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    fontFamily: 'Open Sans',
  },
  toggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnPressed: {
    backgroundColor: '#f1f5f9',
  },
  navScrollView: {
    flex: 1,
  },
  navContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 2,
  },
  menuHeaderContainer: {
    marginBottom: 8,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  menuHeaderDivider: {
    height: 1,
    width: '100%',
    opacity: 0.6,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.8,
    fontFamily: 'Open Sans',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  navItemActive: {
    backgroundColor: '#f1f5f9',
  },
  navItemPressed: {
    backgroundColor: '#f8fafc',
  },
  navItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#475569',
    fontFamily: 'Open Sans',
  },
  navItemTextActive: {
    fontWeight: '500',
    color: '#0f172a',
  },
  soonBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  soonBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    fontFamily: 'Open Sans',
  },
  footer: {
    height: 60,
    borderTopWidth: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  footerCollapsed: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    borderRadius: 8,
  },
  userBoxCollapsed: {
    justifyContent: 'center',
    padding: 0,
  },
  userBoxPressed: {
    backgroundColor: '#f1f5f9',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'Open Sans',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 16,
    fontFamily: 'Open Sans',
  },
  userEmail: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 14,
    fontFamily: 'Open Sans',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  dropdownCard: {
    position: 'absolute',
    width: 250,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dropdownAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'Open Sans',
  },
  dropdownUserInfo: {
    flex: 1,
  },
  dropdownUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'Open Sans',
  },
  dropdownUserEmail: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  menuItemPressed: {
    backgroundColor: '#f8fafc',
  },
  menuItemText: {
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  signOutText: {
    fontSize: 13,
    color: '#ef4444',
    fontFamily: 'Open Sans',
    fontWeight: '600',
  },
})
