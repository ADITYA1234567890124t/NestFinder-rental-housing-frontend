import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPropertyById, updateProperty } from '@/redux/slices/propertySlice'
import PropertyForm from '@/components/property/PropertyForm'
import Loader from '@/components/common/Loader'
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react'
import propertyApi from '@/api/propertyApi'
import toast from 'react-hot-toast'

export default function EditProperty() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { selected: property, loading } = useSelector(s => s.property)
  const [newImages,   setNewImages]   = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [uploading, setUploading]     = useState(false)

  useEffect(() => { dispatch(fetchPropertyById(id)) }, [id, dispatch])

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files)
    const current = (property?.imageUrls?.length || 0) + newImages.length
    if (current + files.length > 10) { toast.error('Maximum 10 images'); return }
    setNewImages(prev => [...prev, ...files])
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => setNewPreviews(prev => [...prev, ev.target.result])
      reader.readAsDataURL(f)
    })
  }

  const removeNew = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx))
    setNewPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const deleteExistingImage = async (imgId) => {
    try {
      await propertyApi.deleteImage(id, imgId)
      dispatch(fetchPropertyById(id))
      toast.success('Image deleted')
    } catch {
      toast.error('Failed to delete image')
    }
  }

  const handleSubmit = async (formData) => {
    const result = await dispatch(updateProperty({ id: Number(id), formData }))
    if (result.meta.requestStatus !== 'fulfilled') {
      toast.error(result.payload || 'Update failed'); return
    }

    if (newImages.length > 0) {
      setUploading(true)
      try {
        const fd = new FormData()
        newImages.forEach(f => fd.append('files', f))
        await propertyApi.uploadImages(id, fd)
        toast.success('Property updated with new images!')
      } catch {
        toast.error('Property updated but image upload failed')
      } finally { setUploading(false) }
    } else {
      toast.success('Property updated!')
    }

    navigate('/owner/properties')
  }

  if (loading && !property) return <Loader />

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900">Edit Property</h1>
          <p className="text-stone-500 text-sm">{property?.title}</p>
        </div>
      </div>

      {/* Existing images */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">Current Images</h2>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {property?.imageUrls?.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
              <img src={url} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => deleteExistingImage(i + 1)} // pass actual imageId in real scenario
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group border-2 border-primary-300">
              <img src={src} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNew(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
              <span className="absolute bottom-1 left-1 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full">New</span>
            </div>
          ))}

          {((property?.imageUrls?.length || 0) + newImages.length) < 10 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-primary-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-50 hover:bg-primary-50">
              <Upload className="w-5 h-5 text-stone-400 mb-1" />
              <span className="text-xs text-stone-400">Add</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImagePick} />
            </label>
          )}
        </div>
      </div>

      {/* Property form */}
      <div className="card p-6">
        <h2 className="font-semibold text-stone-900 mb-5">Property Details</h2>
        {property && (
          <PropertyForm
            defaultValues={{
              title: property.title,
              description: property.description,
              monthlyRent: property.monthlyRent,
              bhk: property.bhk,
              city: property.city,
              state: property.state,
              address: property.address,
              pincode: property.pincode,
              areaSqFt: property.areaSqFt,
              propertyType: property.propertyType,
              furnishingStatus: property.furnishingStatus,
              depositAmount: property.depositAmount,
              totalFloors: property.totalFloors,
              floorNumber: property.floorNumber,
              latitude: property.latitude,
              longitude: property.longitude,
              amenities: property.amenities,
            }}
            onSubmit={handleSubmit}
            loading={loading || uploading}
          />
        )}
      </div>
    </div>
  )
}
