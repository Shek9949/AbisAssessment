import type { NodeProps } from '@xyflow/react'
import type { ApprovalNodeConfig, WorkflowNode } from '../../types.ts'
import { NodeCard } from './NodeCard'

export function ApprovalNode({ data, selected }: NodeProps<WorkflowNode>) {
  const config = data.config as ApprovalNodeConfig

  return (
    <NodeCard
      title={config.title || 'Approval'}
      subtitle={config.approverRole ? `Role: ${config.approverRole}` : 'Decision gate'}
      color="#f29d38"
      selected={selected}
    />
  )
}

