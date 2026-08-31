import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProjectStore } from '@/store/useProjectStore'

interface ProjectMenuProps {
  projectId: string
  projectName: string
  /** Where to send the user after a successful delete. Defaults to the projects list. */
  redirectOnDeleteTo?: string
  /** The bundled sample project — nothing in this menu can be deleted, so it isn't shown. */
  isSample?: boolean
}

export function ProjectMenu({ projectId, projectName, redirectOnDeleteTo = '/app', isSample }: ProjectMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const navigate = useNavigate()

  async function handleDelete() {
    setDeleting(true)
    await deleteProject(projectId)
    setDeleting(false)
    setConfirmOpen(false)
    navigate(redirectOnDeleteTo)
  }

  if (isSample) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Project menu for ${projectName}`}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive-soft focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onClick={(event) => event.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete “{projectName}”?</DialogTitle>
            <DialogDescription>
              This permanently deletes the project and everything in it. This can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
