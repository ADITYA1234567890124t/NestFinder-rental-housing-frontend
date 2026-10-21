import { format, formatDistanceToNow, parseISO, isValid, isToday, isYesterday } from 'date-fns'

const parse = (d) => { if (!d) return null; const p = typeof d === 'string' ? parseISO(d) : new Date(d); return isValid(p) ? p : null }

export const formatDate     = (d) => { const p = parse(d); return p ? format(p, 'dd MMM yyyy') : '—' }
export const formatDateTime = (d) => { const p = parse(d); return p ? format(p, 'dd MMM yyyy, hh:mm a') : '—' }
export const formatTime     = (d) => { const p = parse(d); return p ? format(p, 'hh:mm a') : '—' }
export const getDateKey      = (d) => { const p = parse(d); return p ? format(p, 'yyyy-MM-dd') : 'unknown' }
export const formatChatDate  = (d) => {
	const p = parse(d)
	if (!p) return 'Unknown date'
	if (isToday(p)) return 'Today'
	if (isYesterday(p)) return 'Yesterday'
	return format(p, 'dd MMM yyyy')
}
export const timeAgo        = (d) => { const p = parse(d); return p ? formatDistanceToNow(p, { addSuffix: true }) : '—' }
export const toInputDate    = (d) => { const p = parse(d); return p ? format(p, 'yyyy-MM-dd') : '' }
