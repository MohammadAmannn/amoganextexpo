import 'react-native'

declare module 'react-native' {
  interface PressableProps {
    className?: string
  }
  interface TextProps {
    className?: string
  }
}
