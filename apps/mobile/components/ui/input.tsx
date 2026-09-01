import { TextInput, type TextInputProps } from 'react-native'
export function Input({ className, ...props }: TextInputProps & { className?: string }) { return <TextInput placeholderTextColor='#64748b' className={`min-h-11 rounded-md border border-border bg-background px-3 text-foreground ${className ?? ''}`} {...props} /> }
