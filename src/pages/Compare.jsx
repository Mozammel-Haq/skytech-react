import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { useCart } from '../context/CartContext.jsx'

function Compare() {
  const { items, removeItem, clear, max } = useCompare()
  const { getProductsByIds } = useProducts()
  const { addItem } = useCart()
  const products = getProductsByIds(items.map((i) => i.id))

  const fields = [
    { key: 'price', label: 'Price', format: (v) => `$${v.toFixed(2)}` },
    { key: 'rating', label: 'Rating', format: (v) => `${v}★` },
    { key: 'stockStatus', label: 'Stock', format: (v) => v },
    { key: 'brand', label: 'Brand', format: (v) => v },
    { key: 'category', label: 'Category', format: (v) => v },
  ]

  const isDiff = (key) => {
    const values = products.map((p) => p[key])
    return new Set(values).size > 1
  }

return (
  <>
    <Helmet>
      <title>Compare — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      {products.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            No products to compare
          </h1>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Compare products ({products.length}/{max})
            </h1>
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${p.thumbnail}`}
                  alt={p.title}
                  className="h-32 w-full object-contain"
                />
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {p.title}
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.thumbnail,
                        quantity: 1,
                        variantId: p.variants?.[0]?.id ?? 'default',
                        variantLabel: [p.variants?.[0]?.color, p.variants?.[0]?.storage]
                          .filter(Boolean)
                          .join(' / '),
                      })
                    }
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(p.id)}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-3 text-left text-neutral-900 dark:text-neutral-100">Feature</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3 text-left text-neutral-900 dark:text-neutral-100">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
      <tbody>
  {fields.map((f) => (
    <tr key={f.key} className="border-t border-neutral-100 dark:border-neutral-700">
      <td className="p-3 font-semibold text-neutral-700 dark:text-neutral-300">
        {f.label}
      </td>
      {products.map((p) => (
        <td
          key={p.id}
          className={`p-3 ${isDiff(f.key) ? 'bg-amber-50 dark:bg-amber-900/30' : ''} text-neutral-900 dark:text-neutral-100`}
        >
          {f.format(p[f.key])}
        </td>
      ))}
    </tr>
  ))}
  <tr className="border-t border-neutral-100 dark:border-neutral-700">
    <td className="p-3 font-semibold text-neutral-700 dark:text-neutral-300">Key specs</td>
    {products.map((p) => (
      <td key={p.id} className="p-3">
        <div className="flex flex-wrap gap-2">
          {p.shortSpecs?.slice(0, 4).map((s) => (
            <span
              key={s.id}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-700 dark:text-neutral-100"
            >
              {s.value}
            </span>
          ))}
        </div>
      </td>
    ))}
  </tr>
</tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  </>
)

}

export default Compare
