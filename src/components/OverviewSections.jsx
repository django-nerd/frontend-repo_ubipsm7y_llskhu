import { useEffect, useMemo, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children, hidden }) {
  if (hidden) return null
  return (
    <section className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold text-white mb-3 print:mb-2">{title}</h3>
      <div className="text-slate-200/90 text-sm md:text-base leading-relaxed print:text-black">
        {children}
      </div>
    </section>
  )
}

function Highlight({ text, query }) {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'ig'))
  return parts.map((part, i) => (
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-300 text-black px-0.5 rounded">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  ))
}

export default function OverviewSections() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/overview`)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const match = (value) => !normalizedQuery || String(value).toLowerCase().includes(normalizedQuery)

  if (loading) {
    return (
      <div className="text-blue-200 animate-pulse">Loading overview…</div>
    )
  }

  if (error) {
    return (
      <div className="text-red-300">Error loading content: {error}</div>
    )
  }

  if (!data) return null

  const toolbar = (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 md:p-4 print:hidden">
      <div className="flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms (e.g., Chalcedon, miaphysite, councils)"
          className="w-full bg-slate-900/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100 placeholder-slate-400 rounded-md px-3 py-2"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setQuery('')}
          className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100"
        >
          Clear
        </button>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white"
        >
          Export to PDF
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {toolbar}

      <Section title="Who we’re talking about" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-white">Eastern Orthodox:</span> {data.audiences.eastern_orthodox.map((t, i) => (
              <span key={i}><Highlight text={t} query={normalizedQuery} />{i < data.audiences.eastern_orthodox.length - 1 ? ', ' : ''}</span>
            ))}
          </li>
          <li>
            <span className="font-medium text-white">Oriental Orthodox:</span> {data.audiences.oriental_orthodox.map((t, i) => (
              <span key={i}><Highlight text={t} query={normalizedQuery} />{i < data.audiences.oriental_orthodox.length - 1 ? ', ' : ''}</span>
            ))}
          </li>
        </ul>
      </Section>

      <Section title="Shared core faith" hidden={false}>
        <ul className="list-disc pl-6 space-y-2">
          {data.shared_core.filter(item => match(item)).map((item, idx) => (
            <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="How the split happened" hidden={false}>
        <div className="space-y-2">
          <p>
            In the {data.split_history.century}th century, differing receptions of Chalcedon (AD 451)
            led to a break. The core issue: <Highlight text={data.split_history.core_issue} query={normalizedQuery} />
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-medium text-white">Eastern Orthodox:</span> <Highlight text={data.split_history.eo_position} query={normalizedQuery} />
            </li>
            <li>
              <span className="font-medium text-white">Oriental Orthodox:</span> <Highlight text={data.split_history.oo_position} query={normalizedQuery} />
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Councils recognized" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-white">Eastern Orthodox:</span> <Highlight text={data.councils_recognized.eastern_orthodox} query={normalizedQuery} />
          </li>
          <li>
            <span className="font-medium text-white">Oriental Orthodox:</span> <Highlight text={data.councils_recognized.oriental_orthodox} query={normalizedQuery} />
          </li>
        </ul>
      </Section>

      <Section title="Where they differ most" hidden={false}>
        <div className="grid md:grid-cols-2 gap-4">
          {data.differences.filter(d => match(d.topic) || match(d.eo) || match(d.oo)).map((d, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2"><Highlight text={d.topic} query={normalizedQuery} /></h4>
              <div className="text-sm space-y-1">
                <p><span className="text-sky-300 font-medium">EO:</span> <Highlight text={d.eo} query={normalizedQuery} /></p>
                <p><span className="text-rose-300 font-medium">OO:</span> <Highlight text={d.oo} query={normalizedQuery} /></p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Important convergences from modern dialogue" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          {data.dialogue.convergences.filter(item => match(item)).map((c, i) => (
            <li key={i}><Highlight text={c} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="What still blocks full communion" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          {data.dialogue.remaining_obstacles.filter(item => match(item)).map((o, i) => (
            <li key={i}><Highlight text={o} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="Practical inter‑church relations today" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          {data.today.mutual_recognition.filter(item => match(item)).map((o, i) => (
            <li key={i}><Highlight text={o} query={normalizedQuery} /></li>
          ))}
        </ul>
        <p className="mt-2"><Highlight text={data.today.communion} query={normalizedQuery} /></p>
      </Section>

      <Section title="Key moments timeline" hidden={false}>
        <ol className="list-decimal pl-6 space-y-1">
          {data.timeline.filter(t => match(t.event) || match(t.year)).map((t, i) => (
            <li key={i}><span className="font-medium text-white">{t.year}:</span> <Highlight text={t.event} query={normalizedQuery} /></li>
          ))}
        </ol>
      </Section>

      <Section title="Glossary" hidden={false}>
        <div className="grid md:grid-cols-2 gap-4">
          {data.glossary.filter(g => match(g.term) || match(g.definition)).map((g, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <div className="font-semibold text-white"><Highlight text={g.term} query={normalizedQuery} /></div>
              <div className="text-slate-200/90 text-sm"><Highlight text={g.definition} query={normalizedQuery} /></div>
            </div>
          ))}
        </div>
      </Section>

      {/* Expanded sections */}
      <Section title="How salvation is understood (Soteriology)" hidden={false}>
        <div className="space-y-2">
          <div>
            <div className="font-semibold text-white mb-1">Shared</div>
            <ul className="list-disc pl-6 space-y-1">
              {data.soteriology.shared.filter(item => match(item)).map((item, idx) => (
                <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-1">Nuances</div>
            <ul className="list-disc pl-6 space-y-1">
              {data.soteriology.nuances.filter(item => match(item)).map((item, idx) => (
                <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Sacraments in more detail" hidden={false}>
        <p className="mb-2"><span className="font-semibold text-white">Number celebrated:</span> {data.sacraments_detail.number}</p>
        <ul className="list-disc pl-6 space-y-1">
          {data.sacraments_detail.notes.filter(item => match(item)).map((item, idx) => (
            <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="Spirituality and piety" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          {data.spirituality.filter(item => match(item)).map((item, idx) => (
            <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="Church life and structures (Ecclesiology)" hidden={false}>
        <ul className="list-disc pl-6 space-y-1">
          {data.ecclesiology.filter(item => match(item)).map((item, idx) => (
            <li key={idx}><Highlight text={item} query={normalizedQuery} /></li>
          ))}
        </ul>
      </Section>

      <Section title="Sources and further reading" hidden={false}>
        <ul className="space-y-3">
          {data.sources.filter(s => match(s.title) || match(s.note) || match(s.type) || match(s.link)).map((s, i) => (
            <li key={i} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-white font-semibold"><Highlight text={s.title} query={normalizedQuery} /></div>
                  <div className="text-xs text-slate-300/80">{s.type}</div>
                </div>
                <a href={s.link} target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200 underline break-all">{s.link}</a>
              </div>
              {s.note && (
                <p className="mt-2 text-sm text-slate-200/90"><Highlight text={s.note} query={normalizedQuery} /></p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <div className="print:hidden">
        {toolbar}
      </div>
    </div>
  )
}
