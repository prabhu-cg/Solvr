import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type ProjectSetupValues, projectSetupSchema } from '@/data/project-setup-schema'
import { cn } from '@/lib/utils'

interface FieldSpec {
  name: keyof ProjectSetupValues
  label: string
  helper: string
  placeholder: string
  required: boolean
  multiline: boolean
}

const REQUIRED_FIELDS: FieldSpec[] = [
  {
    name: 'name',
    label: 'Project name',
    helper: 'A short, memorable name for this project.',
    placeholder: 'e.g. Council parking permit renewal',
    required: true,
    multiline: false,
  },
  {
    name: 'problem',
    label: 'Problem',
    helper: 'What problem are you trying to solve?',
    placeholder: 'Describe the problem in your own words…',
    required: true,
    multiline: true,
  },
  {
    name: 'productService',
    label: 'Product / Service',
    helper: 'What product, service or experience are you designing?',
    placeholder: 'e.g. A self-service web app for renewing permits online',
    required: true,
    multiline: true,
  },
  {
    name: 'targetUsers',
    label: 'Target Users',
    helper: 'Who are the people affected by this problem?',
    placeholder: 'Describe who this affects and how…',
    required: true,
    multiline: true,
  },
  {
    name: 'businessGoal',
    label: 'Business Goal',
    helper: 'What does the organisation want to achieve?',
    placeholder: 'Describe the outcome the business is after…',
    required: true,
    multiline: true,
  },
]

const OPTIONAL_FIELDS: FieldSpec[] = [
  {
    name: 'constraints',
    label: 'Constraints',
    helper: 'Technical, regulatory, budget, timeline or organisational constraints.',
    placeholder: 'Optional — note any constraints that will shape the design…',
    required: false,
    multiline: true,
  },
  {
    name: 'evidence',
    label: 'Existing Evidence',
    helper: 'Paste existing research, interview notes, analytics, requirements, observations or stakeholder notes.',
    placeholder: 'Optional — paste anything you already know…',
    required: false,
    multiline: true,
  },
]

interface ProjectSetupFormProps {
  mode: 'create' | 'edit'
  defaultValues: ProjectSetupValues
  submitting?: boolean
  onCreate?: (values: ProjectSetupValues) => void
  onFieldChange?: (values: ProjectSetupValues) => void
  /** HTML id applied to the <form>, so an external button (e.g. a sheet footer) can submit it via `form={formId}`. */
  formId?: string
  /** Hide the built-in submit button — used when the caller renders its own (e.g. a sticky drawer footer). */
  hideSubmitButton?: boolean
  /** The bundled sample project — fields are shown but not editable. */
  readOnly?: boolean
}

export function ProjectSetupForm({
  mode,
  defaultValues,
  submitting,
  onCreate,
  onFieldChange,
  formId,
  hideSubmitButton,
  readOnly,
}: ProjectSetupFormProps) {
  const form = useForm<ProjectSetupValues>({
    resolver: zodResolver(projectSetupSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form

  useEffect(() => {
    if (mode !== 'edit' || !onFieldChange || readOnly) return
    const subscription = watch((values) => {
      onFieldChange(values as ProjectSetupValues)
    })
    return () => subscription.unsubscribe()
  }, [mode, onFieldChange, watch, readOnly])

  function renderField(field: FieldSpec) {
    const error = errors[field.name]
    const Control = field.multiline ? Textarea : Input
    return (
      <div key={field.name} className="flex flex-col gap-1.5">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
        <p id={`${field.name}-helper`} className="text-sm text-muted-foreground">
          {field.helper}
        </p>
        <Control
          id={field.name}
          placeholder={field.placeholder}
          aria-required={field.required}
          aria-invalid={Boolean(error)}
          aria-describedby={`${field.name}-helper${error ? ` ${field.name}-error` : ''}`}
          rows={field.multiline ? 3 : undefined}
          readOnly={readOnly}
          {...register(field.name)}
        />
        {error && (
          <p id={`${field.name}-error`} role="alert" className="text-sm font-medium text-destructive">
            {error.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      id={formId}
      onSubmit={mode === 'create' ? handleSubmit((values) => onCreate?.(values)) : undefined}
      className="flex flex-col gap-8"
      noValidate
    >
      <fieldset className="flex flex-col gap-6">
        <legend className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Required
        </legend>
        {REQUIRED_FIELDS.map(renderField)}
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Optional
        </legend>
        {OPTIONAL_FIELDS.map(renderField)}
      </fieldset>

      {mode === 'create' && !hideSubmitButton && (
        <div className={cn('flex justify-end')}>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Starting…' : 'Start Design'}
            {!submitting && <ArrowRight />}
          </Button>
        </div>
      )}
    </form>
  )
}
