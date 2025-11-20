import { useMemo } from 'react'

export default function Header({ title }) {
  const subtitle = useMemo(() => (
    'A friendly, side‑by‑side look at Eastern Orthodox and Oriental Orthodox teaching'
  ), [])

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="w-[1200px] h-[1200px] rounded-full bg-blue-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2 absolute left-0 top-0" />
        <div className="w-[900px] h-[900px] rounded-full bg-indigo-500/20 blur-3xl translate-x-1/3 translate-y-1/3 absolute right-0 bottom-0" />
      </div>
      <div className="relative text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-4 text-blue-200/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </header>
  )
}
