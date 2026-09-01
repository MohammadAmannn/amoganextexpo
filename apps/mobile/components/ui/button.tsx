import { ActivityIndicator, Pressable, type PressableProps } from 'react-native'
import { Text } from './text'

export interface ButtonProps extends PressableProps {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  loading?: boolean
}

export function Button({
  children,
  className = '',
  variant = 'default',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'min-h-11 flex-row items-center justify-center rounded-lg px-4 py-2.5 active:opacity-80'

  const variantStyles = {
    default: 'bg-primary',
    outline: 'border border-border bg-transparent',
    secondary: 'bg-secondary',
    ghost: 'bg-transparent',
  }

  const textStyles = {
    default: 'text-primary-foreground font-semibold',
    outline: 'text-foreground font-semibold',
    secondary: 'text-secondary-foreground font-semibold',
    ghost: 'text-foreground font-medium',
  }

  const isDisabled = disabled || loading

  return (
    <Pressable
      className={`${baseClasses} ${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === 'default' ? '#ffffff' : '#64748b'}
        />
      ) : typeof children === 'string' ? (
        <Text className={`text-sm ${textStyles[variant]}`}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

