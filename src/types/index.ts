export type CategoriaProduto = 'Pratos Principais' | 'Bebidas' | 'Sobremesas'

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
