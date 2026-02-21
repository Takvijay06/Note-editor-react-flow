# Visual Workflow Engine (React Flow)

Frontend-only scalable workflow builder using React + TypeScript + React Flow, built with dummy data and no backend.

## Features implemented

- Component-based visual workflow canvas
- Left component palette (input/output/tool/agent/connector/utility)
- Right configuration panel with editable node config
- Standard JSON input/output contract per component
- Port-based node connections using handles
- Workflow validation rules:
  - input nodes: output only
  - output nodes: input only
  - required inbound links for non-input nodes with input ports
- Deterministic execution simulation with logs and final JSON output
- Sample workflow preloaded
- Reset and run actions

## Stack

- React
- TypeScript
- Vite
- @xyflow/react
- Zustand

## Run

```bash
npm install
npm run dev
```

## Project structure

- `src/data/componentRegistry.ts`: pluggable component templates and JSON contracts
- `src/data/sampleWorkflow.ts`: initial dummy nodes and edges
- `src/engine/workflowEngine.ts`: validation + deterministic execution logic
- `src/store/workflowStore.ts`: centralized workflow state and actions
- `src/components/panels/*`: palette, config, and execution panels
- `src/components/nodes/WorkflowNode.tsx`: reusable React Flow node renderer

## JSON contract example

```json
{
  "id": "component-id",
  "type": "input | output | tool | agent | connector | utility",
  "inputs": {},
  "outputs": {}
}
```
