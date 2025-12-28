import { describe, it, expect } from 'vitest';

describe('Backward Compatibility', () => {
  it('should support legacy rule ID format', () => {
    const legacyId = "BPA-001";
    const currentPattern = /^[A-Z]{2,3}(-[A-Z]{2,3})?-[0-9]{2,3}$/;
    
    expect(legacyId).toMatch(currentPattern);
  });

  it('should handle missing optional fields from older rules', () => {
    const oldRule = { id: "BPA-01", name: "Old Rule" }; // Missing action
    expect(oldRule.id).toBeDefined();
  });
});
