import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createProperty } from '@/redux/slices/propertySlice'
import PropertyForm from '@/components/property/PropertyForm'
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react'
import Button from '@/components/common/Button'
import propertyApi from '@/api/propertyApi'
import toast from 'react-hot-toast'

export default function AddProperty() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading } = useSelector(s => s.property)
  const [images,  setImages]  = useState([])       // File objects
  const [previews,setPreviews]= useState([])       // base64 previews
  const [uploading,setUploading] = useState(false)
  const [createdId, setCreatedId] = useState(null)

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed'); return
    }
    setImages(prev => [...prev, ...files])
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (formData) => {
    // 1. Create property
    const result = await dispatch(createProperty(formData))
    if (result.meta.requestStatus !== 'fulfilled') {
      toast.error(result.payload || 'Failed to create property'); return
    }

    const pid = result.payload.id
    setCreatedId(pid)

    // 2. Upload images if any
    if (images.length > 0) {
      setUploading(true)
      try {
        const fd = new FormData()
        images.forEach(f => fd.append('files', f))
        await propertyApi.uploadImages(pid, fd)
        toast.success('Property created with images!')
      } catch {
        toast.error('Property created but image upload failed. You can add images from edit page.')
      } finally {
        setUploading(false)
      }
    } else {
      toast.success('Property created!')
    }

    navigate('/owner/properties')
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900">Add New Property</h1>
          <p className="text-stone-500 text-sm">Fill in the details to list your property</p>
        </div>
      </div>

      {/* Image upload section */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-primary-500" />
          Property Images
          <span className="text-xs text-stone-400 font-normal ml-1">(up to 10)</span>
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
              <img src={src} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>
          ))}

          {previews.length < 10 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-primary-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-50 hover:bg-primary-50">
              <Upload className="w-5 h-5 text-stone-400 mb-1" />
              <span className="text-xs text-stone-400">Add</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImagePick}
              />
            </label>
          )}
        </div>

        <p className="text-xs text-stone-400">
          First image will be the primary/cover image. Accepted formats: JPEG, PNG, WebP. Max 10MB per file.
        </p>
      </div>

      {/* Property details form */}
      <div className="card p-6">
        <h2 className="font-semibold text-stone-900 mb-5">Property Details</h2>
        <PropertyForm
          onSubmit={handleSubmit}
          loading={loading || uploading}
        />
      </div>
    </div>
  )
}
