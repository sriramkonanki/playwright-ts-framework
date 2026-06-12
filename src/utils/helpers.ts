import { CreateUserPayload } from "../types/api.types";

// ---------------------------------------------------------------------------
// Random data generators
// ---------------------------------------------------------------------------
export function randomEmail(prefix = "test"): string {
  return `${prefix}+${Date.now()}@example.com`;
}

export function randomString(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export function randomName(): { first: string; last: string } {
  const firstNames = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"];
  const lastNames = ["Smith", "Jones", "Brown", "Wilson", "Taylor", "Davis"];
  return {
    first: firstNames[Math.floor(Math.random() * firstNames.length)],
    last: lastNames[Math.floor(Math.random() * lastNames.length)],
  };
}

// ---------------------------------------------------------------------------
// Payload builders
// ---------------------------------------------------------------------------
export function buildCreateUserPayload(overrides?: Partial<CreateUserPayload>): CreateUserPayload {
  const name = randomName();
  return {
    name: `${name.first} ${name.last}`,
    job: "Software Engineer",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Wait helpers
// ---------------------------------------------------------------------------
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is required but not set.`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// API response validators
// ---------------------------------------------------------------------------
export function assertIsoDateString(value: unknown): asserts value is string {
  if (typeof value !== "string" || isNaN(Date.parse(value))) {
    throw new Error(`Expected ISO date string, got: ${JSON.stringify(value)}`);
  }
}

export function assertPositiveInt(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Expected positive integer, got: ${JSON.stringify(value)}`);
  }
}
