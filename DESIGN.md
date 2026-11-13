---
name: Solvr
description: "Think through. Design better. A flat, warm workspace for guided product and UX design. White paper on a pale butter desk, butter hairlines and one amber accent, built on the SiteNest \"Butter\" tokens."
colors:
  accent: "#e8b923"
  accent-hover: "#d4a615"
  accent-text: "#826400"
  accent-tint: "#faf4df"
  on-accent: "#353335"
  background: "#ffffff"
  desk: "#fcfaf3"
  sand: "#f8f4e4"
  ink: "#4d4a4d"
  ink-strong: "#353335"
  ink-muted: "#6b6b6b"
  hairline: "#ece5cc"
  hairline-strong: "#dccfa6"
  control-border: "#8a7f6e"
  success: "#146c43"
  success-soft: "#e6f4ec"
  warning: "#8a5a00"
  warning-soft: "#fdf3e0"
  info: "#1f5f9e"
  info-soft: "#ebf3fb"
  destructive: "#b3261e"
  destructive-soft: "#fdeceb"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "4.5rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  control: "8px"
  input: "8px"
  panel: "12px"
  menu: "12px"
  card: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "80px"
  container-max: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.pill}"
  input-control:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "40px"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  badge-soft:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  nav-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    height: "56px"
    padding: "0 24px"
  band-desk:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.ink}"
    padding: "80px 24px"
---

# Design System: Solvr

## Overview

**Creative North Star: "White Paper on a Butter Desk"**

Solvr uses the SiteNest "Butter" design system. Desk (`desk`, #fcfaf3) is the chrome: the project sidebar and guidance rail, the landing bands, the projects list ground and the About / Privacy / Terms pages. Paper (`background` / `card`, #ffffff) is what people work with: the workspace content area, cards, forms and dialogs. Amber (`accent`, #e8b923) is a fill that marks what is actionable or selected: the primary button, the logo mark, progress fills. Amber is never text; text that carries it is ochre (`accent-text`, #826400). Newsreader carries h1 and h2; DM Sans carries everything else.

Two surfaces share one system. The **website** persuades: desk and white bands alternate, the hero headline carries one ochre phrase, and a MacBook-framed capture of the app shows the product. The **app** operates: a desk sidebar of stages beside a white working area, with a guidance rail on the right. Both stay calm and scannable because the work is long-form thinking, not dashboards.

**Key Characteristics:**

- **One amber voice.** Fill, not text. Text on amber is charcoal (`on-accent`), never white.
- **Newsreader for h1/h2, DM Sans for everything else.** An unlayered rule in `src/index.css` forces h1/h2/`.font-display` to Newsreader 500 at -0.02em, so per-page `font-bold` classes cannot change them. h3/h4, labels and buttons are DM Sans 600. The `bold` and `extrabold` weights both resolve to 600.
- **Paper and desk.** White is paper; pale butter is the desk; `sand` is the stronger wash for hover and secondary tints.
- **Flat pages.** Depth comes from ground and a 1px hairline. Shadows (`shadow-md`, `shadow-lg`) are for what leaves the page plane: dialogs, drawers, the hover lift on clickable cards, and the device mockup. `shadow-xs` and `shadow-sm` are defined as none so stray uses stay flat. No gradients, no glow (the readiness score ring is the one conic gradient, because it is data).
- **Shape.** Buttons, chips, nav items, close buttons and menu items are full pills. Inputs and textareas are 8px. Inner panels and menus are 12px. Cards, dialogs and landing cards are 20px (`rounded-2xl`).
- **Selection is butter, not grey.** Selected nav items, segments and chosen concepts use `accent-tint` with `accent-text`. Hover uses `sand`.
- **Light or dark, nothing else.** Light is the default; there is no system option. A pill sun/moon toggle sits in the landing nav and the app header. The choice lives on `<html class="dark">` and in `localStorage` (`solvr-theme`), applied by an inline script in `index.html` before first paint. Dark is a warm charcoal ramp (`#141312` ground, `#1c1b19` cards), never neutral grey.
- **Honest about what is simulated.** Landing captures are labelled "Sample project — fictional data" and show the bundled fictional sample project.
- **Motion explains state.** A 180ms opacity-only page fade (never a transform on a page-level wrapper, which would trap fixed drawers), a 2% press scale on buttons, and a 2px lift on clickable cards. Reduced motion drops all travel.

## Colors

### Accent

- **Butter Amber** (`--color-primary`, #e8b923): primary button, logo mark, active-tab underline, progress fills.
- **Amber Hover** (`--color-primary-hover`, #d4a615; dark #f0c94a).
- **Ochre** (`--color-primary-text` and `--color-ring`, #826400; dark #f0c94a): accent-coloured text, links, eyebrows, the focus ring and active nav text. The only accent allowed as text.
- **Amber Tint** (`--color-accent`, #faf4df; dark #2a2410) with `--color-accent-foreground` (#826400): selected items, soft badges, icon tiles.

### Neutral

- **Desk** (`--color-surface`, #fcfaf3; dark #181716).
- **Sand** (`--color-secondary` and `--color-muted`, #f8f4e4; dark #262420).
- **Paper** (`--color-background` / `--color-card`, #ffffff; dark #141312 / #1c1b19).
- **Ink** (`--color-ink`, #4d4a4d; dark #e6e2da): body text, set on `body`. **Ink Strong** (`--color-foreground`, #353335; dark #faf8f2): headings and button labels. **Ink Muted** (`--color-muted-foreground`, #6b6b6b; dark #a8a399).
- **Hairline** (`--color-border`, #ece5cc; dark #2e2b26). **Hairline Strong** (`--color-border-strong`, #dccfa6; dark #433e35): menus, outline buttons, dashed zones.
- **Control Border** (`--color-input`, #8a7f6e; dark #7d7569): field outlines, so boundaries meet 3:1.

### Semantic

`success`, `warning`, `info`, `destructive` and their `-soft` grounds are tokens, with dark-mode values chosen for Solvr (the Butter spec defines light only). Destructive buttons are an outline with red text, never solid red.

### Named Rules

**The One Voice Rule.** Amber is the only accent, and it is a fill. Anything that needs amber as text uses `primary-text`.

**The Token Only Rule.** No literal brand hex or `bg-white` in components; use `primary`, `surface`, `card`, `muted` so dark mode holds. The two exceptions are the CSS-built device mockup and the standalone print stylesheet, which is always white paper.

## Typography

**Display font:** Newsreader (500 only), Georgia fallback. **Body font:** DM Sans (400, 500, 600). **Mono:** Geist Mono is declared but unused so far.

### Hierarchy

- **Display** (Newsreader 500, 3rem on mobile, 4.5rem from `sm`, line-height 1): the landing hero headline, with one `primary-text` phrase.
- **Headline** (Newsreader 500, 1.875rem to 2.25rem): landing section titles. App page titles are Newsreader 500 at `text-2xl`; the projects page title is `text-3xl`.
- **Title** (DM Sans 600, 1rem): card, dialog and feature titles (h3).
- **Body** (DM Sans 400, 0.875rem): app copy and form text. Landing lead paragraphs are 1.125rem in `muted-foreground`. Inputs are `text-base` so mobile never zooms.
- **Label** (DM Sans 600, 0.75rem): badges, meta, eyebrows (uppercase, tracked, in `primary-text`).

### Named Rules

**The One Heading Rule.** Every h1 and h2 looks the same wherever it appears: Newsreader, weight 500. Do not add `font-bold` to a heading; it is overridden.

**The Tabular Numbers Rule.** Scores, percentages and stage numbers get `tabular-nums`.

## Layout

**Website.** Content caps at 1152px (`max-w-6xl`, padding included) with 80px (`py-20`) vertical rhythm. Sections alternate desk and white: hero (desk), design process (white), features (desk), how it works (white), FAQ (desk), final call to action (white). The final call to action is not an amber band. The nav is a 56px translucent white sticky bar with pill links, the theme toggle and one primary button; section anchors become `/#section` when the visitor is on another page. The footer is white with a hairline top border: logo left, copyright centred, About / Privacy / Terms / GitHub right, stacking on mobile.

**Content pages.** About, Privacy and Terms are routes (`/about`, `/privacy`, `/terms`), not popups. Each has the site nav and footer, a Newsreader h1, and a single 20px card on the desk ground, capped at `max-w-3xl`.

**App.** A 56px white top bar (logo, project switcher, save state, readiness bar, theme toggle, project menu) over a three-column workspace: a 240px desk stage sidebar, a fluid white content area with a sticky stage-journey ribbon, and a 320px desk guidance rail from `xl`. Below `lg` the sidebar becomes a left drawer and the guidance rail a right drawer. The projects list is a desk ground with a grid of 20px project cards.

## Elevation & Depth

Flat by default. Surfaces separate by ground and 1px hairline. Clickable project cards lift on hover: the border strengthens to `hairline-strong`, the card rises 2px and gains `shadow-md`; under reduced motion there is no lift. Menus use a `hairline-strong` border and no shadow. Dialogs and drawers use `shadow-lg` over a `bg-black/40` scrim with no blur. The MacBook mockup carries a deep soft shadow because it is a picture of a device.

### Named Rules

**The Quiet Elevation Rule.** Rows, badges, inputs and resting cards have no shadow. Lift belongs to hover on clickable cards, dialogs, drawers and the device mockup.

## Shapes

Pills for every button and chip; 8px for fields; 12px for menus and inner panels (the bordered blocks inside a card); 20px for cards, dialogs and landing cards. Borders are 1px hairline, dashed only for empty or upload zones. The logo mark is Solvr's "S" of two interlocking flow arrows, filled amber.

## Components

### Buttons

- **Shape:** full pill, 44px tall by default (36px `sm`, 52px `lg`, 36px square `icon`), DM Sans 600, 2% press scale.
- **Primary:** amber fill, charcoal text; hover `primary-hover`. One filled primary per view.
- **Secondary:** `sand` fill. **Outline:** card ground, `hairline-strong` border; hover `sand`. **Ghost:** transparent, `sand` hover. **Destructive:** outline with red text; hover `destructive-soft`. **Link:** `primary-text`.
- **Focus:** 2px outline in `ring` (ochre), offset 2px.

### Inputs and textareas

40px tall (textarea min 96px), 8px radius, `card` ground, `control-border` outline, `text-base`. Focus turns the border ochre with a 3px ring at 30% opacity. Invalid fields use a `destructive` border.

### Cards

20px radius, `card` ground, 1px hairline, `p-5` or `p-6`. Clickable project cards stretch the title link over the whole card, carry a menu top right, and lift on hover as described under Elevation.

### Badges

Full pills, at least 20px tall, DM Sans 600. Neutral is `sand` with a hairline; primary is `accent-tint` with `accent-text`; plus success, warning, destructive, info and outline variants.

### Tabs and segmented controls

Underlined tabs use an amber underline with `primary-text` on the active tab. Segmented controls are a pill track on the desk ground with a hairline and 4px padding; the selected segment is an `accent-tint` pill with `accent-text`. No grey fill, no shadow.

### Navigation

Stage sidebar: pill items, hover `sand` with `foreground` text, active `accent-tint` with `accent-text`. Landing nav links are pills with a `sand` hover. The project switcher is a pill-shaped trigger that opens a 12px menu.

### Theme toggle

A 36px pill icon button (moon in light mode, sun in dark) with a `sand` hover, labelled "Toggle light and dark mode". Both icons render and swap with CSS, so there is no flash.

### Dialogs and drawers

Dialogs are 20px with a pill close button. Drawers slide from the edge at up to 480px wide on `sm` and above. Both sit over a `bg-black/40` scrim.

### Device mockup

A CSS-built MacBook holding a 16:10 capture. The light capture shows in light mode and the dark one in dark mode, with the caption "Sample project — fictional data". Captures are 2880x1800 PNGs of the fictional sample project at `public/mockups/workspace-light-v1.png` and `workspace-dark-v1.png`. Retake them whenever the app chrome changes and bump the `-v1` suffix so caches refresh.

## Do's and Don'ts

### Do:

- **Do** use amber as a fill and `primary-text` for accent-coloured text; put charcoal text on amber.
- **Do** use `bg-surface` (desk) for chrome and landing bands, `bg-card` for cards, forms and popovers, and `secondary` for hover.
- **Do** keep every button a pill, every field 8px, every card 20px.
- **Do** make selected states `accent`, hover `secondary`.
- **Do** keep content pages and landing content inside the 1152px container.
- **Do** retake the mockup captures after changing app chrome.

### Don't:

- **Don't** use amber as text, or white text on an amber fill.
- **Don't** add gradients, glow, grey selection washes or amber full-width sections.
- **Don't** put a literal brand hex, `bg-white` or `font-bold` on a heading in components.
- **Don't** add a shadow to rows, badges, inputs or resting cards, or a transform on a page-level wrapper (it traps `position: fixed` drawers).
- **Don't** make destructive buttons solid red.
- **Don't** offer a "system" theme option, or use neutral grey for dark mode.
- **Don't** invent copy or statistics in the screenshots beyond clearly sample data.
