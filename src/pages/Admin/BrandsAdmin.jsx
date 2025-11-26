import { Helmet } from 'react-helmet-async'
import { useProducts } from '../../context/ProductContext.jsx'
import DataTable from '../../components/dashboard/DataTable.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { useState, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

function BrandsAdmin() {
  const { brands, setBrands } = useProducts()

  // Form state
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [founded, setFounded] = useState('')
  const [origin, setOrigin] = useState('')
  const [formModalOpen, setFormModalOpen] = useState(false)

  const toSlug = (s) => (s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
  const normalizeBrandLocal = (b) => {
    const n = b?.name ?? b?.brand ?? ''
    const s = b?.slug ?? b?.brand_slug ?? toSlug(n)
    return {
      id: b?.id ?? b?.brand_id ?? s,
      name: n,
      slug: s,
      ...b,
    }
  }
  const getId = (obj) => (obj?.id ?? obj?.brand_id ?? obj?.slug ?? obj?.name ?? '').toString()
  const refreshBrands = async () => {
    try {
      const bRes = await axios.get('http://localhost/elctro_Ecom_project/admin/api/TestProductBrand')
      const list = Array.isArray(bRes.data)
        ? bRes.data
        : (bRes.data?.test_product_brands ?? bRes.data?.data ?? bRes.data?.items ?? [])
      setBrands(list.map(normalizeBrandLocal))
    } catch {}
  }

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // Reset form
  const resetForm = () => {
    setEditingId(null)
    setName('')
    setLogo(null)
    setPreview('')
    setDescription('')
    setFeatured(false)
    setFounded('')
    setOrigin('')
  }

  const openAddModal = () => {
    resetForm()
    setFormModalOpen(true)
  }

  // Submit add or update
  const submitBrand = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error("Brand name is required")

    try {
      const formData = new FormData()
      if (editingId) formData.append('id', editingId)
      formData.append('name', name)
      if (logo) {
        formData.append('logo', logo)
      }
      else if (editingId && preview) 
      {
        // Extract existing filename from preview URL
        const existingFilename = preview.split('/').pop()
        formData.append('keep_old_logo', existingFilename)
      }

      formData.append('description', description)
      formData.append('featured', featured ? 1 : 0)
      formData.append('founded', founded)
      formData.append('origin', origin)

      const url = editingId
        ? 'http://localhost/elctro_Ecom_project/admin/api/TestProductBrand/update'
        : 'http://localhost/elctro_Ecom_project/admin/api/TestProductBrand/save'

      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.status === 200) {
        const returnedBrand = res.data
        const nextBrand = normalizeBrandLocal(returnedBrand)

        if (editingId) {
          const targetId = editingId?.toString()
          const next = brands.map((b) => (getId(b) === targetId ? nextBrand : b))
          setBrands(next)
          toast.success("Brand Updated!")
        } else {
          const next = [nextBrand, ...brands]
          setBrands(next)
          toast.success("Brand Added!")
        }

        await refreshBrands()
        setFormModalOpen(false)
        resetForm()
      }
    } catch (err) {
      console.error(err)
      toast.error("Operation failed")
    }
  }

  // Edit brand
  const handleEdit = (brand) => {
    setEditingId(getId(brand))
    setName(brand.name)
    setDescription(brand.description)
    setFeatured(Boolean(Number(brand.featured)))
    setFounded(brand.founded)
    setOrigin(brand.origin)
    setPreview(
      brand.logo
        ? `${import.meta.env.VITE_BASE_MEDIA_URL}/brands/${brand.logo}`
        : ''
    )
    setLogo(null)
    setFormModalOpen(true)
  }

  // Delete brand
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return
    try {
      const res = await axios.delete(
        'http://localhost/elctro_Ecom_project/admin/api/TestProductBrand/delete',
        { data: { id } }
      )
      if (res.status === 200) {
        const getId = (obj) => (obj?.id ?? obj?.brand_id ?? obj?.slug ?? obj?.name ?? '').toString()
        const next = brands.filter((b) => getId(b) !== id?.toString())
        setBrands(next)
        toast.success("Brand deleted")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete brand")
    }
  }

  // Memoized DataTable rows
  const rows = useMemo(() => {
    return brands.map(b => ({
      id: b.id,
      name: b.name ?? '',
      logo: b.logo ? (
        <img
          src={`${import.meta.env.VITE_BASE_MEDIA_URL}/brands/${b.logo}`}
          alt={b.name}
          className="h-10 w-10 object-cover rounded-full"
        />
      ) : 'No logo',
      description: b.description ?? '',
      featured: b.featured === "1" || b.featured === 1 || b.featured === true ? "Yes" : "No",
      founded: b.founded ?? '',
      origin: b.origin ?? '',
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(b)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }))
  }, [brands])

  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'logo', label: 'Logo' },
    { key: 'description', label: 'Description' },
    { key: 'featured', label: 'Featured' },
    { key: 'founded', label: 'Founded' },
    { key: 'origin', label: 'Origin' },
    { key: 'actions', label: 'Actions' }
  ], [])

  return (
    <>
      <Helmet>
        <title>Admin — Brands</title>
      </Helmet>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Brands</h2>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          Add Brand
        </button>
      </div>

      <DataTable columns={columns} rows={rows} />

      <DashboardModal
        open={formModalOpen}
        title={editingId ? 'Edit Brand' : 'Add Brand'}
        onClose={() => { setFormModalOpen(false) }}
        onSubmit={submitBrand}
        submitLabel={editingId ? 'Update Brand' : 'Add Brand'}
      >
        <FormField label="Name" value={name} onChange={setName} placeholder="Brand name" />
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">Logo</label>
          <div className="flex items-center gap-4">
            <label htmlFor="logo" className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-white dark:bg-neutral-800">Choose File</label>
            <span>{logo?.name || 'No file selected'}</span>
          </div>
          <input type="file" id="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
          {preview && (<img src={preview} alt="Logo Preview" className="mt-2 h-20 w-20 object-cover rounded-full border" />)}
        </div>
        <FormField label="Description" value={description} onChange={setDescription} placeholder="Brand description" />
        <div className="flex items-center">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="mr-2" />
          <span>Featured</span>
        </div>
        <FormField label="Founded" value={founded} onChange={setFounded} placeholder="Year founded" />
        <FormField label="Origin" value={origin} onChange={setOrigin} placeholder="Country of origin" />
      </DashboardModal>
    </>
  )
}

export default BrandsAdmin