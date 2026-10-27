import { describe, expect, it } from "vitest";
import * as ops from "../src/index";
import type { Carrier, Product, Shipment } from "../src/index";
import {
  sampleCarriers,
  sampleProducts,
  sampleShipment,
} from "../src/sample-data";

const product = sampleProducts[1];
const carrier = sampleCarriers[1];
const shipment = sampleShipment;
const shipments: Shipment[] = [
  shipment,
  {
    ...shipment,
    id: "SH-2",
    carrier: "UPS",
    status: "Assigned",
    destination: { ...shipment.destination, distanceKm: 100 },
  },
  {
    ...shipment,
    id: "SH-3",
    carrier: "SEUR",
    status: "Delivered",
    destination: { ...shipment.destination, distanceKm: 200 },
  },
  {
    ...shipment,
    id: "SH-4",
    carrier: "UPS",
    status: "Failed",
    destination: { ...shipment.destination, distanceKm: 1 },
  },
];

describe("collections", (): void => {
  it("filters warehouse, category and inclusive low stock", (): void => {
    expect(
      ops.filterProductsByWarehouse(sampleProducts, "Los Angeles"),
    ).toEqual([sampleProducts[0], sampleProducts[2]]);
    expect(ops.filterProductsByCategory(sampleProducts, "Electronics")).toEqual(
      [product],
    );
    expect(ops.filterProductsByCategory(sampleProducts, "Home")).toEqual([]);
    expect(
      ops.filterLowStockProducts([
        ...sampleProducts,
        { ...product, stockQuantity: 10 },
      ]),
    ).toHaveLength(2);
  });
  it.each(["asc", "desc"] as const)(
    "sorts stock and reliability %s without mutations",
    (order): void => {
      const productsBefore = structuredClone(sampleProducts);
      const carriersBefore = structuredClone(sampleCarriers);
      expect(
        ops
          .sortProductsByStock(sampleProducts, order)
          .map((p: Product): number => p.stockQuantity),
      ).toEqual(order === "asc" ? [8, 45, 120] : [120, 45, 8]);
      expect(
        ops
          .sortCarriersByReliability(sampleCarriers, order)
          .map((c: Carrier): number => c.onTimeRate),
      ).toEqual(order === "asc" ? [88, 92, 95] : [95, 92, 88]);
      expect(sampleProducts).toEqual(productsBefore);
      expect(sampleCarriers).toEqual(carriersBefore);
    },
  );
  it("combines criteria, including status and stock bounds", (): void => {
    expect(
      ops.filterProducts(sampleProducts, {
        warehouse: "Zaragoza",
        category: "Electronics",
        status: "Low stock",
        minStock: 8,
        maxStock: 8,
        lowStockOnly: true,
      }),
    ).toEqual([product]);
    expect(ops.filterProducts(sampleProducts, { minStock: 1000 })).toEqual([]);
    expect(ops.filterProducts(sampleProducts, {})).toEqual(sampleProducts);
  });
  it("sorts multiple fields and preserves equal-key order", (): void => {
    const input = [
      { ...product, sku: "B", stockQuantity: 2 },
      { ...product, sku: "A", stockQuantity: 2 },
      { ...product, sku: "C", stockQuantity: 1 },
    ];
    expect(
      ops
        .sortProductsByFields(input, [
          { field: "stockQuantity", order: "asc" },
          { field: "sku", order: "desc" },
        ])
        .map((p: Product): string => p.sku),
    ).toEqual(["C", "B", "A"]);
    expect(ops.sortProductsByFields(input, [])).toEqual(input);
    expect(input.map((p: Product): string => p.sku)).toEqual(["B", "A", "C"]);
  });
  it("handles empty arrays", (): void => {
    expect(ops.filterProductsByWarehouse([], "Zaragoza")).toEqual([]);
    expect(ops.filterProductsByCategory([], "Home")).toEqual([]);
    expect(ops.filterLowStockProducts([])).toEqual([]);
    expect(ops.sortProductsByStock([], "asc")).toEqual([]);
    expect(ops.sortCarriersByReliability([], "desc")).toEqual([]);
    expect(ops.filterProducts([], {})).toEqual([]);
    expect(ops.sortProductsByFields([], [])).toEqual([]);
  });
});

describe("search", (): void => {
  it("finds SKU case-insensitively in unsorted input", (): void => {
    expect(ops.findProductBySKU(sampleProducts, "laptop-dell-15")).toBe(
      product,
    );
    expect(ops.findProductBySKU(sampleProducts, "absent")).toBeNull();
    expect(ops.findProductBySKU([], "absent")).toBeNull();
  });
  it("finds exact shipment IDs", (): void => {
    expect(ops.findShipmentById(shipments, "SH-3")).toBe(shipments[2]);
    expect(ops.findShipmentById(shipments, "sh-3")).toBeNull();
    expect(ops.findShipmentById([], "SH-3")).toBeNull();
  });
  it("binary searches endpoints, middle, missing values and duplicate weights", (): void => {
    const sorted = ops.sortProductsByFields(sampleProducts, [
      { field: "weightKg", order: "asc" },
    ]);
    for (const [index, p] of sorted.entries())
      expect(ops.binarySearchProductByWeight(sorted, p.weightKg)).toBe(index);
    for (const weight of [-1, 0.7, 200])
      expect(ops.binarySearchProductByWeight(sorted, weight)).toBe(-1);
    expect(ops.binarySearchProductByWeight([], 1)).toBe(-1);
    expect(ops.binarySearchProductByWeight([product], 2.3)).toBe(0);
    const duplicates = [product, { ...product }];
    expect(
      duplicates[ops.binarySearchProductByWeight(duplicates, 2.3)].weightKg,
    ).toBe(2.3);
  });
});

describe("shipping and scoring", (): void => {
  it.each([
    ["Standard", 35.55],
    ["Express", 46.22],
    ["Same-day", 56.88],
  ] as const)("calculates %s costs", (priority, expected): void => {
    expect(
      ops.calculateShippingCost({ ...shipment, priority }, product, carrier),
    ).toBe(expected);
  });
  it("multiplies weight by quantity and applies surcharge to the full subtotal", (): void => {
    expect(
      ops.calculateShippingCost({ ...shipment, quantity: 2 }, product, carrier),
    ).toBe(50.7);
  });
  it("assigns every score component independently", (): void => {
    expect(ops.scoreCarrierForShipment(carrier, shipment, product)).toBe(97.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, operatesIn: ["United States"] },
        shipment,
        product,
      ),
    ).toBe(77.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, maxWeightKg: 1 },
        shipment,
        product,
      ),
    ).toBe(77.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, acceptsPriority: [] },
        shipment,
        product,
      ),
    ).toBe(82.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, handlesFragile: false },
        shipment,
        product,
      ),
    ).toBe(82.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, handlesFragile: false },
        shipment,
        { ...product, isFragile: false },
      ),
    ).toBe(97.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, onTimeRate: 100 },
        shipment,
        product,
      ),
    ).toBe(100);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, onTimeRate: 0 },
        shipment,
        product,
      ),
    ).toBe(70);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, onTimeRate: 88.888 },
        shipment,
        product,
      ),
    ).toBe(96.67);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, maxWeightKg: 2.3 },
        shipment,
        product,
      ),
    ).toBe(97.6);
    expect(
      ops.scoreCarrierForShipment(
        { ...carrier, maxWeightKg: 2.3 },
        { ...shipment, quantity: 2 },
        product,
      ),
    ).toBe(77.6);
  });
  it("chooses lowest qualifying cost rather than highest score, keeping equal-cost input order", (): void => {
    const cheap = {
      ...sampleCarriers[0],
      baseRateUSD: 0,
      ratePerKgUSD: 0,
      ratePerKmUSD: 0,
    };
    expect(ops.selectBestCarrier([carrier, cheap], shipment, product)).toEqual({
      carrier: cheap,
      cost: 0,
      score: 76.4,
    });
    expect(
      ops.selectBestCarrier(
        [carrier, { ...carrier, id: "tie" }],
        shipment,
        product,
      )?.carrier,
    ).toBe(carrier);
  });
  it("includes score 50 and excludes below 50 without extra disqualifications", (): void => {
    const boundary: Carrier = {
      ...carrier,
      operatesIn: [],
      acceptsPriority: [],
      handlesFragile: false,
      onTimeRate: 100,
    };
    expect(ops.selectBestCarrier([boundary], shipment, product)?.score).toBe(
      50,
    );
    expect(
      ops.selectBestCarrier(
        [{ ...boundary, onTimeRate: 99 }],
        shipment,
        product,
      ),
    ).toBeNull();
    expect(ops.selectBestCarrier([], shipment, product)).toBeNull();
  });
});

describe("reports", (): void => {
  it("counts all categories, including zero counts", (): void => {
    expect(ops.countProductsByCategory(sampleProducts)).toEqual({
      Fashion: 1,
      Electronics: 1,
      Cosmetics: 1,
      Home: 0,
      Other: 0,
    });
    expect(ops.countProductsByCategory([])).toEqual({
      Fashion: 0,
      Electronics: 0,
      Cosmetics: 0,
      Home: 0,
      Other: 0,
    });
  });
  it("calculates inventory value and rounded average distance", (): void => {
    expect(ops.calculateTotalInventoryValue(sampleProducts)).toBe(16975);
    expect(
      ops.calculateTotalInventoryValue([
        { ...product, stockQuantity: 3, unitCostUSD: 1.235 },
      ]),
    ).toBe(3.71);
    expect(ops.calculateAverageShipmentDistance(shipments)).toBe(155.25);
    expect(
      ops.calculateAverageShipmentDistance([
        shipment,
        {
          ...shipment,
          destination: { ...shipment.destination, distanceKm: 1.01 },
        },
      ]),
    ).toBe(160.51);
    expect(ops.calculateTotalInventoryValue([])).toBe(0);
    expect(ops.calculateAverageShipmentDistance([])).toBe(0);
  });
  it("groups every status and returns fresh groups", (): void => {
    const groups = ops.groupShipmentsByStatus(shipments);
    expect(groups.Pending).toEqual([shipment]);
    expect(groups.Assigned).toEqual([shipments[1]]);
    expect(groups.Delivered).toEqual([shipments[2]]);
    expect(groups.Failed).toEqual([shipments[3]]);
    expect(groups["In transit"]).toEqual([]);
    expect(ops.groupShipmentsByStatus([])).toEqual({
      Pending: [],
      Assigned: [],
      "In transit": [],
      Delivered: [],
      Failed: [],
    });
  });
  it("ranks carriers, ignores unassigned shipments and handles topN", (): void => {
    expect(ops.findTopCarriers(shipments, 2)).toEqual([
      { carrier: "UPS", count: 2 },
      { carrier: "SEUR", count: 1 },
    ]);
    expect(ops.findTopCarriers(shipments, 1.9)).toEqual([
      { carrier: "UPS", count: 2 },
    ]);
    expect(
      ops
        .findTopCarriers([shipments[2], shipments[1]], 5)
        .map((row): string => row.carrier),
    ).toEqual(["SEUR", "UPS"]);
    for (const n of [0, -1, NaN, Infinity])
      expect(ops.findTopCarriers(shipments, n)).toEqual([]);
    expect(ops.findTopCarriers([], 3)).toEqual([]);
  });
  it("reports stock extremes and average", (): void => {
    expect(ops.summarizeStock(sampleProducts)).toEqual({
      min: 8,
      max: 120,
      average: 57.67,
    });
    expect(ops.summarizeStock([])).toEqual({
      min: null,
      max: null,
      average: 0,
    });
  });
  it("does not mutate inputs across transformations", (): void => {
    const before = structuredClone({
      sampleProducts,
      sampleCarriers,
      shipments,
    });
    ops.selectBestCarrier(sampleCarriers, shipment, product);
    ops.countProductsByCategory(sampleProducts);
    ops.calculateTotalInventoryValue(sampleProducts);
    ops.groupShipmentsByStatus(shipments);
    ops.findTopCarriers(shipments, 3);
    ops.summarizeStock(sampleProducts);
    expect({ sampleProducts, sampleCarriers, shipments }).toEqual(before);
  });
});

describe("validations", (): void => {
  it("accepts the official sample data", (): void => {
    for (const p of sampleProducts)
      expect(ops.validateProduct(p)).toEqual({ valid: true, errors: [] });
    for (const c of sampleCarriers)
      expect(ops.validateCarrier(c)).toEqual({ valid: true, errors: [] });
    expect(ops.validateShipment(shipment)).toEqual({ valid: true, errors: [] });
  });
  it.each([
    ["weightKg", 0],
    ["weightKg", 100.01],
    ["stockQuantity", -1],
    ["minStockThreshold", -1],
    ["unitCostUSD", 0],
    ["sku", ""],
    ["sku", "  "],
  ] as const)("rejects invalid product %s=%s", (field, value): void => {
    expect(ops.validateProduct({ ...product, [field]: value }).valid).toBe(
      false,
    );
  });
  it.each(["lengthCm", "widthCm", "heightCm"] as const)(
    "enforces dimension bounds on %s",
    (field): void => {
      for (const value of [0, -1, 200.01, NaN, Infinity]) {
        expect(
          ops.validateProduct({
            ...product,
            dimensions: { ...product.dimensions, [field]: value },
          }).valid,
        ).toBe(false);
      }
      expect(
        ops.validateProduct({
          ...product,
          dimensions: { ...product.dimensions, [field]: 200 },
        }).valid,
      ).toBe(true);
    },
  );
  it("accepts inclusive product boundaries", (): void => {
    expect(
      ops.validateProduct({
        ...product,
        weightKg: 100,
        stockQuantity: 0,
        minStockThreshold: 0,
      }).valid,
    ).toBe(true);
  });
  it.each(["quantity", "declaredValueUSD"] as const)(
    "validates shipment %s",
    (field): void => {
      for (const value of [0, -1, NaN, Infinity])
        expect(
          ops.validateShipment({ ...shipment, [field]: value }).valid,
        ).toBe(false);
    },
  );
  it("validates distance, dates and nullable carrier", (): void => {
    expect(
      ops.validateShipment({
        ...shipment,
        destination: { ...shipment.destination, distanceKm: 0 },
      }).valid,
    ).toBe(true);
    for (const distanceKm of [-1, NaN, Infinity])
      expect(
        ops.validateShipment({
          ...shipment,
          destination: { ...shipment.destination, distanceKm },
        }).valid,
      ).toBe(false);
    expect(
      ops.validateShipment({ ...shipment, createdAt: new Date("invalid") })
        .valid,
    ).toBe(false);
    expect(ops.validateShipment({ ...shipment, carrier: "SEUR" }).valid).toBe(
      true,
    );
  });
  it.each([
    "baseRateUSD",
    "ratePerKgUSD",
    "ratePerKmUSD",
    "avgDeliveryDays",
    "maxWeightKg",
    "onTimeRate",
  ] as const)("validates carrier %s", (field): void => {
    for (const value of [-1, NaN, Infinity])
      expect(ops.validateCarrier({ ...carrier, [field]: value }).valid).toBe(
        false,
      );
  });
  it("enforces remaining carrier boundaries", (): void => {
    expect(
      ops.validateCarrier({
        ...carrier,
        baseRateUSD: 0,
        ratePerKgUSD: 0,
        ratePerKmUSD: 0,
        onTimeRate: 0,
      }).valid,
    ).toBe(true);
    expect(ops.validateCarrier({ ...carrier, onTimeRate: 100 }).valid).toBe(
      true,
    );
    expect(ops.validateCarrier({ ...carrier, onTimeRate: 100.01 }).valid).toBe(
      false,
    );
    expect(ops.validateCarrier({ ...carrier, avgDeliveryDays: 0 }).valid).toBe(
      false,
    );
    expect(ops.validateCarrier({ ...carrier, maxWeightKg: 0 }).valid).toBe(
      false,
    );
    expect(ops.validateCarrier({ ...carrier, operatesIn: [] }).valid).toBe(
      false,
    );
  });
  it("rejects every missing field and malformed nested records without throwing", (): void => {
    for (const field of Object.keys(product)) {
      const malformed = { ...product } as Record<string, unknown>;
      delete malformed[field];
      expect(
        ops.validateProduct(malformed as unknown as Product).valid,
        field,
      ).toBe(false);
    }
    for (const field of Object.keys(shipment)) {
      const malformed = { ...shipment } as Record<string, unknown>;
      delete malformed[field];
      expect(
        ops.validateShipment(malformed as unknown as Shipment).valid,
        field,
      ).toBe(false);
    }
    for (const field of Object.keys(carrier)) {
      const malformed = { ...carrier } as Record<string, unknown>;
      delete malformed[field];
      expect(
        ops.validateCarrier(malformed as unknown as Carrier).valid,
        field,
      ).toBe(false);
    }
    for (const value of [null, undefined, {}, [], "bad"]) {
      expect(ops.validateProduct(value as Product).valid).toBe(false);
      expect(ops.validateShipment(value as Shipment).valid).toBe(false);
      expect(ops.validateCarrier(value as Carrier).valid).toBe(false);
    }
    expect(
      ops.validateProduct({
        ...product,
        dimensions: null,
      } as unknown as Product).valid,
    ).toBe(false);
    expect(
      ops.validateShipment({
        ...shipment,
        destination: null,
      } as unknown as Shipment).valid,
    ).toBe(false);
  });
  it("rejects invalid unions, booleans and non-finite product numbers", (): void => {
    for (const field of [
      "weightKg",
      "stockQuantity",
      "minStockThreshold",
      "unitCostUSD",
    ]) {
      for (const value of [NaN, Infinity])
        expect(ops.validateProduct({ ...product, [field]: value }).valid).toBe(
          false,
        );
    }
    expect(
      ops.validateProduct({ ...product, category: "bad" } as unknown as Product)
        .valid,
    ).toBe(false);
    expect(
      ops.validateCarrier({
        ...carrier,
        operatesIn: [null],
      } as unknown as Carrier).valid,
    ).toBe(false);
    expect(
      ops.validateCarrier({
        ...carrier,
        acceptsPriority: ["bad"],
        handlesFragile: null,
      } as unknown as Carrier).valid,
    ).toBe(false);
    expect(
      ops.validateShipment({
        ...shipment,
        priority: "bad",
      } as unknown as Shipment).valid,
    ).toBe(false);
  });
});
