import { useLanguage } from '../i18n/LanguageProvider'

interface PaymentMethodOption {
  id: string
  label: string
  description: string
  icon: string
}

interface PaymentMethodSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { labels } = useLanguage()

  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'card',
      label: labels.paymentMethods.cardLabel,
      description: labels.paymentMethods.cardDescription,
      icon: '💳',
    },
    {
      id: 'pix',
      label: labels.paymentMethods.pixLabel,
      description: labels.paymentMethods.pixDescription,
      icon: '📱',
    },
    {
      id: 'cash',
      label: labels.paymentMethods.cashLabel,
      description: labels.paymentMethods.cashDescription,
      icon: '💵',
    },
  ]

  return (
    <div className="grid gap-2">
      {paymentMethods.map((method) => {
        const isActive = value === method.id

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isActive ? 'border-orange-400 bg-orange-500 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <p className="font-semibold">{method.label}</p>
                <p className={`text-sm ${isActive ? 'text-orange-100' : 'text-slate-500'}`}>{method.description}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${isActive ? 'text-orange-100' : 'text-orange-500'}`}>
              {isActive ? labels.paymentMethods.selected : labels.paymentMethods.choose}
            </span>
          </button>
        )
      })}
    </div>
  )
}
