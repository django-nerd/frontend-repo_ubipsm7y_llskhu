import Header from './components/Header'
import OverviewSections from './components/OverviewSections'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_10%,rgba(56,189,248,0.15),transparent),radial-gradient(600px_400px_at_80%_90%,rgba(124,58,237,0.12),transparent)]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header title="Eastern Orthodox + Oriental Orthodox Overview" />
        <div className="mt-6">
          <OverviewSections />
        </div>
        <Footer />
        <div className="mt-8 text-center">
          <a href="/test" className="inline-block text-xs text-blue-300/70 hover:text-blue-200 underline">Check backend & database status</a>
        </div>
      </div>
    </div>
  )
}

export default App
