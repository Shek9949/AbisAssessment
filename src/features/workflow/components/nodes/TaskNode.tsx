import type { NodeProps } from '@xyflow/react'
import type { TaskNodeConfig, WorkflowNode } from '../../types.ts'
import { NodeCard } from './NodeCard'

export function TaskNode({ data, selected }: NodeProps<WorkflowNode>) {
  const config = data.config as TaskNodeConfig

  return (
    <NodeCard
      title={config.title || 'Task'}
      subtitle={config.assignee ? `Assignee: ${config.assignee}` : 'Human task'}
      color="#2279dc"
      selected={selected}
    />
  )
}

