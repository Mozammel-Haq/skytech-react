// src/pages/Admin/CategoriesAdmin.jsx
import { Helmet } from 'react-helmet-async'
import { useProducts } from '../../context/ProductContext.jsx'
import DataTable from '../../components/dashboard/DataTable.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

function CategoriesAdmin() {
  // initial categories from context (kept for initial load)
  const { categories: ctxCategories = [] } = useProducts()

  // local categories state so we can re-render reliably after actions
  const [categories, setCategories] = useState(() => Array.isArray(ctxCategories) ? ctxCategories : [])

  // form state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null) // File
  const [preview, setPreview] = useState('') // preview url or existing image url

  // API endpoints (change if needed)
  const API_BASE = 'http://localhost/elctro_Ecom_project/admin/api'
  const ENDPOINT = `${API_BASE}/TestProductCategory`

  // helper: slugify
  const toSlug = (s) => (s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')

  // normalize category shape (local)
  const normalizeCategoryLocal = (c) => {
    const nameVal = c?.name ?? c?.title ?? ''
    const slugVal = c?.slug ?? c?.category_slug ?? toSlug(nameVal)
    return {
      id: c?.id ?? c?.category_id ?? slugVal,
      name: nameVal,
      slug: slugVal,
      description: c?.description ?? '',
      image: c?.image ?? c?.thumbnail ?? null,
      ...c,
    }
  }

  // utility to extract id string for comparisons
  const getId = (obj) => (obj?.id ?? obj?.category_id ?? obj?.slug ?? obj?.name ?? '').toString()

  // refresh categories from API
  const refreshCategories = async () => {
    try {
      const res = await axios.get(ENDPOINT)
      const raw = Array.isArray(res.data) ? res.data : (res.data?.test_product_categories ?? res.data?.data ?? res.data?.items ?? [])
      setCategories(raw.map(normalizeCategoryLocal))
    } catch (err) {
      console.error('Failed to refresh categories', err)
    }
  }

  // initialize local categories from context on mount (and keep in sync if context changes)
  useEffect(() => {
    if (Array.isArray(ctxCategories) && ctxCategories.length > 0) {
      setCategories(ctxCategories.map(normalizeCategoryLocal))
    } else {
      // fallback to fetch from API when context doesn't have categories yet
      refreshCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxCategories?.length])

  // handle file selection & preview
  const handleImageChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setImageFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  // open modal for adding
  const openAddModal = () => {
    resetForm()
    setFormModalOpen(true)
  }

  // reset form
  const resetForm = () => {
    setEditingId(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageFile(null)
    setPreview('')
  }

  // submit add or update
  const submitCategory = async (e) => {
    e?.preventDefault?.()
    if (!name?.trim()) return toast.error('Name is required')

    try {
      const formData = new FormData()
      if (editingId) formData.append('id', editingId)
      formData.append('name', name)
      formData.append('slug', slug || toSlug(name))

      // image handling:
      // - if user selected a new file -> append file
      // - else if editing and preview points to an existing filename -> append keep_old_image with filename
      if (imageFile) {
        formData.append('image', imageFile) // backend should expect "image" (or adjust)
      } else if (editingId && preview) {
        // extract filename part
        const parts = preview.split('/')
        const filename = parts[parts.length - 1]
        if (filename) formData.append('keep_old_image', filename)
      }

      formData.append('description', description ?? '')

      const url = editingId ? `${ENDPOINT}/update` : `${ENDPOINT}/save`

      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.status === 200) {
        const returned = res.data
        const cat = normalizeCategoryLocal(returned)
                  console.log(res)
        if (editingId) {
          // optimistic update local list
          const next = categories.map((c) => (getId(c) === getId({ id: editingId }) ? cat : c))
          setCategories(next)
          toast.success('Category updated!')
        } else {
          setCategories((prev) => [cat, ...prev])
          toast.success('Category added!')
        }

        // refresh from API to ensure consistent server state (and to get real IDs, filenames)
        await refreshCategories()
        setFormModalOpen(false)
        resetForm()
      } else {
        toast.error('Operation failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Operation failed')
    }
  }

  // populate form for edit
  const handleEdit = (row) => {
    const c = normalizeCategoryLocal(row)
    setEditingId(getId(c))
    setName(c.name ?? '')
    setSlug(c.slug ?? toSlug(c.name ?? ''))
    setDescription(c.description ?? '')
    setPreview(c.image ? `${import.meta.env.VITE_BASE_MEDIA_URL}/categories/${c.image}` : '') // keep same pattern as your brands
    setImageFile(null)
    setFormModalOpen(true)
  }

  // delete category
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await axios.delete(`${ENDPOINT}/delete`, { data: { id } })
      console.log(res)
      if (res.status === 200) {
        setCategories((prev) => prev.filter((c) => getId(c) !== id?.toString()))
        toast.success('Category deleted')
      } else {
        toast.error('Failed to delete category')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete category')
    }
  }

  // memoized rows for DataTable (we pass jsx for image / actions like you do for brands)
  const rows = useMemo(() => {
    return categories.map((c) => ({
      id: c.id,
      name: c.name ?? '',
      slug: c.slug ?? '',
      description: c.description ?? '',
      image: c.image ? (
        <img
          src={`${import.meta.env.VITE_BASE_MEDIA_URL}/categories/${c.image}`}
          alt={c.name}
          className="h-10 w-10 object-cover rounded-full"
        />
      ) : 'No image',
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(c)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(c.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }))
  }, [categories])

  // columns for DataTable (image column key is 'image' to match rows)
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'image', label: 'Image' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' }
  ], [])

  return (
    <>
      <Helmet>
        <title>Admin — Categories</title>
      </Helmet>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={refreshCategories}
            className="rounded-full border px-4 py-2 text-sm"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={rows} />

      <DashboardModal
        open={formModalOpen}
        title={editingId ? 'Edit Category' : 'Add Category'}
        onClose={() => { setFormModalOpen(false) }}
        onSubmit={submitCategory}
        submitLabel={editingId ? 'Update Category' : 'Add Category'}
      >
        <FormField label="Name" value={name} onChange={setName} placeholder="Category name" />
        <FormField label="Slug" value={slug} onChange={setSlug} placeholder="category-slug (optional)" />
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">Image</label>
          <div className="flex items-center gap-4">
            <label htmlFor="image" className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-white dark:bg-neutral-800">
              Choose File
            </label>
            <span>{imageFile?.name || 'No file selected'}</span>
          </div>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {preview && (
            <img src={preview} alt="Image Preview" className="mt-2 h-20 w-20 object-cover rounded-full border" />
          )}
        </div>
        <FormField label="Description" value={description} onChange={setDescription} placeholder="Category description" />
      </DashboardModal>
    </>
  )
}

export default CategoriesAdmin
