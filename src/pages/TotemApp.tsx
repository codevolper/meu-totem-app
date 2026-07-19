import { useEffect, useMemo, useState } from 'react'
import { CartItem } from '../components/CartItem'
import { MenuCard } from '../components/MenuCard'
import { PaymentButton } from '../components/PaymentButton'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { useCart } from '../hooks/useCart'
import { menuService } from '../services/menuService'
import type { IProduto, IPedido } from '../types'

const categories = ['Pratos Principais', 'Bebidas', 'Sobremesas'] as const
const steps = [
  { key: 'menu', label: 'Selecionar' },
  { key: 'confirm', label: 'Confirmar' },
  { key: 'payment', label: 'Pagar' },
] as const

type Step = 'menu' | 'confirm' | 'payment'

export function TotemApp() {
  const [step, setStep] = useState<Step>('menu')
  const [products, setProducts] = useState<IProduto[]>([])
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('Pratos Principais')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isKioskMode, setIsKioskMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { items, total, itemCount, clearCart } = useCart()

  useEffect(() => {
    void menuService.getProducts().then(setProducts)
  }, [])

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === selectedCategory),
    [products, selectedCategory],
  )

  const currentStepIndex = steps.findIndex((item) => item.key === step)
  const canAdvance = items.length > 0

  const handleStartConfirmation = () => {
    if (!canAdvance) return
    setStep('confirm')
  }

  const handleConfirmOrder = async () => {
    if (!canAdvance) return

    setIsProcessingPayment(true)

    const pedido: IPedido = {
      id: 'temp',
      items,
      total,
      status: 'em_andamento',
      createdAt: new Date().toISOString(),
    }

    await menuService.processOrder(pedido)
    await new Promise((resolve) => window.setTimeout(resolve, 1000))

    setIsProcessingPayment(false)
    setStep('payment')
  }

  const handleNewOrder = () => {
    clearCart()
    setStep('menu')
    setIsProcessingPayment(false)
    setPaymentMethod('card')
  }

  return (
    <div className={`min-h-screen p-4 text-slate-800 sm:p-6 lg:p-8 ${isKioskMode ? 'bg-slate-950 text-white' : 'bg-[radial-gradient(circle_at_top,_#fff7ed,_#fff)]'}`}>
      <div className={`mx-auto flex max-w-7xl flex-col gap-4 rounded-[32px] border p-4 shadow-2xl backdrop-blur sm:p-6 lg:flex-row lg:gap-6 lg:p-8 ${isKioskMode ? 'border-slate-700 bg-slate-900/90' : 'border-orange-100 bg-white/80'}`}>
        <section className={`flex-1 rounded-[28px] p-4 sm:p-6 ${isKioskMode ? 'bg-slate-800 text-white' : 'bg-slate-950 text-white'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Totem de Autoatendimento</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Escolha o que deseja</h1>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsKioskMode((value) => !value)} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${isKioskMode ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-200'}`}>
                {isKioskMode ? 'Sair do Dark Mode' : 'Dark Mode'}
              </button>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                <p className="text-xs uppercase text-slate-400">Itens</p>
                <p className="text-xl font-semibold">{itemCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-200'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {filteredProducts.map((product) => (
              <MenuCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <aside className={`w-full max-w-xl rounded-[28px] border p-4 sm:p-6 ${isKioskMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-orange-100 bg-orange-50/70 text-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isKioskMode ? 'text-orange-300' : 'text-orange-500'}`}>Resumo</p>
              <h2 className={`mt-2 text-2xl font-semibold ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>Seu pedido</h2>
            </div>
            {itemCount > 0 ? (
              <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600">
                Limpar
              </button>
            ) : null}
          </div>

          <div className="mt-5 flex items-center gap-2">
            {steps.map((item, index) => {
              const isActive = index <= currentStepIndex
              return (
                <div key={item.key} className="flex flex-1 items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                  </span>
                  {item.label}
                </div>
              )
            })}
          </div>

          <div className="mt-6 space-y-3">
            {items.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-6 text-center text-sm ${isKioskMode ? 'border-slate-600 bg-slate-700/70 text-slate-200' : 'border-orange-200 bg-white text-slate-600'}`}>
                Selecione itens no menu para montar seu pedido.
              </div>
            ) : (
              items.map((item) => <CartItem key={item.product.id} item={item} />)
            )}
          </div>

          <div className={`mt-6 rounded-3xl p-4 shadow-sm ${isKioskMode ? 'bg-slate-700/80' : 'bg-white'}`}>
            <div className={`flex items-center justify-between text-sm ${isKioskMode ? 'text-slate-200' : 'text-slate-600'}`}>
              <span>Total</span>
              <span className={`text-xl font-semibold ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>R$ {total.toFixed(2)}</span>
            </div>

            <div className="mt-4 space-y-3">
              {step === 'menu' ? (
                <PaymentButton label="Confirmar pedido" onClick={handleStartConfirmation} variant="primary" disabled={!canAdvance} />
              ) : null}

              {step === 'confirm' ? (
                <>
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-3 text-sm text-slate-700">
                    <p className="font-semibold">Forma de pagamento</p>
                    <p className="mt-2">Terminal preparado para {paymentMethod === 'card' ? 'cartão' : paymentMethod === 'pix' ? 'PIX' : 'dinheiro'}.</p>
                  </div>
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                  <PaymentButton label={isProcessingPayment ? 'Processando pagamento...' : 'Finalizar pagamento'} onClick={handleConfirmOrder} variant="primary" disabled={isProcessingPayment} />
                  <PaymentButton label="Voltar ao menu" onClick={() => setStep('menu')} variant="secondary" />
                </>
              ) : null}

              {step === 'payment' ? (
                <>
                  <div className={`rounded-2xl p-4 text-center ${isKioskMode ? 'bg-emerald-600/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                    Pagamento simulado com sucesso via {paymentMethod === 'card' ? 'cartão' : paymentMethod === 'pix' ? 'PIX' : 'dinheiro'}. Seu pedido foi enviado.
                  </div>
                  <PaymentButton label="Novo pedido" onClick={handleNewOrder} variant="secondary" />
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
