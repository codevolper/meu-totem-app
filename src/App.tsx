import './App.css'
import { CartProvider } from './hooks/useCart'
import { TotemApp } from './pages/TotemApp'

function App() {
  return (
    <CartProvider>
      <TotemApp />
    </CartProvider>
  )
}

export default App
