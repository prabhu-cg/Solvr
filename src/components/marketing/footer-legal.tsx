import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const TRIGGER_CLASS = 'text-sm text-muted-foreground transition-colors hover:text-foreground'

function LegalDialog({
  trigger,
  title,
  description,
  badge,
  children,
}: {
  trigger: string
  title: string
  description?: string
  badge?: ReactNode
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger className={TRIGGER_CLASS}>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4 pr-6">
          <div>
            <DialogTitle className="text-base font-bold text-foreground">{title}</DialogTitle>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {badge}
        </div>
        <div className="flex flex-col gap-5 pt-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/70">{label}</p>
      <p className="mt-1 text-foreground">{children}</p>
    </div>
  )
}

function H({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-bold text-foreground">{children}</h3>
}

export function AboutDialog() {
  return (
    <LegalDialog
      trigger="About"
      title="About Solvr"
      description="Think through. Design better."
      badge={<Badge variant="primary">V1</Badge>}
    >
      <div className="flex flex-col gap-3">
        <H>What it is</H>
        <p>
          Solvr is a free, AI-guided Product/UX design workspace. It walks a rough product problem through five
          stages — Project Setup, Discover, Define, Ideate and Solution — asking the questions a design process
          normally asks, and using AI to help draft, critique and score readiness at every step.
        </p>
        <p>
          It replaces a blank document with guided deliverables — research plans, personas, journey maps, concepts,
          information architecture, and more — each with a readiness score that names what is still missing before
          you move on.
        </p>
        <p>
          There is no account to create. Your projects are stored locally in your browser. When you generate a
          deliverable, the relevant project context is sent to Solvr&rsquo;s own AI endpoint to produce the result —
          never to a third party directly, and never used to train anything.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <H>How it is built</H>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Framework">React 19, TypeScript (strict), Vite</Field>
          <Field label="Styling">Tailwind CSS v4, shadcn-style components on Radix UI primitives</Field>
          <Field label="Icons & Type">Lucide, Manrope</Field>
          <Field label="State">Zustand</Field>
          <Field label="Forms & Validation">React Hook Form with Zod schemas</Field>
          <Field label="Routing">React Router</Field>
          <Field label="Storage">Dexie / IndexedDB, browser-local</Field>
          <Field label="AI">A Vercel serverless function calling Groq via the AI SDK</Field>
        </div>
      </div>
    </LegalDialog>
  )
}

export function PrivacyDialog() {
  return (
    <LegalDialog trigger="Privacy" title="Privacy Policy" description="Last updated 31 August 2026">
      <div className="flex flex-col gap-2">
        <H>The short version</H>
        <p>
          Solvr does not require an account, does not use cookies or analytics, and does not sell or share your
          data. Your projects are stored locally in your browser. The only data that leaves your device is what is
          needed to generate a deliverable you asked for.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>What we collect</H>
        <p>
          Nothing about you personally. There is no account, no email address, no tracking pixel and no analytics
          package running on this site or in the app.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>Where your data lives</H>
        <p>
          Projects, stages and deliverables are stored in your browser&rsquo;s IndexedDB, on the device you are
          using. Nothing is synced to a server or readable by Solvr outside your own browser. You can delete a
          project at any time from the dashboard, or clear your browser&rsquo;s site data to remove everything.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>What we send for AI generation</H>
        <p>
          When you generate a deliverable, Solvr sends the relevant trimmed project context — your project brief
          and the accepted outputs relevant to that step — to Solvr&rsquo;s own server function, which forwards it
          to our AI provider (Groq) to produce the result. That request is not stored by Solvr once the response is
          returned, and is never used to identify you.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>Cookies and tracking</H>
        <p>Solvr sets no cookies and runs no analytics, advertising or session-recording scripts on this site or in the app.</p>
      </div>

      <div className="flex flex-col gap-2">
        <H>Hosting</H>
        <p>
          This site and the app are hosted by Vercel Inc. Like any web host, Vercel processes standard technical
          request information (IP address, user agent, timestamp) to deliver the files and keep the service secure.
          That is server infrastructure logging, not data Solvr collects about you.
        </p>
      </div>
    </LegalDialog>
  )
}

export function TermsDialog() {
  return (
    <LegalDialog trigger="Terms" title="Terms and Conditions" description="Last updated 31 August 2026">
      <div className="flex flex-col gap-2">
        <H>1. Acceptance</H>
        <p>By using Solvr you agree to these terms. If you do not agree with them, please do not use it.</p>
      </div>

      <div className="flex flex-col gap-2">
        <H>2. The service</H>
        <p>
          Solvr is a free, AI-guided design workspace. It requires no account. Your project data is stored in your
          own browser; only the trimmed context needed for a specific AI generation request leaves your device, and
          only to Solvr&rsquo;s own AI endpoint.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>3. Your content is yours</H>
        <p>
          You retain all rights to everything you write and generate in Solvr. We claim no licence over it. You are
          responsible for ensuring you have the right to enter any client or third-party information you use.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>4. AI-generated content</H>
        <p>
          Deliverables generated by Solvr are a starting point, not a guarantee. AI-assisted scores, readiness
          checks and recommendations are exactly that — assisted, not objective measurements — and should be
          reviewed by a person before you rely on them.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <H>5. Data loss</H>
        <p className="font-semibold text-foreground">
          This is the most important clause. Your projects exist only in the browser storage of the device you
          created them on.
        </p>
        <ul className="list-disc pl-5">
          <li>Clearing your browser data, using private browsing, or a browser evicting storage under pressure will delete your projects permanently.</li>
          <li>There is no backup, no server-side copy and no recovery process.</li>
          <li>Projects do not sync between devices or browsers.</li>
          <li>You are solely responsible for retaining anything you cannot afford to lose — print or export it.</li>
        </ul>
        <p>We accept no liability for lost, corrupted or inaccessible project data under any circumstances.</p>
      </div>

      <div className="flex flex-col gap-2">
        <H>6. Provided as is</H>
        <p>
          Solvr is provided free of charge, as is, without warranty of any kind. We do not guarantee uptime,
          accuracy of AI-generated content, or fitness for any particular purpose.
        </p>
      </div>
    </LegalDialog>
  )
}
