# Architecture

Existing website: static HTML, CSS and JavaScript under uis/website, with its own package and tests. Shared TypeScript placeholder package: packages/shared. Other top-level folders separate agents, services, data pipelines/evaluation, MCP, reusable skills and workflows; their READMEs distinguish intended future responsibilities from executable systems. The devcontainer defines a universal development image. No live warehouse/carrier integration is claimed.
