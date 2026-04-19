import type { DragEvent } from 'react'
import type { WorkflowNodeType } from '../types.ts'

const nodeOptions: Array<{ type: WorkflowNodeType; title: string; description: string }> = [
  { type: 'start', title: 'Start Node', description: 'Workflow entry point' },
  { type: 'task', title: 'Task Node', description: 'Human action item' },
  { type: 'approval', title: 'Approval Node', description: 'Role-based decision' },
  { type: 'automated', title: 'Automated Step', description: 'System-triggered action' },
  { type: 'end', title: 'End Node', description: 'Workflow completion' },
]

export function NodePalette() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, type: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="wf-palette">
      <header>
        <p className="wf-eyebrow">Palette</p>
      </header>

      <div className="wf-palette-list">
        {nodeOptions.map((node) => (
          <div
            key={node.type}
            className="wf-palette-item"
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
          >
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}

