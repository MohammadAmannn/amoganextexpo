import React, { useState } from 'react'
import {
  FlatList,
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
import { MapPin, Navigation, Search, Compass, Layers, Globe } from 'lucide-react-native'
import { initialMarkers } from '../data/mock-locations'
import type { MapMarker } from '../types'

export function MapScreen() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(
    markers[0] || null
  )
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMarkers = markers.filter((m) => {
    const q = searchQuery.trim().toLowerCase()
    return (
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.address.toLowerCase().includes(q)
    )
  })

  const mapCanvas = (
    <View style={styles.mapCanvas}>
      {/* Decorative Grid Lines to simulate map terrain */}
      <View style={styles.mapGridHorizontal1} />
      <View style={styles.mapGridHorizontal2} />
      <View style={styles.mapGridVertical1} />
      <View style={styles.mapGridVertical2} />

      {/* Floating Map Controls */}
      <View style={styles.mapOverlayControls}>
        <View style={styles.mapBadge}>
          <Compass size={14} color='#059669' />
          <Text style={styles.mapBadgeText}>Interactive Geospatial View</Text>
        </View>
      </View>

      {/* Interactive Pins */}
      {markers.map((marker, index) => {
        const isSelected = selectedMarker?.id === marker.id
        // Layout pins across canvas relative positions
        const topOffsets = ['28%', '58%', '38%', '68%']
        const leftOffsets = ['42%', '65%', '25%', '78%']

        return (
          <Pressable
            key={marker.id}
            onPress={() => setSelectedMarker(marker)}
            style={[
              styles.markerPin,
              {
                top: topOffsets[index % topOffsets.length] as any,
                left: leftOffsets[index % leftOffsets.length] as any,
              },
            ]}
          >
            <View
              style={[
                styles.pinBubble,
                isSelected && styles.pinBubbleSelected,
              ]}
            >
              <MapPin
                size={16}
                color={isSelected ? '#ffffff' : '#059669'}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.pinText,
                  isSelected && styles.pinTextSelected,
                ]}
                numberOfLines={1}
              >
                {marker.title.split(' ')[0]}
              </Text>
            </View>
          </Pressable>
        )
      })}

      {/* Selected Marker Detail Card on Map */}
      {selectedMarker && (
        <View style={styles.mapSelectedCard}>
          <View style={styles.mapSelectedHeader}>
            <View style={styles.mapSelectedIconBox}>
              <MapPin size={18} color='#059669' />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapSelectedTitle}>{selectedMarker.title}</Text>
              <Text style={styles.mapSelectedCategory}>
                {selectedMarker.category.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.mapSelectedAddress}>{selectedMarker.address}</Text>
          <Text style={styles.mapSelectedCoords}>
            Lat: {selectedMarker.latitude.toFixed(4)}, Lon: {selectedMarker.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  )

  const listPane = (
    <View style={styles.listContainer}>
      <View style={styles.searchBar}>
        <Search size={16} color='#94a3b8' />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search locations...'
          placeholderTextColor='#94a3b8'
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredMarkers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedMarker?.id === item.id
          return (
            <Pressable
              onPress={() => setSelectedMarker(item)}
              style={[
                styles.locationCard,
                isSelected && styles.locationCardSelected,
              ]}
            >
              <View style={styles.locCardTop}>
                <Text style={styles.locTitle}>{item.title}</Text>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{item.category}</Text>
                </View>
              </View>
              <Text style={styles.locDesc}>{item.description}</Text>
              <Text style={styles.locAddress}>{item.address}</Text>
            </Pressable>
          )
        }}
        contentContainerStyle={styles.locationsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )

  return (
    <UniversalLayout title='Map Template'>
      <View style={styles.container}>
        {isDesktop ? (
          <View style={styles.desktopSplit}>
            <View style={styles.desktopListPane}>{listPane}</View>
            <View style={styles.desktopMapPane}>{mapCanvas}</View>
          </View>
        ) : (
          <View style={styles.mobileLayout}>
            <View style={styles.mobileMapCanvas}>{mapCanvas}</View>
            <View style={styles.mobileListPane}>{listPane}</View>
          </View>
        )}
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  desktopSplit: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopListPane: {
    width: 360,
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
  },
  desktopMapPane: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  mobileLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  mobileMapCanvas: {
    height: 260,
  },
  mobileListPane: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  locationsList: {
    padding: 12,
    gap: 8,
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 4,
  },
  locationCardSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#059669',
  },
  locCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  catBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
  },
  locDesc: {
    fontSize: 11,
    color: '#64748b',
  },
  locAddress: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridHorizontal1: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  mapGridHorizontal2: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  mapGridVertical1: {
    position: 'absolute',
    left: '33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  mapGridVertical2: {
    position: 'absolute',
    left: '66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  mapOverlayControls: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  markerPin: {
    position: 'absolute',
    zIndex: 5,
  },
  pinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pinBubbleSelected: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  pinText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  pinTextSelected: {
    color: '#ffffff',
  },
  mapSelectedCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
    zIndex: 10,
  },
  mapSelectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  mapSelectedIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapSelectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  mapSelectedCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 0.6,
  },
  mapSelectedAddress: {
    fontSize: 12,
    color: '#475569',
  },
  mapSelectedCoords: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
})
