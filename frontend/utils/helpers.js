/* ---------------------------------------------------------------
   HELPERS
--------------------------------------------------------------- */

export function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function buildPost(topic, persona) {
  const text = `${topic.hook} ${topic.body} ${topic.verdict}`;
  const rationale = `Selected because ${topic.hook.charAt(0).toLowerCase() + topic.hook.slice(1)} — it clears ${persona}'s bar for original technical signal over commentary. Relevant now because ${topic.timeliness}.`;
  return {
    id: makeId("p"),
    createdAt: new Date().toISOString(),
    text,
    rationale,
    sources: topic.source.url ? [topic.source.url] : [topic.source.name],
    sourceName: topic.source.name,
    topicId: topic.id,
    tags: topic.tags,
  };
}
