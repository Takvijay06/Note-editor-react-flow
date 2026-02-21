import type { ComponentTemplate } from "../domain/types";

export const componentRegistry: ComponentTemplate[] = [
  {
    id: "chat-input",
    name: "Chat Input",
    type: "input",
    description: "Starts workflow with user chat payload.",
    defaults: { source: "web", includeMetadata: true },
    inputPorts: [],
    outputPorts: [{ key: "message", label: "message" }],
    ioContract: {
      inputs: {},
      outputs: { message: { text: "string", userId: "string" } }
    }
  },
  {
    id: "text-input",
    name: "Text Input",
    type: "input",
    description: "Starts workflow with static text.",
    defaults: { text: "Hello from workflow" },
    inputPorts: [],
    outputPorts: [{ key: "text", label: "text" }],
    ioContract: {
      inputs: {},
      outputs: { text: "string" }
    }
  },
  {
    id: "webhook-input",
    name: "Webhook Input",
    type: "input",
    description: "Starts workflow from external webhook request.",
    defaults: { route: "/hooks/new-lead" },
    inputPorts: [],
    outputPorts: [{ key: "payload", label: "payload" }],
    ioContract: {
      inputs: {},
      outputs: { payload: { body: "json", headers: "json" } }
    }
  },
  {
    id: "json-parser",
    name: "JSON Parser",
    type: "utility",
    description: "Extracts selected keys from JSON payload.",
    defaults: { pick: "text,userId" },
    inputPorts: [{ key: "raw", label: "raw" }],
    outputPorts: [{ key: "parsed", label: "parsed" }],
    ioContract: {
      inputs: { raw: { any: true } },
      outputs: { parsed: { extracted: "json" } }
    }
  },
  {
    id: "http-connector",
    name: "HTTP Connector",
    type: "connector",
    description: "Calls external API endpoint (simulated).",
    defaults: { method: "POST", url: "https://api.example.com/process" },
    inputPorts: [{ key: "request", label: "request" }],
    outputPorts: [{ key: "response", label: "response" }],
    ioContract: {
      inputs: { request: { body: "json" } },
      outputs: { response: { status: "number", data: "json" } }
    }
  },
  {
    id: "summarizer-agent",
    name: "Summarizer Agent",
    type: "agent",
    description: "Creates a short summary from incoming payload.",
    defaults: { tone: "concise", maxWords: 40 },
    inputPorts: [{ key: "context", label: "context" }],
    outputPorts: [{ key: "summary", label: "summary" }],
    ioContract: {
      inputs: { context: { any: true } },
      outputs: { summary: { text: "string", confidence: "number" } }
    }
  },
  {
    id: "chat-output",
    name: "Chat Output",
    type: "output",
    description: "Sends text payload to chat channel.",
    defaults: { channel: "support" },
    inputPorts: [{ key: "message", label: "message" }],
    outputPorts: [],
    ioContract: {
      inputs: { message: { text: "string" } },
      outputs: {}
    }
  },
  {
    id: "json-output",
    name: "JSON Output",
    type: "output",
    description: "Exposes structured result.",
    defaults: { pretty: true },
    inputPorts: [{ key: "result", label: "result" }],
    outputPorts: [],
    ioContract: {
      inputs: { result: { any: true } },
      outputs: {}
    }
  }
];

export const registryById = componentRegistry.reduce<Record<string, ComponentTemplate>>((acc, template) => {
  acc[template.id] = template;
  return acc;
}, {});
