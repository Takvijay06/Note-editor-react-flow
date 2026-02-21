import type { DragEvent } from "react";
import { componentRegistry } from "../../data/componentRegistry";
import { useWorkflowStore } from "../../store/workflowStore";

const typeOrder = ["input", "tool", "agent", "connector", "utility", "output"] as const;

export function ComponentPalette() {
  const addNodeFromTemplate = useWorkflowStore((state) => state.addNodeFromTemplate);

  const onDragStart = (event: DragEvent<HTMLButtonElement>, templateId: string) => {
    event.dataTransfer.setData("application/reactflow-template", templateId);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="panel panel--left">
      <h2>Components</h2>
      <p className="panel__subtitle">Click to add component node or drag it to canvas.</p>

      {typeOrder.map((type) => {
        const items = componentRegistry.filter((template) => template.type === type);
        if (items.length === 0) return null;

        return (
          <section key={type} className="palette-group">
            <h3>{type}</h3>
            {items.map((template) => (
              <button
                key={template.id}
                className="palette-item"
                onClick={() => addNodeFromTemplate(template.id)}
                onDragStart={(event) => onDragStart(event, template.id)}
                draggable
                title={template.description}
              >
                <span>{template.name}</span>
                <small>{template.id}</small>
              </button>
            ))}
          </section>
        );
      })}
    </aside>
  );
}
