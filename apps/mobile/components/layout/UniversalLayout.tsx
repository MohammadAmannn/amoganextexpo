import React, { useState } from 'react'
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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.rootContainer}>
        {/* Desktop Sidebar */}
        {isDesktop && (
          <AppSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        {/* Mobile / Native Drawer Modal */}
        {!isDesktop && (
          <Modal
            visible={isMobileDrawerOpen}
            animationType='fade'
            transparent
            onRequestClose={() => setIsMobileDrawerOpen(false)}
          >
            <View style={styles.modalBackdrop}>
              <Pressable
                style={styles.backdropPressable}
                onPress={() => setIsMobileDrawerOpen(false)}
              />
              <View style={styles.drawerContainer}>
                <AppSidebar onNavigate={() => setIsMobileDrawerOpen(false)} />
              </View>
            </View>
          </Modal>
        )}

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {!hideHeader && (
            <AppHeader
              title={title}
              isDesktop={isDesktop}
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
              onSearchPress={onSearchPress}
            >
              {headerChildren}
            </AppHeader>
          )}

          <View style={styles.childContainer}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  childContainer: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    flexDirection: 'row',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
})
