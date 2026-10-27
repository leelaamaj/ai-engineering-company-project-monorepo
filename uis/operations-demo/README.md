# TrackFlow Operations Lab

A small Vite + vanilla TypeScript + Tailwind test page for Milestone 2. Its calculations import the real `@repo/shared-types` functions rather than duplicating their logic.

From the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. `npm run build` produces `uis/operations-demo/dist`; `npm run preview` serves it. The page uses sample data only and makes no API calls or persistent changes.

## Manual browser checklist

- Inventory: select Zaragoza and low stock; expect one laptop with stock 8 and threshold 10. Add category Home; expect no results. Reset; expect all three products. Try both stock directions and warehouse/stock sorting.
- Search: search lowercase `laptop-dell-15`; expect the laptop. Search `SH-2024-8821` in shipment mode; expect the sample shipment. Try unknown keys; expect null.
- Binary search: weight 2.3 returns index 2 in the displayed ascending list; weight 99 returns -1.
- Shipping: default Express laptop shipment costs $30.89 with UPS (76.4 points), $46.22 with SEUR (97.6), and $63.18 with DHL Express (98.5). UPS wins under the brief's scoring rule. Change priority, quantity, country, weight via product selection, fragility, and reliability display order; compare updated results.
- Reports: the full sample inventory value is $16,975.00. Four illustrative shipment records produce a 216.25 km average distance, SEUR usage 2 and UPS usage 1. Product filters also change inventory reports.
- Empty collections: expect $0.00, 0 km, no stock extremes, every category/status key, and no top carriers.
- Validation: each sample passes. Try `null`, missing fields, weight 0 or 101, invalid nested objects, and malformed JSON; expect clear errors. Shipment date strings are explicitly converted into Date objects.
- Keyboard/layout: use Tab and Enter through forms and navigation; check visible focus, readable mobile controls, and locally scrollable tables at 375px and desktop widths.

The first sample shipment is unchanged from the brief. Additional shipments are explicitly illustrative, derived from it for grouping/ranking demonstrations. The JSON editor changes only the object being validated, not the inventory or shipment fixtures.

See the [shared package guide](../../packages/shared/README.md) for the full interface and requirement mapping.
