import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectSetupForm } from '@/components/app/project-setup-form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PROJECT_SETUP_DEFAULTS, type ProjectSetupValues } from '@/data/project-setup-schema'
import { useProjectStore } from '@/store/useProjectStore'

const NEW_PROJECT_FORM_ID = 'new-project-form'

interface NewProjectSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewProjectSheet({ open, onOpenChange }: NewProjectSheetProps) {
  const createProject = useProjectStore((state) => state.createProject)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(values: ProjectSetupValues) {
    setSubmitting(true)
    try {
      const project = await createProject(values)
      onOpenChange(false)
      navigate(`/app/projects/${project.id}/setup`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>New project</SheetTitle>
          <SheetDescription>
            Tell Solvr about the problem you’re working on. You can refine any of this later —
            nothing here is final.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <ProjectSetupForm
            mode="create"
            formId={NEW_PROJECT_FORM_ID}
            hideSubmitButton
            defaultValues={PROJECT_SETUP_DEFAULTS}
            submitting={submitting}
            onCreate={handleCreate}
          />
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form={NEW_PROJECT_FORM_ID} disabled={submitting}>
            {submitting ? 'Starting…' : 'Start Design'}
            {!submitting && <ArrowRight />}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
