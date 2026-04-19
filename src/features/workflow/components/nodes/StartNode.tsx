import type { NodeProps } from '@xyflow/react'
import type { StartNodeConfig, WorkflowNode } from '../../types.ts'
import { NodeCard } from './NodeCard'

export function StartNode({ data, selected }: NodeProps<WorkflowNode>) {
  const config = data.config as StartNodeConfig

  return (
    <NodeCard
      title={config.title || 'Start'}
      subtitle="Entry point"
      color="#2aa37a"
      withTarget={false}
      selected={selected}
    />
  )
}

