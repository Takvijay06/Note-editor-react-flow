import { useWorkflowStore } from "../../store/workflowStore";

export function ExecutionPanel() {
  const validationErrors = useWorkflowStore((state) => state.validationErrors);
  const executionLogs = useWorkflowStore((state) => state.executionLogs);
  const finalOutput = useWorkflowStore((state) => state.finalOutput);

  return (
    <section className="execution-panel">
      <div>
        <h3>Validation</h3>
        {validationErrors.length === 0 ? (
          <p className="ok">No errors.</p>
        ) : (
          <ul>
            {validationErrors.map((error) => (
              <li key={error} className="error">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Execution Log</h3>
        {executionLogs.length === 0 ? (
          <p className="panel__subtitle">Run the workflow to view execution order.</p>
        ) : (
          <ul>
            {executionLogs.map((log) => (
              <li key={`${log.nodeId}-${log.message}`}>
                <strong>{log.nodeLabel}</strong>: {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Final Output</h3>
        <pre>{finalOutput ? JSON.stringify(finalOutput, null, 2) : "No output yet"}</pre>
      </div>
    </section>
  );
}
