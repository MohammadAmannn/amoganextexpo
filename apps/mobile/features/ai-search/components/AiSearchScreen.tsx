import React, { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import {
  Search,
  Globe,
  Code,
  BarChart3,
  FileText,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native'
import type { SearchResult, SearchSource } from '../types'

const TOOLS = [
  { id: 'web-search', name: 'Web Search', icon: Globe },
  { id: 'code-assistant', name: 'Code Assistant', icon: Code },
  { id: 'data-analysis', name: 'Data Analysis', icon: BarChart3 },
  { id: 'doc-reader', name: 'Doc Reader', icon: FileText },
]

const SAMPLE_QUERIES = [
  'Best practices for Expo React Native Web universal layouts',
  'Next.js App Router vs Expo Router file architecture',
  'Supabase Postgres row level security best practices',
  'How to measure latency in AI LLM streaming applications',
]

export function AiSearchScreen() {
  const [activeTool, setActiveTool] = useState(TOOLS[0].id)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)

  const handleSearch = (searchQuery?: string) => {
    const q = (searchQuery || query).trim()
    if (!q) return

    setBusy(true)
    setTimeout(() => {
      const mockResult: SearchResult = {
        query: q,
        answer: `Comprehensive synthesis for "${q}":\n\n1. Architecture Overview: Expo Universal enables writing a single React component that renders natively via UIKit/Android Views on mobile, and standard DOM HTML/CSS on web.\n2. Responsive Adaptation: By querying window dimensions or using NativeWind media queries, UI layouts seamlessly shift between mobile drawer sheets and desktop two-column sidebars.\n3. Performance Optimization: Tree-shaking unused platform modules and locking React versions guarantees minimal bundle overhead and zero runtime singleton clashes.`,
        sources: [
          {
            title: 'Expo Universal Architecture Guide',
            url: 'https://docs.expo.dev/workflow/universal-apps',
            snippet:
              'Learn how to target Android, iOS, and Web from a single unified codebase with Expo Router.',
          },
          {
            title: 'React Native Web Styling Specifications',
            url: 'https://necolas.github.io/react-native-web/docs',
            snippet:
              'A complete guide to CSS Flexbox emulation, layout invariants, and high-performance Web renderers.',
          },
        ],
        timestamp: 'Just now',
      }
      setResult(mockResult)
      setBusy(false)
    }, 600)
  }

  return (
    <UniversalLayout title='AI Search'>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Hero Header */}
          <View style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <Sparkles size={14} color='#059669' />
              <Text style={styles.heroBadgeText}>NEURAL SEMANTIC ENGINE</Text>
            </View>
            <Text style={styles.heroTitle}>Ask anything, anywhere.</Text>
            <Text style={styles.heroSubtitle}>
              Synthesize web knowledge, code repositories, and documentation in real time.
            </Text>
          </View>

          {/* Tools Filter Row */}
          <View style={styles.toolsRow}>
            {TOOLS.map((t) => {
              const Icon = t.icon
              const isActive = activeTool === t.id
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setActiveTool(t.id)}
                  style={[
                    styles.toolChip,
                    isActive && styles.toolChipActive,
                  ]}
                >
                  <Icon
                    size={14}
                    color={isActive ? '#ffffff' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.toolChipText,
                      isActive && styles.toolChipTextActive,
                    ]}
                  >
                    {t.name}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Big Search Input */}
          <View style={styles.searchBar}>
            <Search size={20} color='#94a3b8' />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='Enter your question or search query...'
              placeholderTextColor='#94a3b8'
              style={styles.searchInput}
              onSubmitEditing={() => handleSearch()}
            />
            <Pressable
              disabled={busy || !query.trim()}
              onPress={() => handleSearch()}
              style={[
                styles.searchActionBtn,
                (!query.trim() || busy) && styles.searchActionBtnDisabled,
              ]}
              hitSlop={8}
            >
              {busy ? (
                <ActivityIndicator size='small' color='#ffffff' />
              ) : (
                <ArrowRight size={16} color='#ffffff' strokeWidth={2.5} />
              )}
            </Pressable>
          </View>

          {/* Suggestions if no search yet */}
          {!result && (
            <View style={styles.suggestSection}>
              <Text style={styles.suggestHeading}>TRENDING QUESTIONS</Text>
              <View style={styles.suggestList}>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      setQuery(sq)
                      handleSearch(sq)
                    }}
                    style={styles.suggestItem}
                  >
                    <Search size={14} color='#64748b' />
                    <Text style={styles.suggestItemText}>{sq}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Search Results Display */}
          {result && (
            <View style={styles.resultContainer}>
              {/* Answer Card */}
              <View style={styles.answerCard}>
                <View style={styles.answerCardHeader}>
                  <Sparkles size={16} color='#059669' />
                  <Text style={styles.answerCardTitle}>AI Synthesis</Text>
                  <Text style={styles.answerCardTime}>{result.timestamp}</Text>
                </View>

                <Text style={styles.answerBody}>{result.answer}</Text>
              </View>

              {/* Sources Section */}
              <View style={styles.sourcesSection}>
                <Text style={styles.sourcesHeading}>CITED SOURCES</Text>
                <View style={styles.sourcesGrid}>
                  {result.sources.map((src, index) => (
                    <View key={index} style={styles.sourceCard}>
                      <View style={styles.sourceTop}>
                        <Globe size={14} color='#059669' />
                        <Text style={styles.sourceTitle} numberOfLines={1}>
                          {src.title}
                        </Text>
                        <ExternalLink size={12} color='#94a3b8' />
                      </View>
                      <Text style={styles.sourceSnippet} numberOfLines={2}>
                        {src.snippet}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 780,
    gap: 20,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#059669',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 520,
  },
  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  toolChipActive: {
    backgroundColor: '#059669',
  },
  toolChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  toolChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 54,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  searchActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchActionBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  suggestSection: {
    marginTop: 10,
    gap: 10,
  },
  suggestHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  suggestList: {
    gap: 8,
  },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  suggestItemText: {
    fontSize: 13,
    color: '#334155',
  },
  resultContainer: {
    gap: 16,
    marginTop: 10,
  },
  answerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 12,
  },
  answerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  answerCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  answerCardTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  answerBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1e293b',
  },
  sourcesSection: {
    gap: 10,
  },
  sourcesHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  sourcesGrid: {
    gap: 8,
  },
  sourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 6,
  },
  sourceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  sourceSnippet: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
})
