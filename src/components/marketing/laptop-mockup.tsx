export function LaptopMockup({
  src,
  alt,
  width,
  height,
}: {
  src: string
  alt: string
  width: number
  height: number
}) {
  return (
    <div className="mx-auto mt-16 max-w-4xl select-none">
      <div className="relative z-10 rounded-t-[20px] bg-zinc-950 p-3 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.15),0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/10 sm:p-4">
        <span
          aria-hidden
          className="absolute left-1/2 top-1.5 z-10 size-1.5 -translate-x-1/2 rounded-full bg-zinc-800 ring-1 ring-black/60 sm:top-2"
        />
        <div className="relative overflow-hidden rounded-[6px] bg-black">
          <img src={src} alt={alt} width={width} height={height} className="block w-full" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent"
          />
        </div>
      </div>

      {/* Hinge seam, then a keyboard deck that flares out well past the screen's
          width — the width step is what reads as "laptop base" rather than a
          tablet's bottom bezel, so it needs to be a lot more than a sliver. */}
      <div aria-hidden className="h-[3px] bg-zinc-800 sm:h-1" />
      <div className="relative mx-[-28px] sm:mx-[-42px]">
        <div className="h-4 rounded-b-xl bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.3)] sm:h-6" />
        <span
          aria-hidden
          className="absolute bottom-0 left-1/2 h-1.5 w-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-zinc-400/80 ring-1 ring-black/10 sm:h-2 sm:w-20"
        />
      </div>

      <div aria-hidden className="mx-auto mt-4 h-3 w-[70%] rounded-[50%] bg-black/10 blur-md sm:h-5" />
    </div>
  )
}
