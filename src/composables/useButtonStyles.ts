import { computed, type ComputedRef } from 'vue'

interface ButtonStyleProps {
  type?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export const useButtonStyles = (props: ButtonStyleProps) => {
  const base =
    'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lighter-blue disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'

  const sizeClasses: ComputedRef<string> = computed(
    () =>
      ({
        sm: 'px-3 py-1 text-sm',
        md: 'px-5 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      })[props.size || 'md'],
  )

  const variantClasses: ComputedRef<string> = computed(
    () =>
      ({
        primary: 'bg-lighter-blue text-dark hover:bg-lightest-blue hover:text-dark-blue',
        secondary: 'bg-medium-dark-blue text-lightest-blue hover:bg-lighter-blue hover:text-dark',
        outline:
          'border border-lighter-blue text-lighter-blue hover:bg-lighter-blue hover:text-dark',
      })[props.type || 'primary'],
  )

  const classes: ComputedRef<string> = computed(
    () => `${base} ${sizeClasses.value} ${variantClasses.value}`,
  )

  return { classes }
}
