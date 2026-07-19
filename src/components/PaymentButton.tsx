interface PaymentButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function PaymentButton({ label, onClick, variant = 'primary', disabled = false }: PaymentButtonProps) {
  const baseClasses = 'w-full rounded-2xl px-5 py-4 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]}`}>
      {label}
    </button>
  )
}
