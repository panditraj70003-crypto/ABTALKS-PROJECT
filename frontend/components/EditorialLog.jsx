import React from "react";
import { CircleCheck, CircleDashed, X } from "lucide-react";

function LogIcon({ type }) {
  if (type === "accept") return <CircleCheck size={13} color="var(--accept)" />;
  if (type === "reject") return <X size={13} color="var(--reject)" />;
  return <CircleDashed size={13} color="var(--text-faint)" />;
}

export default function EditorialLog({ log }) {
  return (
    <>
      <div className="log-title">Editorial log</div>
      <div className="log-list">
        {log.length === 0 && (
          <div className="log-note" style={{ fontSize: 12 }}>
            Scanning sources…
          </div>
        )}
        {log.map((item) => (
          <div className="log-item" key={item.id}>
            <span className="log-icon">
              <LogIcon type={item.type} />
            </span>
            <span className="log-text">
              {item.title && <span className="log-title-t">{item.title}</span>}
              <span className="log-note">{item.note}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
