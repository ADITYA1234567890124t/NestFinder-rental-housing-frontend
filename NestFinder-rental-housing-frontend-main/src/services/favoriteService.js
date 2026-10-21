import favoriteApi from '@/api/favoriteApi'
export const favoriteService = {
  add:    (id)     => favoriteApi.add(id).then(r => r.data),
  remove: (id)     => favoriteApi.remove(id).then(r => r.data),
  getAll: (params) => favoriteApi.getAll(params).then(r => r.data.data),
  check:  (id)     => favoriteApi.check(id).then(r => r.data.data?.isFavorite ?? false),
}
