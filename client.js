import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"]
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
},{
  capabilities: {
    resources: {},
    tools: {},
  },
});

await client.connect(transport);

const result = await client.callTool({
  name: "add",
  arguments: {
    a: 4,
    b: 50
  }
});
console.log(`Tool executed-----> ${JSON.stringify(result)}`)

const tools = await client.listTools()
console.log(`List of tools-----> ${JSON.stringify(tools)}`)

// List resources
const resources = await client.listResources()
console.log(`List of resources-----> ${JSON.stringify(resources)}`)

// Read a resource
const resource = await client.readResource({
  uri: "file:///text.txt",
});

console.log("Resource::::::", JSON.stringify(resource, null, 2));
console.log(`HERE-----> END`)