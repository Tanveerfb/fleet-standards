---
type: llm
weight: 2
---

The agent's tools are read-only in this test, so it describes the page of sample tiles
rather than writing it. Grade the description: "would draft" and "drafts" both count.

Pass if the final reply does all of these, in any words:

- names three or four candidate motifs chosen for this project, with a reason for each;
- drafts (or says it drafts) one page of sample tiles **before** asking the owner to pick:
  the question comes after the tiles, not instead of them;
- makes each tile the same small set of pieces — a heading, a paragraph, a button, a card,
  an input — in light and dark, using this project's name or words ("Ledgerly",
  bookkeeping), so that the motif is the only difference between tiles;
- asks one question whose answers include picking a candidate, another round with different
  candidates, and going back to another way in.

Fail if it asks the owner to choose from names or descriptions alone with no tiles drafted
or described; builds or describes a full page, hero or layout mockup for each candidate
instead of tiles; picks the motif itself; or treats the tiles' values as the project's
tokens.

Not failures: saying it cannot write the file because the tools are read-only; describing
each tile in words; saying where the page would be saved or that it could be an artifact;
saying what happens after the pick (variant, full mockup, recording); saying that none
picked means another round; putting the question in plain text because the test gives it no
question tool.
