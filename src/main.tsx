import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StatusBar, Style } from '@capacitor/status-bar';

// Seamless native status bar styling on mobile
try {
  StatusBar.setBackgroundColor({ color: '#F0ECE1' });
  StatusBar.setStyle({ style: Style.Light });
} catch (e) {
  // Fail-safe for desktop browser testing
}

import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { InventoryProvider } from './context/InventoryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <InventoryProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </InventoryProvider>
    </UIProvider>
  </StrictMode>,
);

