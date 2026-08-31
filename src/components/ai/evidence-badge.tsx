import { FileCheck, Lightbulb, Sparkles, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EvidenceType } from '@/data/models'
import { EVIDENCE_TYPE_DESCRIPTIONS, EVIDENCE_TYPE_LABELS } from '@/data/models'

const EVIDENCE_TYPE_ICON: Record<EvidenceType, typeof FileCheck> = {
  evidence: FileCheck,
  assumption: TriangleAlert,
  inference: Lightbulb,
  recommendation: Sparkles,
}

const EVIDENCE_TYPE_VARIANT: Record<EvidenceType, 'success' | 'warning' | 'info' | 'primary'> = {
  evidence: 'success',
  assumption: 'warning',
  inference: 'info',
  recommendation: 'primary',
}

/** Always shown next to AI-touched content so it's never mistaken for verified fact — Section 5. */
export function EvidenceBadge({ type }: { type: EvidenceType }) {
  const Icon = EVIDENCE_TYPE_ICON[type]
  return (
    <Badge variant={EVIDENCE_TYPE_VARIANT[type]} title={EVIDENCE_TYPE_DESCRIPTIONS[type]}>
      <Icon className="size-3" aria-hidden />
      {EVIDENCE_TYPE_LABELS[type]}
    </Badge>
  )
}
