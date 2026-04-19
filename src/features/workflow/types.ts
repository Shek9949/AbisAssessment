import type { Edge, Node } from '@xyflow/react'

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KeyValuePair {
  key: string
  value: string
}

export interface StartNodeConfig {
  title: string
  metadata: KeyValuePair[]
}

export interface TaskNodeConfig {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export interface ApprovalNodeConfig {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedNodeConfig {
  title: string
  actionId: string
  actionLabel: string
  params: Record<string, string>
}

export interface EndNodeConfig {
  endMessage: string
  summary: boolean
}

export interface WorkflowNodeConfigMap {
  start: StartNodeConfig
  task: TaskNodeConfig
  approval: ApprovalNodeConfig
  automated: AutomatedNodeConfig
  end: EndNodeConfig
}

export type WorkflowNodeConfig = WorkflowNodeConfigMap[WorkflowNodeType]

export interface WorkflowNodeData extends Record<string, unknown> {
  kind: WorkflowNodeType
  config: WorkflowNodeConfig
}

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>
export type WorkflowEdge = Edge

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface WorkflowSnapshot {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface SimulationStep {
  id: string
  nodeId: string
  nodeType: WorkflowNodeType
  message: string
  status: 'success' | 'warning' | 'error'
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface SimulationResult {
  valid: boolean
  errors: string[]
  steps: SimulationStep[]
}

export const nodeTitles: Record<WorkflowNodeType, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated',
  end: 'End',
}

export function getDefaultConfig(type: 'start'): StartNodeConfig
export function getDefaultConfig(type: 'task'): TaskNodeConfig
export function getDefaultConfig(type: 'approval'): ApprovalNodeConfig
export function getDefaultConfig(type: 'automated'): AutomatedNodeConfig
export function getDefaultConfig(type: 'end'): EndNodeConfig
export function getDefaultConfig(type: WorkflowNodeType): WorkflowNodeConfig {
  switch (type) {
    case 'start':
      return { title: 'Workflow start', metadata: [] }
    case 'task':
      return {
        title: 'Collect documents',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      }
    case 'approval':
      return {
        title: 'Manager approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      }
    case 'automated':
      return {
        title: 'System automation',
        actionId: '',
        actionLabel: '',
        params: {},
      }
    case 'end':
      return {
        endMessage: 'Workflow completed',
        summary: true,
      }
    default:
      return { title: 'Workflow start', metadata: [] }
  }
}

