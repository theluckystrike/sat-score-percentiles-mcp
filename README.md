# sat-score-percentiles-mcp

SAT score percentiles and class of 2026 SAT averages by state for AI assistants, from College Board's percentile tables and the 2026 SAT Suite Annual Report.

This is a Model Context Protocol (MCP) server. It answers from bundled College Board data, so it needs no API key and no network calls.

## Tools

| Tool | What it returns |
| --- | --- |
| `get_sat_percentile` | User group and nationally representative percentiles for any SAT total (400-1600) or section score (200-800), with the class of 2026 national mean and score band. |
| `get_score_for_sat_percentile` | The lowest total or section score that reaches a target percentile, for example the 90th. |
| `get_sat_scores_by_state` | Class of 2026 SAT results for any state, DC, Puerto Rico or the US Virgin Islands: test takers, participation rate, mean total, Reading and Writing and Math, percent meeting benchmarks, 25th/50th/75th percentile scores and rank. |
| `rank_states_by_sat` | States and DC ranked by mean score, participation rate, benchmark rate or test takers, with an optional minimum participation filter. |

Every result has structured JSON, a one-paragraph summary, `as_of`, `source` (the College Board page or PDF) and `more` (a page on [examscorecalc.com](https://examscorecalc.com/sat/?utm_source=mcp&utm_medium=sat-score-percentiles-mcp)).

## What it knows that your model does not

- Class of 2026 SAT results, published by College Board in fall 2026: 1,954,833 test takers nationally with a mean total of 1045 (528 Reading and Writing, 517 Math), and the same figures for every state.
- Each state's participation rate, which explains most of the gap between state averages. States that test every 11th grader have lower means than states where only college-bound students test.
- The 25th, 50th and 75th percentile SAT scores for each state's class of 2026.
- The exact College Board percentile for every 10-point score, in both reference groups, instead of a rounded guess.

## Install

### Hosted (Claude.ai custom connector, ChatGPT developer mode)

Paste this URL. No token, no sign-up.

```
https://sat-score-percentiles-mcp.lipmichal.workers.dev/mcp
```

### Claude Code

```
claude mcp add --transport http sat-percentiles https://sat-score-percentiles-mcp.lipmichal.workers.dev/mcp
```

Or run it locally over stdio:

```
claude mcp add sat-percentiles -- npx -y github:theluckystrike/sat-score-percentiles-mcp
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sat-percentiles": { "command": "npx", "args": ["-y", "github:theluckystrike/sat-score-percentiles-mcp"] }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sat-percentiles": { "url": "https://sat-score-percentiles-mcp.lipmichal.workers.dev/mcp" }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "sat-percentiles": { "type": "http", "url": "https://sat-score-percentiles-mcp.lipmichal.workers.dev/mcp" }
  }
}
```

Node 20 or newer is needed for the local stdio version.

## Example prompts

- "What percentile is a 1350 on the SAT?"
- "What SAT Math score do I need for the 90th percentile?"
- "What was the average SAT score in Texas for the class of 2026, and how many students took it?"
- "Which states had the highest SAT averages in 2026 among states where at least half of students took the test?"
- "Is a 1200 a good SAT score in Ohio?"

## Data sources

Full list with fetch dates and file hashes in [DATA_SOURCES.md](DATA_SOURCES.md).

- Percentiles: College Board, [SAT Nationally Representative and User Percentiles](https://research.collegeboard.org/reports/sat-suite/understanding-scores/sat).
- Class of 2026 results: College Board, [2026 SAT Suite of Assessments Annual Report](https://reports.collegeboard.org/sat-suite-program-results), total group report and the state supplements.

## Limitations

- The percentile page does not print a year. User group percentiles cover SAT takers from the past three graduating classes, as College Board states on that page.
- State means depend on who tests. Compare states with similar participation rates, or use `min_participation_pct`.
- Puerto Rico and the US Virgin Islands reports have no participation rate, so they are not ranked.
- The Ohio supplement was not linked from the report index on 2026-11-03; it was fetched from the same College Board path pattern and parsed like the others.
- Data are fixed at the 2026 reports. When College Board publishes the class of 2027 report, the data file is rebuilt with `scripts/build_data.py`.

## More

Digital SAT score calculators and practice score conversions are on [examscorecalc.com](https://examscorecalc.com/sat/?utm_source=mcp&utm_medium=sat-score-percentiles-mcp).

Part of the Zovo MCP collection: https://mcp.zovo.one

## Development

```
npm install
npm test            # builds, then runs fixtures copied by hand from the College Board sources
node scripts/smoke-stdio.mjs   # stdio check, one call per tool
npx wrangler deploy            # Cloudflare Worker, Streamable HTTP at /mcp
```

## License

MIT
