import type { WorkflowNode } from '../types.ts'
import type {
  ApprovalNodeConfig,
  AutomatedNodeConfig,
  AutomationAction,
  EndNodeConfig,
  StartNodeConfig,
  TaskNodeConfig,
} from '../types.ts'
import { KeyValueEditor } from './forms/KeyValueEditor'

interface NodeConfigPanelProps {
  node: WorkflowNode | null
  automations: AutomationAction[]
  loadingAutomations: boolean
  onChange: (nodeId: string, nextConfig: WorkflowNode['data']['config']) => void
  onDeleteNode: () => void
}

export function NodeConfigPanel({
  node,
  automations,
  loadingAutomations,
  onChange,
  onDeleteNode,
}: NodeConfigPanelProps) {
  if (!node) {
    return (
      <aside className="wf-panel">
        <header>
          <p className="wf-eyebrow">Configuration</p>
          <h2>Node Form Panel</h2>
        </header>
        <p className="wf-muted">Select a node in the canvas to configure fields.</p>
      </aside>
    )
  }

  const renderForm = () => {
    switch (node.data.kind) {
      case 'start':
        return (
          <StartForm
            config={node.data.config as StartNodeConfig}
            onPatch={(nextConfig) => onChange(node.id, nextConfig)}
          />
        )
      case 'task':
        return (
          <TaskForm
            config={node.data.config as TaskNodeConfig}
            onPatch={(nextConfig) => onChange(node.id, nextConfig)}
          />
        )
      case 'approval':
        return (
          <ApprovalForm
            config={node.data.config as ApprovalNodeConfig}
            onPatch={(nextConfig) => onChange(node.id, nextConfig)}
          />
        )
      case 'automated':
        return (
          <AutomatedForm
            config={node.data.config as AutomatedNodeConfig}
            actions={automations}
            loading={loadingAutomations}
            onPatch={(nextConfig) => onChange(node.id, nextConfig)}
          />
        )
      case 'end':
        return (
          <EndForm
            config={node.data.config as EndNodeConfig}
            onPatch={(nextConfig) => onChange(node.id, nextConfig)}
          />
        )
      default:
        return <p className="wf-muted">No form available for selected node.</p>
    }
  }

  return (
    <aside className="wf-panel">
      <header>
        <p className="wf-eyebrow">Configuration</p>
        <h2>{node.type?.toUpperCase()} Node</h2>
      </header>

      <div className="wf-form-grid">{renderForm()}</div>

      <button type="button" className="wf-delete-btn" onClick={onDeleteNode}>
        Delete selected node
      </button>
    </aside>
  )
}

interface StartFormProps {
  config: StartNodeConfig
  onPatch: (config: StartNodeConfig) => void
}

function StartForm({ config, onPatch }: StartFormProps) {
  return (
    <>
      <label>
        Start title
        <input
          type="text"
          value={config.title}
          onChange={(event) => onPatch({ ...config, title: event.target.value })}
        />
      </label>

      <KeyValueEditor
        label="Metadata"
        rows={config.metadata}
        onChange={(metadata) => onPatch({ ...config, metadata })}
      />
    </>
  )
}

interface TaskFormProps {
  config: TaskNodeConfig
  onPatch: (config: TaskNodeConfig) => void
}

function TaskForm({ config, onPatch }: TaskFormProps) {
  return (
    <>
      <label>
        Title *
        <input
          type="text"
          value={config.title}
          onChange={(event) => onPatch({ ...config, title: event.target.value })}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={config.description}
          onChange={(event) => onPatch({ ...config, description: event.target.value })}
          rows={3}
        />
      </label>

      <label>
        Assignee
        <input
          type="text"
          value={config.assignee}
          onChange={(event) => onPatch({ ...config, assignee: event.target.value })}
        />
      </label>

      <label>
        Due date
        <input
          type="date"
          value={config.dueDate}
          onChange={(event) => onPatch({ ...config, dueDate: event.target.value })}
        />
      </label>

      <KeyValueEditor
        label="Custom fields"
        rows={config.customFields}
        onChange={(customFields) => onPatch({ ...config, customFields })}
      />
    </>
  )
}

interface ApprovalFormProps {
  config: ApprovalNodeConfig
  onPatch: (config: ApprovalNodeConfig) => void
}

function ApprovalForm({ config, onPatch }: ApprovalFormProps) {
  return (
    <>
      <label>
        Title
        <input
          type="text"
          value={config.title}
          onChange={(event) => onPatch({ ...config, title: event.target.value })}
        />
      </label>

      <label>
        Approver role
        <input
          type="text"
          value={config.approverRole}
          onChange={(event) => onPatch({ ...config, approverRole: event.target.value })}
          placeholder="Manager / HRBP / Director"
        />
      </label>

      <label>
        Auto-approve threshold
        <input
          type="number"
          value={config.autoApproveThreshold}
          onChange={(event) =>
            onPatch({ ...config, autoApproveThreshold: Number(event.target.value || 0) })
          }
          min={0}
        />
      </label>
    </>
  )
}

interface AutomatedFormProps {
  config: AutomatedNodeConfig
  actions: AutomationAction[]
  loading: boolean
  onPatch: (config: AutomatedNodeConfig) => void
}

function AutomatedForm({ config, actions, loading, onPatch }: AutomatedFormProps) {
  const selectedAction = actions.find((action) => action.id === config.actionId)

  const onActionChange = (actionId: string) => {
    const action = actions.find((candidate) => candidate.id === actionId)
    if (!action) {
      onPatch({ ...config, actionId: '', actionLabel: '', params: {} })
      return
    }

    const nextParams = Object.fromEntries(action.params.map((param) => [param, config.params[param] ?? '']))
    onPatch({ ...config, actionId: action.id, actionLabel: action.label, params: nextParams })
  }

  return (
    <>
      <label>
        Title
        <input
          type="text"
          value={config.title}
          onChange={(event) => onPatch({ ...config, title: event.target.value })}
        />
      </label>

      <label>
        Action
        <select
          value={config.actionId}
          onChange={(event) => onActionChange(event.target.value)}
          disabled={loading}
        >
          <option value="">{loading ? 'Loading actions...' : 'Select action'}</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </label>

      {selectedAction && (
        <div className="wf-dynamic-fields">
          <p>Action parameters</p>
          {selectedAction.params.map((param) => (
            <label key={param}>
              {param}
              <input
                type="text"
                value={config.params[param] ?? ''}
                onChange={(event) =>
                  onPatch({
                    ...config,
                    params: {
                      ...config.params,
                      [param]: event.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      )}
    </>
  )
}

interface EndFormProps {
  config: EndNodeConfig
  onPatch: (config: EndNodeConfig) => void
}

function EndForm({ config, onPatch }: EndFormProps) {
  return (
    <>
      <label>
        End message
        <input
          type="text"
          value={config.endMessage}
          onChange={(event) => onPatch({ ...config, endMessage: event.target.value })}
        />
      </label>

      <label className="wf-switch">
        <input
          type="checkbox"
          checked={config.summary}
          onChange={(event) => onPatch({ ...config, summary: event.target.checked })}
        />
        <span>Summary flag</span>
      </label>
    </>
  )
}

