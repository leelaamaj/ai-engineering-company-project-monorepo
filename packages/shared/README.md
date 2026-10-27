# TrackFlow inventory and shipping utilities

Milestone 2 implements the [official TrackFlow briefing](./BRIEFING.md) inside the existing company monorepo. The shared package is browser-compatible TypeScript: it does not read files, call APIs, depend on the DOM, or change global state.

## Run from the repository root

Use Node.js 24.1 or later and npm 11 or later.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

The demo opens at the local URL printed by Vite, normally [localhost:5173](http://localhost:5173). For Codespaces, forward that port. To inspect the built demo, run `npm run preview`. No database, credentials, or paid services are needed.

The root workspace contains the shared package and Operations Lab. The previous public website retains its own commands and tests; `npm test` here runs this milestone's Vitest suite only.

## Public interface

```typescript
import {
  filterLowStockProducts,
  selectBestCarrier,
  validateProduct,
  type Product,
} from "@repo/shared-types";
import {
  sampleProducts,
  sampleCarriers,
  sampleShipment,
} from "@repo/shared-types/sample-data";

const validation = validateProduct(sampleProducts[1]);
if (validation.valid) {
  const lowStock = filterLowStockProducts(sampleProducts);
  const choice = selectBestCarrier(
    sampleCarriers,
    sampleShipment,
    sampleProducts[1],
  );
  console.log(lowStock, choice);
}
```

The package exports TypeScript source for a TypeScript-aware tool such as Vite. It is private and is not a published, precompiled JavaScript library.

The exact briefing models are in `src/types/models.ts`: `Product`, `Shipment`, `Carrier`, `InventoryMovement`, `Dimensions`, `Destination`, and every specified union type. Dates are actual `Date` objects. Literal fixtures in `src/sample-data.ts` reproduce the briefing examples.

## Requirement checklist

| Brief requirement                           | Exported functions                                                                            | Verification                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Warehouse, category and low-stock filtering | `filterProductsByWarehouse`, `filterProductsByCategory`, `filterLowStockProducts`             | Exact fields, inclusive threshold, empty results                                |
| Ascending/descending sorting                | `sortProductsByStock`, `sortCarriersByReliability`                                            | Both orders, unchanged source arrays                                            |
| Linear search                               | `findProductBySKU`, `findShipmentById`                                                        | SKU ignores case; shipment ID matches exactly; missing returns null             |
| Binary search                               | `binarySearchProductByWeight`                                                                 | Sorted weights, endpoints, duplicates, empty/missing returns -1                 |
| Shipping cost and carrier selection         | `calculateShippingCost`, `scoreCarrierForShipment`, `selectBestCarrier`                       | Priority multipliers, quantities, every score component, cutoff, cost selection |
| Counts, value and averages                  | `countProductsByCategory`, `calculateTotalInventoryValue`, `calculateAverageShipmentDistance` | Known totals, rounding, zero counts                                             |
| Grouping and rankings                       | `groupShipmentsByStatus`, `findTopCarriers`                                                   | All statuses, unassigned carriers, top-N and ties                               |
| Business validation                         | `validateProduct`, `validateShipment`, `validateCarrier`                                      | Boundaries, missing/null fields, invalid numbers, nested records                |
| Broader lesson requirements                 | `filterProducts`, `sortProductsByFields`, `summarizeStock`                                    | Combined criteria, multiple sort fields, minimum/maximum/average                |

The first eight rows cover all **19 required functions**. The final row adds three supplementary helpers.

## Contracts and edge cases

- Validate data before calling processing functions. Their signatures take typed, non-null arrays and objects; validators also handle malformed runtime input without throwing. They check required property types and literal unions as well as the brief's numeric rules. They do not infer stock status, impose integer quantities, or invent date-order rules.
- Validators return `{ valid, errors }`, including every detected error. Invalid numbers include `NaN` and infinities. Product weight is `(0, 100]`; each dimension is `(0, 200]`.
- Empty collections return empty arrays, zero totals/averages, and null stock extremes. Category counts and status groups include every declared category/status even when unused.
- Linear searches return the first match or `null`. SKU comparisons ignore case, but do not remove whitespace.
- **Binary search requires weights sorted ascending.** It returns the index within that sorted array, not the original array. With duplicate weights, any matching index is valid. The caller sorts a copy; the search itself does not sort or scan the array.
- Shipping surcharge applies to the whole base + weight + distance subtotal. Weight cost includes shipment quantity. Costs, scores and numeric report averages are rounded to two decimal places; numbers do not retain display-only trailing zeros.
- Carrier scores follow the brief exactly: country 20, weight 20, priority 15, fragile capability 15, reliability up to 30. Select the **lowest rounded cost among scores >= 50**; retain the first input carrier for cost ties. This can select a carrier that misses an individual capability, because the assignment does not define hard disqualifications.
- Carrier usage ignores null assignments and sorts descending by count. Ties retain first-seen order. Positive fractional `topN` is floored; non-finite values and values below 1 return an empty array.
- Sorting copies the input array; filters, reports, and grouping do not modify input objects. Returned objects remain references to the input records, rather than deep copies.

## Learning checkpoints

1. **Interfaces describe the shape.** A Product has explicitly named fields, including nested Dimensions; TypeScript checks code against that shape.
2. **Pure functions transform data.** Filters select records, sorts reorder copies, and reducers combine records into reports.
3. **Search strategy depends on the input.** Linear search works on unsorted records; binary search is faster when its ascending-order precondition holds.
4. **Types and validation do different jobs.** TypeScript checks our code before execution. Validators check actual incoming values at runtime.
5. **Tests turn business rules into examples.** The suite checks exact outputs and boundary values independently of the demo.

## Demo and delivery

See [Operations Lab](../../uis/operations-demo/README.md) for the manual browser checklist. The implementation branch is `feature/domain-models`, targeting `main` in the existing fork. The PR includes functionality, implementation challenges, verification, and screenshots. Course submission and merging remain separate steps; merge after instructor approval.
