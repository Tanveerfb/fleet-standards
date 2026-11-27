// The one reader of the rules set a project declares (project-rules.md §SCOPE): the
// `Rules: app, ui, node, web · Options: firebase, trello` line in its CLAUDE.md, and the
// `@rules/...` import lines beside it. Used by check-rules-version.mjs and sync-rules.mjs;
// tested in tests/run.mjs. Reads text only: the callers read the files.

const LINE = /^[-*\s]*\**Rules\**:\**\s*([^\n·]*)(?:·\s*\**Options\**:\**\s*([^\n·]*))?([^\n]*)/m;
// A project that declined the import (sync-standards Step 4 (a)) still declares its set, so
// the sync knows what to copy, and ends the line `· read, not imported`.
const NOT_IMPORTED = /·\s*\**read,?\s+not\s+imported\**/i;

// Options read on demand, never imported (§SCOPE). AI is read through a line in CLAUDE.md,
// which must name the file; the credit is read by the skills, so CLAUDE.md need not.
export const READ_ON_DEMAND = ["rules/options/ai.md", "rules/options/credit.md"];
const NAMED_IN_CLAUDE_MD = new Set(["rules/options/ai.md"]);

/**
 * The files under rules/ a CLAUDE.md declares, or null when it has no Rules line.
 * Names are lower-cased; a name that still is not a plain file name is returned in
 * `unknown`, never dropped silently. An option the owner declined is written `no-<name>`
 * (`Options: trello, no-firebase, no-ai`) and returned in `declined`, so it is never asked
 * again and never read as a file.
 */
export function parseRulesLine(text) {
  const line = (text ?? "").match(LINE);
  if (!line) return null;
  const unknown = [];
  const declined = [];
  const names = (part) =>
    (part ?? "")
      .split(",")
      .map((name) => name.trim().replace(/[`*.]/g, "").trim().toLowerCase())
      .filter((name) => {
        if (name === "" || name === "none") return false;
        if (/^no-[a-z-]+$/.test(name)) {
          declined.push(name.slice(3));
          return false;
        }
        if (/^[a-z-]+$/.test(name)) return true;
        unknown.push(name);
        return false;
      });
  const files = [
    ...names(line[1]).map((n) => `rules/${n}.md`),
    ...names(line[2]).map((n) => `rules/options/${n}.md`),
  ];
  return { files, unknown, declined, notImported: NOT_IMPORTED.test(line[3] ?? "") };
}

/** The `@rules/...` files a CLAUDE.md imports, one per line. */
export function rulesImports(text) {
  return [...(text ?? "").matchAll(/^@(?:\.\/)?(rules\/\S+\.md)\s*$/gm)].map((m) => m[1]);
}

/**
 * What is wrong with a project's declared set, as sentences; empty when nothing is.
 *   text      the project's CLAUDE.md
 *   exists    (path relative to the project) => boolean
 *   known     (path relative to the standard) => boolean, whether the standard has that file
 *   present   the files under the project's rules/ folder, as `rules/x.md` paths; a file of
 *             the standard's left there after its option was declined or dropped is reported
 */
export function rulesProblems(text, exists, known = () => true, present = []) {
  const declared = parseRulesLine(text);
  if (!declared) return [];
  const problems = [];
  for (const name of declared.unknown) problems.push(`the Rules line names "${name}", which is not a file name`);
  const imports = rulesImports(text);
  for (const file of declared.files) {
    if (!known(file)) problems.push(`the Rules line declares ${file}, which the standard does not have`);
    else if (!exists(file)) problems.push(`${file} is declared but missing from the project`);
    else if (READ_ON_DEMAND.includes(file)) {
      if (NAMED_IN_CLAUDE_MD.has(file) && !text.includes(file)) problems.push(`${file} is declared but CLAUDE.md never says to read it`);
    } else if (!imports.includes(file) && !declared.notImported) problems.push(`${file} is declared but not imported in CLAUDE.md`);
  }
  for (const file of imports) {
    if (!declared.files.includes(file)) problems.push(`CLAUDE.md imports ${file}, which the Rules line does not declare`);
    else if (READ_ON_DEMAND.includes(file)) problems.push(`CLAUDE.md imports ${file}, which is read on demand, not imported`);
  }
  for (const file of present) {
    const rel = file.replace(/\\/g, "/");
    if (known(rel) && !declared.files.includes(rel)) problems.push(`${rel} is in the project but the Rules line does not declare it (an option declined or dropped leaves its file behind)`);
  }
  return problems;
}
