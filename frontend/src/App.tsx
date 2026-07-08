import { useMemo, useState, type ReactNode } from 'react'
import {
  LayoutDashboard, GitBranch, ScrollText, Network, Settings, Plus, Play,
  ListChecks, Search, TerminalSquare, ShieldCheck, FileText,
  Activity, Server, Box, Cpu, Bot
} from 'lucide-react'

type AgentStatus = 'idle' | 'running' | 'completed' | 'error'
type ReportTab = 'report' | 'audit'

interface AgentOutput {
  status?: string
  plan?: unknown
  findings?: unknown
  result?: unknown
  approval?: boolean
  [key: string]: unknown
}

interface TraceEvent {
  step: string
  status: string
  message: string
}

interface ReviewerScore {
  clarity?: number
  completeness?: number
  actionability?: number
  risk?: string
  decision?: string
}

interface WorkflowResponse {
  task?: string
  planner_output?: AgentOutput
  research_output?: AgentOutput
  executor_output?: AgentOutput
  reviewer_output?: AgentOutput
  final_output?: string
  mode?: string
  trace?: TraceEvent[]
  reviewer_score?: ReviewerScore
}

interface AgentCardConfig {
  key: keyof Pick<
    WorkflowResponse,
    'planner_output' | 'research_output' | 'executor_output' | 'reviewer_output'
  >
  name: string
  role: string
  icon: IconName
}

type IconName =
  | 'command'
  | 'workflow'
  | 'audit'
  | 'harness'
  | 'settings'
  | 'plus'
  | 'planner'
  | 'research'
  | 'executor'
  | 'reviewer'
  | 'run'
  | 'report'
  | 'model'
  | 'fallback'
  | 'backend'
  | 'container'
  | 'gpu'
  | 'trace'

const logoSrc = '/brand/nexusops-logo.png'

const agentCards: AgentCardConfig[] = [
  {
    key: 'planner_output',
    name: 'Planner',
    role: 'Decomposes the command into executable agent steps.',
    icon: 'planner',
  },
  {
    key: 'research_output',
    name: 'Research',
    role: 'Collects context, documentation, and operational signals.',
    icon: 'research',
  },
  {
    key: 'executor_output',
    name: 'Executor',
    role: 'Performs the planned actions through approved tools.',
    icon: 'executor',
  },
  {
    key: 'reviewer_output',
    name: 'Reviewer',
    role: 'Checks the outcome against safety and policy constraints.',
    icon: 'reviewer',
  },
]

const harnessItems = [
  { label: 'Model Service', value: 'Fireworks / Gemma\nReady', icon: 'model' },
  { label: 'Mock Fallback', value: 'Active', icon: 'fallback' },
  { label: 'Backend', value: 'FastAPI', icon: 'backend' },
  { label: 'Container', value: 'Docker', icon: 'container' },
  { label: 'GPU Target', value: 'AMD ROCm', icon: 'gpu' },
  { label: 'Workflow Trace', value: 'Enabled', icon: 'trace' },
]

function Icon({ name }: { name: IconName }) {
  const props = { className: "lucide-icon" }
  switch (name) {
    case 'command': return <LayoutDashboard {...props} />
    case 'workflow': return <GitBranch {...props} />
    case 'audit': return <ScrollText {...props} />
    case 'harness': return <Network {...props} />
    case 'settings': return <Settings {...props} />
    case 'plus': return <Plus {...props} />
    case 'planner': return <ListChecks {...props} />
    case 'research': return <Search {...props} />
    case 'executor': return <TerminalSquare {...props} />
    case 'reviewer': return <ShieldCheck {...props} />
    case 'run': return <Play {...props} />
    case 'report': return <FileText {...props} />
    case 'model': return <Bot {...props} />
    case 'fallback': return <Activity {...props} />
    case 'backend': return <Server {...props} />
    case 'container': return <Box {...props} />
    case 'gpu': return <Cpu {...props} />
    case 'trace': return <Activity {...props} />
    default: return null
  }
}

function formatValue(value: unknown): ReactNode {
  if (value === undefined || value === null || value === '') return 'Awaiting output'
  if (Array.isArray(value)) {
    return (
      <ul className="output-list">
        {value.map((item, i) => (
          <li key={i}>{String(item)}</li>
        ))}
      </ul>
    )
  }
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    return (
      <div className="output-object">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="object-row">
            <span className="object-key">{k}:</span>
            <span className="object-val">{String(v)}</span>
          </div>
        ))}
      </div>
    )
  }
  return JSON.stringify(value, null, 2)
}

function summarizeOutput(output?: AgentOutput): ReactNode {
  if (!output) return 'No workflow data yet.'
  if ('plan' in output) return formatValue(output.plan)
  if ('findings' in output) return formatValue(output.findings)
  if ('result' in output) return formatValue(output.result)
  if ('approval' in output) return `Approval: ${output.approval ? 'Yes' : 'No'}`
  return formatValue(output)
}

function getAgentStatus(
  output: AgentOutput | undefined,
  isLoading: boolean,
  index: number,
  hasError: boolean,
): AgentStatus {
  if (hasError) return index === 0 ? 'error' : 'idle'
  if (output) return 'completed'
  if (isLoading) return index === 0 ? 'running' : 'idle'
  return 'idle'
}

function modeLabel(mode?: string) {
  if (!mode) return 'pending'
  return mode.toLowerCase()
}

function BrandWordmark() {
  return (
    <span className="brand-wordmark-text" aria-label="NexusOps AI">
      <span>NexusOps</span>
      {' '}
      <span className="brand-ai">AI</span>
    </span>
  )
}

export default function App() {
  const [taskInput, setTaskInput] = useState('')
  const [workflowData, setWorkflowData] = useState<WorkflowResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ReportTab>('report')

  const sessionId = useMemo(() => {
    const seed = workflowData?.task || taskInput || 'NexusOps AI'
    let hash = 0
    for (const char of seed) hash = (hash + char.charCodeAt(0) * 17) % 9999
    return `NX-${String(hash || 9042).padStart(4, '0')}-ALPHA`
  }, [taskInput, workflowData?.task])

  const handleRunWorkflow = async () => {
    if (!taskInput.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setWorkflowData(null)
    setActiveTab('audit')

    try {
      const response = await fetch('http://localhost:8000/api/workflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput }),
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data = (await response.json()) as WorkflowResponse
      setWorkflowData(data)
      setActiveTab('report')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend.')
    } finally {
      setIsLoading(false)
    }
  }

  const fallbackAuditLogs = [
    { label: 'Task received', done: Boolean(workflowData?.task) || isLoading },
    { label: 'Planner completed', done: Boolean(workflowData?.planner_output) },
    { label: 'Research completed', done: Boolean(workflowData?.research_output) },
    { label: 'Executor completed', done: Boolean(workflowData?.executor_output) },
    { label: 'Reviewer completed', done: Boolean(workflowData?.reviewer_output) },
    { label: 'Final report generated', done: Boolean(workflowData?.final_output) },
  ]

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <div className="sidebar-brand">
          <img className="brand-mark" src={logoSrc} alt="NexusOps AI logo" />
          <div>
            <BrandWordmark />
            <span className="brand-kicker">Reliability Layer</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {[
            ['Command Center', 'command'],
            ['Workflow', 'workflow'],
            ['Audit', 'audit'],
            ['Harness', 'harness'],
            ['Settings', 'settings'],
          ].map(([label, icon], index) => (
            <button className={`nav-item ${index === 0 ? 'active' : ''}`} key={label}>
              <Icon name={icon as IconName} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="new-session-button" type="button" onClick={() => setWorkflowData(null)}>
          <Icon name="plus" />
          New Session
        </button>
      </aside>

      <header className="ops-topbar">
        <div className="topbar-brand">
          <img className="topbar-logo" src={logoSrc} alt="" />
          <BrandWordmark />
        </div>
        <div className="status-badges" aria-label="Project readiness">
          <span>AMD Hackathon Track 3</span>
          <span>Fireworks/Gemma Ready</span>
          <span>Mock Fallback Active</span>
          <span>Dockerized Backend</span>
        </div>
      </header>

      <main className="ops-main">
        <section className="command-hero">
          <div>
            <p className="eyebrow">Enterprise Multi-Agent Operations</p>
            <h1>Command Center</h1>
            <p className="hero-copy">
              Dispatch an operations task to the NexusOps AI agent team and inspect each
              stage from planning through final review.
            </p>
          </div>
          <div className="session-card">
            <span>Session ID</span>
            <strong>{sessionId}</strong>
          </div>
        </section>

        <section className="task-card" aria-labelledby="task-command-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Task Command</p>
              <h2 id="task-command-title">Agent Team Objective</h2>
            </div>
            <span className={`run-state ${isLoading ? 'running' : error ? 'error' : workflowData ? 'completed' : ''}`}>
              {isLoading ? 'Running' : error ? 'Error' : workflowData ? 'Completed' : 'Idle'}
            </span>
          </div>

          <textarea
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault()
                handleRunWorkflow()
              }
            }}
            placeholder="Describe an operations task for the AI agent team..."
            className="task-input"
            rows={4}
          />
          <p className="prompt-helper">
            Try: Create a launch plan for NexusOps AI for the AMD Developer Hackathon.
          </p>

          <div className="command-actions">
            <span>Press Ctrl + Enter to run the workflow.</span>
            <button
              className="run-button"
              type="button"
              onClick={handleRunWorkflow}
              disabled={isLoading || !taskInput.trim()}
            >
              <Icon name="run" />
              {isLoading ? 'Running Workflow' : 'Run Workflow'}
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </section>

        <section className="pipeline-section" aria-labelledby="pipeline-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pipeline State Flow</p>
              <h2 id="pipeline-title">Four-Agent Inspection Pipeline</h2>
            </div>
          </div>

          <div className="agent-grid">
            {agentCards.map((agent, index) => {
              const output = workflowData?.[agent.key]
              const status = getAgentStatus(output, isLoading, index, Boolean(error))

              return (
                <article className={`agent-card ${status}`} key={agent.name}>
                  <div className="agent-icon">
                    <Icon name={agent.icon} />
                  </div>
                  <span className={`state-badge ${status}`}>{status}</span>
                  <h3>{agent.name}</h3>
                  <p>{agent.role}</p>
                  <pre>{summarizeOutput(output)}</pre>
                </article>
              )
            })}
          </div>
        </section>

        <section className="harness-section" aria-labelledby="harness-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">System Harness</p>
              <h2 id="harness-title">Project Readiness</h2>
            </div>
          </div>
          <div className="harness-grid">
            {harnessItems.map((item) => (
              <article className="harness-card" key={item.label}>
                <div className="harness-card-header">
                  <Icon name={item.icon as IconName} />
                  <span>{item.label}</span>
                </div>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="report-panel">
        <div className="report-tabs" role="tablist" aria-label="Workflow report">
          <button
            className={activeTab === 'report' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('report')}
          >
            Report
          </button>
          <button
            className={activeTab === 'audit' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('audit')}
          >
            Audit Trace
          </button>
        </div>

        {activeTab === 'report' ? (
          <section className="report-content">
            <div className="report-title-row">
              <div>
                <p className="eyebrow">Final Operations Report</p>
                <h2>Report</h2>
              </div>
              <span className={`mode-badge ${modeLabel(workflowData?.mode)}`}>
                {modeLabel(workflowData?.mode)}
              </span>
            </div>

            {workflowData?.final_output ? (
              <>
                <div className="task-summary">
                  <span>Task</span>
                  <p>{workflowData.task || taskInput}</p>
                </div>
                <div className="final-output">{workflowData.final_output}</div>
                
                {workflowData.reviewer_score && (
                  <div className="reviewer-score-card">
                    <p className="eyebrow">Reviewer Score</p>
                    <div className="score-grid">
                      <div className="score-item">
                        <span>Clarity</span>
                        <strong>{workflowData.reviewer_score.clarity ?? '-'}</strong>
                      </div>
                      <div className="score-item">
                        <span>Completeness</span>
                        <strong>{workflowData.reviewer_score.completeness ?? '-'}</strong>
                      </div>
                      <div className="score-item">
                        <span>Actionability</span>
                        <strong>{workflowData.reviewer_score.actionability ?? '-'}</strong>
                      </div>
                      <div className="score-item">
                        <span>Risk</span>
                        <strong className="risk-badge" data-risk={workflowData.reviewer_score.risk}>{workflowData.reviewer_score.risk ?? '-'}</strong>
                      </div>
                      <div className="score-item">
                        <span>Decision</span>
                        <strong className="decision-badge" data-decision={workflowData.reviewer_score.decision}>{workflowData.reviewer_score.decision ?? '-'}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-report">
                <div className="empty-report-icon">
                  <Icon name="report" />
                </div>
                <span>Operations report standby</span>
                <h3>Run a workflow to generate the final report</h3>
                <p>
                  NexusOps AI will summarize the reviewed outcome here, including the
                  final output, execution mode, and the traceable agent handoff.
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="audit-content">
            <p className="eyebrow">Workflow Logs</p>
            <h2>Audit Trace</h2>
            <div className="audit-list">
              {workflowData?.trace ? (
                workflowData.trace.map((event, index) => (
                  <div className="audit-row done" key={index}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{event.step}</strong>
                      <p>{event.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                fallbackAuditLogs.map((log, index) => (
                  <div className={`audit-row ${log.done ? 'done' : ''}`} key={log.label}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <p>{log.label}</p>
                    </div>
                  </div>
                ))
              )}
              {error && (
                <div className="audit-row error">
                  <span>!</span>
                  <div>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </aside>
    </div>
  )
}
