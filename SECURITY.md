# Security

**Supported:** only the latest release, the newest version in `standards/CHANGELOG.md`, which
is what `main` carries. Older versions get no fixes; a project on one moves up with
`sync-standards`.

**Reporting a vulnerability:** do not open a public issue or pull request. Report it
privately to the repository's owner, Tanveerfb, through GitHub, with enough to reproduce it.
A fix ships as a release; the report is credited in the changelog unless you ask otherwise.

**What the credential hook covers:** `standards/templates/pre-commit`, copied into each
project as `.githooks/pre-commit`, refuses a commit whose staged additions have the shape of
a credential: a service-account private key in JSON, a PEM private-key block, a stream key or
API key with a long value, an OpenAI-style secret key, a Google API key, a Discord webhook
URL, or a Google OAuth client secret. It matches shapes, not words, runs only in a clone that
has turned it on (`git config core.hooksPath .githooks`), and is a guard against accidents,
not a scanner: a credential in another shape passes it.
