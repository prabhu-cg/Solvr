# Product: Solvr

**Tagline:** Think through. Design better.

Solvr is a free, AI-guided product and UX design workspace. It walks a rough product problem through a structured design process, asking the questions a design process normally asks and using AI to draft, critique and score readiness at every step.

## Who it is for

- Product managers, founders and engineers who have a problem but not a design process.
- Designers who want a structured second opinion and faster first drafts.
- Anyone who needs to get from "we think users struggle with X" to a defensible, specified solution.

No UX knowledge is required. Solvr guides the process instead of expecting you to know the methodology. It does not replace a designer; it makes the thinking explicit so a designer (or anyone) can work from it.

## The problem

Most product problems do not fail from lack of effort. They fail from skipping the thinking a proper design process would have forced: evidence, assumptions, a sharp opportunity, alternatives, a specified solution and a plan to test it. Solvr replaces a blank document with guided deliverables and says plainly what is still missing before you move on.

## The process

Seven stages, in order. Visiting a later stage advances the project's "current stage"; it never regresses.

| Stage | Purpose |
| --- | --- |
| Project Setup | Capture the problem, the product, who it affects, the business goal, constraints and any evidence. The foundation everything else builds on. |
| Discover | Understand the problem space: bring in evidence, surface assumptions and gaps. |
| Define | Turn what was discovered into a sharp, agreed opportunity worth solving. |
| Ideate | Explore and compare multiple solution concepts, then select one. |
| Solution | Develop the chosen concept into a practical, structured product and UX specification (for example information architecture and user flows). |
| Validate | Plan how to test, bring back evidence from real testing, and turn it into findings. |
| Iterate | Turn accepted findings into an impact analysis and concrete proposed updates, reviewed side by side with what exists today. |

## Principles

- **Evidence-aware.** Evidence, assumptions, inferences and recommendations are kept separate and labelled.
- **Readiness, not completion.** Each stage has a readiness score that names strengths, gaps and critical assumptions. The overall project readiness is a weighted combination of setup and stage scores.
- **Explore before deciding.** Multiple concepts are generated and compared before one is chosen.
- **Human in the loop.** AI output is a draft. Findings and proposals are reviewed one by one and never auto-accepted. Editing an earlier stage marks later generated deliverables as possibly stale.
- **Honest about AI.** Generated scores and recommendations are assisted, not objective measurements, and should be reviewed by a person.

## Features

- Guided deliverables at every stage, each editable, with generation states (idle, generating, ready, failed) and a streamed reasoning view.
- Per-stage readiness check and overall readiness shown in the header.
- Project switcher in the app header, plus a projects list with readiness per project.
- A bundled **sample project** (a fictional council parking-permit application) so people can see a worked example. It is clearly labelled fictional and re-seeds itself from source on every read, so a stale copy can never get stuck.
- Export and a print view of a whole project.
- Light and dark themes.

## Data and privacy

- No account, no cookies, no analytics, no tracking.
- Projects live in the browser's IndexedDB (via Dexie) on the device where they were created. There is no backup, no sync and no recovery: clearing site data or using private browsing deletes them. The Terms state this plainly.
- For AI generation only, the trimmed project context needed for that step is sent to Solvr's own serverless endpoint (`api/ai.ts` on Vercel), which calls Groq through the Vercel AI SDK. It is not stored by Solvr and not used to identify anyone. The model is chosen server-side in one place; the API key never reaches the client.
- Hosted on Vercel, which logs standard technical request data as any host does.

## Stack (for orientation)

React 19, TypeScript (strict), Vite, Tailwind CSS v4 with shadcn-style components on Radix, Zustand for state, React Hook Form with Zod, React Router, Dexie for storage, and a Vercel function using the AI SDK with Groq. Source: github.com/prabhu-cg/Solvr. Visual language is documented in `DESIGN.md`.

## Site map

- `/` landing page: hero, design process, features, how it works, FAQ, call to action.
- `/about`, `/privacy`, `/terms` content pages.
- `/app` projects list; `/app/projects/:id/{setup,discover,define,ideate,solution,validate,iterate}` the workspace; `/app/projects/:id/print` the print view.

## Voice

Plain, direct and a little wry; never hype. Say what the tool does and what it does not. Prefer concrete verbs (draft, critique, score, name what is missing) over "AI-powered magic". The product name carries no "AI" in it by design.

## Non-goals (V1)

- Accounts, sync, collaboration or cloud storage.
- Replacing user research: Solvr plans and organises validation but real testing happens outside it.
- Visual design or prototyping output; Solvr produces specifications and structured deliverables, not mockups.

## Ownership

An independent project by Prabhu Raja, built with AI in the loop. Contact and portfolio are on the About page.
