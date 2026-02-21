import type { Edge, Node } from "@xyflow/react";
import type { ExecutionLog, JsonValue, WorkflowNodeData } from "../domain/types";

interface ExecutionResult {
  logs: ExecutionLog[];
  finalOutput: Record<string, JsonValue> | null;
}

export function validateWorkflow(nodes: Node<WorkflowNodeData>[], edges: Edge[]): string[] {
  const errors: string[] = [];

  for (const node of nodes) {
    const inDegree = edges.filter((edge) => edge.target === node.id).length;
    const outDegree = edges.filter((edge) => edge.source === node.id).length;

    if (node.data.componentType === "input" && inDegree > 0) {
      errors.push(`${node.data.label} cannot have incoming connections.`);
    }
    if (node.data.componentType === "output" && outDegree > 0) {
      errors.push(`${node.data.label} cannot have outgoing connections.`);
    }
    if (node.data.componentType !== "input" && node.data.inputPorts.length > 0 && inDegree === 0) {
      errors.push(`${node.data.label} requires at least one incoming connection.`);
    }
  }

  return errors;
}

export function executeWorkflow(nodes: Node<WorkflowNodeData>[], edges: Edge[]): ExecutionResult {
  const logs: ExecutionLog[] = [];
  const queue = [...nodes.filter((node) => node.data.componentType === "input")];
  const visited = new Set<string>();
  const outputsByNode = new Map<string, Record<string, JsonValue>>();

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node || visited.has(node.id)) {
      continue;
    }

    const inbound = edges.filter((edge) => edge.target === node.id);
    const mergedInput = inbound.reduce<Record<string, JsonValue>>((acc, edge) => {
      const sourceOutput = outputsByNode.get(edge.source);
      if (sourceOutput) {
        Object.assign(acc, sourceOutput);
      }
      return acc;
    }, {});

    const output = simulateNode(node, mergedInput);
    outputsByNode.set(node.id, output);
    visited.add(node.id);

    logs.push({
      nodeId: node.id,
      nodeLabel: node.data.label,
      status: "success",
      message: `Executed ${node.data.componentId}`,
      output
    });

    const nextNodeIds = edges.filter((edge) => edge.source === node.id).map((edge) => edge.target);
    const nextNodes = nextNodeIds
      .map((id) => nodes.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is Node<WorkflowNodeData> => Boolean(candidate));

    for (const nextNode of nextNodes) {
      const allParentsVisited = edges
        .filter((edge) => edge.target === nextNode.id)
        .every((edge) => visited.has(edge.source));

      if (allParentsVisited) {
        queue.push(nextNode);
      }
    }
  }

  const outputNode = nodes.find((node) => node.data.componentType === "output");
  const finalOutput = outputNode ? outputsByNode.get(outputNode.id) ?? null : null;

  return { logs, finalOutput };
}

function simulateNode(node: Node<WorkflowNodeData>, input: Record<string, JsonValue>): Record<string, JsonValue> {
  switch (node.data.componentId) {
    case "chat-input":
      return { message: { text: "Need summary of ticket #123", userId: "u-1002" } };
    case "text-input":
      return { text: node.data.config.text ?? "" };
    case "webhook-input":
      return { payload: { body: { event: "new-lead", source: "website" }, headers: { token: "dummy-token" } } };
    case "json-parser":
      return { parsed: { extracted: input } };
    case "http-connector":
      return { response: { status: 200, data: { echoed: input } } };
    case "summarizer-agent": {
      const source = JSON.stringify(input);
      const clipped = source.length > 120 ? `${source.slice(0, 120)}...` : source;
      return { summary: { text: `Summary: ${clipped}`, confidence: 0.93 } };
    }
    case "chat-output":
      return { delivered: true, message: input };
    case "json-output":
      return { result: input };
    default:
      return { passthrough: input };
  }
}
