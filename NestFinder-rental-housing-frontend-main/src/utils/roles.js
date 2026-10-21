export const normalizeRole = (role) => {
  if (!role) return ''
  return String(role).trim().toUpperCase().replace(/^ROLE_/, '')
}

export const dashboardPathForRole = (role) => {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === 'ADMIN') return '/admin'
  if (normalizedRole === 'OWNER') return '/owner/properties'
  return '/tenant'
}
