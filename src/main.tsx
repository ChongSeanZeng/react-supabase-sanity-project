import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { App } from "./App";
import { routes } from "./routes";
import { assetUrl } from "./lib/assets";

import "./index.css";

document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute("href", assetUrl("/assets/logo.png"));

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <App router={createBrowserRouter(routes)} />
    </HelmetProvider>
  </StrictMode>
);

if (root.dataset.prerendered === "true" && ["/", "/en", "/en/"].includes(window.location.pathname)) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
