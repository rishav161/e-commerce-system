'use client';

import { CartProvider } from './CartProvider';
import Header from './Header';

export default function Providers({ children }) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
    </CartProvider>
  );
}

