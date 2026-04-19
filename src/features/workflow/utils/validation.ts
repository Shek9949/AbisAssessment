import type { WorkflowEdge, WorkflowNode, ValidationResult } from '../types.ts'

function buildAdjacency(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const incoming = new Map<string, number>()
  const outgoing = new Map<string, number>()
  const graph = new Map<string, string[]>()

  for (const node of nodes) {
    incoming.set(node.id, 0)
    outgoing.set(node.id, 0)
    graph.set(node.id, [])
  }

  for (const edge of edges) {
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1)
    outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1)
    const targets = graph.get(edge.source)
    if (targets) {
      targets.push(edge.target)
    }
  }

  return { incoming, outgoing, graph }
}

function hasCycle(nodes: WorkflowNode[], graph: Map<string, string[]>) {
  const visiting = new Set<string>()
  const visited = new Set<string>()

  const dfs = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) {
      return true
    }
    if (visited.has(nodeId)) {
      return false
    }

    visiting.add(nodeId)
    const neighbors = graph.get(nodeId) ?? []

    for (const next of neighbors) {
      if (dfs(next)) {
        return true
      }
    }

    visiting.delete(nodeId)
    visited.add(nodeId)
    return false
  }

  for (const node of nodes) {
    if (dfs(node.id)) {
      return true
    }
  }

  return false
}

export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
  const errors: string[] = []

  if (nodes.length === 0) {
    return { isValid: false, errors: ['Add at least one node to start building a workflow.'] }
  }

  const startNodes = nodes.filter((node) => node.data.kind === 'start')
  const endNodes = nodes.filter((node) => node.data.kind === 'end')

  if (startNodes.length !== 1) {
    errors.push('Workflow must contain exactly one Start node.')
  }

  if (endNodes.length !== 1) {
    errors.push('Workflow must contain exactly one End node.')
  }

  const { incoming, outgoing, graph } = buildAdjacency(nodes, edges)

  if (startNodes.length === 1) {
    const startNode = startNodes[0]
    if ((incoming.get(startNode.id) ?? 0) > 0) {
      errors.push('Start node cannot have incoming connections.')
    }
    if ((outgoing.get(startNode.id) ?? 0) === 0) {
      errors.push('Start node must connect to at least one next step.')
    }
  }

  if (endNodes.length === 1) {
    const endNode = endNodes[0]
    if ((outgoing.get(endNode.id) ?? 0) > 0) {
      errors.push('End node cannot have outgoing connections.')
    }
    if ((incoming.get(endNode.id) ?? 0) === 0) {
      errors.push('End node must be reachable from a previous step.')
    }
  }

  for (const node of nodes) {
    if (node.data.kind !== 'end' && (outgoing.get(node.id) ?? 0) === 0) {
      errors.push(`Node "${node.id}" has no outgoing connection.`)
    }
  }

  if (hasCycle(nodes, graph)) {
    errors.push('Workflow contains a cycle. Use a directed acyclic flow for this prototype.')
  }

  if (startNodes.length === 1) {
    const visited = new Set<string>()
    const queue: string[] = [startNodes[0].id]

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current || visited.has(current)) {
        continue
      }
      visited.add(current)

      for (const next of graph.get(current) ?? []) {
        queue.push(next)
      }
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        errors.push(`Node "${node.id}" is not reachable from Start.`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

