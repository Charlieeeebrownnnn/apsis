'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { formatNtPrice, useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
    itemCount,
    isCartOpen,
    openCart,
    closeCart,
  } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const handleCheckout = () => {
    setCheckoutMessage('This is a simulated checkout for portfolio demonstration.');
  };

  const handleClose = () => {
    setCheckoutMessage('');
    closeCart();
  };

  return (
    <>
      {!isCartOpen && itemCount > 0 ? (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-5 right-5 z-[90] border border-[#111111]/18 bg-[#efeee9]/82 px-4 py-3 text-[10px] uppercase tracking-[0.34em] text-[#111111]/70 shadow-[0_22px_70px_rgba(36,31,21,0.14)] backdrop-blur-md transition-colors duration-500 hover:text-[#111111]"
        >
          Bag {itemCount}
        </button>
      ) : null}

      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              className="fixed inset-0 z-[95] cursor-default bg-[#111111]/24 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleClose}
            />

            <motion.aside
              className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-[430px] flex-col border-l border-[#111111]/12 bg-[#efeee9] text-[#111111] shadow-[0_40px_140px_rgba(17,17,17,0.2)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Shopping bag"
            >
              <header className="flex items-center justify-between border-b border-[#111111]/10 px-5 py-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.42em] text-[#111111]/44">
                    APSIS
                  </p>
                  <h2 className="mt-2 text-xl font-light uppercase tracking-[0.28em]">Bag</h2>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[10px] uppercase tracking-[0.34em] text-[#111111]/46 transition-colors duration-500 hover:text-[#111111]"
                >
                  Close
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {items.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <p className="text-[10px] uppercase leading-relaxed tracking-[0.34em] text-[#111111]/44">
                      Your bag is empty.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {items.map((item) => (
                      <article
                        key={item.cartId}
                        className="grid grid-cols-[88px_1fr] gap-4 border-b border-[#111111]/10 pb-5"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#d8d2c5]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="88px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.3em] text-[#111111]/40">
                                {item.type}
                              </p>
                              <h3 className="mt-2 text-sm font-light uppercase tracking-[0.18em] text-[#111111]/82">
                                {item.name}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.cartId)}
                              className="text-[9px] uppercase tracking-[0.28em] text-[#111111]/38 transition-colors duration-500 hover:text-[#111111]"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#111111]/58">
                            <span>{item.price}</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item.cartId)}
                                className="h-7 w-7 border border-[#111111]/12 transition-colors duration-500 hover:border-[#111111]/44"
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => increaseQuantity(item.cartId)}
                                className="h-7 w-7 border border-[#111111]/12 transition-colors duration-500 hover:border-[#111111]/44"
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <footer className="border-t border-[#111111]/10 px-5 py-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#111111]/70">
                  <span>Subtotal</span>
                  <span>{formatNtPrice(subtotal)}</span>
                </div>

                {checkoutMessage ? (
                  <p className="mt-4 text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#111111]/52">
                    {checkoutMessage}
                  </p>
                ) : null}

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="border border-[#111111]/18 bg-[#111111] px-4 py-4 text-[10px] uppercase tracking-[0.34em] text-[#efeee9] transition-opacity duration-500 hover:opacity-82"
                  >
                    Checkout
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="border border-[#111111]/14 px-4 py-4 text-[10px] uppercase tracking-[0.3em] text-[#111111]/48 transition-colors duration-500 hover:text-[#111111]"
                  >
                    Clear
                  </button>
                </div>
              </footer>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
