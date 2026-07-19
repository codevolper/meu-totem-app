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

const paymentMethods: PaymentMethodOption[] = [
  {
    id: 'card',
    label: 'Cartão',
    description: 'Terminal com leitor',
    icon: '💳',
  },
  {
    id: 'pix',
    label: 'PIX',
    description: 'Pagamento instantâneo',
    icon: '📱',
  },
  {
    id: 'cash',
    label: 'Dinheiro',
    description: 'Troco incluso',
    icon: '💵',
  },
]

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
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
              {isActive ? 'Selecionado' : 'Escolher'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
