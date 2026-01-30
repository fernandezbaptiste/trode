# Trode

Track your Claude Code usage and find out which skills are helping (or hurting).

## The Problem

You've installed skills but have no idea if they help or hurt Claude's performance.

Tessl evaluates skills - some improve results by +25%, others actually make Claude worse!

> "Some of your skills might be making your agent worse"

## Quick Start

1. Install the Tessl CLI:
   ```bash
   npm install -g @tessl/cli
   ```

2. Create a free account:
   ```bash
   tessl login
   ```

3. Clone and run:
   ```bash
   git clone https://github.com/fernandezbaptiste/trode
   cd trode/app && npm install && npm start
   ```

## Try the Demo

```bash
SKILLS_PROJECT_PATH=./demo-project npm start
```

This shows 4 real skills including **karpathy-guidelines** which has **-3.5 lift** - it actually makes Claude worse!

| Skill | Lift |
|-------|------|
| remotion-best-practices | +25.5 |
| frontend-design | +24.6 |
| vercel-react-best-practices | +16.5 |
| karpathy-guidelines | **-3.5** |

## Features

- Claude usage tracking (5-hour window, weekly, today)
- Skills health check with Tessl evaluation scores
- Color-coded effectiveness (green = good, red = bad)
- Link to free skill evaluations on tessl.io

## Screenshot

![Trode Screenshot](assets/screenshot.png)

## Build from Source

```bash
cd app
npm install
npm run package
```

Creates a `.dmg` installer in `dist/`.

---

Free evals on [tessl.io](https://tessl.io)
