import type { NodeProps } from '@xyflow/react'
import type { AutomatedNodeConfig, WorkflowNode } from '../../types.ts'
import { NodeCard } from './NodeCard'

export function AutomatedNode({ data, selected }: NodeProps<WorkflowNode>) {
  const config = data.config as AutomatedNodeConfig

  return (
    <NodeCard
      title={config.title || 'Automated step'}
      subtitle={config.actionLabel || 'System action'}
      color="#8a56ef"
      selected={selected}
    />
  )
}

