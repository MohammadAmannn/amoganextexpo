import React, { createContext, useContext, useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useTheme } from '@/providers/theme-provider'

interface DrawerContextType {
  openMobileDrawer: () => void
  closeMobileDrawer: () => void
  isMobileDrawerOpen: boolean
}

const DrawerContext = createContext<DrawerContextType>({
  openMobileDrawer: () => {},
  closeMobileDrawer: () => {},
  isMobileDrawerOpen: false,
})

export function useDrawer() {
  return useContext(DrawerContext)
}

interface UniversalLayoutProps {
  title: string
  children: React.ReactNode
  headerChildren?: React.ReactNode
  onSearchPress?: () => void
  hideHeader?: boolean
}

export function UniversalLayout({
  title,
  children,
  headerChildren,
  onSearchPress,
  hideHeader = false,
}: UniversalLayoutProps) {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024
  const { colors } = useTheme()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const openMobileDrawer = () => setIsMobileDrawerOpen(true)
  const closeMobileDrawer = () => setIsMobileDrawerOpen(false)

  return (
    <DrawerContext.Provider
      value={{ openMobileDrawer, closeMobileDrawer, isMobileDrawerOpen }}
    >
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View
          style={[styles.rootContainer, { backgroundColor: colors.background }]}
        >
          {/* Desktop Sidebar */}
          {isDesktop && (
            <AppSidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
            />
          )}

          {/* Mobile / Native Drawer Modal */}
          {!isDesktop && (
            <Modal
              visible={isMobileDrawerOpen}
              animationType='fade'
              transparent
              onRequestClose={closeMobileDrawer}
            >
              <View style={styles.modalBackdrop}>
                <Pressable
                  style={styles.backdropPressable}
                  onPress={closeMobileDrawer}
                />
                <View
                  style={[
                    styles.drawerContainer,
                    { backgroundColor: colors.sidebar || colors.background },
                  ]}
                >
                  <AppSidebar onNavigate={closeMobileDrawer} />
                </View>
              </View>
            </Modal>
          )}

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* AppHeader is displayed on desktop, or when not hidden */}
            {!hideHeader && isDesktop && (
              <AppHeader
                title={title}
                isDesktop={isDesktop}
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
                onOpenMobileDrawer={openMobileDrawer}
                onSearchPress={onSearchPress}
              >
                {headerChildren}
              </AppHeader>
            )}

            {!hideHeader && !isDesktop && (
              <AppHeader
                title={title}
                isDesktop={isDesktop}
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
                onOpenMobileDrawer={openMobileDrawer}
                onSearchPress={onSearchPress}
              >
                {headerChildren}
              </AppHeader>
            )}

            <View
              style={[
                styles.childContainer,
                { backgroundColor: colors.background },
              ]}
            >
              {children}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </DrawerContext.Provider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  childContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerContainer: {
    width: 280,
    maxWidth: '82%',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
})
