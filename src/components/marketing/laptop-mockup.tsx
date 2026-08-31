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

      <div className="relative mx-[-10px] sm:mx-[-14px]">
        <div
          aria-hidden
          className="absolute inset-x-2.5 top-0 h-px bg-black/20 sm:inset-x-3.5"
        />
        <div className="h-[10px] rounded-b-2xl bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-300 sm:h-[14px]" />
      </div>

      <div aria-hidden className="mx-auto mt-3 h-3 w-[80%] rounded-[50%] bg-black/10 blur-md sm:h-4" />
    </div>
  )
}
