/**
 * A CSS-built MacBook holding a 16:10 capture of the app. The light capture shows
 * in light mode and the dark one in dark mode. The captures are of the bundled
 * fictional sample project — the caption says so.
 */
export function LaptopMockup({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  width: number
  height: number
}) {
  return (
    <figure className="mx-auto mt-16 max-w-4xl select-none">
      <div className="relative z-10 rounded-t-[20px] bg-[#2b2927] p-3 shadow-[0_24px_48px_-12px_rgba(53,51,53,0.28),0_40px_80px_-24px_rgba(53,51,53,0.3)] ring-1 ring-[#1c1b19]/20 sm:p-4 dark:bg-[#0d0c0b] dark:ring-white/10">
        <span
          aria-hidden
          className="absolute left-1/2 top-1.5 z-10 size-1.5 -translate-x-1/2 rounded-full bg-[#141312] sm:top-2"
        />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-card">
          <img
            src={lightSrc}
            alt={alt}
            width={width}
            height={height}
            className="block w-full dark:hidden"
          />
          <img
            src={darkSrc}
            alt={alt}
            width={width}
            height={height}
            className="hidden w-full dark:block"
          />
        </div>
      </div>

      {/* Hinge seam, then a keyboard deck that flares out past the screen's width —
          the width step is what reads as "laptop base" rather than a tablet bezel. */}
      <div aria-hidden className="h-[3px] bg-[#1c1b19] sm:h-1 dark:bg-[#0d0c0b]" />
      <div className="relative mx-[-28px] sm:mx-[-42px]">
        <div className="h-4 rounded-b-xl bg-border-strong shadow-[0_8px_12px_-6px_rgba(53,51,53,0.3)] sm:h-6 dark:bg-[#433e35]" />
        <span
          aria-hidden
          className="absolute bottom-0 left-1/2 h-1.5 w-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-border ring-1 ring-black/10 sm:h-2 sm:w-20 dark:bg-[#2e2b26]"
        />
      </div>

      <figcaption className="mt-8 text-center text-xs text-muted-foreground">
        Sample project — fictional data
      </figcaption>
    </figure>
  )
}
