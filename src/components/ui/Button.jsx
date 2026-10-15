import { forwardRef } from 'react'
import { classNames } from '../../utils/formatters'
import { Icon } from './Icon'

/*
  Button — brand variants built on the green / gold identity.
    primary   Dark green fill (main CTAs)          → hover gold on hero via tone="hero"
    secondary Outline green on transparent
    accent    Golden fill with green text (highlights)
    ghost     Borderless, hover wash
    danger    Red (destructive)
    success   Green-600 (confirm)
*/
const VARIANTS = {
  primary:
    'bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:outline-brand-700',
  hero: 'bg-brand-700 text-white shadow-sm hover:bg-gold-400 hover:text-brand-800 focus-visible:outline-brand-700',
  secondary:
    'border border-brand-700 text-brand-700 bg-transparent hover:bg-gold-400 hover:border-gold-400 hover:text-brand-800',
  accent:
    'bg-gold-400 text-brand-800 shadow-sm hover:bg-gold-500 focus-visible:outline-gold-400',
  ghost: 'text-brand-800 hover:bg-brand-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
  success: 'bg-success text-white hover:brightness-95 focus-visible:outline-success',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
  icon: 'h-10 w-10 justify-center',
}

const BASE =
  'inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-[background-color,color,transform,box-shadow,opacity] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon,
    iconRight,
    loading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classNames(
        BASE,
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && <Icon name={icon} className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      )}
      {children}
      {iconRight && !loading && <Icon name={iconRight} className="h-4 w-4" />}
    </button>
  )
})
