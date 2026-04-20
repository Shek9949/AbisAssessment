# HR Workflow Designer Prototype

Interactive mini-module to design and test HR workflows (onboarding, leave approval, document verification) using React + React Flow.

## How to Run

npm install
npm run dev

## What Is Implemented

1. React app bootstrapped with Vite + TypeScript
2. React Flow canvas with drag-and-drop custom nodes
3. Node-specific configuration forms in a dedicated panel
4. Mock API layer for automations and simulation
5. Workflow test/sandbox panel with structure validation + execution log

## Node Types

1. Start Node
2. Task Node
3. Approval Node
4. Automated Step Node
5. End Node

## Core Features

1. Drag node blocks from left palette onto canvas
2. Connect nodes using directed edges
3. Select node to open editable configuration form
4. Delete nodes via panel button or keyboard key
5. Validate workflow shape (start/end constraints, reachability, cycle check)
6. Serialize graph and call mock POST /simulate
7. Show step-by-step simulation timeline

## Mock API Contract

In this prototype, APIs are local async mocks (no backend required).

1. GET /automations
Returns actions like:

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "notify_slack", "label": "Notify Slack", "params": ["channel", "message"] }
]
```

2. POST /simulate
Accepts serialized workflow JSON and returns:
1. validity flag
2. validation errors (if any)
3. ordered execution steps

## Architecture

```text
src/
  features/workflow/
    api/mockApi.ts                 # local async API facade
    hooks/useWorkflowDesigner.ts   # canvas state + node/edge operations
    components/
      WorkflowDesigner.tsx         # feature composition root
      NodePalette.tsx              # drag source sidebar
      NodeConfigPanel.tsx          # dynamic forms by node type
      SandboxPanel.tsx             # simulation + serialized output
      forms/KeyValueEditor.tsx     # reusable KV field editor
      nodes/*.tsx                  # custom React Flow node renderers
    utils/validation.ts            # graph structural validation
    types.ts                       # domain + graph types
```

## Design Choices

1. Feature-first structure
Keeps workflow-specific logic cohesive and scalable.

2. Typed node model + config map
Allows each node to hold specific config data while sharing canvas behaviors.

3. Dedicated state hook
`useWorkflowDesigner` centralizes graph editing actions (add, connect, select, update, delete).

4. Extensible form strategy
`NodeConfigPanel` renders specialized forms per node kind and can be extended with new node types.

5. Pre-simulation validation
Client-side graph validation catches issues early before the mock API call.

## Assumptions

1. Single Start and single End are mandatory
2. Workflow is expected to be acyclic for this prototype
3. Simulation follows the first outgoing edge at branch points (deterministic path)
4. No persistence/auth was required, so state is in-memory only

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Future Improvements

1. Persist workflows (local storage or backend)
2. Rich branch conditions and multi-path simulation
3. Undo/redo stack
4. Node templates and reusable sub-workflows
5. MSW-backed API mocking for closer real API parity
