/**
 * Shows the model's reasoning as it streams in, token by token, while a
 * deliverable or readiness check is generating. The structured result
 * itself only ever arrives once, at the end — this is what makes
 * generation visibly happen in real time instead of just sitting on a
 * spinner until a block of content suddenly appears.
 */
export function ReasoningStream({ text }: { text: string }) {
  return (
    <div className="max-h-48 overflow-y-auto rounded-lg border border-dashed border-border-strong p-4">
      <p className="text-sm italic leading-relaxed text-muted-foreground">
        {text || 'Thinking…'}
        <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-muted-foreground/50 align-text-bottom" />
      </p>
    </div>
  )
}
