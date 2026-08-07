import React from "react";
import { ChevronDown, ChevronUp, Link2 } from "lucide-react";
import { relTime } from "../utils/helpers";

export default function PostFeed({ posts, expanded, setExpanded }) {
  if (posts.length === 0) {
    return (
      <div className="feed-empty">
        First cycle running — the agent is discovering and evaluating topics now.
      </div>
    );
  }

  return (
    <div className="rail">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <div className="post-time">
            {relTime(post.createdAt)} · {new Date(post.createdAt).toLocaleTimeString()}
          </div>
          <p className="post-text">{post.text}</p>
          <button
            className="toggle-why"
            onClick={() => setExpanded(expanded === post.id ? null : post.id)}
          >
            {expanded === post.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            why this, why now
          </button>
          {expanded === post.id && (
            <div className="why-panel">
              <div className="why-label">Rationale</div>
              <p className="why-text">{post.rationale}</p>
              <div className="why-label">Source</div>
              <div>
                {post.sources.map((s, i) =>
                  s.startsWith("http") ? (
                    <a key={i} className="source-chip" href={s} target="_blank" rel="noreferrer">
                      <Link2 size={11} /> {post.sourceName}
                    </a>
                  ) : (
                    <span key={i} className="source-chip">
                      <Link2 size={11} /> {s}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
