import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 4000,
    },
    plugins: [
        ...VitePluginNode({
            adapter: "express",
            appPath: "./src/server.ts",
            exportName: "viteNodeApp",

            tsCompiler: "esbuild",
        }),
    ],
});
