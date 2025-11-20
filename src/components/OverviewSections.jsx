import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <section className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold text-white mb-3">{title}</h3>
      <div className="text-slate-200/90 text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function OverviewSections() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="space-y-6">
      <Section title="Who we’re talking about">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-white">Eastern Orthodox:</span> {data.audiences.eastern_orthodox.join(', ')}
          </li>
          <li>
            <span className="font-medium text-white">Oriental Orthodox:</span> {data.audiences.oriental_orthodox.join(', ')}
          </li>
        </ul>
      </Section>

      <Section title="Shared core faith">
        <ul className="list-disc pl-6 space-y-2">
          {data.shared_core.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="How the split happened">
        <div className="space-y-2">
          <p>
            In the {data.split_history.century}th century, differing receptions of Chalcedon (AD 451)
            led to a break. The core issue: {data.split_history.core_issue}
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-medium text-white">Eastern Orthodox:</span> {data.split_history.eo_position}
            </li>
            <li>
              <span className="font-medium text-white">Oriental Orthodox:</span> {data.split_history.oo_position}
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Councils recognized">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-white">Eastern Orthodox:</span> {data.councils_recognized.eastern_orthodox}
          </li>
          <li>
            <span className="font-medium text-white">Oriental Orthodox:</span> {data.councils_recognized.oriental_orthodox}
          </li>
        </ul>
      </Section>

      <Section title="Where they differ most">
        <div className="grid md:grid-cols-2 gap-4">
          {data.differences.map((d, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">{d.topic}</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-sky-300 font-medium">EO:</span> {d.eo}</p>
                <p><span className="text-rose-300 font-medium">OO:</span> {d.oo}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Important convergences from modern dialogue">
        <ul className="list-disc pl-6 space-y-1">
          {data.dialogue.convergences.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="What still blocks full communion">
        <ul className="list-disc pl-6 space-y-1">
          {data.dialogue.remaining_obstacles.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title="Practical inter‑church relations today">
        <ul className="list-disc pl-6 space-y-1">
          {data.today.mutual_recognition.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
        <p className="mt-2">{data.today.communion}</p>
      </Section>

      <Section title="Key moments timeline">
        <ol className="list-decimal pl-6 space-y-1">
          {data.timeline.map((t, i) => (
            <li key={i}><span className="font-medium text-white">{t.year}:</span> {t.event}</li>
          ))}
        </ol>
      </Section>

      <Section title="Glossary">
        <div className="grid md:grid-cols-2 gap-4">
          {data.glossary.map((g, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <div className="font-semibold text-white">{g.term}</div>
              <div className="text-slate-200/90 text-sm">{g.definition}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Key takeaways">
        <ul className="list-disc pl-6 space-y-1">
          {data.takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
