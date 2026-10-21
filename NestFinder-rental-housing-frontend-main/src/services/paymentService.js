import paymentApi from '@/api/paymentApi'
export const paymentService = {
  initiate:      (data)   => paymentApi.initiate(data).then(r => r.data.data),
  confirm:       (data)   => paymentApi.confirm(data).then(r => r.data.data),
  getMyPayments: (params) => paymentApi.getMyPayments(params).then(r => r.data.data),
  getEarnings:   ()       => paymentApi.getEarnings().then(r => r.data.data),
}
