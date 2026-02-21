import { useCallback, type DragEvent } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes
} from "@xyflow/react";
import { WorkflowNode } from "./components/nodes/WorkflowNode";
import { ComponentPalette } from "./components/panels/ComponentPalette";
import { ConfigPanel } from "./components/panels/ConfigPanel";
import { ExecutionPanel } from "./components/panels/ExecutionPanel";
import { useWorkflowStore } from "./store/workflowStore";

const nodeTypes: NodeTypes = {
  workflow: WorkflowNode
};

function WorkflowCanvas() {
  const reactFlow = useReactFlow();
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const selectNode = useWorkflowStore((state) => state.selectNode);
  const addNodeFromTemplate = useWorkflowStore((state) => state.addNodeFromTemplate);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const templateId = event.dataTransfer.getData("application/reactflow-template");
      if (!templateId) {
        return;
      }

      const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNodeFromTemplate(templateId, position);
    },
    [addNodeFromTemplate, reactFlow]
  );

  return (
    <section className="canvas-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
      <ExecutionPanel />
    </section>
  );
}

export function App() {
  const runWorkflow = useWorkflowStore((state) => state.runWorkflow);
  const resetWorkflow = useWorkflowStore((state) => state.resetWorkflow);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Visual Workflow Engine</h1>
          <p>React Flow + JSON contracts + deterministic run simulation</p>
        </div>
        <div className="topbar-actions">
          <button onClick={runWorkflow}>Validate & Run</button>
          <button onClick={resetWorkflow} className="secondary">
            Reset
          </button>
        </div>
      </header>

      <main className="workspace">
        <ComponentPalette />

        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>

        <ConfigPanel />
      </main>
    </div>
  );
}

