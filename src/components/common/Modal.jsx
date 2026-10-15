import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '../../utils/formatters'
import { Icon } from '../ui/Icon'

/*
  Modal — centered dialog with fade + scale and a backdrop overlay (spec §34).
  Closes on backdrop click, the X button, and Escape. Locks body scroll while open.
*/
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const width = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size]

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-brand-950/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(
          'animate-pop relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl',
          width,
          className,
        )}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            {typeof title === 'string' ? (
              <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
            ) : (
              title
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted transition hover:bg-cream-soft hover:text-ink"
              aria-label="Close"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="scrollbar-warm min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line bg-cream/40 px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
