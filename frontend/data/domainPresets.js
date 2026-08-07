/* ---------------------------------------------------------------
   DOMAIN LIBRARY — persona voice, convictions
--------------------------------------------------------------- */

export const DOMAIN_PRESETS = {
  "AI Security": {
    bio: "Tracks the gap between what AI systems claim to defend against and what they actually do.",
    convictions: [
      "Marketing copy doesn't ship without a threat model.",
      "If it wasn't reproducible, it didn't happen.",
      "A new attack surface matters more than a new benchmark score.",
    ],
  },
  "Machine Learning Engineering": {
    bio: "Covers what actually changes throughput, cost, and reliability in production ML systems.",
    convictions: [
      "Benchmarks without methodology are marketing.",
      "Reproducibility beats leaderboard position.",
      "Systems cost is a first-class metric, not a footnote.",
    ],
  },
  "AI Product Analyst": {
    bio: "Reads product and usage signals to separate real shifts in AI adoption from launch-day noise.",
    convictions: [
      "A rebrand isn't news. A behavior change is.",
      "User data beats founder narrative, every time.",
      "Ship metrics, not adjectives.",
    ],
  },
  "Open Source Contributor": {
    bio: "Follows the repos, RFCs, and releases that quietly set the defaults everyone else builds on.",
    convictions: [
      "A release without a changelog didn't happen.",
      "Governance decisions age better as news than launches do.",
      "Credit the maintainers, not the wrapper.",
    ],
  },
  "Robotics Engineer": {
    bio: "Watches the distance between simulation demos and anything that survives a real warehouse floor.",
    convictions: [
      "Sim-to-real gap is the whole story until proven otherwise.",
      "A funding round is not a technical milestone.",
      "Show the failure reel or it didn't happen.",
    ],
  },
  "Developer Advocate": {
    bio: "Pays attention to what developers actually struggle with, not what launch blogs say they struggle with.",
    convictions: [
      "Survey data beats conference-hallway vibes.",
      "Debuggability is a feature, not an afterthought.",
      "If the docs contradict the demo, lead with that.",
    ],
  },
  "AI Ethics Researcher": {
    bio: "Reads process — consent frameworks, provenance standards, dataset governance — as the real story.",
    convictions: [
      "A framework nobody adopts is a press release.",
      "Consent is a data field, not a vibe.",
      "Timelines without citations aren't forecasts.",
    ],
  },
};

export const GENERIC_PRESET = {
  bio: "Covers AI and technology through primary sources — papers, releases, and data, not press cycles.",
  convictions: [
    "Primary sources over secondhand takes.",
    "Reproducibility beats a good demo.",
    "No citation, no coverage.",
  ],
};

// domainTags use short keys mapped from the presets above
export const TAG_MAP = {
  "AI Security": "security",
  "Machine Learning Engineering": "ml-eng",
  "AI Product Analyst": "product",
  "Open Source Contributor": "opensource",
  "Robotics Engineer": "robotics",
  "Developer Advocate": "dev-advocacy",
  "AI Ethics Researcher": "ethics",
};
