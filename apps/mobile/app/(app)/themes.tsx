import { FlatList, Pressable, View } from 'react-native'
import { colorThemes } from '@amoga/theme'
import { Card, Text } from '@/components/ui'
import { useAmogaTheme } from '@/providers/theme-provider'

export default function ThemesScreen() {
  const { themeName, setThemeName, mode, toggleMode } = useAmogaTheme()
  return <View className='flex-1 bg-background p-5'>
    <Pressable onPress={toggleMode}><Text className='mb-4 text-primary'>Mode: {mode} — tap to toggle</Text></Pressable>
    <FlatList data={colorThemes} keyExtractor={(item, index) => `${item.name}-${index}`} renderItem={({ item }) => <Pressable onPress={() => setThemeName(item.name)}><Card className={`mb-2 ${themeName === item.name ? 'border-primary' : ''}`}><Text className='font-semibold'>{item.label}</Text><Text className='text-muted-foreground'>{item.category ?? 'palette'}</Text></Card></Pressable>} />
  </View>
}
