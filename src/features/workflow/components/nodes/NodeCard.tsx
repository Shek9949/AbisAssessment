import { Handle, Position } from '@xyflow/react'

interface NodeCardProps {
  title: string
  subtitle: string
  color: string
  withTarget?: boolean
  withSource?: boolean
  selected?: boolean
}

export function NodeCard({
  title,
  subtitle,
  color,
  withTarget = true,
  withSource = true,
  selected = false,
}: NodeCardProps) {
  return (
    <div className={`wf-node-card ${selected ? 'is-selected' : ''}`} style={{ borderColor: color }}>
      {withTarget && <Handle className="wf-handle" type="target" position={Position.Left} />}

      <div className="wf-node-content">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>

      {withSource && <Handle className="wf-handle" type="source" position={Position.Right} />}
    </div>
  )
}

