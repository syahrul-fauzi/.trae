import { describe, it, expect } from 'vitest';
import { validateRule } from '../validator'; // Mock validator

describe('Rule Schema Validation', () => {
  it('should validate a correct BPA rule', () => {
    const rule = {
      id: "BPA-APP-01",
      name: "Test Rule",
      trigger: { events: ["test.event"] },
      action: { steps: [{ op: "tool", ref: "test" }], integration: "@sba/test" }
    };
    expect(validateRule(rule)).toBe(true);
  });

  it('should fail if ID format is invalid', () => {
    const rule = { id: "INVALID-ID", name: "Test" };
    expect(() => validateRule(rule)).toThrow();
  });
});
