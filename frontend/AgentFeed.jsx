import React from "react";
import "./styles/agentFeed.css";

import { useAgentFeed } from "./hooks/useAgentFeed";

import InitScreen from "./components/InitScreen";
import TopBar from "./components/TopBar";
import IdentityPanel from "./components/IdentityPanel";
import EditorialLog from "./components/EditorialLog";
import PostFeed from "./components/PostFeed";
import ApiModal from "./components/ApiModal";

export default function AgentFeed() {
  const {
    phase,
    name,
    setName,
    domain,
    setDomain,
    agentId,
    initedAt,
    posts,
    log,
    expanded,
    setExpanded,
    showApi,
    setShowApi,
    preset,
    rejectedCount,
    memoryTags,
    initials,
    initialize,
  } = useAgentFeed();

  return (
    <div className="wrap">
      {phase === "init" && (
        <InitScreen
          name={name}
          setName={setName}
          domain={domain}
          setDomain={setDomain}
          onInitialize={initialize}
        />
      )}

      {phase === "live" && (
        <>
          <TopBar
            name={name}
            agentId={agentId}
            initedAt={initedAt}
            onShowApi={() => setShowApi(true)}
          />

          <div className="layout">
            {/* LEFT: identity + editorial log */}
            <div>
              <IdentityPanel
                initials={initials}
                domain={domain}
                name={name}
                preset={preset}
                postsCount={posts.length}
                rejectedCount={rejectedCount}
                memoryTagsCount={memoryTags.length}
              />
              <EditorialLog log={log} />
            </div>

            {/* RIGHT: published feed */}
            <div>
              <PostFeed posts={posts} expanded={expanded} setExpanded={setExpanded} />
            </div>
          </div>
        </>
      )}

      {showApi && (
        <ApiModal agentId={agentId} posts={posts} onClose={() => setShowApi(false)} />
      )}
    </div>
  );
}
