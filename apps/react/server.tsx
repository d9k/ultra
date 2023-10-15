import { renderToReadableStream } from "react-dom/server";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import App from "./app.tsx";

const root = Deno.cwd();

// create symlink to ultra for development
try {
  await Deno.symlink("../../", "./ultra", { type: "dir" });
} catch (error) {
  // ignore
}

const importMap = {
  imports: {
    "react": "https://esm.sh/react@18?dev",
    "react/": "https://esm.sh/react@18&dev/",
    "react-dom/": "https://esm.sh/react-dom@18&dev&external=react/",
    "/~/": import.meta.resolve("./"),
    "ultra/": import.meta.resolve("./ultra/"),
  },
};

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request} importMap={importMap}>
        <App />
      </UltraServer>,
      {
        bootstrapModules: [
          import.meta.resolve("./client.tsx"),
        ],
      },
    );
  },
});

const compiler = createCompilerHandler({
  root,
});

Deno.serve((request) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }

  if (compiler.supportsRequest(request)) {
    return compiler.handleRequest(request);
  }

  if (renderer.supportsRequest(request)) {
    return renderer.handleRequest(request);
  }

  return new Response("Not Found", { status: 404 });
});
