import React from "react";
import { X } from "lucide-react";

export default function ApiModal({ agentId, posts, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>GET /api/agent/feed?agentId={agentId}</span>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <pre>
          {JSON.stringify(
            {
              posts: posts.map((p) => ({
                id: p.id,
                createdAt: p.createdAt,
                text: p.text,
                rationale: p.rationale,
                sources: p.sources,
              })),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
