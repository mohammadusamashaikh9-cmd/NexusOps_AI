import { useState } from 'react'

export default function App() {
  const [taskInput, setTaskInput] = useState('')
  const [workflowData, setWorkflowData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRunWorkflow = async () => {
    if (!taskInput.trim()) return;
    setIsLoading(true);
    setError(null);
    setWorkflowData(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/workflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput })
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      setWorkflowData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-blue-400">NexusOps AI</h1>
          <p className="text-xl text-slate-400">Enterprise AI Operations Platform</p>
        </header>

        <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold text-slate-200">New Task</h2>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="E.g., Deploy a new database cluster..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && handleRunWorkflow()}
            />
            <button 
              onClick={handleRunWorkflow}
              disabled={isLoading || !taskInput.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white px-6 py-2 rounded-md font-semibold transition-colors flex-shrink-0"
            >
              {isLoading ? 'Running...' : 'Run Workflow'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </section>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold text-purple-400 mb-2">Planner</h2>
              <p className="text-sm text-slate-400 mb-4 flex-grow">Breaks down tasks and creates execution workflows.</p>
              {workflowData?.planner_output && (
                <div className="bg-slate-900 p-3 rounded text-sm text-slate-300 font-mono mt-auto">
                  <span className="text-green-400">Status: {workflowData.planner_output.status}</span><br />
                  Plan: {JSON.stringify(workflowData.planner_output.plan)}
                </div>
              )}
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold text-emerald-400 mb-2">Research</h2>
              <p className="text-sm text-slate-400 mb-4 flex-grow">Gathers context, documentation, and system states.</p>
              {workflowData?.research_output && (
                <div className="bg-slate-900 p-3 rounded text-sm text-slate-300 font-mono mt-auto">
                  <span className="text-green-400">Status: {workflowData.research_output.status}</span><br />
                  Findings: {workflowData.research_output.findings}
                </div>
              )}
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold text-amber-400 mb-2">Executor</h2>
              <p className="text-sm text-slate-400 mb-4 flex-grow">Interacts with external systems to perform actions.</p>
              {workflowData?.executor_output && (
                <div className="bg-slate-900 p-3 rounded text-sm text-slate-300 font-mono mt-auto">
                  <span className="text-green-400">Status: {workflowData.executor_output.status}</span><br />
                  Result: {workflowData.executor_output.result}
                </div>
              )}
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold text-rose-400 mb-2">Reviewer</h2>
              <p className="text-sm text-slate-400 mb-4 flex-grow">Validates execution output against safety constraints.</p>
              {workflowData?.reviewer_output && (
                <div className="bg-slate-900 p-3 rounded text-sm text-slate-300 font-mono mt-auto">
                  <span className="text-green-400">Status: {workflowData.reviewer_output.status}</span><br />
                  Approved: {workflowData.reviewer_output.approval ? 'Yes' : 'No'}
                </div>
              )}
            </div>
          </div>
        </main>
        
        {workflowData?.final_output && (
          <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Final Result</h2>
            <div className="bg-slate-900 p-4 rounded text-slate-300 font-mono">
              <p className="mb-2">{workflowData.final_output}</p>
              <p className="text-slate-500 text-sm">Mode: {workflowData.mode}</p>
            </div>
          </section>
        )}
        
      </div>
    </div>
  )
}
