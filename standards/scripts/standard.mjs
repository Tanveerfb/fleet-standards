// What the standard is made of, read the same way by every script that needs it: the files the
// skills read beside them, and the one version line. Used by copy-skills-to-project.mjs,
// install-skills.mjs, check-rules-version.mjs and sync-rules.mjs; tested in tests/run.mjs.
// The two hook scripts copied into projects (block-shell-writes.mjs, after-compact.mjs) import
// nothing, so a project's copy stands alone.

/** The files and folders under standards/ that the skills read, copied beside them. */
export const REFERENCE = [
  "project-rules.md",
  "rules",
  "motifs.md",
  "motif-gallery.html",
  "CHANGELOG.md",
  "adopting-the-standard.md",
  "process-x.md",
  "templates",
];

const VERSION_LINE = /^\*\*Version:\*\*\s*(\d+\.\d+\.\d+)(?![\d.])/m;

/** The `**Version:** x.y.z` at the start of a line in `text`, or null. */
export function versionIn(text) {
  return VERSION_LINE.exec(text ?? "")?.[1] ?? null;
}

/** Compares two x.y.z versions: negative, zero or positive. */
export function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
}
