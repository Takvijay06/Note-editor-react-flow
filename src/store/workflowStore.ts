import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange
} from "@xyflow/react";
import { componentRegistry, registryById } from "../data/componentRegistry";
import { initialEdges, initialNodes } from "../data/sampleWorkflow";
import type { ExecutionLog, JsonValue, WorkflowNodeData } from "../domain/types";
import { executeWorkflow, validateWorkflow } from "../engine/workflowEngine";

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: string[];
  executionLogs: ExecutionLog[];
  finalOutput: Record<string, JsonValue> | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNodeFromTemplate: (templateId: string, position?: { x: number; y: number }) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeConfig: (nodeId: string, key: string, rawValue: string) => void;
  runWorkflow: () => void;
  resetWorkflow: () => void;
}

function parseValue(rawValue: string): JsonValue {
  const trimmed = rawValue.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (trimmed !== "" && !Number.isNaN(Number(trimmed))) return Number(trimmed);

  try {
    return JSON.parse(trimmed) as JsonValue;
  } catch {
    return rawValue;
  }
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  validationErrors: [],
  executionLogs: [],
  finalOutput: null,

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    })),

  onConnect: (connection) => {
    const state = get();
    if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      return;
    }

    const sourceNode = state.nodes.find((node) => node.id === connection.source);
    const targetNode = state.nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return;
    if (sourceNode.data.componentType === "output" || targetNode.data.componentType === "input") return;

    set({
      edges: addEdge({ ...connection, id: `e-${connection.source}-${connection.target}-${Date.now()}` }, state.edges)
    });
  },

  addNodeFromTemplate: (templateId, position) =>
    set((state) => {
      const template = registryById[templateId];
      if (!template) return state;

      const nodeId = `node-${Math.random().toString(36).slice(2, 10)}`;
      const index = state.nodes.length + 1;

      const node: Node<WorkflowNodeData> = {
        id: nodeId,
        type: "workflow",
        position: position ?? { x: 100 + (index % 5) * 200, y: 280 + Math.floor(index / 5) * 140 },
        data: {
          label: template.name,
          componentId: template.id,
          componentType: template.type,
          config: { ...template.defaults },
          contract: template.ioContract,
          inputPorts: template.inputPorts,
          outputPorts: template.outputPorts
        }
      };

      return { nodes: [...state.nodes, node] };
    }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  updateNodeConfig: (nodeId, key, rawValue) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;

        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              [key]: parseValue(rawValue)
            }
          }
        };
      })
    })),

  runWorkflow: () => {
    const state = get();
    const errors = validateWorkflow(state.nodes, state.edges);

    if (errors.length > 0) {
      set({ validationErrors: errors, executionLogs: [], finalOutput: null });
      return;
    }

    const result = executeWorkflow(state.nodes, state.edges);
    set({
      validationErrors: [],
      executionLogs: result.logs,
      finalOutput: result.finalOutput
    });
  },

  resetWorkflow: () =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: null,
      validationErrors: [],
      executionLogs: [],
      finalOutput: null
    })
}));

export function getTemplatesByType(type: string) {
  return componentRegistry.filter((template) => template.type === type);
}
