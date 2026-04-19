import type { NodeProps } from '@xyflow/react'
import type { EndNodeConfig, WorkflowNode } from '../../types.ts'
import { NodeCard } from './NodeCard'

export function EndNode({ data, selected }: NodeProps<WorkflowNode>) {
  const config = data.config as EndNodeConfig

  return (
    <NodeCard
      title="End"
      subtitle={config.endMessage || 'Workflow completed'}
      color="#db4959"
      withSource={false}
      selected={selected}
    />
  )
}

