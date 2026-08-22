import type { IProduto } from '../types'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../i18n/LanguageProvider'

interface MenuCardProps {
  product: IProduto
}

export function MenuCard({ product }: MenuCardProps) {
  const { addItem } = useCart()
  const { labels } = useLanguage()

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="flex h-full flex-col items-start justify-between rounded-3xl border border-orange-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
          {product.badge ? (
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600">
              {product.badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-slate-600">{product.description}</p>
      </div>

      <div className="mt-4 flex w-full items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          R$ {product.price.toFixed(2)}
        </span>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
          {labels.add}
        </span>
      </div>
    </button>
  )
}
