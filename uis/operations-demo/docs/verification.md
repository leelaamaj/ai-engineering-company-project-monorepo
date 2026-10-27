# Verification — October 27, 2026

## Automated checks

- `npm run typecheck`: passed with strict TypeScript checks.
- `npm test`: 46 Vitest tests passed across all 19 required exports and three supplemental helpers.
- `npm run build`: passed; browser assets compiled into the demo's ignored `dist` directory.
- `npm audit`: zero vulnerabilities after updating Vitest to 5.0.5.
- `git diff --check`: passed.

## Browser checks

Functional checks used Codex's in-app browser against the local Vite server. Playwright CLI supplied explicit viewport sizes, keyboard checks, and screenshot files.

| Scenario | Observed result |
| --- | --- |
| Zaragoza + low-stock filters | One laptop; filtered inventory value $5,200.00 |
| Add Home category | Clear no-products result; reset restores three products |
| Lowercase SKU / missing SKU | Laptop object / null message |
| Exact shipment ID | Original sample shipment, including date |
| Binary weight 2.3 / 99 | Sorted index 2 / -1 |
| Same-day, quantity 2 | UPS $42.43 and score 61.4; SEUR $62.40; DHL $85.12 |
| Reliability display ascending | UPS, SEUR, DHL Express |
| Empty report collections | $0.00, null extremes displayed as dashes, zero average |
| Product, shipment and carrier samples | All validate successfully |
| JSON null / malformed JSON | Field errors / syntax guidance, no crash |
| Keyboard Tab and Enter | Skip link receives focus with a 3px outline; Enter activates it |
| Browser console after favicon correction | Zero errors and warnings |

At **1440 × 1000**, document width equals viewport width. At **375 × 812**, document width is 375px; product and carrier tables scroll inside their 291px-wide containers. Inspected desktop/mobile screenshots for typography, readable controls, section order, table scrolling, colors, and spacing.

- [Desktop preview](desktop-preview.png)
- [Full desktop page](desktop.png)
- [Full mobile page](mobile.png)

The public website was not changed. The pre-existing untracked submission screenshot remains outside this milestone's commit. No live orders, course submission, or merge were performed.
