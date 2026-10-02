# TrackFlow — AI Engineering Company Project

[![4Geeks Academy](https://img.shields.io/badge/4Geeks-Academy-blue)](https://4geeksacademy.com)
[![AI Engineering](https://img.shields.io/badge/track-AI%20Engineering-green)](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)

_TrackFlow company brief and project guide for the AI Engineering Career Program at 4Geeks Academy._

_The original repository-structure guide is also available in [Spanish](./README.es.md). This README contains the TrackFlow-specific company brief._

---

## Company brief

**TrackFlow** is a last-mile delivery and warehouse management company founded in **2009 in Los Angeles, United States**. It operates in **the United States and Spain**, with warehouses in **Los Angeles and Zaragoza**, approximately **130 employees**, and around **€9 million in annual revenue**.

TrackFlow manages logistics for e-commerce brands: storing inventory, picking and packing orders, shipping through a network of eight carriers, tracking deliveries, and handling returns. Its customers include both the brands that rely on its logistics services and the consumers waiting for their orders.

### The business problem

The two warehouses use different systems and have no shared, real-time inventory view. Incoming orders are manually copied from emails, picking relies on printed lists, and stock discrepancies are often found late. Carrier assignment and tracking are handled manually across separate portals. Returns, customer questions, client reports, and executive reports also depend heavily on manual work.

The technology landscape includes two warehouse management systems, a legacy ERP, undocumented integrations, and databases across two cloud providers. Without centralized monitoring or a shared data pipeline, teams struggle to get timely, consistent information.

### Departments and opportunities

These are needs described in the company briefing, rather than features already implemented in this repository.

| Department | Current challenge | Systems and automations needed |
| --- | --- | --- |
| **Warehouse Operations** | Separate warehouse systems, manual order entry, and late inventory discrepancies | A unified inventory API, email-based order ingestion, an operations dashboard, and low-stock alerts |
| **Last Mile and Carrier Management** | Manual carrier selection and tracking across eight carriers, with no structured performance history | Carrier recommendations, a unified tracking endpoint, a public tracking portal, and performance reporting |
| **Reverse Logistics** | Returns represent 18–25% of volume and require manual, sometimes inconsistent review | Configurable approval rules, collection workflows, AI-assisted product inspection, and returns analysis |
| **Customer Experience** | Fifteen agents handle repetitive questions without a unified ticketing system or knowledge base | A first-line support agent, a semantic knowledge base for RAG, unified tickets, sentiment analysis, and CX reporting |
| **Commercial and Client Relations** | Client information sits in spreadsheets and emails; reports and renewal tracking are manual | CRM integration, automated client reports, client health indicators, and renewal alerts |
| **Technology** | Fragmented systems, undocumented integrations, and no centralized telemetry | Shared data pipelines, logging and monitoring, automatic alerts, technical documentation, and operational automation |
| **Executive Direction** | Manually assembled reports provide an incomplete, delayed view across countries | A real-time KPI dashboard, automated weekly reports, country comparisons, threshold alerts, and a natural-language assistant |

The project takes the role of **TrackFlow Tech**, the internal unit tasked with building the systems, integrations, and intelligent automations that help these teams work together.

For the full company scenario, see [CONTEXT.md](./CONTEXT.md).

## Project focus

The company selection and motivation are documented in [company-choice.md](./company-choice.md). The initial areas of interest are **Technology** and **Warehouse Operations**: connecting the Los Angeles and Zaragoza teams, improving the reliability of their systems, and giving them accurate inventory and order information.

The proposed automation challenge is a **unified inventory system** that shows real-time stock in both warehouses and automatically warns employees when an item is running low.

The proposed AI agent would:

- Read information from order emails, warehouse inventory systems, product records, and low-stock limits.
- Organize incoming order data and flag missing or conflicting information.
- Compare requested products with available stock.
- Produce clear employee alerts and trigger low-stock notifications when inventory falls below the required level.

These are planned project ideas. Implementation will be added through the course milestones: Web, Programming, Backend, Telemetry, RAG, Agents, Workflows, and Real-time.

## How to start

1. **Clone this repository** or open it in Codespaces.
2. **Read** [CONTEXT.md](./CONTEXT.md) for the TrackFlow briefing and [company-choice.md](./company-choice.md) for the selected focus.
3. **Read this folder guide** and the `README.md` of the folder you will work in.
4. **Implement** each milestone in the appropriate folder instead of adding everything at the root.
5. **Document** each new app, service, agent, or pipeline in its own subfolder with a README, including setup and verification instructions.

---

## How to think about this monorepo

This monorepo develops **TrackFlow** across many milestones and projects. Each top-level folder has a **single responsibility** — like a real engineering team repo.

| Layer               | Folders                           | What lives here                                                  |
| ------------------- | --------------------------------- | ---------------------------------------------------------------- |
| **Company context** | `CONTEXT.md`                      | Domain facts, field names, and constraints for TrackFlow |
| **User-facing**     | `uis/`, `services/`               | Frontends and backends users (or operators) interact with        |
| **Data**            | `data/`                           | Raw files, pipelines, processed datasets, evaluation sets        |
| **AI**              | `agents/`, `skills/`, `mcps/`     | Agents, reusable agent capabilities, MCP tool servers            |
| **Automation**      | `workflows/`                      | n8n flows and cross-system orchestration                         |
| **Reuse**           | `packages/`, `shared/`            | Shared types, SDKs, schemas, templates                           |
| **Operations**      | `infra/`, `scripts/`, `internal/` | Docker, deploy configs, one-off scripts, internal CLIs           |
| **Documentation**   | `docs/`                           | Architecture, decisions, conventions for the whole repo          |

**Rule of thumb:** if it has a UI → `uis/`. If it exposes an API or runs in the background → `services/`. If it moves or transforms data → `data/`. If an AI model does the work → `agents/` (+ `skills/` or `mcps/` as needed).

---

## Current project status

- TrackFlow has been selected, and the company briefing is present in [CONTEXT.md](./CONTEXT.md).
- [company-choice.md](./company-choice.md) records the motivation, department interests, automation challenge, and proposed AI agent.
- The public website is implemented in `uis/website/`: English and Spanish landing pages, a validated business inquiry form, and local Lighthouse evidence. The broader applications and automations described above remain planned.
- Run the website from this repository root with `npx http-server uis/website -p 3000 -a 0.0.0.0`. Open port 3000. See [website instructions](./uis/website/README.md) for build, test, and Codespaces review steps.
- Shared package metadata exists in `packages/shared/package.json` (`@repo/shared-types`), but no workspace runner or application test command is configured at the root.
- There is no root `AGENTS.md` or `docker-compose.yml` yet. Component-specific setup and checks should be documented as implementation is added.

---

## Folder guide — what goes where

Read the linked `README.md` inside each folder before you start coding there.

### Root files

| Path | Purpose |
| --- | --- |
| [`CONTEXT.md`](./CONTEXT.md) | Full TrackFlow company briefing and source for the project domain |
| [`company-choice.md`](./company-choice.md) | Reasons for choosing TrackFlow, department interests, and proposed automation and agent |
| `README.md` | TrackFlow company brief, project focus, current status, and repository guide |
| [`README.es.md`](./README.es.md) | Original Spanish repository-structure guide |
| `docker-compose.yml` (planned, not present) | If added, keep local development orchestration at the root to connect services and databases |

### `uis/` — user interfaces

**Purpose:** All frontend applications — anything a human sees and clicks.

**Put here:**

- Public website (`website/`)
- Internal admin / backoffice (`backoffice/`)
- Customer tracking portals, Streamlit/Gradio tools, dashboards with a UI

**Examples:** TrackFlow landing page, warehouse backoffice, parcel tracking portal, telemetry dashboard UI

→ See [`uis/README.md`](./uis/README.md)

### `services/` — centralized company API (FastAPI)

**Purpose:** One **centralized FastAPI backend** for the whole company — a single entry point that keeps complexity low as the project grows.

**Put here:**

- One main FastAPI app (e.g. `api/`) with routers/modules per domain (inventory, orders, shipments, returns, telemetry, etc.)
- Background workers only when they truly need to run separately from the API

**Recommendation:** avoid splitting into many microservices early. Add endpoints to the same FastAPI app; extract a worker only when necessary.

**Example endpoint ideas:** `/inventory`, `/orders`, `/shipments`, `/returns`, webhook handlers, scheduled jobs

→ See [`services/README.md`](./services/README.md)

### `data/` — datasets, pipelines, and evaluation

**Purpose:** Everything data-related, from raw files to production-ready tables.

| Subfolder                                       | Purpose                      | What you do here                                                          |
| ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| [`data/raw/`](./data/raw/README.md)             | Untouched source data        | Store dumps, exports, sample CSVs/JSON — document origin and PII rules    |
| [`data/pipelines/`](./data/pipelines/README.md) | ETL/ELT jobs                 | Write ingestion, cleaning, and transformation scripts                     |
| [`data/process/`](./data/process/README.md)     | Clean / intermediate outputs | Save artifacts produced by pipelines (features, aggregates, clean tables) |
| [`data/eval/`](./data/eval/README.md)           | Quality measurement          | Golden sets, RAG/agent eval datasets, experiment metrics                  |

**Flow:** `raw` → `pipelines` → `process` → consumed by `services/`, `uis/`, or `agents/`. Use `eval` to prove quality.

### `agents/` — AI agents

**Purpose:** Autonomous or semi-autonomous AI assistants for the company.

**Put here:**

- One subfolder per agent (e.g. `support-agent/`, `onboarding-agent/`)
- Agent config, prompts, tools wiring, tests
- Start from [`agents/_template/`](./agents/_template/README.md) when creating a new agent

**Examples:** customer support bot, employee onboarding copilot, training assistant

→ See [`agents/README.md`](./agents/README.md)

### `skills/` — reusable agent capabilities

**Purpose:** Packaged instructions + scripts that agents (or you in Cursor) reuse across the repo.

**Put here:**

- Skills for data analysis, code review, scraping, research, etc.
- Each skill = a folder with `SKILL.md`, optional scripts and resources

**Example included:** `skills/data-analysis/` (pandas cleaning script + metrics reference)

→ See [`skills/README.md`](./skills/README.md)

### `mcps/` — Model Context Protocol servers

**Purpose:** Bridge AI models to your systems — databases, APIs, GitHub, custom tools.

**Put here:**

- One subfolder per MCP server (e.g. `database-mcp/`, `github-mcp/`)
- Tool definitions, resources, and server config

**When to use:** when an agent needs live access to data or actions your codebase alone cannot provide

→ See [`mcps/README.md`](./mcps/README.md)

### `workflows/` — automation and orchestration

**Purpose:** Connect systems without writing full apps — scheduled jobs, webhooks, notifications.

**Put here:**

- n8n workflow exports, Make/Zapier configs, or orchestration docs
- Flows that link `services/`, `data/pipelines/`, and `agents/`

**Examples:** new-order → Slack alert, nightly ETL trigger, lead → CRM sync

→ See [`workflows/README.md`](./workflows/README.md)

### `packages/` — shared libraries

**Purpose:** Versionable code reused by multiple apps, agents, or pipelines.

**Put here:**

- Shared TypeScript types (`packages/shared/` → `@repo/shared-types`)
- UI component libraries, API clients, analytics SDKs

**Rule:** if `uis/` and `services/` both need the same interface → extract it here

→ See [`packages/README.md`](./packages/README.md)

### `shared/` — loose shared assets

**Purpose:** Resources that are not a full package — schemas, templates, static assets, short docs.

**Put here:**

- JSON schemas, email templates, OpenAPI specs, design tokens
- Anything reused but too small or non-code for `packages/`

→ See [`shared/README.md`](./shared/README.md)

### `docs/` — cross-cutting documentation

**Purpose:** Architecture and decisions that span the whole company project.

**Put here:**

- System architecture diagrams, ADRs, security/observability guides
- Conventions not tied to one app or agent

→ See [`docs/README.md`](./docs/README.md)

### `infra/` — infrastructure and deployment

**Purpose:** How the company project runs in Docker, cloud, or CI.

**Put here:**

- Dockerfiles, Terraform, K8s manifests, Nginx configs, CI/CD pipelines

**If added, keep at repo root:** `docker-compose.yml` to orchestrate local development for `services/`, databases, and other containers from one place.

→ See [`infra/README.md`](./infra/README.md)

### `scripts/` — helper scripts

**Purpose:** Small, repeatable automation — not full apps.

**Put here:**

- Setup scripts, seed data generators, lint wrappers, one-off migrations
- Document each script: what it does, args, and how to run it

**Difference from `internal/`:** scripts are usually single files; `internal/` tools are structured projects with their own deps and tests.

→ See [`scripts/README.md`](./scripts/README.md)

### `internal/` — internal developer tools

**Purpose:** Robust utilities for the engineering team.

**Put here:**

- CLIs, packaged migration tools, prompt evaluators
- Tools with their own `package.json`, tests, and install steps

→ See [`internal/README.md`](./internal/README.md)

---

## Where should I put this?

Quick decision guide:

```text
Does it have buttons and screens?          → uis/
Does it run on a server / API / queue?     → services/
Is it raw or transformed data?             → data/raw/ or data/process/
Does it move data between systems?         → data/pipelines/
Do you measure AI/pipeline quality?        → data/eval/
Is it an AI assistant with a goal?         → agents/
Is it a reusable AI capability/instruction?→ skills/
Does AI need to call external tools/APIs?  → mcps/
Is it n8n / scheduled automation?          → workflows/
Will 2+ folders import the same code?      → packages/
Is it a schema/template/asset, not a lib?  → shared/
Is it architecture or team-wide docs?      → docs/
Is it docker-compose for local dev?        → repo root
Is it Docker / deploy / cloud config?      → infra/
Is it a one-off script?                    → scripts/
Is it a CLI tool with its own package?     → internal/
```

---

## Repository structure (tree)

```text
ai-engineering-company-project-monorepo/
├── README.md                 # TrackFlow brief and project guide
├── README.es.md              # Original Spanish repository guide
├── CONTEXT.md                # Full TrackFlow company briefing
├── CONTEXT.es.md             # Original Spanish context template
├── company-choice.md         # TrackFlow selection and project focus
├── .devcontainer/            # Development-container configuration
├── uis/                       # Frontends (website, backoffice, dashboards)
├── services/                  # Centralized FastAPI company API
├── data/
│   ├── raw/                   # Source datasets
│   ├── pipelines/             # ETL/ELT jobs
│   ├── process/               # Clean / intermediate outputs
│   └── eval/                  # Evaluation sets and metrics
├── agents/                    # AI agents (+ _template/ starter)
├── skills/                    # Reusable agent skills
├── mcps/                      # MCP servers for tool access
├── workflows/                 # n8n and automation flows
├── packages/                  # Shared libraries (@repo/shared-types, …)
├── shared/                    # Schemas, templates, loose assets
├── docs/                      # Architecture and cross-cutting docs
├── infra/                     # Docker, Terraform, deployment
├── scripts/                   # Helper scripts
└── internal/                  # Internal CLIs and dev tools
```

---

## Links

- [4Geeks Academy — AI Engineering](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)
- [How to start a coding project](https://4geeks.com/lesson/how-to-start-a-project)

---

## Template credits

The original repository template was built as part of the 4Geeks Academy AI Engineering Career Program by [@marcogonzalo](https://www.linkedin.com/in/marcogonzalo) and [@alesanchezr](https://x.com/alesanchezr) and many other contributors. Find out more about our [AI Engineering Course](https://4geeksacademy.com/en/career-programs/ai-engineering), and [other courses](https://4geeksacademy.com/en/program-comparison).

You can find other templates and resources like this at the [4Geeks Academy GitHub page](https://github.com/4geeksacademy).

_This project is based on the 4Geeks Academy template for the AI Engineering track. For exclusive use in the programme._
