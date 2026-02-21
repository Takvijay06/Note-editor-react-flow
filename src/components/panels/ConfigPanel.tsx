import { useMemo } from "react";
import { useWorkflowStore } from "../../store/workflowStore";

export function ConfigPanel() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

  return (
    <aside className="panel panel--right">
      <h2>Configuration</h2>
      {!selectedNode && <p className="panel__subtitle">Select a node to edit its config and JSON contract.</p>}

      {selectedNode && (
        <>
          <div className="config-title">
            <h3>{selectedNode.data.label}</h3>
            <small>{selectedNode.data.componentId}</small>
          </div>

          <div className="config-section">
            <h4>Config</h4>
            {Object.entries(selectedNode.data.config).map(([key, value]) => (
              <label key={key} className="config-field">
                <span>{key}</span>
                <input
                  type="text"
                  value={typeof value === "string" ? value : JSON.stringify(value)}
                  onChange={(event) => updateNodeConfig(selectedNode.id, key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="config-section">
            <h4>JSON Contract</h4>
            <pre>{JSON.stringify(selectedNode.data.contract, null, 2)}</pre>
          </div>
        </>
      )}
    </aside>
  );
}
