import type { IItemPedido } from '../types'
import { useCart } from '../hooks/useCart'

interface CartItemProps {
  item: IItemPedido
}

export function CartItem({ item }: CartItemProps) {
  const { addItem, decrementItem, removeItem } = useCart()

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{item.product.name}</p>
          <p className="text-sm text-slate-600">R$ {item.product.price.toFixed(2)}</p>
        </div>
        <p className="text-sm font-semibold text-slate-700">x{item.quantity}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => decrementItem(item.product.id)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-lg font-semibold text-slate-700"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => addItem(item.product)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-lg font-semibold text-slate-700"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => removeItem(item.product.id)}
          className="ml-auto rounded-full bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
