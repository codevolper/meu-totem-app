import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { IItemPedido, IProduto } from '../types'

interface CartContextValue {
  items: IItemPedido[]
  addItem: (product: IProduto) => void
  removeItem: (productId: string) => void
  decrementItem: (productId: string) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<IItemPedido[]>([])

  const addItem = (product: IProduto) => {
    setItems((currentItems) => {
      const itemExists = currentItems.find((item) => item.product.id === product.id)

      if (itemExists) {
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...currentItems, { product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }

  const decrementItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.product.id !== productId) {
          return [item]
        }

        if (item.quantity > 1) {
          return [{ ...item, quantity: item.quantity - 1 }]
        }

        return []
      }),
    )
  }

  const clearCart = () => setItems([])

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      decrementItem,
      clearCart,
      total,
      itemCount,
    }),
    [items, total, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }

  return context
}
