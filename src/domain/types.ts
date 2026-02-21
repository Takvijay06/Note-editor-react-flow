export type ComponentCategory = "input" | "output" | "tool" | "agent" | "connector" | "utility";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface PortDefinition {
  key: string;
  label: string;
  schemaHint?: string;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  type: ComponentCategory;
  description: string;
  defaults: Record<string, JsonValue>;
  inputPorts: PortDefinition[];
  outputPorts: PortDefinition[];
  ioContract: {
    inputs: Record<string, JsonValue>;
    outputs: Record<string, JsonValue>;
  };
}

export interface WorkflowNodeData {
  label: string;
  componentId: string;
  componentType: ComponentCategory;
  config: Record<string, JsonValue>;
  contract: {
    inputs: Record<string, JsonValue>;
    outputs: Record<string, JsonValue>;
  };
  inputPorts: PortDefinition[];
  outputPorts: PortDefinition[];
}

export interface ExecutionLog {
  nodeId: string;
  nodeLabel: string;
  status: "success" | "skipped" | "failed";
  message: string;
  output?: Record<string, JsonValue>;
}
