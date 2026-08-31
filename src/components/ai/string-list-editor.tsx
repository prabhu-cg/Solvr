import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface StringListEditorProps {
  value: string[]
  onChange: (next: string[]) => void
  addLabel?: string
  itemLabel?: string
}

export function StringListEditor({ value, onChange, addLabel = 'Add', itemLabel = 'item' }: StringListEditorProps) {
  function updateAt(index: number, text: string) {
    onChange(value.map((item, i) => (i === index ? text : item)))
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            value={item}
            onChange={(e) => updateAt(index, e.target.value)}
            rows={2}
            aria-label={`${itemLabel} ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${itemLabel} ${index + 1}`}
            onClick={() => removeAt(index)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => onChange([...value, ''])}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  )
}
