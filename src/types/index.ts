export type Language = 'pt-BR' | 'en-US'

export type CategoriaProduto = 'Pratos Principais' | 'Bebidas' | 'Sobremesas' | 'Main Dishes' | 'Drinks' | 'Desserts'

export interface IProduto {
  id: string
  name: string
  description: string
  price: number
  category: CategoriaProduto
  preparationTime?: number
  badge?: string
}

export interface IItemPedido {
  product: IProduto
  quantity: number
}

export interface IPedido {
  id: string
  items: IItemPedido[]
  total: number
  status: 'em_andamento' | 'confirmado' | 'pago'
  createdAt: string
}
