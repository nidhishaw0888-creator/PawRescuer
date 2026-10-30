import { Badge } from './Badge'
import { RESCUE_STATUSES, SEVERITY_LEVELS } from '../../utils/constants'

const STATUS_TONES = {
  Reported: 'coral',
  Accepted: 'teal',
  'En Route': 'teal',
  'On Scene': 'teal',
  Rescued: 'forest',
  'In Care': 'forest',
  Resolved: 'neutral',
}

const STATUS_LABELS = {
  Reported: 'Reported',
  Accepted: 'Accepted',
  'En Route': 'En route',
  'On Scene': 'On scene',
  Rescued: 'Rescued',
  'In Care': 'In care',
  Resolved: 'Resolved',
}

export function StatusBadge({ status }) {
  if (!RESCUE_STATUSES.includes(status)) return null
  return <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
}

const SEVERITY_TONES = {
  Critical: 'coral',
  High: 'amber',
  Normal: 'teal',
}

export function PriorityBadge({ severity }) {
  if (!SEVERITY_LEVELS.includes(severity)) return null
  return <Badge tone={SEVERITY_TONES[severity]}>{severity} priority</Badge>
}
