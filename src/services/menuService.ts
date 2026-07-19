import axios from 'axios'
import type { IProduto, IPedido } from '../types'

const api = axios.create({
  baseURL: 'https://mock-api.local/api',
  timeout: 4000,
})

export class MenuService {
  async getProducts(): Promise<IProduto[]> {
    try {
      const { data } = await api.get<IProduto[]>('/products')
      return data
    } catch {
      return this.getMockProducts()
    }
  }

  async processOrder(order: IPedido): Promise<IPedido> {
    try {
      const { data } = await api.post<IPedido>('/orders', order)
      return data
    } catch {
      return {
        ...order,
        id: `mock-${Date.now()}`,
        status: 'confirmado',
      }
    }
  }

  private getMockProducts(): IProduto[] {
    return [
      {
        id: 'p1',
        name: 'Burger Artesanal',
        description: 'Pão brioche, hambúrguer suculento e molho especial.',
        price: 28.9,
        category: 'Pratos Principais',
        preparationTime: 12,
        badge: 'Mais pedido',
      },
      {
        id: 'p2',
        name: 'Frango Crocante',
        description: 'Filé de frango empanado com batata rústica.',
        price: 24.5,
        category: 'Pratos Principais',
        preparationTime: 10,
      },
      {
        id: 'p3',
        name: 'Suco de Laranja',
        description: 'Natural e gelado.',
        price: 8.5,
        category: 'Bebidas',
      },
      {
        id: 'p4',
        name: 'Refrigerante Lata',
        description: 'Diversos sabores.',
        price: 7.0,
        category: 'Bebidas',
      },
      {
        id: 'p5',
        name: 'Pudim de Leite',
        description: 'Calda de caramelo e creme.',
        price: 12.0,
        category: 'Sobremesas',
      },
      {
        id: 'p6',
        name: 'Brownie',
        description: 'Quente com sorvete.',
        price: 13.5,
        category: 'Sobremesas',
      },
    ]
  }
}

export const menuService = new MenuService()
