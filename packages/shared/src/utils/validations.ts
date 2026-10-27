import type { Carrier, Product, Shipment } from "../types/models";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as DataRecord)
    : {};
}

function numberInRange(
  value: unknown,
  min: number,
  max: number,
  exclusiveMin: boolean = false,
): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    (exclusiveMin ? value > min : value >= min) &&
    value <= max
  );
}

function check(errors: string[], condition: boolean, message: string): void {
  if (!condition) errors.push(message);
}

function strings(data: DataRecord, fields: string[], errors: string[]): void {
  for (const field of fields)
    check(
      errors,
      typeof data[field] === "string",
      field + " must be a string.",
    );
}

function member(value: unknown, choices: readonly string[]): boolean {
  return typeof value === "string" && choices.includes(value);
}

function result(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function validateProduct(product: Product): ValidationResult {
  const data = asRecord(product);
  const dimensions = asRecord(data.dimensions);
  const errors: string[] = [];
  check(
    errors,
    typeof data.sku === "string" && data.sku.trim().length > 0,
    "sku must not be empty.",
  );
  strings(data, ["name"], errors);
  check(
    errors,
    member(data.category, [
      "Fashion",
      "Electronics",
      "Cosmetics",
      "Home",
      "Other",
    ]),
    "category must be a supported product category.",
  );
  check(
    errors,
    member(data.warehouse, ["Los Angeles", "Zaragoza"]),
    "warehouse must be Los Angeles or Zaragoza.",
  );
  check(
    errors,
    member(data.status, [
      "Active",
      "Low stock",
      "Out of stock",
      "Discontinued",
    ]),
    "status must be a supported product status.",
  );
  check(
    errors,
    typeof data.isFragile === "boolean",
    "isFragile must be a boolean.",
  );
  check(
    errors,
    numberInRange(data.weightKg, 0, 100, true),
    "weightKg must be greater than 0 and at most 100.",
  );
  for (const field of ["lengthCm", "widthCm", "heightCm"]) {
    check(
      errors,
      numberInRange(dimensions[field], 0, 200, true),
      "dimensions." + field + " must be greater than 0 and at most 200.",
    );
  }
  check(
    errors,
    numberInRange(data.stockQuantity, 0, Infinity),
    "stockQuantity must be a finite number at least 0.",
  );
  check(
    errors,
    numberInRange(data.minStockThreshold, 0, Infinity),
    "minStockThreshold must be a finite number at least 0.",
  );
  check(
    errors,
    numberInRange(data.unitCostUSD, 0, Infinity, true),
    "unitCostUSD must be a finite number greater than 0.",
  );
  return result(errors);
}

export function validateShipment(shipment: Shipment): ValidationResult {
  const data = asRecord(shipment);
  const destination = asRecord(data.destination);
  const errors: string[] = [];
  strings(data, ["id", "sku"], errors);
  strings(destination, ["city", "postalCode"], errors);
  check(
    errors,
    member(data.origin, ["Los Angeles", "Zaragoza"]),
    "origin must be Los Angeles or Zaragoza.",
  );
  check(
    errors,
    member(destination.country, ["United States", "Spain"]),
    "destination.country must be United States or Spain.",
  );
  check(
    errors,
    member(data.priority, ["Standard", "Express", "Same-day"]),
    "priority must be Standard, Express, or Same-day.",
  );
  check(
    errors,
    member(data.status, [
      "Pending",
      "Assigned",
      "In transit",
      "Delivered",
      "Failed",
    ]),
    "status must be a supported shipment status.",
  );
  check(
    errors,
    data.carrier === null || typeof data.carrier === "string",
    "carrier must be a string or null.",
  );
  check(
    errors,
    data.createdAt instanceof Date && Number.isFinite(data.createdAt.getTime()),
    "createdAt must be a valid Date.",
  );
  check(
    errors,
    numberInRange(data.quantity, 0, Infinity, true),
    "quantity must be a finite number greater than 0.",
  );
  check(
    errors,
    numberInRange(data.declaredValueUSD, 0, Infinity, true),
    "declaredValueUSD must be a finite number greater than 0.",
  );
  check(
    errors,
    numberInRange(destination.distanceKm, 0, Infinity),
    "destination.distanceKm must be a finite number at least 0.",
  );
  return result(errors);
}

export function validateCarrier(carrier: Carrier): ValidationResult {
  const data = asRecord(carrier);
  const errors: string[] = [];
  strings(data, ["id", "name"], errors);
  for (const field of ["baseRateUSD", "ratePerKgUSD", "ratePerKmUSD"]) {
    check(
      errors,
      numberInRange(data[field], 0, Infinity),
      field + " must be a finite number at least 0.",
    );
  }
  check(
    errors,
    numberInRange(data.avgDeliveryDays, 0, Infinity, true),
    "avgDeliveryDays must be a finite number greater than 0.",
  );
  check(
    errors,
    numberInRange(data.onTimeRate, 0, 100),
    "onTimeRate must be between 0 and 100.",
  );
  check(
    errors,
    numberInRange(data.maxWeightKg, 0, Infinity, true),
    "maxWeightKg must be a finite number greater than 0.",
  );
  check(
    errors,
    Array.isArray(data.operatesIn) &&
      data.operatesIn.length > 0 &&
      data.operatesIn.every((country: unknown): boolean =>
        member(country, ["United States", "Spain"]),
      ),
    "operatesIn must contain at least one supported country.",
  );
  check(
    errors,
    Array.isArray(data.acceptsPriority) &&
      data.acceptsPriority.every((priority: unknown): boolean =>
        member(priority, ["Standard", "Express", "Same-day"]),
      ),
    "acceptsPriority must be an array of supported priorities.",
  );
  check(
    errors,
    typeof data.handlesFragile === "boolean",
    "handlesFragile must be a boolean.",
  );
  return result(errors);
}
