import React, { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { MetricCards } from './MetricCards'
import { BarChartPreview } from './BarChartPreview'
import { AreaChartPreview } from './AreaChartPreview'
import { BarChart3, ChartArea, LayoutDashboard } from 'lucide-react-native'

export function ChartTemplateScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bar' | 'area'>('overview')

  return (
    <UniversalLayout
      title='Chart Template'
      headerChildren={
        <View style={styles.headerTabs}>
          <Pressable
            onPress={() => setActiveTab('overview')}
            style={[
              styles.tabBtn,
              activeTab === 'overview' && styles.tabBtnActive,
            ]}
          >
            <LayoutDashboard
              size={14}
              color={activeTab === 'overview' ? '#059669' : '#64748b'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'overview' && styles.tabBtnTextActive,
              ]}
            >
              Overview
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('bar')}
            style={[
              styles.tabBtn,
              activeTab === 'bar' && styles.tabBtnActive,
            ]}
          >
            <BarChart3
              size={14}
              color={activeTab === 'bar' ? '#059669' : '#64748b'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'bar' && styles.tabBtnTextActive,
              ]}
            >
              Bar Charts
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('area')}
            style={[
              styles.tabBtn,
              activeTab === 'area' && styles.tabBtnActive,
            ]}
          >
            <ChartArea
              size={14}
              color={activeTab === 'area' ? '#059669' : '#64748b'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'area' && styles.tabBtnTextActive,
              ]}
            >
              Area Charts
            </Text>
          </Pressable>
        </View>
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {activeTab === 'overview' && (
            <>
              <MetricCards />
              <BarChartPreview />
              <AreaChartPreview />
            </>
          )}

          {activeTab === 'bar' && <BarChartPreview />}

          {activeTab === 'area' && <AreaChartPreview />}
        </View>
      </ScrollView>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  tabBtnTextActive: {
    fontWeight: '600',
    color: '#059669',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 900,
    gap: 20,
  },
})
