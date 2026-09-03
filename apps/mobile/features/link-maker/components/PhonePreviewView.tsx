import React from 'react'
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLinkMakerStore } from '../store'
import { ExternalLink, Link2, Sparkles } from 'lucide-react-native'

export function PhonePreviewView() {
  const { config } = useLinkMakerStore()
  const { profile, links, socials, theme } = config

  const getThemeBackground = () => {
    switch (theme.preset) {
      case 'sunset-horizon':
        return '#f97316'
      case 'midnight-glow':
        return '#0f172a'
      case 'cyber-neo':
        return '#064e3b'
      case 'minimal-silk':
        return '#f1f5f9'
      default:
        return '#1e293b'
    }
  }

  const bgColor = getThemeBackground()
  const isLight = theme.preset === 'minimal-silk'

  return (
    <View style={styles.phoneFrame}>
      {/* Dynamic Notch */}
      <View style={styles.notch} />

      <ScrollView
        contentContainerStyle={[
          styles.screenContent,
          { backgroundColor: bgColor },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar & Name */}
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {(profile.name || 'A')[0].toUpperCase()}
          </Text>
        </View>

        <Text
          style={[
            styles.profileName,
            { color: isLight ? '#0f172a' : '#ffffff' },
          ]}
        >
          {profile.name || 'Alex Rivera'}
        </Text>

        <Text
          style={[
            styles.profileBio,
            { color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.7)' },
          ]}
        >
          {profile.bio || 'Digital creator & software craftsman'}
        </Text>

        {/* Links List */}
        <View style={styles.linksContainer}>
          {links.length > 0 ? (
            links
              .filter((l) => l.isEnabled)
              .map((link) => (
                <Pressable
                  key={link.id}
                  onPress={() => {
                    if (link.url) Linking.openURL(link.url).catch(() => {})
                  }}
                  style={[
                    styles.linkPill,
                    {
                      backgroundColor: isLight
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.12)',
                      borderColor: isLight
                        ? '#e2e8f0'
                        : 'rgba(255, 255, 255, 0.2)',
                    },
                  ]}
                >
                  <Link2
                    size={14}
                    color={isLight ? '#059669' : '#ffffff'}
                  />
                  <Text
                    style={[
                      styles.linkPillText,
                      { color: isLight ? '#0f172a' : '#ffffff' },
                    ]}
                  >
                    {link.title}
                  </Text>
                  <ExternalLink
                    size={12}
                    color={isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.5)'}
                  />
                </Pressable>
              ))
          ) : (
            <View style={styles.emptyLinks}>
              <Text
                style={{
                  color: isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.5)',
                  fontSize: 12,
                }}
              >
                No links added yet.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerNote}>
          <Text
            style={{
              fontSize: 10,
              color: isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.4)',
              fontWeight: '600',
            }}
          >
            POWERED BY AMOGA
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  phoneFrame: {
    width: 280,
    height: 520,
    borderRadius: 36,
    borderWidth: 8,
    borderColor: '#0f172a',
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
    alignSelf: 'center',
  },
  notch: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 70,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0f172a',
    zIndex: 20,
  },
  screenContent: {
    flexGrow: 1,
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileBio: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  linksContainer: {
    width: '100%',
    gap: 8,
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  linkPillText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  emptyLinks: {
    padding: 16,
    alignItems: 'center',
  },
  footerNote: {
    marginTop: 'auto',
    paddingTop: 24,
  },
})
