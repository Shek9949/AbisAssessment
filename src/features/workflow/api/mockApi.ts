import type {
  ApprovalNodeConfig,
  AutomatedNodeConfig,
  AutomationAction,
  EndNodeConfig,
  StartNodeConfig,
  SimulationResult,
  SimulationStep,
  TaskNodeConfig,
  WorkflowNode,
  WorkflowSnapshot,
} from '../types.ts'
import { validateWorkflow } from '../utils/validation'

const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
]

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function createStep(node: WorkflowNode): SimulationStep {
  switch (node.data.kind) {
    case 'start':
      {
        const config = node.data.config as StartNodeConfig
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'start',
        message: `Started workflow: ${config.title}`,
        status: 'success',
      }
      }
    case 'task':
      {
        const config = node.data.config as TaskNodeConfig
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'task',
        message: `Task assigned to ${config.assignee || 'unassigned user'}`,
        status: 'success',
      }
      }
    case 'approval':
      {
        const config = node.data.config as ApprovalNodeConfig
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'approval',
        message: `Approval requested from role: ${config.approverRole}`,
        status: 'success',
      }
      }
    case 'automated': {
      const config = node.data.config as AutomatedNodeConfig
      const actionLabel = config.actionLabel || 'No action selected'
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'automated',
        message: `Automation executed: ${actionLabel}`,
        status: config.actionId ? 'success' : 'warning',
      }
    }
    case 'end':
      {
        const config = node.data.config as EndNodeConfig
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'end',
        message: config.endMessage,
        status: 'success',
      }
      }
    default:
      return {
        id: `step-${node.id}`,
        nodeId: node.id,
        nodeType: 'task',
        message: 'Unknown workflow step',
        status: 'error',
      }
  }
}

function runDeterministicSimulation(workflow: WorkflowSnapshot) {
  const nodeMap = new Map(workflow.nodes.map((node) => [node.id, node]))
  const outgoing = new Map<string, string[]>()

  for (const edge of workflow.edges) {
    const targets = outgoing.get(edge.source) ?? []
    targets.push(edge.target)
    outgoing.set(edge.source, targets)
  }

  const startNode = workflow.nodes.find((node) => node.data.kind === 'start')
  if (!startNode) {
    return []
  }

  const steps: SimulationStep[] = []
  const visited = new Set<string>()
  let cursor: string | undefined = startNode.id

  while (cursor && !visited.has(cursor)) {
    visited.add(cursor)
    const node = nodeMap.get(cursor)

    if (!node) {
      break
    }

    steps.push(createStep(node))

    const next: string | undefined = outgoing.get(cursor)?.[0]
    cursor = next
  }

  return steps
}

export async function getAutomations(): Promise<AutomationAction[]> {
  await wait(350)
  return mockAutomations
}

export async function simulateWorkflow(workflow: WorkflowSnapshot): Promise<SimulationResult> {
  await wait(550)

  const validation = validateWorkflow(workflow.nodes, workflow.edges)
  if (!validation.isValid) {
    return {
      valid: false,
      errors: validation.errors,
      steps: [],
    }
  }

  const steps = runDeterministicSimulation(workflow)

  return {
    valid: true,
    errors: [],
    steps,
  }
}

