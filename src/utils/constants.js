export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const WS_URL       = import.meta.env.VITE_WS_URL       || 'http://localhost:8080/ws'

export const ROLES = { TENANT: 'TENANT', OWNER: 'OWNER', ADMIN: 'ADMIN' }

export const BOOKING_STATUS = {
  PENDING:   'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  REJECTED:  'REJECTED',
}

export const PAYMENT_STATUS = {
  PENDING:   'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED:    'FAILED',
  REFUNDED:  'REFUNDED',
}

export const COMPLAINT_STATUS = {
  OPEN:        'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED:    'RESOLVED',
  CLOSED:      'CLOSED',
}

export const PROPERTY_TYPES      = ['Apartment','Villa','PG','Studio','Independent House','Penthouse']
export const FURNISHING_STATUSES = ['Furnished','Semi-Furnished','Unfurnished']
export const BHK_OPTIONS         = [1,2,3,4,5]
export const PAYMENT_METHODS     = ['UPI','NET_BANKING','CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','CASH']
export const TIME_SLOTS          = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi',
]

export const STATUS_BADGE = {
  PENDING:     'warning',
  CONFIRMED:   'success',
  CANCELLED:   'error',
  COMPLETED:   'success',
  REJECTED:    'error',
  OPEN:        'warning',
  IN_PROGRESS: 'info',
  RESOLVED:    'success',
  CLOSED:      'neutral',
}
