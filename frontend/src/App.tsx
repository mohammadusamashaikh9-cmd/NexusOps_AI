import { useMemo, useState, type ReactNode } from 'react'
import {
  LayoutDashboard, GitBranch, ScrollText, Network, Settings, Plus, Play,
  ListChecks, Search, TerminalSquare, ShieldCheck, FileText,
  Activity, Server, Box, Cpu, Bot, Paperclip, Copy, Download
} from 'lucide-react'

type AgentStatus = 'idle' | 'running' | 'completed' | 'error'
type ReportTab = 'report' | 'audit'
type SectionId = 'command' | 'workflow' | 'audit' | 'harness' | 'settings'

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
  document_attached?: boolean
  document_name?: string
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
  | 'paperclip'
  | 'copy'
  | 'download'

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
    case 'paperclip': return <Paperclip {...props} />
    case 'copy': return <Copy {...props} />
    case 'download': return <Download {...props} />
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
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentError, setDocumentError] = useState<string | null>(null)
  const [workflowData, setWorkflowData] = useState<WorkflowResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ReportTab>('report')
  const [activeSection, setActiveSection] = useState<SectionId>('command')

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
      const formData = new FormData()
      formData.append('task', taskInput)
      if (documentFile) {
        formData.append('document', documentFile)
      }

      const response = await fetch('http://localhost:8000/api/workflow/run', {
        method: 'POST',
        body: formData,
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
          ].map(([label, icon]) => (
            <button 
              className={`nav-item ${activeSection === icon ? 'active' : ''}`} 
              key={label}
              onClick={() => setActiveSection(icon as SectionId)}
            >
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
        {activeSection === 'command' && (
          <>
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <input 
                  type="file" 
                  id="doc-upload" 
                  accept=".txt,.md" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setDocumentError(null);
                    if (!file) {
                      setDocumentFile(null);
                      return;
                    }
                    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
                      setDocumentError("Only .txt and .md files are supported.");
                      setDocumentFile(null);
                      return;
                    }
                    if (file.size > 1024 * 1024) {
                      setDocumentError("File size exceeds the 1MB limit.");
                      setDocumentFile(null);
                      return;
                    }
                    setDocumentFile(file);
                  }}
                />
                <label htmlFor="doc-upload" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.85rem', color: '#9eabc5', transition: 'background 0.2s' }}>
                  <Icon name="paperclip" /> 
                  {documentFile ? documentFile.name : 'Attach Document (.txt, .md)'}
                </label>
                {documentFile && <span className="state-badge completed" style={{ marginLeft: '4px' }}>Document attached</span>}
              </div>
              
              {documentError && <div className="error-banner" style={{ marginBottom: '16px', padding: '8px 12px' }}>{documentError}</div>}

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
          </>
        )}

        {activeSection === 'workflow' && (
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

            {workflowData?.trace && (
              <div className="workflow-meta" style={{ marginTop: '24px', color: '#9eabc5', fontSize: '0.9rem' }}>
                <p>Workflow trace events recorded: <strong>{workflowData.trace.length}</strong></p>
              </div>
            )}
          </section>
        )}

        {activeSection === 'audit' && (
          <section className="audit-section" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Workflow Logs</p>
                <h2>Audit Trace Overview</h2>
              </div>
              <span className={`mode-badge ${modeLabel(workflowData?.mode)}`}>
                {modeLabel(workflowData?.mode)}
              </span>
            </div>

            {!workflowData && !isLoading && (
               <div className="empty-report" style={{ border: '1px solid var(--line)', padding: '3rem', borderRadius: '8px', textAlign: 'center' }}>
                 <div className="empty-report-icon" style={{ display: 'inline-flex', marginBottom: '16px' }}>
                   <Icon name="audit" />
                 </div>
                 <h3 style={{ marginBottom: '8px' }}>No active workflow trace</h3>
                 <p style={{ color: '#a4b3d8' }}>Run a workflow in the Command Center to populate this trace.</p>
               </div>
            )}

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

            {workflowData?.reviewer_score && (
              <div className="reviewer-score-card" style={{ marginTop: '2rem' }}>
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
          </section>
        )}

        {activeSection === 'harness' && (
          <section className="harness-section" aria-labelledby="harness-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">System Harness</p>
                <h2 id="harness-title">Project Readiness</h2>
                <p style={{ color: '#c3cce0', marginTop: '12px', fontSize: '0.9rem' }}>
                  NexusOps AI uses a harness layer to keep agent workflows traceable, reviewed, and fallback-safe.
                </p>
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
        )}

        {activeSection === 'settings' && (
          <section className="settings-section" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Configuration</p>
                <h2>Settings</h2>
              </div>
            </div>
            
            <div className="error-banner" style={{ marginBottom: '24px', background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fef08a' }}>
              <Icon name="settings" />
              <span>Secrets are never displayed in the frontend.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <article className="harness-card" style={{ minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9eabc5' }}>Mock Mode</span>
                <strong style={{ color: '#31d8f2' }}>Enabled</strong>
              </article>
              <article className="harness-card" style={{ minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9eabc5' }}>Live Fireworks Mode</span>
                <strong style={{ color: '#9eabc5' }}>Disabled until controlled test</strong>
              </article>
              <article className="harness-card" style={{ minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9eabc5' }}>API Endpoint</span>
                <strong style={{ color: '#ffffff' }}>/api/workflow/run</strong>
              </article>
              <article className="harness-card" style={{ minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9eabc5' }}>Secrets</span>
                <strong style={{ color: '#657297' }}>Backend env only</strong>
              </article>
              <article className="harness-card" style={{ minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9eabc5' }}>Frontend Secret Exposure</span>
                <strong style={{ color: '#657297' }}>Disabled</strong>
              </article>
            </div>
          </section>
        )}
      </main>

      {activeSection === 'command' && (
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
          <section className="report-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height) - 58px)' }}>
            {/* Sticky action header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--line)',
              background: 'rgba(10, 13, 29, 0.98)',
              flexShrink: 0
            }}>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>Final Operations Report</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: workflowData?.final_output ? '14px' : '0' }}>
                <span className={`mode-badge ${modeLabel(workflowData?.mode)}`}>
                  {modeLabel(workflowData?.mode)}
                </span>
                {workflowData?.document_attached && (
                  <span className="state-badge completed" style={{ fontSize: '0.72rem' }}>
                    📎 {workflowData.document_name}
                  </span>
                )}
              </div>
              {workflowData?.final_output && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="run-button"
                    style={{
                      background: 'rgba(168,150,255,0.12)',
                      color: 'var(--violet)',
                      border: '1px solid rgba(168,150,255,0.35)',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      width: 'auto',
                      flex: 1,
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onClick={() => navigator.clipboard.writeText(workflowData.final_output || '')}
                  >
                    <Icon name="copy" /> Copy
                  </button>
                  <button
                    type="button"
                    className="run-button"
                    style={{
                      background: 'rgba(49,216,242,0.1)',
                      color: 'var(--cyan)',
                      border: '1px solid rgba(49,216,242,0.3)',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      width: 'auto',
                      flex: 1,
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onClick={() => {
                      const blob = new Blob([workflowData.final_output || ''], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'nexusops-report.md';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Icon name="download" /> Download .md
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable report body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {workflowData?.final_output ? (
                <>
                  <div className="task-summary">
                    <span>Task</span>
                    <p>{workflowData.task || taskInput}</p>
                  </div>

                  <div className="final-output" style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.75',
                    fontSize: '0.875rem',
                    color: '#dde6ff',
                    fontFamily: 'inherit',
                    marginTop: '16px'
                  }}>
                    {workflowData.final_output}
                  </div>

                  {workflowData.reviewer_score && (
                    <div className="reviewer-score-card" style={{ marginTop: '24px' }}>
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
            </div>
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
      )}
    </div>
  )
}
