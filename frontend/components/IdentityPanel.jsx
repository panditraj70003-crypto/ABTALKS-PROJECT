import React from "react";

export default function IdentityPanel({
  initials,
  domain,
  name,
  preset,
  postsCount,
  rejectedCount,
  memoryTagsCount,
}) {
  return (
    <>
      <div className="avatar">{initials}</div>
      <div className="id-domain">{domain}</div>
      <h2 className="id-name display">{name}</h2>
      <p className="id-bio">{preset.bio}</p>

      <ul className="convictions">
        {preset.convictions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      <div className="stats">
        <div>
          <span className="stat-num">{postsCount}</span>
          <span className="stat-label">Published</span>
        </div>
        <div>
          <span className="stat-num">{rejectedCount}</span>
          <span className="stat-label">Passed on</span>
        </div>
        <div>
          <span className="stat-num">{memoryTagsCount}</span>
          <span className="stat-label">In memory</span>
        </div>
      </div>
    </>
  );
}
