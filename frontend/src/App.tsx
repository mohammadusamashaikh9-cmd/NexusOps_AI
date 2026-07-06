export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-blue-400">NexusOps AI</h1>
          <p className="text-xl text-slate-400">Enterprise AI Operations Platform</p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
              <h2 className="text-xl font-semibold text-purple-400 mb-2">Planner</h2>
              <p className="text-sm text-slate-400">Breaks down tasks and creates execution workflows.</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-400 mb-2">Research</h2>
              <p className="text-sm text-slate-400">Gathers context, documentation, and system states.</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
              <h2 className="text-xl font-semibold text-amber-400 mb-2">Executor</h2>
              <p className="text-sm text-slate-400">Interacts with external systems to perform actions.</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
              <h2 className="text-xl font-semibold text-rose-400 mb-2">Reviewer</h2>
              <p className="text-sm text-slate-400">Validates execution output against safety constraints.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
