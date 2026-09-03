import { Plus, Trash2 } from 'lucide-react'
import { SegmentedControl } from '@/components/ai/segmented-control'
import { StringListEditor } from '@/components/ai/string-list-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EVIDENCE_SEVERITY_LABELS, EVIDENCE_TYPE_LABELS, FINDING_STATUS_LABELS, type EvidenceSeverity, type EvidenceType, type FindingStatus } from '@/data/models'

export interface RecordFieldSpec<T> {
  key: keyof T & string
  label: string
  kind:
    | 'text'
    | 'textarea'
    | 'confidence'
    | 'evidenceType'
    | 'number'
    | 'stringList'
    | 'priority'
    | 'priorityLevel'
    | 'severity'
    | 'findingStatus'
}

interface RecordListEditorProps<T extends Record<string, unknown>> {
  value: T[]
  onChange: (next: T[]) => void
  fields: RecordFieldSpec<T>[]
  itemLabel: string
  /** A fresh value for a new item — pass a factory (`() => ({...})`) whenever items need unique ids. */
  emptyItem: T | (() => T)
}

const CONFIDENCE_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

const EVIDENCE_TYPE_OPTIONS = (Object.keys(EVIDENCE_TYPE_LABELS) as EvidenceType[]).map((type) => ({
  value: type,
  label: EVIDENCE_TYPE_LABELS[type],
}))

const PRIORITY_OPTIONS = [
  { value: 'must', label: 'Must have' },
  { value: 'should', label: 'Should have' },
  { value: 'could', label: 'Could have' },
] as const

/** High/medium/low priority scale — distinct from PRIORITY_OPTIONS above (Solution's must/should/could requirement scale). Used by Validate's prioritised issues and findings. */
const PRIORITY_LEVEL_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
] as const

const SEVERITY_OPTIONS = (Object.keys(EVIDENCE_SEVERITY_LABELS) as EvidenceSeverity[]).map((value) => ({
  value,
  label: EVIDENCE_SEVERITY_LABELS[value],
}))

const FINDING_STATUS_OPTIONS = (Object.keys(FINDING_STATUS_LABELS) as FindingStatus[]).map((value) => ({
  value,
  label: FINDING_STATUS_LABELS[value],
}))

export function RecordListEditor<T extends Record<string, unknown>>({
  value,
  onChange,
  fields,
  itemLabel,
  emptyItem,
}: RecordListEditorProps<T>) {
  function updateField(index: number, key: keyof T, fieldValue: unknown) {
    onChange(value.map((item, i) => (i === index ? { ...item, [key]: fieldValue } : item)))
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...value, typeof emptyItem === 'function' ? (emptyItem as () => T)() : emptyItem])
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((item, index) => (
        <div key={index} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {itemLabel} {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
              onClick={() => removeAt(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field) => {
              const fieldId = `${itemLabel}-${index}-${field.key}`
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={fieldId}>{field.label}</Label>
                  {field.kind === 'text' && (
                    <Input
                      id={fieldId}
                      value={String(item[field.key] ?? '')}
                      onChange={(e) => updateField(index, field.key, e.target.value)}
                    />
                  )}
                  {field.kind === 'textarea' && (
                    <Textarea
                      id={fieldId}
                      rows={2}
                      value={String(item[field.key] ?? '')}
                      onChange={(e) => updateField(index, field.key, e.target.value)}
                    />
                  )}
                  {field.kind === 'number' && (
                    <Input
                      id={fieldId}
                      type="number"
                      min={1}
                      max={10}
                      value={String(item[field.key] ?? '')}
                      onChange={(e) => updateField(index, field.key, Number(e.target.value))}
                    />
                  )}
                  {field.kind === 'confidence' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'medium')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={[...CONFIDENCE_OPTIONS]}
                    />
                  )}
                  {field.kind === 'evidenceType' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'inference')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={EVIDENCE_TYPE_OPTIONS}
                    />
                  )}
                  {field.kind === 'priority' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'should')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={[...PRIORITY_OPTIONS]}
                    />
                  )}
                  {field.kind === 'priorityLevel' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'medium')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={[...PRIORITY_LEVEL_OPTIONS]}
                    />
                  )}
                  {field.kind === 'severity' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'medium')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={SEVERITY_OPTIONS}
                    />
                  )}
                  {field.kind === 'findingStatus' && (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(item[field.key] ?? 'draft')}
                      onChange={(v) => updateField(index, field.key, v)}
                      options={FINDING_STATUS_OPTIONS}
                    />
                  )}
                  {field.kind === 'stringList' && (
                    <StringListEditor
                      value={(item[field.key] as string[] | undefined) ?? []}
                      onChange={(v) => updateField(index, field.key, v)}
                      itemLabel={field.label.toLowerCase()}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" className="self-start" onClick={addItem}>
        <Plus className="size-3.5" />
        Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  )
}
