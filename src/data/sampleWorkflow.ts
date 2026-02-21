import type { Edge, Node } from "@xyflow/react";
import type { WorkflowNodeData } from "../domain/types";

export const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "node-1",
    position: { x: 50, y: 100 },
    type: "workflow",
    data: {
      label: "Chat Input",
      componentId: "chat-input",
      componentType: "input",
      config: { source: "web", includeMetadata: true },
      contract: {
        inputs: {},
        outputs: { message: { text: "string", userId: "string" } }
      },
      inputPorts: [],
      outputPorts: [{ key: "message", label: "message" }]
    }
  },
  {
    id: "node-2",
    position: { x: 340, y: 100 },
    type: "workflow",
    data: {
      label: "JSON Parser",
      componentId: "json-parser",
      componentType: "utility",
      config: { pick: "text,userId" },
      contract: {
        inputs: { raw: { any: true } },
        outputs: { parsed: { extracted: "json" } }
      },
      inputPorts: [{ key: "raw", label: "raw" }],
      outputPorts: [{ key: "parsed", label: "parsed" }]
    }
  },
  {
    id: "node-3",
    position: { x: 650, y: 100 },
    type: "workflow",
    data: {
      label: "Summarizer Agent",
      componentId: "summarizer-agent",
      componentType: "agent",
      config: { tone: "concise", maxWords: 40 },
      contract: {
        inputs: { context: { any: true } },
        outputs: { summary: { text: "string", confidence: "number" } }
      },
      inputPorts: [{ key: "context", label: "context" }],
      outputPorts: [{ key: "summary", label: "summary" }]
    }
  },
  {
    id: "node-4",
    position: { x: 980, y: 100 },
    type: "workflow",
    data: {
      label: "JSON Output",
      componentId: "json-output",
      componentType: "output",
      config: { pretty: true },
      contract: {
        inputs: { result: { any: true } },
        outputs: {}
      },
      inputPorts: [{ key: "result", label: "result" }],
      outputPorts: []
    }
  }
];

export const initialEdges: Edge[] = [
  { id: "e-1-2", source: "node-1", target: "node-2", sourceHandle: "out-message", targetHandle: "in-raw" },
  { id: "e-2-3", source: "node-2", target: "node-3", sourceHandle: "out-parsed", targetHandle: "in-context" },
  { id: "e-3-4", source: "node-3", target: "node-4", sourceHandle: "out-summary", targetHandle: "in-result" }
];
