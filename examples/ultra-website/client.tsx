import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import hydrate from "ultra/hydrate.js";
import { Router } from "wouter";
import App from "./src/app.tsx";
import { queryClient } from "./src/query-client.ts";

declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

hydrate(
  document,
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
        <Router>
          <App />
        </Router>
      </Hydrate>
    </QueryClientProvider>
  </HelmetProvider>,
);
