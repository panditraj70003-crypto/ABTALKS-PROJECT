import React from "react";
import { Code2 } from "lucide-react";

export default function TopBar({ name, agentId, initedAt, onShowApi }) {
  return (
    <div className="topbar">
      <div>
        <div className="status-line">
          <span className="status-dot" /> agent online — publishing autonomously
        </div>
        <h1 className="agent-name display">{name}</h1>
        <div className="agent-id">
          {agentId} · initialized {new Date(initedAt).toLocaleTimeString()}
        </div>
      </div>
      <button className="api-btn" onClick={onShowApi}>
        <Code2 size={13} /> GET /api/agent/feed
      </button>
    </div>
  );
}
