export const validators = {
  required:  (v) => (v && String(v).trim() ? undefined : 'This field is required'),
  email:     (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : 'Invalid email address'),
  phone:     (v) => (/^[6-9]\d{9}$/.test(v) ? undefined : 'Enter valid 10-digit Indian mobile number'),
  pincode:   (v) => (/^[1-9][0-9]{5}$/.test(v) ? undefined : 'Enter valid 6-digit pincode'),
  minLength: (n) => (v) => (v?.length >= n ? undefined : `Minimum ${n} characters required`),
  maxLength: (n) => (v) => (v?.length <= n ? undefined : `Maximum ${n} characters allowed`),
  min:       (n) => (v) => (Number(v) >= n ? undefined : `Minimum value is ${n}`),
  max:       (n) => (v) => (Number(v) <= n ? undefined : `Maximum value is ${n}`),
  positive:  (v) => (Number(v) > 0 ? undefined : 'Must be a positive number'),
  password:  (v) => {
    if (!v || v.length < 8)              return 'Minimum 8 characters'
    if (!/[A-Z]/.test(v))               return 'At least one uppercase letter'
    if (!/[a-z]/.test(v))               return 'At least one lowercase letter'
    if (!/[0-9]/.test(v))               return 'At least one digit'
    if (!/[!@#$%^&*]/.test(v))          return 'At least one special character'
    return undefined
  },
  confirmPassword: (pw) => (v) => (v === pw ? undefined : 'Passwords do not match'),
}

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

export const truncate = (str, n = 100) => str?.length > n ? str.slice(0, n) + '…' : str ?? ''

export const classNames = (...cls) => cls.filter(Boolean).join(' ')
