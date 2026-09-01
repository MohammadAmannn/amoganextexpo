import * as React from 'react'
import { Pressable, Text } from 'react-native'
export function Button({ children, disabled, onPress }: { children: React.ReactNode; disabled?: boolean; onPress?: () => void }) { return <Pressable disabled={disabled} onPress={onPress} className='min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 disabled:opacity-50'><Text className='text-primary-foreground font-medium'>{children}</Text></Pressable> }
