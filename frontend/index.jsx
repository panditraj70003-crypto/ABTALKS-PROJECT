import React from "react";
import { createRoot } from "react-dom/client";
import AgentFeed from "./AgentFeed";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AgentFeed />
  </React.StrictMode>
);