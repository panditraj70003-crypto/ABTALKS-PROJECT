import { useState, useRef, useCallback, useEffect } from "react";
import { DOMAIN_PRESETS, GENERIC_PRESET, TAG_MAP } from "../data/domainPresets";
import { TOPICS } from "../data/topics";
import { shuffled, makeId, buildPost } from "../utils/helpers";

/**
 * Encapsulates the entire agent lifecycle: init -> live simulation,
 * topic queue, editorial log, memory/dedupe rules, and published posts.
 */
export function useAgentFeed() {
  const [phase, setPhase] = useState("init"); // init | live
  const [name, setName] = useState("Vantage");
  const [domain, setDomain] = useState("AI Security");
  const [agentId, setAgentId] = useState(null);
  const [initedAt, setInitedAt] = useState(null);

  const [posts, setPosts] = useState([]);
  const [log, setLog] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showApi, setShowApi] = useState(false);
  const [, forceTick] = useState(0);

  const queueRef = useRef([]);
  const pointerRef = useRef(0);
  const memoryRef = useRef(new Set());

  const preset = DOMAIN_PRESETS[domain] || GENERIC_PRESET;
  const tag = TAG_MAP[domain];

  const initialize = useCallback(() => {
    const id = makeId("agent");
    setAgentId(id);
    setInitedAt(new Date().toISOString());

    const tagged = tag ? TOPICS.filter((t) => t.tags.includes(tag)) : [];
    const rest = TOPICS.filter((t) => !tagged.includes(t));
    queueRef.current = shuffled([...tagged, ...shuffled(rest)]);
    pointerRef.current = 0;
    memoryRef.current = new Set();

    setPhase("live");
  }, [tag]);

  const runCycle = useCallback(() => {
    const queue = queueRef.current;
    if (pointerRef.current >= queue.length) {
      setLog((l) => [
        {
          id: makeId("log"),
          type: "idle",
          note: "Swept all current sources — nothing new clears the bar yet.",
          at: new Date().toISOString(),
        },
        ...l,
      ]);
      return;
    }
    const topic = queue[pointerRef.current];
    pointerRef.current += 1;

    const isReject = topic.kind === "marketing" || topic.kind === "rumor";

    if (isReject) {
      setLog((l) => [
        {
          id: makeId("log"),
          type: "reject",
          title: topic.title,
          note: topic.rejectReason,
          at: new Date().toISOString(),
        },
        ...l,
      ]);
      return;
    }

    // memory check — skip near-duplicate tag saturation (soft rule)
    const tagKey = topic.tags.join(",");
    const seenCount = [...memoryRef.current].filter((k) => k === tagKey).length;
    if (seenCount >= 4) {
      setLog((l) => [
        {
          id: makeId("log"),
          type: "reject",
          title: topic.title,
          note: "Already covered this thread recently — holding to avoid repeating myself.",
          at: new Date().toISOString(),
        },
        ...l,
      ]);
      return;
    }

    memoryRef.current.add(tagKey);
    const post = buildPost(topic, name);
    setPosts((p) => [post, ...p]);
    setLog((l) => [
      {
        id: makeId("log"),
        type: "accept",
        title: topic.title,
        note: "Cleared the bar — publishing.",
        at: new Date().toISOString(),
      },
      ...l,
    ]);
  }, [name]);

  useEffect(() => {
    if (phase !== "live") return;
    const first = setTimeout(runCycle, 1800);
    const interval = setInterval(runCycle, 13000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [phase, runCycle]);

  // re-render every few seconds so relative timestamps stay fresh
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const acceptedCount = log.filter((l) => l.type === "accept").length;
  const rejectedCount = log.filter((l) => l.type === "reject").length;
  const memoryTags = [...new Set(posts.flatMap((p) => p.tags))];
  const initials = name.trim().slice(0, 2).toUpperCase() || "AI";

  return {
    // state
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
    // derived
    acceptedCount,
    rejectedCount,
    memoryTags,
    initials,
    // actions
    initialize,
  };
}
