import fs from 'fs';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ReadResourceRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
    name: "Demo",
    version: "1.0.0"
}, {
    capabilities: {
        resources: {}, 
        tools: {},
    },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [{
            name: "add",
            description: "A tool for basic addition.",
            inputSchema: {
                type: "object",
                properties: {
                    a: { type: "number" },
                    b: { type: "number" }
                },
                required: ["a", "b"]
            }
        }]
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "add") {
        const { a, b } = request.params.arguments;
        return {
            content: [
                {
                    type: "text",
                    text: String(a + b)
                }
            ]
        };
    }
    throw new Error("Tool not found");
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
    console.error("LIST RESOURCES HANDLER CALLED");
    return {
        resources: [
            {
                uri: "file:///text.txt",
                name: "File Loremps",
                mimeType: "text/plain"
            }
        ]
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    console.error("ReadResourceRequestSchema HANDLER CALLED");

    const uri = request.params.uri;

    if (uri === "file:///text.txt") {
        const filename = uri.replace("file:///", "")
        const logContents = fs.readFileSync(filename, "utf8");
        return {
            contents: [
                {
                    uri,
                    mimeType: "text/plain",
                    text: logContents
                }
            ]
        };
    }

    throw new Error("Resource not found");
});

async function startServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCCP Server running on stdio...");
}

startServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
