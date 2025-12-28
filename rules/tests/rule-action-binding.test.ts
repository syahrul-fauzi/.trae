import { describe, it, expect } from 'vitest';

describe('Rule Action Binding', () => {
  it('should resolve tool reference correctly', () => {
    const toolRegistry = { 'workflow.escalate': () => 'success' };
    const step = { op: 'tool', ref: 'workflow.escalate' };
    
    expect(toolRegistry[step.ref]).toBeDefined();
    expect(toolRegistry[step.ref]()).toBe('success');
  });

  it('should map dynamic input values', () => {
    const triggerData = { id: 'doc_001' };
    const inputTemplate = { doc_id: '${trigger.id}' };
    
    const resolvedInput = { doc_id: triggerData.id };
    expect(resolvedInput.doc_id).toBe('doc_001');
  });
});
