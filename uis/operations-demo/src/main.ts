import "./styles.css";
import {
  binarySearchProductByWeight,
  calculateAverageShipmentDistance,
  calculateShippingCost,
  calculateTotalInventoryValue,
  countProductsByCategory,
  filterProducts,
  filterProductsByWarehouse,
  filterProductsByCategory,
  filterLowStockProducts,
  findProductBySKU,
  findShipmentById,
  findTopCarriers,
  groupShipmentsByStatus,
  scoreCarrierForShipment,
  selectBestCarrier,
  sortCarriersByReliability,
  sortProductsByFields,
  sortProductsByStock,
  summarizeStock,
  validateCarrier,
  validateProduct,
  validateShipment,
} from "@repo/shared-types";
import type {
  Carrier,
  Country,
  Product,
  ProductCategory,
  ProductStatus,
  Shipment,
  ShipmentPriority,
  SortOrder,
  WarehouseLocation,
} from "@repo/shared-types";
import {
  sampleProducts,
  sampleCarriers,
  sampleShipment,
} from "@repo/shared-types/sample-data";

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error("Missing UI element: " + id);
  return found as T;
}
function value(id: string): string {
  return element<HTMLInputElement | HTMLSelectElement>(id).value;
}
function checked(id: string): boolean {
  return element<HTMLInputElement>(id).checked;
}
function text(id: string, content: string): void {
  element(id).textContent = content;
}
function json(id: string, content: unknown): void {
  text(id, JSON.stringify(content, null, 2));
}
function money(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function cell(row: HTMLTableRowElement, content: string): void {
  row.insertCell().textContent = content;
}

const shipments: Shipment[] = [
  sampleShipment,
  {
    ...sampleShipment,
    id: "SH-DEMO-002",
    carrier: "SEUR",
    status: "Delivered",
    destination: { ...sampleShipment.destination, distanceKm: 200 },
  },
  {
    ...sampleShipment,
    id: "SH-DEMO-003",
    carrier: "SEUR",
    status: "Assigned",
    destination: { ...sampleShipment.destination, distanceKm: 150 },
  },
  {
    ...sampleShipment,
    id: "SH-DEMO-004",
    carrier: "UPS",
    status: "In transit",
    origin: "Los Angeles",
    destination: {
      city: "San Diego",
      country: "United States",
      postalCode: "92101",
      distanceKm: 195,
    },
  },
];
let visibleProducts: Product[] = [...sampleProducts];

function renderInventory(): void {
  let products = [...sampleProducts];
  if (value("warehouse"))
    products = filterProductsByWarehouse(
      products,
      value("warehouse") as WarehouseLocation,
    );
  if (value("category"))
    products = filterProductsByCategory(
      products,
      value("category") as ProductCategory,
    );
  if (checked("low-stock")) products = filterLowStockProducts(products);
  products = filterProducts(products, {
    status: (value("product-status") || undefined) as ProductStatus | undefined,
    minStock:
      value("min-stock") === "" ? undefined : Number(value("min-stock")),
    maxStock:
      value("max-stock") === "" ? undefined : Number(value("max-stock")),
  });
  visibleProducts =
    value("stock-sort") === "warehouse"
      ? sortProductsByFields(products, [
          { field: "warehouse", order: "asc" },
          { field: "stockQuantity", order: "asc" },
        ])
      : sortProductsByStock(products, value("stock-sort") as SortOrder);
  const body = element<HTMLTableSectionElement>("inventory-body");
  body.replaceChildren();
  for (const product of visibleProducts) {
    const row = body.insertRow();
    cell(row, product.name + " · " + product.sku);
    cell(row, product.warehouse);
    cell(row, product.stockQuantity + " / " + product.minStockThreshold);
    cell(row, product.weightKg + " kg");
    cell(row, product.status);
  }
  if (!visibleProducts.length) {
    const empty = body.insertRow().insertCell();
    empty.colSpan = 5;
    empty.textContent = "No products match these filters.";
  }
  text(
    "inventory-count",
    visibleProducts.length + " of " + sampleProducts.length + " products",
  );
  renderReports();
}

element<HTMLFormElement>("inventory-form").addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    renderInventory();
  },
);
element("inventory-form").addEventListener("reset", (): void => {
  queueMicrotask(renderInventory);
});
element("linear-form").addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    const found =
      value("search-kind") === "product"
        ? findProductBySKU(sampleProducts, value("search-term"))
        : findShipmentById(shipments, value("search-term"));
    if (found === null) text("linear-result", "No record found (null).");
    else json("linear-result", found);
  },
);
element("search-kind").addEventListener("change", (): void => {
  element<HTMLInputElement>("search-term").value =
    value("search-kind") === "product" ? "laptop-dell-15" : "SH-2024-8821";
  text("linear-result", "Ready to search.");
});
const byWeight = sortProductsByFields(sampleProducts, [
  { field: "weightKg", order: "asc" },
]);
for (const [index, product] of byWeight.entries()) {
  const li = document.createElement("li");
  li.textContent =
    index + " · " + product.sku + " — " + product.weightKg + " kg";
  element("weight-list").append(li);
}
element("binary-form").addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    const index = binarySearchProductByWeight(
      byWeight,
      Number(value("target-weight")),
    );
    text(
      "binary-result",
      index === -1
        ? "Weight not found (index -1)."
        : "Found at index " + index + ": " + byWeight[index].sku,
    );
  },
);

for (const product of sampleProducts) {
  const option = document.createElement("option");
  option.value = product.sku;
  option.textContent = product.sku;
  option.selected = product.sku === sampleShipment.sku;
  element("shipping-product").append(option);
}
element("shipping-product").addEventListener("change", (): void => {
  const product = findProductBySKU(sampleProducts, value("shipping-product"));
  if (product) element<HTMLInputElement>("fragile").checked = product.isFragile;
});

function renderShipping(): void {
  const sourceProduct = findProductBySKU(
    sampleProducts,
    value("shipping-product"),
  );
  if (!sourceProduct) return;
  const product: Product = { ...sourceProduct, isFragile: checked("fragile") };
  const shipment: Shipment = {
    ...sampleShipment,
    sku: product.sku,
    origin: product.warehouse,
    quantity: Number(value("shipping-quantity")),
    priority: value("shipping-priority") as ShipmentPriority,
    destination: {
      ...sampleShipment.destination,
      country: value("destination-country") as Country,
      distanceKm: Number(value("shipping-distance")),
    },
  };
  const validation = validateShipment(shipment);
  const body = element<HTMLTableSectionElement>("carrier-body");
  body.replaceChildren();
  if (!validation.valid) {
    text("shipping-result", validation.errors.join(" "));
    return;
  }
  const best = selectBestCarrier(sampleCarriers, shipment, product);
  text(
    "shipping-result",
    best
      ? best.carrier.name +
          " is the lowest-cost qualifying carrier: " +
          money(best.cost) +
          " · score " +
          best.score +
          "/100."
      : "No suitable carrier found (null).",
  );
  for (const carrier of sortCarriersByReliability(
    sampleCarriers,
    value("carrier-sort") as SortOrder,
  )) {
    const score = scoreCarrierForShipment(carrier, shipment, product);
    const row = body.insertRow();
    if (best?.carrier.id === carrier.id) row.className = "bg-blue-50";
    cell(row, carrier.name);
    cell(row, carrier.onTimeRate + "%");
    cell(row, String(score));
    cell(row, money(calculateShippingCost(shipment, product, carrier)));
    cell(row, score >= 50 ? "Qualifies" : "Below 50");
  }
}
element("shipping-form").addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    renderShipping();
  },
);

function renderReports(): void {
  const products = checked("empty-reports") ? [] : visibleProducts;
  const records = checked("empty-reports") ? [] : shipments;
  const stock = summarizeStock(products);
  text(
    "report-scope",
    products.length +
      " products · " +
      records.length +
      " shipments in this report",
  );
  text("inventory-value", money(calculateTotalInventoryValue(products)));
  text("average-distance", calculateAverageShipmentDistance(records) + " km");
  text(
    "stock-summary",
    (stock.min ?? "—") + " / " + (stock.max ?? "—") + " / " + stock.average,
  );
  const groups = groupShipmentsByStatus(records);
  json("report-details", {
    productsByCategory: countProductsByCategory(products),
    shipmentsByStatus: Object.fromEntries(
      Object.entries(groups).map(
        ([status, items]: [string, Shipment[]]): [string, string[]] => [
          status,
          items.map((item: Shipment): string => item.id),
        ],
      ),
    ),
    topCarriers: findTopCarriers(records, 3),
  });
}
element("generate-reports").addEventListener("click", renderReports);
element("empty-reports").addEventListener("change", renderReports);

function loadValidationSample(): void {
  const sample =
    value("validation-kind") === "product"
      ? sampleProducts[1]
      : value("validation-kind") === "shipment"
        ? sampleShipment
        : sampleCarriers[1];
  element<HTMLTextAreaElement>("validation-json").value = JSON.stringify(
    sample,
    null,
    2,
  );
  text("validation-result", "Sample loaded. Edit it or validate it as-is.");
}
element("validation-kind").addEventListener("change", loadValidationSample);
element("reset-json").addEventListener("click", loadValidationSample);
element("validation-form").addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    let parsed: unknown;
    try {
      parsed = JSON.parse(value("validation-json"));
    } catch {
      text(
        "validation-result",
        "Invalid JSON. Check quotes, commas, and brackets.",
      );
      return;
    }
    if (
      value("validation-kind") === "shipment" &&
      typeof parsed === "object" &&
      parsed !== null &&
      "createdAt" in parsed &&
      typeof parsed.createdAt === "string"
    ) {
      parsed = { ...parsed, createdAt: new Date(parsed.createdAt) };
    }
    const result =
      value("validation-kind") === "product"
        ? validateProduct(parsed as Product)
        : value("validation-kind") === "shipment"
          ? validateShipment(parsed as Shipment)
          : validateCarrier(parsed as Carrier);
    json("validation-result", result);
  },
);

renderInventory();
renderShipping();
loadValidationSample();
