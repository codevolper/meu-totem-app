import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Language } from '../types'

export type TranslationMap = {
  appTitle: string
  appSubtitle: string
  items: string
  kioskMode: string
  kioskModeOff: string
  categories: {
    main: string
    drinks: string
    desserts: string
  }
  summary: string
  yourOrder: string
  clear: string
  emptyCart: string
  total: string
  confirmOrder: string
  backToMenu: string
  finishPayment: string
  processingPayment: string
  paymentSuccess: string
  paymentMethod: string
  paymentMethodDescription: string
  paymentMethods: {
    cardLabel: string
    cardDescription: string
    pixLabel: string
    pixDescription: string
    cashLabel: string
    cashDescription: string
    selected: string
    choose: string
  }
  newOrder: string
  steps: {
    select: string
    confirm: string
    pay: string
  }
  add: string
  remove: string
  loading: string
}

const translations: Record<Language, TranslationMap> = {
  'pt-BR': {
    appTitle: 'Totem de Autoatendimento',
    appSubtitle: 'Escolha o que deseja',
    items: 'Itens',
    kioskMode: 'Modo kiosk',
    kioskModeOff: 'Sair do kiosk',
    categories: {
      main: 'Pratos Principais',
      drinks: 'Bebidas',
      desserts: 'Sobremesas',
    },
    summary: 'Resumo',
    yourOrder: 'Seu pedido',
    clear: 'Limpar',
    emptyCart: 'Selecione itens no menu para montar seu pedido.',
    total: 'Total',
    confirmOrder: 'Confirmar pedido',
    backToMenu: 'Voltar ao menu',
    finishPayment: 'Finalizar pagamento',
    processingPayment: 'Processando pagamento...',
    paymentSuccess: 'Pagamento simulado com sucesso via {method}. Seu pedido foi enviado.',
    paymentMethod: 'Forma de pagamento',
    paymentMethodDescription: 'Terminal preparado para {method}.',
    paymentMethods: {
      cardLabel: 'Cartão',
      cardDescription: 'Terminal com leitor',
      pixLabel: 'PIX',
      pixDescription: 'Pagamento instantâneo',
      cashLabel: 'Dinheiro',
      cashDescription: 'Troco incluso',
      selected: 'Selecionado',
      choose: 'Escolher',
    },
    newOrder: 'Novo pedido',
    steps: {
      select: 'Selecionar',
      confirm: 'Confirmar',
      pay: 'Pagar',
    },
    add: 'Adicionar',
    remove: 'Remover',
    loading: 'Carregando menu...',
  },
  'en-US': {
    appTitle: 'Self-Service Kiosk',
    appSubtitle: 'Choose what you want',
    items: 'Items',
    kioskMode: 'Kiosk mode',
    kioskModeOff: 'Exit kiosk',
    categories: {
      main: 'Main Dishes',
      drinks: 'Drinks',
      desserts: 'Desserts',
    },
    summary: 'Summary',
    yourOrder: 'Your order',
    clear: 'Clear',
    emptyCart: 'Select items from the menu to build your order.',
    total: 'Total',
    confirmOrder: 'Confirm order',
    backToMenu: 'Back to menu',
    finishPayment: 'Finish payment',
    processingPayment: 'Processing payment...',
    paymentSuccess: 'Payment simulated successfully via {method}. Your order has been sent.',
    paymentMethod: 'Payment method',
    paymentMethodDescription: 'Terminal ready for {method}.',
    paymentMethods: {
      cardLabel: 'Card',
      cardDescription: 'Terminal with reader',
      pixLabel: 'PIX',
      pixDescription: 'Instant payment',
      cashLabel: 'Cash',
      cashDescription: 'Change included',
      selected: 'Selected',
      choose: 'Choose',
    },
    newOrder: 'New order',
    steps: {
      select: 'Select',
      confirm: 'Confirm',
      pay: 'Pay',
    },
    add: 'Add',
    remove: 'Remove',
    loading: 'Loading menu...',
  },
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  labels: TranslationMap
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt-BR')

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      labels: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider')
  }

  return context
}

export const localeFlags: Record<Language, string> = {
  'pt-BR': '🇧🇷',
  'en-US': '🇺🇸',
}

export const localeNames: Record<Language, string> = {
  'pt-BR': 'PT-BR',
  'en-US': 'EN-US',
}
