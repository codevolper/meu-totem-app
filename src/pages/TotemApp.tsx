import { useEffect, useMemo, useState } from 'react'
import { CartItem } from '../components/CartItem'
import { MenuCard } from '../components/MenuCard'
import { PaymentButton } from '../components/PaymentButton'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../i18n/LanguageProvider'
import { menuService } from '../services/menuService'
import type { CategoriaProduto, IProduto, IPedido, Language } from '../types'

const categoriesByLanguage: Record<Language, Array<{ key: string; label: string }>> = {
  'pt-BR': [
    { key: 'Pratos Principais', label: 'Pratos Principais' },
    { key: 'Bebidas', label: 'Bebidas' },
    { key: 'Sobremesas', label: 'Sobremesas' },
  ],
  'en-US': [
    { key: 'Main Dishes', label: 'Main Dishes' },
    { key: 'Drinks', label: 'Drinks' },
    { key: 'Desserts', label: 'Desserts' },
  ],
}

type Step = 'menu' | 'confirm' | 'payment'

export function TotemApp() {
  const [step, setStep] = useState<Step>('menu')
  const [products, setProducts] = useState<IProduto[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Pratos Principais')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isKioskMode, setIsKioskMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { items, total, itemCount, clearCart } = useCart()
  const { language, setLanguage, labels } = useLanguage()

  const categories = categoriesByLanguage[language]

  const translateProduct = (product: IProduto, currentLanguage: Language): IProduto => {
    const translations: Record<Language, Record<string, { name: string; description: string; badge?: string; category: CategoriaProduto }>> = {
      'pt-BR': {
        p1: {
          name: 'Burger Artesanal',
          description: 'Pão brioche, hambúrguer suculento e molho especial.',
          badge: 'Mais pedido',
          category: 'Pratos Principais',
        },
        p2: {
          name: 'Frango Crocante',
          description: 'Filé de frango empanado com batata rústica.',
          badge: undefined,
          category: 'Pratos Principais',
        },
        p3: {
          name: 'Suco de Laranja',
          description: 'Natural e gelado.',
          badge: undefined,
          category: 'Bebidas',
        },
        p4: {
          name: 'Refrigerante Lata',
          description: 'Diversos sabores.',
          badge: undefined,
          category: 'Bebidas',
        },
        p5: {
          name: 'Pudim de Leite',
          description: 'Calda de caramelo e creme.',
          badge: undefined,
          category: 'Sobremesas',
        },
        p6: {
          name: 'Brownie',
          description: 'Quente com sorvete.',
          badge: undefined,
          category: 'Sobremesas',
        },
      },
      'en-US': {
        p1: {
          name: 'Artisan Burger',
          description: 'Brioche bun, juicy burger and special sauce.',
          badge: 'Best seller',
          category: 'Main Dishes',
        },
        p2: {
          name: 'Crunchy Chicken',
          description: 'Breaded chicken fillet with rustic potatoes.',
          badge: undefined,
          category: 'Main Dishes',
        },
        p3: {
          name: 'Orange Juice',
          description: 'Fresh and chilled.',
          badge: undefined,
          category: 'Drinks',
        },
        p4: {
          name: 'Soft Drink Can',
          description: 'Various flavors.',
          badge: undefined,
          category: 'Drinks',
        },
        p5: {
          name: 'Milk Pudding',
          description: 'Caramel sauce and cream.',
          badge: undefined,
          category: 'Desserts',
        },
        p6: {
          name: 'Brownie',
          description: 'Warm with ice cream.',
          badge: undefined,
          category: 'Desserts',
        },
      },
    }

    const translation = translations[currentLanguage]?.[product.id]

    if (!translation) {
      return product
    }

    return {
      ...product,
      name: translation.name,
      description: translation.description,
      badge: translation.badge,
      category: translation.category as IProduto['category'],
    }
  }

  useEffect(() => {
    void menuService.getProducts().then((productsFromService) => {
      const localizedProducts = productsFromService.map((product) => translateProduct(product, language))
      setProducts(localizedProducts)
    })
  }, [language])

  const steps = [
    { key: 'menu', label: labels.steps.select },
    { key: 'confirm', label: labels.steps.confirm },
    { key: 'payment', label: labels.steps.pay },
  ] as const

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

  useEffect(() => {
    setSelectedCategory(categories[0].label)
  }, [categories, language])

  return (
    <div className={`min-h-screen p-4 text-slate-800 sm:p-6 lg:p-8 ${isKioskMode ? 'bg-slate-950 text-white' : 'bg-[radial-gradient(circle_at_top,_#fff7ed,_#fff)]'}`}>
      <div className="mx-auto mb-4 flex max-w-7xl flex-wrap items-center justify-end gap-3 rounded-[28px] border border-white/70 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-950/5 px-3 py-2">
          <button
            type="button"
            onClick={() => setLanguage('pt-BR')}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${language === 'pt-BR' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`}
            aria-label="Português Brasileiro"
          >
            <span className="mr-1">🇧🇷</span>PT
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en-US')}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${language === 'en-US' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`}
            aria-label="English American"
          >
            <span className="mr-1">🇺🇸</span>EN
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsKioskMode((value) => !value)}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition ${isKioskMode ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          {isKioskMode ? labels.kioskModeOff : labels.kioskMode}
        </button>
      </div>

      <div className={`mx-auto flex max-w-7xl flex-col gap-4 rounded-[32px] border p-4 shadow-2xl backdrop-blur sm:p-6 lg:flex-row lg:gap-6 lg:p-8 ${isKioskMode ? 'border-slate-700 bg-slate-900/90' : 'border-orange-100 bg-white/80'}`}>
        <section className={`flex-1 rounded-[28px] p-4 sm:p-6 ${isKioskMode ? 'bg-slate-800 text-white' : 'bg-slate-950 text-white'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">{labels.appTitle}</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{labels.appSubtitle}</h1>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <p className="text-xs uppercase text-slate-400">{labels.items}</p>
              <p className="text-xl font-semibold">{itemCount}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setSelectedCategory(category.label)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedCategory === category.label ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-200'}`}
              >
                {category.label}
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
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isKioskMode ? 'text-orange-300' : 'text-orange-500'}`}>{labels.summary}</p>
              <h2 className={`mt-2 text-2xl font-semibold ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>{labels.yourOrder}</h2>
            </div>
            {itemCount > 0 ? (
              <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600">
                {labels.clear}
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

          <div className="mt-6 max-h-[42vh] overflow-y-auto pr-1">
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center text-sm ${isKioskMode ? 'border-slate-600 bg-slate-700/70 text-slate-200' : 'border-orange-200 bg-white text-slate-600'}`}>
                  {labels.emptyCart}
                </div>
              ) : (
                items.map((item) => <CartItem key={item.product.id} item={item} />)
              )}
            </div>
          </div>

          <div className={`mt-6 rounded-3xl p-4 shadow-sm ${isKioskMode ? 'bg-slate-700/80' : 'bg-white'}`}>
            <div className={`flex items-center justify-between text-sm ${isKioskMode ? 'text-slate-200' : 'text-slate-600'}`}>
              <span>{labels.total}</span>
              <span className={`text-xl font-semibold ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>R$ {total.toFixed(2)}</span>
            </div>

            <div className="mt-4 space-y-3">
              {step === 'menu' ? (
                <PaymentButton label={labels.confirmOrder} onClick={handleStartConfirmation} variant="primary" disabled={!canAdvance} />
              ) : null}

              {step === 'confirm' ? (
                <>
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-3 text-sm text-slate-700">
                    <p className="font-semibold">{labels.paymentMethod}</p>
                    <p className="mt-2">{labels.paymentMethodDescription.replace('{method}', paymentMethod === 'card' ? labels.paymentMethods.cardLabel : paymentMethod === 'pix' ? labels.paymentMethods.pixLabel : labels.paymentMethods.cashLabel)}</p>
                  </div>
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                  <PaymentButton label={isProcessingPayment ? labels.processingPayment : labels.finishPayment} onClick={handleConfirmOrder} variant="primary" disabled={isProcessingPayment} />
                  <PaymentButton label={labels.backToMenu} onClick={() => setStep('menu')} variant="secondary" />
                </>
              ) : null}

              {step === 'payment' ? (
                <>
                  <div className={`rounded-2xl p-4 text-center ${isKioskMode ? 'bg-emerald-600/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                    {labels.paymentSuccess.replace('{method}', paymentMethod === 'card' ? labels.paymentMethods.cardLabel : paymentMethod === 'pix' ? labels.paymentMethods.pixLabel : labels.paymentMethods.cashLabel)}
                  </div>
                  <PaymentButton label={labels.newOrder} onClick={handleNewOrder} variant="secondary" />
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
