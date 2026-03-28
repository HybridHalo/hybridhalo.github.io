// ============================================================
//  ✏️  PROJECTS — add, remove, or edit entries here.
//
//  Fields:
//    name   folder name under /vibe/ (required)
//    desc   one-sentence summary shown on the card
//    tags   array of strings — drives the filter buttons
//
//  Preview: drop a preview.png into /vibe/<name>/
//  and it will automatically appear on the card.
// ============================================================

const PROJECTS = [

  { name: "portfolio-site",
    desc: "Personal portfolio with dark theme, case studies, and animated transitions.",
    tags: ["web", "design", "react"] },

  { name: "llm-playground",
    desc: "A local UI for experimenting with different LLM prompts side by side, with diff views.",
    tags: ["ai", "tooling", "python"] },

  { name: "budget-cli",
    desc: "Terminal-based budget tracker that parses bank CSVs and produces weekly digests.",
    tags: ["cli", "python", "finance"] },

  { name: "raycast-snippets",
    desc: "Collection of Raycast extensions and snippet packs for common dev workflows.",
    tags: ["tooling", "productivity"] },

  { name: "recipe-scraper",
    desc: "Strips the life-story fluff from recipe blogs and outputs clean markdown.",
    tags: ["python", "web", "cli"] },

  { name: "shaders-sketchbook",
    desc: "GLSL fragment shader experiments, mostly noise and SDF-based animations.",
    tags: ["creative", "graphics", "web"] },

  { name: "homelab-ansible",
    desc: "Ansible playbooks for provisioning and maintaining my home server stack.",
    tags: ["devops", "linux", "tooling"] },

  { name: "font-tester",
    desc: "Browser tool for visually comparing variable font axes across specimen text.",
    tags: ["design", "web", "typography"] },

];
