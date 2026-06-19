import propertyApi from '@/api/propertyApi'

export const propertyService = {
  getAll:    (params)        => propertyApi.getAll(params).then(r => r.data.data),
  getById:   (id)            => propertyApi.getById(id).then(r => r.data.data),
  create:    (data)          => propertyApi.create(data).then(r => r.data.data),
  update:    (id, data)      => propertyApi.update(id, data).then(r => r.data.data),
  delete:    (id)            => propertyApi.delete(id).then(r => r.data),
  search:    (params)        => propertyApi.search(params).then(r => r.data.data),
  uploadImages:(id, files)   => {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    return propertyApi.uploadImages(id, fd).then(r => r.data.data)
  },
  deleteImage:(pid, imgId)   => propertyApi.deleteImage(pid, imgId).then(r => r.data),
}
