import { FlatList, Pressable, View } from 'react-native'
import { colorThemes } from '@amoga/theme'
import { Card, Text } from '@/components/ui'
import { useTheme } from '@/providers/theme-provider'

export default function ThemesScreen() {
  const { themeName, setThemeName, appearanceMode, setAppearanceMode, resolvedMode } =
    useTheme()

  return (
    <View className='flex-1 bg-background p-5'>
      <Pressable
        onPress={() =>
          setAppearanceMode(
            appearanceMode === 'light'
              ? 'dark'
              : appearanceMode === 'dark'
              ? 'system'
              : 'light'
          )
        }
      >
        <Text className='mb-4 text-primary font-semibold'>
          Appearance Mode: {appearanceMode} (Active: {resolvedMode}) — tap to cycle
        </Text>
      </Pressable>
      <FlatList
        data={colorThemes}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <Pressable onPress={() => setThemeName(item.name)}>
            <Card
              className={`mb-2 p-3 ${
                themeName === item.name ? 'border-primary border-2' : ''
              }`}
            >
              <Text className='font-semibold'>{item.label}</Text>
              <Text className='text-muted-foreground text-xs'>
                {item.category ?? 'palette'}
              </Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  )
}
