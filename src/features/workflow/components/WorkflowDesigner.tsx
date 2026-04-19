import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type ReactFlowInstance,
} from '@xyflow/react'
import { getAutomations, simulateWorkflow } from '../api/mockApi'
import { useWorkflowDesigner } from '../hooks/useWorkflowDesigner'
import type {
  AutomationAction,
  SimulationResult,
  ValidationResult,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '../types.ts'
import { validateWorkflow } from '../utils/validation'
import { NodeConfigPanel } from './NodeConfigPanel'
import { NodePalette } from './NodePalette'
import { SandboxPanel } from './SandboxPanel'
import { ApprovalNode } from './nodes/ApprovalNode'
import { AutomatedNode } from './nodes/AutomatedNode'
import { EndNode } from './nodes/EndNode'
import { StartNode } from './nodes/StartNode'
import { TaskNode } from './nodes/TaskNode'

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
}

function DesignerContent() {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeConfig,
    deleteSelectedNode,
    setSelectedNodeId,
  } = useWorkflowDesigner()

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<WorkflowNode, WorkflowEdge> | null>(
    null,
  )
  const [automations, setAutomations] = useState<AutomationAction[]>([])
  const [loadingAutomations, setLoadingAutomations] = useState(false)
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadAutomations = async () => {
      setLoadingAutomations(true)
      try {
        const data = await getAutomations()
        if (mounted) {
          setAutomations(data)
        }
      } finally {
        if (mounted) {
          setLoadingAutomations(false)
        }
      }
    }

    void loadAutomations()

    return () => {
      mounted = false
    }
  }, [])

  const validation: ValidationResult = useMemo(() => validateWorkflow(nodes, edges), [edges, nodes])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType
      if (!type || !rfInstance) {
        return
      }

      const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY })
      addNode(type, position)
    },
    [addNode, rfInstance],
  )

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const runSimulation = useCallback(async () => {
    setIsSimulating(true)
    try {
      const response = await simulateWorkflow({ nodes, edges })
      setSimulation(response)
    } finally {
      setIsSimulating(false)
    }
  }, [edges, nodes])

  return (
    <div className="wf-layout">
      <NodePalette />

      <div className="wf-canvas-shell">
        <header className="wf-header">
          <div>
            <p className="wf-eyebrow">HR Workflows</p>
          </div>
          <div className={`wf-badge ${validation.isValid ? 'ok' : 'error'}`}>
            {validation.isValid ? 'Valid structure' : `${validation.errors.length} issue(s)`}
          </div>
        </header>

        <div className="wf-canvas" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background gap={20} size={1} color="#d3dbe8" />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>

        <SandboxPanel
          validation={validation}
          simulation={simulation}
          isSimulating={isSimulating}
          onSimulate={runSimulation}
        />
      </div>

      <NodeConfigPanel
        node={selectedNode}
        automations={automations}
        loadingAutomations={loadingAutomations}
        onChange={updateNodeConfig}
        onDeleteNode={deleteSelectedNode}
      />
    </div>
  )
}

export function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <DesignerContent />
    </ReactFlowProvider>
  )
}

