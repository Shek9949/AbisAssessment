import { useCallback, useMemo, useState } from 'react'
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'
import type { WorkflowEdge, WorkflowNode, WorkflowNodeConfig, WorkflowNodeType } from '../types.ts'
import { getDefaultConfig } from '../types.ts'

function createNode(type: WorkflowNodeType, position: XYPosition): WorkflowNode {
  const id = `${type}-${crypto.randomUUID().slice(0, 8)}`

  switch (type) {
    case 'start':
      return {
        id,
        type,
        position,
        data: { kind: type, config: getDefaultConfig(type) },
      }
    case 'task':
      return {
        id,
        type,
        position,
        data: { kind: type, config: getDefaultConfig(type) },
      }
    case 'approval':
      return {
        id,
        type,
        position,
        data: { kind: type, config: getDefaultConfig(type) },
      }
    case 'automated':
      return {
        id,
        type,
        position,
        data: { kind: type, config: getDefaultConfig(type) },
      }
    case 'end':
      return {
        id,
        type,
        position,
        data: { kind: type, config: getDefaultConfig(type) },
      }
    default:
      return {
        id,
        type: 'task',
        position,
        data: { kind: 'task', config: getDefaultConfig('task') },
      }
  }
}

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 120, y: 220 },
    data: { kind: 'start', config: getDefaultConfig('start') },
  },
  {
    id: 'task-1',
    type: 'task',
    position: { x: 420, y: 220 },
    data: { kind: 'task', config: getDefaultConfig('task') },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 760, y: 220 },
    data: { kind: 'end', config: getDefaultConfig('end') },
  },
]

export function useWorkflowDesigner() {
  const [nodes, setNodes, onNodesChangeBase] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            animated: false,
          },
          current,
        ),
      )
    },
    [setEdges],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange<WorkflowNode>[]) => {
      onNodesChangeBase(changes)

      const wasRemoved = changes.some(
        (change) => change.type === 'remove' && change.id === selectedNodeId,
      )
      if (wasRemoved) {
        setSelectedNodeId(null)
      }
    },
    [onNodesChangeBase, selectedNodeId],
  )

  const addNode = useCallback(
    (type: WorkflowNodeType, position: XYPosition) => {
      const node = createNode(type, position)
      setNodes((current) => [...current, node])
      setSelectedNodeId(node.id)
    },
    [setNodes],
  )

  const updateNodeConfig = useCallback(
    (nodeId: string, nextConfig: WorkflowNodeConfig) => {
      setNodes((current) =>
        current.map((node) => {
          if (node.id !== nodeId) {
            return node
          }

          return {
            ...node,
            data: {
              ...node.data,
              config: nextConfig,
            },
          }
        }),
      )
    },
    [setNodes],
  )

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) {
      return
    }

    setNodes((current) => current.filter((node) => node.id !== selectedNodeId))
    setEdges((current) =>
      current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId),
    )
    setSelectedNodeId(null)
  }, [selectedNodeId, setEdges, setNodes])

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeConfig,
    deleteSelectedNode,
    setSelectedNodeId,
  }
}

