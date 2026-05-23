/** Client-side admin check (UI routing). Server RLS uses auth app_metadata.role = 'admin'. */
export function getAdminEmails() {
  return (import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminUser(user) {
  if (!user?.email) return false
  if (user.app_metadata?.role === 'admin') return true
  return getAdminEmails().includes(user.email.toLowerCase())
}
