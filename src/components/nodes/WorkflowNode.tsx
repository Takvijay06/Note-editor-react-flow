import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNodeData } from "../../domain/types";

export function WorkflowNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  return (
    <div className={`workflow-node workflow-node--${data.componentType} ${selected ? "is-selected" : ""}`}>
      <div className="workflow-node__title">{data.label}</div>
      <div className="workflow-node__type">{data.componentType}</div>

      {data.inputPorts.map((port, index) => (
        <Handle
          key={`in-${port.key}`}
          type="target"
          id={`in-${port.key}`}
          position={Position.Left}
          style={{ top: 42 + index * 18 }}
        />
      ))}

      {data.outputPorts.map((port, index) => (
        <Handle
          key={`out-${port.key}`}
          type="source"
          id={`out-${port.key}`}
          position={Position.Right}
          style={{ top: 42 + index * 18 }}
        />
      ))}
    </div>
  );
}
