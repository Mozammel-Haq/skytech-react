// src/pages/admin/ProductsAdmin.jsx
import { Helmet } from 'react-helmet-async'
import { useProducts } from '../../context/ProductContext.jsx'
import DataTable from '../../components/dashboard/DataTable.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useDropzone } from 'react-dropzone'

function ProductsAdmin() {
  const { products, setProducts, brands, categories } = useProducts()

  // editing
  const [editingId, setEditingId] = useState(null)

  // form state (full)
  const initialForm = {
    // Basic Info
    sku: '',
    title: '',
    slug: '',
    description: '',
    brandId: '',
    categoryId: '',
    subcategory: '',
    price: '',
    originalPrice: '',
    discountPercent: '',
    rating: 0,
    reviewsCount: 0,
    stock: 0,
    stockStatus: '',
    featured: false,
    bestseller: false,
    newArrival: true,
    onSale: false,
    bestValue: false,
    dealEndTime: '',
    shippingEstimate: '',
    warranty: '',

    // Media
    thumbnail: '', // preview url or path
    _thumbnailFile: null,
    gallery: [], // previews (mix of url strings or File preview objects)
    _galleryFiles: [],

    // Variants
    variants: [], // [{id: optional, color:'', storage:'', price:''}]

    // Specs & Highlights
    specs: [{ id: null, key: '', value: '' }],
    highlights: [{ id: null, text: '' }],

    // Tags & Badges
    tags: [{ id: null, tag: '' }],
    badges: [{ id: null, badge: '' }],

    // Relations
    relatedIds: [],
    recommendedIds: []
  }

  const [form, setForm] = useState(initialForm)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [tagsInput, setTagsInput] = useState('')
  const [badgesInput, setBadgesInput] = useState('')
  const [variantsInput, setVariantsInput] = useState('')

  // refresh list
  const refreshProducts = async () => {
    try {
      const res = await axios.get('http://localhost/elctro_Ecom_project/admin/api/TestProduct')
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.test_products ?? res.data?.data ?? res.data?.items ?? []
      setProducts(list.map(normalizeProductLocal))
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch products')
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  // normalize incoming product to local shape
  const toSlug = (s) => (s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')

  const normalizeProductLocal = (p) => ({
  id: p.id ?? `p-${Date.now()}`,

  sku: p.sku ?? "",
  title: p.title ?? "",
  slug: p.slug ?? toSlug(p.title),
  description: p.description ?? "",

  price: Number(p.price) || 0,
  originalPrice: Number(p.originalPrice ?? p.original_price) || 0,
  discountPercent: Number(p.discountPercent ?? p.discount_percent) || 0,

  brandId: p.brandId ?? p.brand_id ?? "",
  brand: p.brand ?? "",
  brandSlug: p.brandSlug ?? p.brand_slug ?? (p.brand ? toSlug(p.brand) : ""),
  categoryId: p.categoryId ?? p.category_id ?? "",
  category: p.category ?? "",
  categorySlug: p.categorySlug ?? p.category_slug ?? (p.category ? toSlug(p.category) : ""),
  subcategory: p.subcategory ?? "",

  stock: Number(p.stock) || 0,
  rating: Number(p.rating) || 0,
  reviewsCount: Number(p.reviewsCount ?? p.reviews_count) || 0,

  stockStatus: p.stockStatus ?? (p.stock > 0 ? "In Stock" : "Out of Stock"),

  thumbnail: p.thumbnail || "",
  images: Array.isArray(p.images) ? p.images.map(img => ({
    id: img.id ?? null,
    name: img.name ?? img.image_path ?? img
  })) : [],

  featured: !!p.featured,
  bestseller: !!p.bestseller,
  newArrival: !!p.newArrival,
  onSale: !!p.onSale,
  bestValue: !!p.bestValue,

  dealEndTime: p.dealEndTime ?? p.deal_end_time ?? "",
  shippingEstimate: p.shippingEstimate ?? p.shipping_estimate ?? "",
  warranty: p.warranty ?? "",

  // -------- Variants ----------
  variants: (p.variants ?? []).map(v => ({
    id: v.id ?? null,
    color: v.color ?? "",
    storage: v.storage ?? "",
    price: v.price ?? 0
  })),

  // -------- Specs (ID SAFE) ----------
  specs: (Array.isArray(p.specs) ? p.specs : (p.shortSpecs ?? [])).map(s => ({
    id: s.id ?? null,
    key: s.key ?? "",
    value: s.value ?? s.spec_text ?? ""
  })),

  // -------- Highlights ---------- (strings for form input)
  highlights: (p.highlights ?? []).map(h => ({ id: h.id ?? null, text: h.text ?? h.highlight_text ?? (typeof h === 'string' ? h : '') })),

  // -------- Tags ----------
  tags: (p.tags ?? []).map(t => ({ id: t.id ?? null, tag: t.tag ?? t.name ?? (typeof t === 'string' ? t : '') })),

  // -------- Badges ----------
  badges: (p.badges ?? []).map(b => ({ id: b.id ?? null, badge: b.badge ?? b.name ?? (typeof b === 'string' ? b : '') })),

  // -------- Related ----------
  relatedIds: (p.relatedIds ?? []).map(r =>
    typeof r === "string" ? r : `p-${r}`
  ),

  // -------- Recommended ----------
  recommendedIds: (p.recommendedIds ?? []).map(r =>
    typeof r === "string" ? r : `p-${r}`
  )
});


  // Simple dropzone for gallery
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles?.length) return
    // create previews and keep file references
    const previews = acceptedFiles.map(file => {
      return Object.assign(file, { preview: URL.createObjectURL(file) })
    })
    setForm(prev => ({
      ...prev,
      _galleryFiles: [...prev._galleryFiles, ...acceptedFiles],
      gallery: [...prev.gallery, ...previews]
    }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true,
    maxFiles: 12
  })

  // thumbnail change
  const handleThumbnailChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setForm(prev => ({ ...prev, thumbnail: URL.createObjectURL(f), _thumbnailFile: f }))
  }

  // remove gallery preview (and its file if present)
  const removeGalleryAt = (index) => {
    setForm(prev => {
      const newGallery = prev.gallery.filter((_, i) => i !== index)
      const newFiles = prev._galleryFiles.filter((_, i) => {
        // a little heuristic: files are placed first in gallery; but there may be mixed string urls
        // we remove file at same index if exists
        return i !== index
      })
      return { ...prev, gallery: newGallery, _galleryFiles: newFiles }
    })
  }

  // reorder gallery (simple move)
  const moveGallery = (from, to) => {
    setForm(prev => {
      const g = [...prev.gallery]
      const item = g.splice(from, 1)[0]
      g.splice(to, 0, item)

      // try reorder files similarly (best-effort)
      const f = [...prev._galleryFiles]
      if (f.length) {
        const fitem = f.splice(from, 1)[0]
        f.splice(to, 0, fitem)
      }
      return { ...prev, gallery: g, _galleryFiles: f }
    })
  }

  const resetForm = () => {
    // revoke object URLs to free memory
    if (form._thumbnailFile) URL.revokeObjectURL(form.thumbnail)
    form._galleryFiles?.forEach(f => f?.preview && URL.revokeObjectURL(f.preview))
    setEditingId(null)
    setForm(initialForm)
    setActiveTab('basic')
    setTagsInput('')
    setBadgesInput('')
    setVariantsInput('')
  }

  // Prefill form when editing
  const handleEdit = (product) => {
  setEditingId(product.id);
  const resolvedBrandId = (() => {
    const match = brands.find(b =>
      String(b.id) === String(product.brandId || '') ||
      (product.brand && b.name === product.brand) ||
      (product.brandSlug && b.slug === product.brandSlug)
    )
    return match?.id ?? product.brandId ?? ''
  })()
  const resolvedCategoryId = (() => {
    const match = categories.find(c =>
      String(c.id) === String(product.categoryId || '') ||
      (product.category && c.name === product.category) ||
      (product.categorySlug && c.slug === product.categorySlug)
    )
    return match?.id ?? product.categoryId ?? ''
  })()

  setForm({
    ...initialForm,
    sku: product.sku,
    title: product.title,
    slug: product.slug,
    description: product.description,
    brandId: resolvedBrandId,
    categoryId: resolvedCategoryId,
    subcategory: product.subcategory,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    stock: product.stock,
    stockStatus: product.stockStatus,
    featured: product.featured,
    bestseller: product.bestseller,
    newArrival: product.newArrival,
    onSale: product.onSale,
    bestValue: product.bestValue,
    dealEndTime: product.dealEndTime,
    shippingEstimate: product.shippingEstimate,
    warranty: product.warranty,

    thumbnail: product.thumbnail,
    gallery: product.images?.map(img => ({
      id: img.id ?? null,
      name: img.name
    })) ?? [],

    _galleryFiles: [],
    _thumbnailFile: null,

    variants: product.variants?.map(v => ({ ...v })) ?? [],
    specs: (product.specs && product.specs.length
      ? product.specs.map(s => ({ id: s.id ?? null, key: s.key ?? "", value: s.value ?? "" }))
      : (product.shortSpecs || []).map(s => ({ id: s.id ?? null, key: "", value: s.value ?? "" }))
    ),
    highlights: (product.highlights || []).map(h => ({ id: h.id ?? null, text: (typeof h === 'string' ? h : h.text) })),
    tags: (product.tags || []).map(t => ({ id: t.id ?? null, tag: (typeof t === 'string' ? t : t.tag) })),
    badges: (product.badges || []).map(b => ({ id: b.id ?? null, badge: (typeof b === 'string' ? b : b.badge) })),
    relatedIds: product.relatedIds,
    recommendedIds: product.recommendedIds
  });

  setFormModalOpen(true);
  setActiveTab("basic");
  setTagsInput((product.tags || []).map(t => (typeof t === 'string' ? t : t.tag)).join(', '))
  setBadgesInput((product.badges || []).map(b => (typeof b === 'string' ? b : b.badge)).join(', '))
  setVariantsInput((product.variants || []).map(v => [v.color, v.storage, v.price].filter(Boolean).join(', ')).join('\n'))
};


  // Delete product
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await axios.delete('http://localhost/elctro_Ecom_project/admin/api/TestProduct/delete', { data: { id } })
      console.log(res)
      if (res.status === 200) {
        toast.success('Product deleted')
        await refreshProducts()
      } else {
        toast.error('Delete failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete product')
    }
  }

  // Add or update product
  const handleAddOrEdit = async (e) => {
    e?.preventDefault?.();

    // Basic validation
    if (!form.title || !form.price || !form.slug || !form.brandId || !form.categoryId) {
      toast.error('Please fill required fields in Basic Info tab');
      setActiveTab('basic');
      return;
    }

    try {
      const fd = new FormData();

      // Include product id on update
      if (editingId) fd.append("id", editingId);

      // ---------------------------
      // 1) Basic scalar fields
      // ---------------------------
      const scalarMap = {
        sku: form.sku,
        title: form.title,
        slug: form.slug,
        description: form.description,
        brand_id: form.brandId,
        category_id: form.categoryId,
        subcategory: form.subcategory,
        price: Number(form.price || 0),
        original_price: Number(form.originalPrice || 0),
        discount_percent: Number(form.discountPercent || 0),
        rating: Number(form.rating || 0),
        reviews_count: Number(form.reviewsCount || 0),
        stock: Number(form.stock || 0),
        stock_status: form.stockStatus || (form.stock > 0 ? 'In Stock' : 'Out of Stock'),
        featured: form.featured ? 1 : 0,
        bestseller: form.bestseller ? 1 : 0,
        new_arrival: form.newArrival ? 1 : 0,
        on_sale: form.onSale ? 1 : 0,
        best_value: form.bestValue ? 1 : 0,
        deal_end_time: form.dealEndTime || "",
        shipping_estimate: form.shippingEstimate || "",
        warranty: form.warranty || ""
      };

      Object.entries(scalarMap).forEach(([k, v]) => {
        fd.append(k, v ?? "");
      });

      // ---------------------------
      // 2) Thumbnail + Gallery
      // ---------------------------
      // Thumbnail: new or existing
      if (form._thumbnailFile) {
        fd.append("thumbnail", form._thumbnailFile);
      } else if (form.thumbnail && typeof form.thumbnail === "string") {
        fd.append("existingThumbnail", form.thumbnail);
      }

      // ⭐ Gallery (send IDs + URLs)
      const galleryPayload = (form.gallery || []).map(item => ({
        id: item?.id ?? null,
        name: typeof item === "string" ? item : item.name || null
      }));

      fd.append("gallery", JSON.stringify(galleryPayload));

      // Also send newly uploaded files
      if (form._galleryFiles?.length) {
        form._galleryFiles.forEach((f, i) =>
          fd.append("galleryFiles[]", f, f.name || `gallery_${i}`)
        );
      }

      // ---------------------------
// 3) Child tables with IDs
// ---------------------------

// Variants
fd.append("variants", JSON.stringify(
  (form.variants || []).map(v => ({
    id: v.id ?? null,
    color: v.color,
    storage: v.storage,
    price: v.price
  }))
));

// Specs
fd.append("specs", JSON.stringify(
  (form.specs || []).map(s => ({
    id: s.id ?? null,
    key: s.key,
    value: s.value
  }))
));

// Highlights
fd.append("highlights", JSON.stringify(
  (form.highlights || []).map(h => ({
    id: h.id ?? null,
    text: h.text
  }))
));

// Tags
fd.append("tags", JSON.stringify(
  (form.tags || []).map(t => ({
    id: t.id ?? null,
    tag: t.tag
  }))
));

// Badges
fd.append("badges", JSON.stringify(
  (form.badges || []).map(b => ({
    id: b.id ?? null,
    badge: b.badge
  }))
));

// Related
fd.append("relatedIds", JSON.stringify(
  (form.relatedIds || []).map(r => ({
    id: typeof r === "string" ? r.replace(/^p-/, "") : r
  }))
));

// Recommended
fd.append("recommendedIds", JSON.stringify(
  (form.recommendedIds || []).map(r => ({
    id: typeof r === "string" ? r.replace(/^p-/, "") : r
  }))
));


      // ---------------------------
      // 4) API CALL
      // ---------------------------
      const url = editingId
        ? "http://localhost/elctro_Ecom_project/admin/api/TestProduct/update"
        : "http://localhost/elctro_Ecom_project/admin/api/TestProduct/save";

      const res = await axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(res.data);
      if (res.status === 200 && (res.data?.success === true || res.data?.success === 'yes')) {
        toast.success(editingId ? "Product Updated!" : "Product Added!");
        await refreshProducts();
        setFormModalOpen(false);
        resetForm();
      } else {
        toast.success(editingId ? "Product Updated!" : "Product Added!");
        await refreshProducts();
        setFormModalOpen(false);
        resetForm();
      }

    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  // Add a variant row
  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { id: null, color: '', storage: '', price: '' }]
    }))
  }

  const removeVariant = (idx) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }))
  }
  const updateVariant = (idx, key, val) => {
    setForm(prev => {
      const v = [...(prev.variants || [])]
      v[idx] = { ...(v[idx] || {}), [key]: val }
      return { ...prev, variants: v }
    })
  }

  // Specs handlers
  const addSpec = () => setForm(prev => ({ ...prev, specs: [...(prev.specs || []), { id: null, key: '', value: '' }] }))
  const removeSpec = (idx) => setForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== idx) }))
  const updateSpec = (idx, key, val) => {
    setForm(prev => {
      const s = [...prev.specs]
      s[idx] = { ...(s[idx] || {}), [key]: val }
      return { ...prev, specs: s }
    })
  }

  // Highlights
  const addHighlight = () => setForm(prev => ({ ...prev, highlights: [...(prev.highlights || []), { id: null, text: '' }] }))
  const updateHighlight = (idx, val) => {
    setForm(prev => {
      const h = [...prev.highlights]
      h[idx] = { ...h[idx], text: val }
      return { ...prev, highlights: h }
    })
  }
  const removeHighlight = (idx) => setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }))

  // Tags & Badges (simple comma-separated input helper)
  const setTagsFromInput = (str) => {
    setTagsInput(str)
    setForm(prev => ({
      ...prev,
      tags: str.split(',').map(t => t.trim()).filter(Boolean).map(tag => ({ id: null, tag }))
    }))
  }
  const setBadgesFromInput = (str) => {
    setBadgesInput(str)
    setForm(prev => ({
      ...prev,
      badges: str.split(',').map(t => t.trim()).filter(Boolean).map(badge => ({ id: null, badge }))
    }))
  }

  const setVariantsFromInput = (str) => {
    setVariantsInput(str)
    const lines = str.split(/\n|;/).map(l => l.trim()).filter(Boolean)
    const parsed = lines.map(l => {
      const [color, storage, price] = l.split(',').map(s => s.trim())
      return { id: null, color: color || '', storage: storage || '', price: Number(price) || 0 }
    })
    setForm(prev => ({ ...prev, variants: parsed }))
  }

  // Related & Recommended multi-select change
  const handleMultiSelect = (e, field) => {
    const values = [...e.target.selectedOptions].map(o => o.value)
    setForm(prev => ({ ...prev, [field]: values }))
  }

  // Columns & rows for DataTable
  const columns = useMemo(() => [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'rating', label: 'Rating' },
    { key: 'actions', label: 'Actions' }
  ], [])

  const rows = useMemo(() => products.map(p => ({
    ...p,
    brand: (brands.find(b => String(b.id) === String(p.brandId))?.name) ?? p.brand ?? '',
    category: (categories.find(c => String(c.id) === String(p.categoryId))?.name) ?? p.category ?? '',
    price: `$${Number(p.price).toFixed(2)}`,
    actions: (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700" title="Edit"><FiEdit /></button>
        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700" title="Delete"><FiTrash2 /></button>
      </div>
    )
  })), [products, brands, categories])

  // Modal Tabs UI
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'media', label: 'Media' },
    { id: 'variants', label: 'Variants' },
    { id: 'specs', label: 'Specifications' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'tags', label: 'Tags & Badges' },
    { id: 'relations', label: 'Related & Recommended' }
  ]

  return (
    <>
      <Helmet><title>Admin — Products</title></Helmet>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { resetForm(); setFormModalOpen(true) }}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={refreshProducts}
            className="rounded-full border px-4 py-2 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={rows} />

      <DashboardModal
        open={formModalOpen}
        title={editingId ? 'Edit Product' : 'Add Product'}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleAddOrEdit}
        submitLabel={editingId ? 'Update Product' : 'Add Product'}
      >
        <div className="w-full">
          {/* Tabs */}
          <div className="mb-4 border-b overflow-x-auto">
            <nav className="flex min-w-max space-x-4" aria-label="Tabs">
              {tabs.map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${activeTab === t.id
                      ? 'border-b-2 border-neutral-900'
                      : 'text-neutral-600'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="space-y-4">
            {/* Basic Info */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="SKU"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Title *"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Slug *"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Subcategory"
                    value={form.subcategory}
                    onChange={e => setForm({ ...form, subcategory: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl border p-3 text-sm"
                  rows={4}
                ></textarea>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Original Price"
                    value={form.originalPrice}
                    onChange={e => {
                      const original = Number(e.target.value) || 0;
                      const discount = Number(form.discountPercent) || 0;
                      const calculatedPrice = original * (1 - discount / 100);

                      setForm(prev => ({
                        ...prev,
                        originalPrice: original,
                        price: calculatedPrice,
                        // Update variant prices if they don't have manual price
                        variants: prev.variants.map(v => ({
                          ...v,
                          price: v.price ? v.price : calculatedPrice
                        }))
                      }));
                    }}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />

                  <input
                    type="number"
                    placeholder="Discount %"
                    value={form.discountPercent}
                    onChange={e => {
                      const discount = Number(e.target.value) || 0;
                      const original = Number(form.originalPrice) || 0;
                      const calculatedPrice = original * (1 - discount / 100);

                      setForm(prev => ({
                        ...prev,
                        discountPercent: discount,
                        price: calculatedPrice,
                        variants: prev.variants.map(v => ({
                          ...v,
                          price: v.price ? v.price : calculatedPrice
                        }))
                      }));
                    }}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    readOnly
                    className="h-10 rounded-xl border px-3 text-sm bg-neutral-100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={String(form.brandId || '')}
                    onChange={e => setForm({ ...form, brandId: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  >
                    <option value="">Select Brand *</option>
                    {brands.length === 0 ? (
                      <option value="" disabled>Loading brands...</option>
                    ) : (
                      brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)
                    )}
                  </select>

                  <select
                    value={String(form.categoryId || '')}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  >
                    <option value="">Select Category *</option>
                    {categories.length === 0 ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : (
                      categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)
                    )}
                  </select>

                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="number"
                    readOnly
                    placeholder="Rating"
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm bg-neutral-100"
                  />
                  <input
                    type="number"
                    readOnly
                    placeholder="Reviews Count"
                    value={form.reviewsCount}
                    onChange={e => setForm({ ...form, reviewsCount: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm bg-neutral-100"
                  />
                  <input
                    type="text"
                    placeholder="Shipping Estimate"
                    value={form.shippingEstimate}
                    onChange={e => setForm({ ...form, shippingEstimate: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Warranty"
                    value={form.warranty}
                    onChange={e => setForm({ ...form, warranty: e.target.value })}
                    className="h-10 rounded-xl border px-3 text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.newArrival} onChange={e => setForm({ ...form, newArrival: e.target.checked })} />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.onSale} onChange={e => setForm({ ...form, onSale: e.target.checked })} />
                    On Sale
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.bestValue} onChange={e => setForm({ ...form, bestValue: e.target.checked })} />
                    Best Value
                  </label>
                </div>
              </div>
            )}

            {/* Media */}
            {activeTab === 'media' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                  {form.thumbnail && (
                    <div className="mt-2 w-40 h-40 border rounded overflow-hidden">
                      <img
                        src={
                          (() => {
                            const t = String(form.thumbnail || '')
                            const isBlobOrUrl = t.startsWith('blob:') || /^https?:/i.test(t)
                            return isBlobOrUrl ? t : `${import.meta.env.VITE_BASE_MEDIA_URL}/products/${t}`
                          })()
                        }
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1">Gallery (drag & drop, reorder, remove)</label>
                  <div {...getRootProps()} className={`border-dashed border-2 rounded-md p-6 text-center ${isDragActive ? 'bg-neutral-50' : ''}`}>
                    <input {...getInputProps()} />
                    <p className="text-sm">Drag & drop images here, or click to select (max 12)</p>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {form.gallery.map((img, i) => {
                      const name = typeof img === 'string' ? img : img?.name
                      const previewSrc = img?.preview
                      const src = previewSrc || (name
                        ? ((String(name).startsWith('blob:') || /^https?:/i.test(String(name)))
                          ? String(name)
                          : `${import.meta.env.VITE_BASE_MEDIA_URL}/products/${name}`)
                        : '')
                      return (
                        <div key={i} className="relative w-full h-28 border rounded overflow-hidden">
                          <img src={src} alt={`g-${i}`} className="object-cover w-full h-full" />
                          <div className="absolute left-1 top-1 flex gap-1">
                            <button type="button" onClick={() => moveGallery(i, Math.max(0, i - 1))} className="bg-white/80 rounded px-2 py-1 text-xs">↑</button>
                            <button type="button" onClick={() => moveGallery(i, Math.min(form.gallery.length - 1, i + 1))} className="bg-white/80 rounded px-2 py-1 text-xs">↓</button>
                          </div>
                          <button type="button" onClick={() => removeGalleryAt(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs">✕</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Variants */}
            {activeTab === 'variants' && (
              <div>
                <div className="flex flex-col gap-3">
                  {(form.variants || []).map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 items-center">
                      <input type="text" placeholder="Color" value={v.color || ''} onChange={e => updateVariant(i, 'color', e.target.value)} className="h-10 rounded-xl border px-3 text-sm" />
                      <input type="text" placeholder="Storage / Option" value={v.storage || ''} onChange={e => updateVariant(i, 'storage', e.target.value)} className="h-10 rounded-xl border px-3 text-sm" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={v.price || ''}
                        onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                        className="h-10 rounded-xl border px-3 text-sm"
                      />

                      <div className="flex gap-2">
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500">Remove</button>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addVariant} className="rounded bg-neutral-900 text-white px-3 py-1 text-sm">+ Add Variant</button>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="block text-sm">Bulk variants (one per line, comma separated)</label>
                  <textarea
                    placeholder={"e.g.\nRed,64GB,129.99\nBlue,128GB,149.99"}
                    value={variantsInput}
                    onChange={(e) => setVariantsFromInput(e.target.value)}
                    className="min-h-24 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Specs */}
            {activeTab === 'specs' && (
              <div>
                {(form.specs || []).map((s, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-center mb-2">
                    <input type="text" placeholder="Spec Key" value={s.key || ''} onChange={e => updateSpec(i, 'key', e.target.value)} className="h-10 rounded-xl border px-3 text-sm" />
                    <input type="text" placeholder="Spec Value" value={s.value || ''} onChange={e => updateSpec(i, 'value', e.target.value)} className="h-10 rounded-xl border px-3 text-sm" />
                    <div>
                      <button type="button" onClick={() => removeSpec(i)} className="text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addSpec} className="rounded bg-neutral-900 text-white px-3 py-1 text-sm">+ Add Spec</button>
              </div>
            )}

            {/* Highlights */}
            {activeTab === 'highlights' && (
              <div>
                {(form.highlights || []).map((h, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <input type="text" placeholder="Highlight" value={h.text || ''} onChange={e => updateHighlight(i, e.target.value)} className="h-10 rounded-xl border px-3 text-sm w-full" />
                    <button type="button" onClick={() => removeHighlight(i)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addHighlight} className="rounded bg-neutral-900 text-white px-3 py-1 text-sm">+ Add Highlight</button>
              </div>
            )}

            {/* Tags & Badges */}
            {activeTab === 'tags' && (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Tags (comma separated)</label>
                  <input type="text" placeholder="e.g. Wireless, Audio" onChange={e => setTagsFromInput(e.target.value)} value={tagsInput} className="h-10 rounded-xl border px-3 text-sm w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Badges (comma separated)</label>
                  <input type="text" placeholder="e.g. Hot, New" onChange={e => setBadgesFromInput(e.target.value)} value={badgesInput} className="h-10 rounded-xl border px-3 text-sm w-full" />
                </div>
              </div>
            )}

            {/* Relations */}
            {activeTab === 'relations' && (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Related Products (multi-select)</label>
                  <select multiple value={form.relatedIds} onChange={(e) => handleMultiSelect(e, 'relatedIds')} className="h-40 rounded-xl border px-3 text-sm w-full">
                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Recommended Products (multi-select)</label>
                  <select multiple value={form.recommendedIds} onChange={(e) => handleMultiSelect(e, 'recommendedIds')} className="h-40 rounded-xl border px-3 text-sm w-full">
                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardModal>
    </>
  )
}

export default ProductsAdmin
