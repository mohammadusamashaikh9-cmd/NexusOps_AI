import { useMemo, useState, type ReactNode } from 'react'

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

interface WorkflowResponse {
  task?: string
  planner_output?: AgentOutput
  research_output?: AgentOutput
  executor_output?: AgentOutput
  reviewer_output?: AgentOutput
  final_output?: string
  mode?: string
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
  ['Model Service', 'Fireworks/Gemma Ready'],
  ['Mock Fallback', 'Active'],
  ['Backend', 'FastAPI'],
  ['Container', 'Docker'],
  ['GPU Target', 'AMD ROCm'],
  ['Workflow Trace', 'Enabled'],
]

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  const paths: Record<IconName, ReactNode> = {
    command: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.2" />
        <path d="M14 17h6M17 14v6" />
      </>
    ),
    workflow: (
      <>
        <rect x="3" y="5" width="5" height="5" rx="1" />
        <rect x="16" y="5" width="5" height="5" rx="1" />
        <rect x="9.5" y="15" width="5" height="5" rx="1" />
        <path d="M8 7.5h8M12 10v5" />
      </>
    ),
    audit: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5M10 12h6M10 16h6M10 20h4" />
      </>
    ),
    harness: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.1L14 3h-4l-.5 2.8a7 7 0 0 0-2 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.1L10 21h4l.5-2.8a7 7 0 0 0 2-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    planner: (
      <>
        <path d="M8 4h8M12 4v16M8 20h8" />
        <path d="M9 8l-3 3 3 3M15 8l3 3-3 3" />
      </>
    ),
    research: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="M15 15l5 5M8.5 10.5h4M10.5 8.5v4" />
      </>
    ),
    executor: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 9h6v6H9zM12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    reviewer: (
      <>
        <path d="M12 4c4.5 0 8 4 9 8-1 4-4.5 8-9 8s-8-4-9-8c1-4 4.5-8 9-8Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    run: <path d="M8 5v14l11-7z" />,
    report: (
      <>
        <path d="M5 4h14v16H5z" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return 'Awaiting output'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value, null, 2)
}

function summarizeOutput(output?: AgentOutput): string {
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

  const auditLogs = [
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
            {harnessItems.map(([label, value]) => (
              <article className="harness-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
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
              {auditLogs.map((log, index) => (
                <div className={`audit-row ${log.done ? 'done' : ''}`} key={log.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{log.label}</p>
                </div>
              ))}
              {error && (
                <div className="audit-row error">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </aside>
    </div>
  )
}
