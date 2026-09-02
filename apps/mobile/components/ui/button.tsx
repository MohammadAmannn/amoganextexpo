import { ActivityIndicator, Pressable, type PressableProps, StyleSheet } from 'react-native'
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
  style,
  ...props
}: ButtonProps) {
  const baseClasses = 'min-h-11 flex-row items-center justify-center rounded-xl px-4 py-3 active:opacity-80'

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
      style={(state) => [
        defaultButtonStyles.base,
        defaultButtonStyles[variant],
        isDisabled && defaultButtonStyles.disabled,
        state.pressed && !isDisabled && defaultButtonStyles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      className={`${baseClasses} ${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === 'default' ? '#ffffff' : '#7c3aed'}
        />
      ) : typeof children === 'string' ? (
        <Text
          style={[defaultTextStyles.base, defaultTextStyles[variant]]}
          className={`text-sm ${textStyles[variant]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

const defaultButtonStyles = StyleSheet.create({
  base: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  default: {
    backgroundColor: '#7c3aed',
  },
  outline: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
})

const defaultTextStyles = StyleSheet.create({
  base: {
    fontSize: 14,
    textAlign: 'center',
  },
  default: {
    color: '#ffffff',
    fontWeight: '600',
  },
  outline: {
    color: '#0f172a',
    fontWeight: '600',
  },
  secondary: {
    color: '#0f172a',
    fontWeight: '600',
  },
  ghost: {
    color: '#0f172a',
    fontWeight: '500',
  },
})
