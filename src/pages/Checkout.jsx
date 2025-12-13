import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrders } from '../context/OrdersContext.jsx'

function Checkout() {
  const { items, totals, clearCart } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState({ name: user?.name ?? '', email: user?.email ?? '' })
  const [address, setAddress] = useState({ line1: user?.address ?? '', line2: '', city: user?.city ??'', state: user?.country ?? '', postalCode: user?.postalCode??'', country: user?.country??'' })
  const [shipping, setShipping] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [payment, setPayment] = useState({ cardNumber: '', nameOnCard: '', exp: '', cvc: '' })
  const [placedOrder, setPlacedOrder] = useState(null)

  const shippingPrice = shipping === 'express' ? 25 : 15
  const orderTotals = useMemo(() => ({
    subtotal: totals.subtotal,
    shipping: items.length > 0 ? shippingPrice : 0,
    tax: totals.tax,
    discount: totals.discount,
    total: totals.subtotal + (items.length > 0 ? shippingPrice : 0) + totals.tax - totals.discount,
  }), [totals, shippingPrice, items.length])

  const canPlaceOrder = contact.name && contact.email && address.line1 && address.city && address.state && address.postalCode && address.country && items.length > 0 && (paymentMethod === 'cod' ? true : (payment.cardNumber && payment.nameOnCard && payment.exp && payment.cvc))

  const placeOrder = async () => {
    if (!canPlaceOrder) {
      toast.error('Please complete all fields')
      return
    }
    const id = `ord-${Math.floor(5000 + Math.random() * 5000)}`
    const orderNumber = `SKY-${id.split('-')[1]}`
    const newOrder = {
  id,
  orderNumber,
  userId: user?.id ?? 'guest',
  status: 'pending',           // only once
  placedAt: dayjs().toISOString(),
  fulfilledAt: null,
  items: items.map((i) => ({
    id: i.id,
    product_id: i.id,
    title: i.title,
    quantity: i.quantity,
    price: i.price
  })),
  subtotal: orderTotals.subtotal,
  shipping: orderTotals.shipping,
  tax: orderTotals.tax,
  total: orderTotals.total,
  shipping_name: contact.name,
  shipping_line1: address.line1,
  shipping_line2: address.line2,
  shipping_city: address.city,
  shipping_state: address.state,
  shipping_postal_code: address.postalCode,
  shipping_country: address.country,
  tracking_carrier: null,
  tracking_number: null,
  paymentMethod,
};

    const created = await createOrder(newOrder)
    clearCart()
    setPlacedOrder(created)
    toast.success('Order placed')
  }

  return (
    <>
      <Helmet>
        <title>Checkout — SkyTech</title>
      </Helmet>
      <div className="container py-10">
        {placedOrder ? (
          <div className="rounded-3xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Order confirmed</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Your order number is <span className="font-semibold text-neutral-900 dark:text-neutral-100">{placedOrder.orderNumber}</span></p> 
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between"><span>Total</span><span className="font-semibold">${placedOrder.total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Items</span><span className="font-semibold">{placedOrder.items.length}</span></div>
            </div>
            <button type="button" onClick={() => navigate('/account')} className="mt-6 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white">View orders</button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-6">
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((s) => (
                    <button key={s} type="button" onClick={() => setStep(s)} className={`h-10 w-10 rounded-full text-sm font-semibold ${step === s ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>{s}</button>    
                  ))}
                </div>
                {step === 1 && (
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Full name" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />   
                    <input type="text" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address line 1" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 md:col-span-2" />
                    <input type="text" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Address line 2" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 md:col-span-2" />
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" /> 
                    <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State/Region" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                    <input type="text" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Postal code" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                    <input type="text" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Country" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                    <div className="mt-4 flex justify-end">
                      <button type="button" onClick={() => setStep(2)} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-neutral-800 dark:text-neutral-300">Continue</button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="mt-6 space-y-3">
                    {[
                      { id: 'standard', label: 'Standard (3–5 days)', price: 15 },
                      { id: 'express', label: 'Express (1–2 days)', price: 25 },
                    ].map((opt) => (
                      <label key={opt.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                        <span className="text-sm">{opt.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">${opt.price}</span>
                          <input type="radio" name="shipping" checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                        </div>
                      </label>
                    ))}
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={() => setStep(1)} className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold dark:border-neutral-700 dark:text-neutral-300">Back</button>
                      <button type="button" onClick={() => setStep(3)} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-neutral-800 dark:text-neutral-300">Continue</button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      {[
                        { id: 'card', label: 'Credit/Debit Card' },
                        { id: 'cod', label: 'Cash on Delivery' },
                      ].map((opt) => (
                        <label key={opt.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                          <span className="text-sm">{opt.label}</span>
                          <input type="radio" name="payment-method" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                        </label>
                      ))}
                    </div>
                    {paymentMethod === 'card' ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <input type="text" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} placeholder="Card number" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm md:col-span-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                        <input type="text" value={payment.nameOnCard} onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })} placeholder="Name on card" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm md:col-span-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                        <input type="text" value={payment.exp} onChange={(e) => setPayment({ ...payment, exp: e.target.value })} placeholder="Expiry MM/YY" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                        <input type="text" value={payment.cvc} onChange={(e) => setPayment({ ...payment, cvc: e.target.value })} placeholder="CVC" className="h-11 rounded-xl border border-neutral-200 px-3 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                        <p className="font-semibold">Cash on delivery</p>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Pay in cash when your order arrives.</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <button type="button" onClick={() => setStep(2)} className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold dark:border-neutral-700 dark:text-neutral-300">Back</button>
                      <button type="button" onClick={() => setStep(4)} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-neutral-800 dark:text-neutral-300">Review</button>
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                      <p className="font-semibold">Shipping to</p>
                      <p>{contact.name}</p>
                      <p>{address.line1} {address.line2}</p>
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                      <p className="font-semibold">Items</p>
                      <ul className="mt-2 space-y-2">
                        {items.map((i) => (
                          <li key={`${i.id}-${i.variantId}`} className="flex justify-between"><span>{i.title} × {i.quantity}</span><span>${(i.price * i.quantity).toFixed(2)}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">${orderTotals.subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span className="font-semibold">${orderTotals.shipping.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Tax</span><span className="font-semibold">${orderTotals.tax.toFixed(2)}</span></div>
                      {orderTotals.discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount</span><span className="font-semibold">-${orderTotals.discount.toFixed(2)}</span></div>}
                      <div className="flex justify-between border-t border-neutral-200 pt-2 text-base dark:border-neutral-700 dark:text-neutral-300"><span>Total</span><span className="font-semibold">${orderTotals.total.toFixed(2)}</span></div>
                    </div>
                    <div className="flex justify-between">
                      <button type="button" onClick={() => setStep(3)} className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold dark:border-neutral-700 dark:text-neutral-300">Back</button>
                      <button type="button" onClick={placeOrder} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white dark:bg-primary/90">Place order</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Order summary</p>
                <div className="mt-2 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {items.map((i) => (
                    <div key={`${i.id}-${i.variantId}`} className="flex justify-between"><span>{i.title}</span><span>${(i.price * i.quantity).toFixed(2)}</span></div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}

export default Checkout
