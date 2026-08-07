import React from "react";
import { Radio } from "lucide-react";
import { DOMAIN_PRESETS } from "../data/domainPresets";

export default function InitScreen({ name, setName, domain, setDomain, onInitialize }) {
  return (
    <div className="init-shell">
      <div className="init-eyebrow">
        <Radio size={13} /> POST /api/agent/init
      </div>
      <h1 className="init-title display">Initialize the agent.</h1>
      <p className="init-sub">
        Set a name and a focus domain, then hand off. Once initialized, the agent
        discovers topics, applies editorial judgment, and publishes on its own —
        no further prompts.
      </p>

      <div className="field">
        <label className="field-label">Persona name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vantage" />
      </div>

      <div className="field">
        <label className="field-label">Domain</label>
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          {Object.keys(DOMAIN_PRESETS).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <button className="init-btn" onClick={onInitialize}>
        Initialize agent →
      </button>

      <div className="init-code">
        {`{
  "persona": {
    "name": `}
        <span className="k">"{name || "…"}"</span>
        {`,
    "domain": `}
        <span className="k">"{domain}"</span>
        {`
  }
}`}
      </div>
    </div>
  );
}
