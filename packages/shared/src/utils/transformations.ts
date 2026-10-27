import type {
  Carrier,
  Product,
  ProductCategory,
  Shipment,
  ShipmentStatus,
} from "../types/models";

export interface CarrierSelection {
  carrier: Carrier;
  score: number;
  cost: number;
}
export interface StockSummary {
  min: number | null;
  max: number | null;
  average: number;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateShippingCost(
  shipment: Shipment,
  product: Product,
  carrier: Carrier,
): number {
  const subtotal =
    carrier.baseRateUSD +
    product.weightKg * carrier.ratePerKgUSD * shipment.quantity +
    shipment.destination.distanceKm * carrier.ratePerKmUSD;
  const surcharge = { Standard: 1, Express: 1.3, "Same-day": 1.6 }[
    shipment.priority
  ];
  return roundMoney(subtotal * surcharge);
}

export function scoreCarrierForShipment(
  carrier: Carrier,
  shipment: Shipment,
  product: Product,
): number {
  const score =
    (carrier.operatesIn.includes(shipment.destination.country) ? 20 : 0) +
    (product.weightKg * shipment.quantity <= carrier.maxWeightKg ? 20 : 0) +
    (carrier.acceptsPriority.includes(shipment.priority) ? 15 : 0) +
    (!product.isFragile || carrier.handlesFragile ? 15 : 0) +
    carrier.onTimeRate * 0.3;
  return roundMoney(score);
}

export function selectBestCarrier(
  carriers: Carrier[],
  shipment: Shipment,
  product: Product,
): CarrierSelection | null {
  let best: CarrierSelection | null = null;
  for (const carrier of carriers) {
    const score = scoreCarrierForShipment(carrier, shipment, product);
    if (score < 50) continue;
    const cost = calculateShippingCost(shipment, product, carrier);
    if (best === null || cost < best.cost) best = { carrier, score, cost };
  }
  return best;
}

export function countProductsByCategory(
  products: Product[],
): Record<ProductCategory, number> {
  return products.reduce(
    (
      counts: Record<ProductCategory, number>,
      product: Product,
    ): Record<ProductCategory, number> => {
      counts[product.category] += 1;
      return counts;
    },
    { Fashion: 0, Electronics: 0, Cosmetics: 0, Home: 0, Other: 0 },
  );
}

export function calculateTotalInventoryValue(products: Product[]): number {
  return roundMoney(
    products.reduce(
      (total: number, product: Product): number =>
        total + product.stockQuantity * product.unitCostUSD,
      0,
    ),
  );
}

export function calculateAverageShipmentDistance(
  shipments: Shipment[],
): number {
  if (shipments.length === 0) return 0;
  return roundMoney(
    shipments.reduce(
      (total: number, shipment: Shipment): number =>
        total + shipment.destination.distanceKm,
      0,
    ) / shipments.length,
  );
}

export function groupShipmentsByStatus(
  shipments: Shipment[],
): Record<ShipmentStatus, Shipment[]> {
  return shipments.reduce(
    (
      groups: Record<ShipmentStatus, Shipment[]>,
      shipment: Shipment,
    ): Record<ShipmentStatus, Shipment[]> => {
      groups[shipment.status].push(shipment);
      return groups;
    },
    { Pending: [], Assigned: [], "In transit": [], Delivered: [], Failed: [] },
  );
}

export function findTopCarriers(
  shipments: Shipment[],
  topN: number,
): Array<{ carrier: string; count: number }> {
  if (!Number.isFinite(topN) || topN < 1) return [];
  const counts = new Map<string, number>();
  for (const shipment of shipments) {
    if (shipment.carrier !== null)
      counts.set(shipment.carrier, (counts.get(shipment.carrier) ?? 0) + 1);
  }
  return Array.from(
    counts,
    ([carrier, count]: [string, number]): {
      carrier: string;
      count: number;
    } => ({ carrier, count }),
  )
    .sort(
      (a: { count: number }, b: { count: number }): number => b.count - a.count,
    )
    .slice(0, Math.floor(topN));
}

export function summarizeStock(products: Product[]): StockSummary {
  if (products.length === 0) return { min: null, max: null, average: 0 };
  let min = Infinity;
  let max = -Infinity;
  let total = 0;
  for (const product of products) {
    min = Math.min(min, product.stockQuantity);
    max = Math.max(max, product.stockQuantity);
    total += product.stockQuantity;
  }
  return { min, max, average: roundMoney(total / products.length) };
}
