import reviewApi from '@/api/reviewApi'
export const reviewService = {
  add:           (data)        => reviewApi.add(data).then(r => r.data.data),
  getByProperty: (pid, params) => reviewApi.getByProperty(pid, params).then(r => r.data.data),
  delete:        (id)          => reviewApi.delete(id).then(r => r.data),
}
