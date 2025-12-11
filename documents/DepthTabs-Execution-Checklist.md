# DepthTabs - Technical Execution Checklist

## Pre-Implementation Setup

### 1. Environment Preparation
```bash
# Verify project structure
cd apps/app
ls -la src/components/ui/

# Check existing tab implementations
grep -r "tab" src/components/ --include="*.tsx" | head -10

# Verify testing setup
ls -la src/__tests__/components/
```

### 2. Dependencies Check
```json
// package.json dependencies check
{
  "@radix-ui/react-tabs": "^1.0.4",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "vitest": "^1.0.0",
  "@playwright/test": "^1.40.0"
}
```

## Implementation Steps

### Step 1: Core Component Structure
```tsx
// src/components/ui/DepthTabs.tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

export interface TabItem {
  id: string
  label: string
  content?: React.ReactNode
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface DepthTabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  items: TabItem[]
  disabledIndices?: number[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const DepthTabs = React.forwardRef<HTMLDivElement, DepthTabsProps>(
  ({ items, disabledIndices = [], className, orientation = 'horizontal', ...props }, ref) => {
    const disabledSet = new Set(disabledIndices)
    
    return (
      <TabsPrimitive.Root
        ref={ref}
        className={cn("depth-tabs", className)}
        orientation={orientation}
        {...props}
      >
        <TabsPrimitive.List className="depth-tabs-list" role="tablist">
          {items.map((item, index) => {
            const isDisabled = item.disabled || disabledSet.has(index)
            return (
              <TabsPrimitive.Trigger
                key={item.id}
                value={item.id}
                className={cn(
                  "depth-tabs-trigger",
                  isDisabled && "depth-tabs-trigger-disabled"
                )}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : undefined}
              >
                {item.icon && <item.icon className="depth-tabs-icon" />}
                <span>{item.label}</span>
              </TabsPrimitive.Trigger>
            )
          })}
        </TabsPrimitive.List>
        
        {items.map((item) => (
          <TabsPrimitive.Content
            key={item.id}
            value={item.id}
            className="depth-tabs-content"
            role="tabpanel"
          >
            {item.content}
          </TabsPrimitive.Content>
        ))}
      </TabsPrimitive.Root>
    )
  }
)
DepthTabs.displayName = "DepthTabs"
```

### Step 2: CSS Styling Implementation
```css
/* src/styles/components/depth-tabs.css */
.depth-tabs {
  @apply w-full;
}

.depth-tabs-list {
  @apply inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground;
}

.depth-tabs-trigger {
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}

.depth-tabs-trigger[data-state="active"] {
  @apply bg-background text-foreground shadow-sm;
}

.depth-tabs-trigger-disabled {
  @apply opacity-60 cursor-not-allowed pointer-events-none;
}

.depth-tabs-trigger-disabled:hover {
  @apply bg-transparent;
}

.depth-tabs-content {
  @apply mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .depth-tabs-trigger-disabled {
    @apply opacity-50;
  }
}
```

### Step 3: Keyboard Navigation Enhancement
```tsx
// src/hooks/useTabKeyboardNavigation.ts
import { useCallback, useRef } from 'react'

export const useTabKeyboardNavigation = (items: TabItem[], disabledIndices: number[] = []) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const disabledSet = new Set(disabledIndices)
  
  const getNextEnabledTab = useCallback((currentIndex: number, direction: 1 | -1) => {
    let nextIndex = currentIndex + direction
    
    // Wrap around logic
    if (nextIndex < 0) nextIndex = items.length - 1
    if (nextIndex >= items.length) nextIndex = 0
    
    // Skip disabled tabs
    while (disabledSet.has(nextIndex) || items[nextIndex]?.disabled) {
      nextIndex += direction
      if (nextIndex < 0) nextIndex = items.length - 1
      if (nextIndex >= items.length) nextIndex = 0
      
      // Prevent infinite loop if all tabs are disabled
      if (nextIndex === currentIndex) return currentIndex
    }
    
    return nextIndex
  }, [items, disabledSet])
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        const nextIndex = getNextEnabledTab(currentIndex, direction)
        tabRefs.current[nextIndex]?.focus()
        break
      }
      case 'Home':
        event.preventDefault()
        const firstEnabled = items.findIndex((item, index) => 
          !item.disabled && !disabledSet.has(index)
        )
        if (firstEnabled !== -1) {
          tabRefs.current[firstEnabled]?.focus()
        }
        break
      case 'End':
        event.preventDefault()
        const lastEnabled = items.findLastIndex((item, index) => 
          !item.disabled && !disabledSet.has(index)
        )
        if (lastEnabled !== -1) {
          tabRefs.current[lastEnabled]?.focus()
        }
        break
    }
  }, [items, disabledSet, getNextEnabledTab])
  
  return { tabRefs, handleKeyDown }
}
```

### Step 4: Comprehensive Test Suite

#### Unit Tests
```tsx
// src/__tests__/components/ui/DepthTabs.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DepthTabs } from '@/components/ui/DepthTabs'

describe('DepthTabs', () => {
  const mockItems = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' }
  ]
  
  it('renders disabled tabs with correct attributes', () => {
    render(<DepthTabs items={mockItems} defaultValue="tab1" />)
    
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' })
    expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
    expect(disabledTab).toHaveAttribute('tabindex', '-1')
    expect(disabledTab).toHaveClass('depth-tabs-trigger-disabled')
  })
  
  it('prevents clicking on disabled tabs', () => {
    const onValueChange = vi.fn()
    render(
      <DepthTabs 
        items={mockItems} 
        defaultValue="tab1" 
        onValueChange={onValueChange}
      />
    )
    
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' })
    fireEvent.click(disabledTab)
    
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tab 1')
  })
  
  it('skips disabled tabs during keyboard navigation', () => {
    render(<DepthTabs items={mockItems} defaultValue="tab1" />)
    
    const activeTab = screen.getByRole('tab', { selected: true })
    fireEvent.keyDown(activeTab, { key: 'ArrowRight' })
    
    // Should skip disabled tab2 and focus tab3
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus()
  })
  
  it('handles disabledIndices prop correctly', () => {
    const items = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' }
    ]
    
    render(
      <DepthTabs 
        items={items} 
        disabledIndices={[1]} 
        defaultValue="tab1" 
      />
    )
    
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' })
    expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
  })
})
```

#### Integration Tests
```tsx
// e2e/depth-tabs.spec.ts
import { test, expect } from '@playwright/test'

test.describe('DepthTabs Integration', () => {
  test('disabled tabs behavior in umbrella page', async ({ page }) => {
    await page.goto('/umbrella')
    
    // Verify disabled tab exists
    const disabledTab = page.getByRole('tab', { name: 'Disabled Section' })
    await expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
    
    // Attempt to click disabled tab
    await disabledTab.click()
    
    // Verify active tab hasn't changed
    const activeTab = page.getByRole('tab', { selected: true })
    await expect(activeTab).not.toHaveText('Disabled Section')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab') // Focus active tab
    await page.keyboard.press('ArrowRight')
    
    // Should skip disabled tab
    await expect(activeTab).not.toHaveText('Disabled Section')
  })
  
  test('visual regression for disabled state', async ({ page }) => {
    await page.goto('/umbrella')
    
    // Take screenshot of disabled tabs
    const tabsContainer = page.locator('.depth-tabs')
    await expect(tabsContainer).toHaveScreenshot('disabled-tabs-state.png')
  })
})
```

### Step 5: Accessibility Validation

#### Automated A11y Tests
```tsx
// src/__tests__/a11y/DepthTabs.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { DepthTabs } from '@/components/ui/DepthTabs'

expect.extend(toHaveNoViolations)

describe('DepthTabs Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <DepthTabs
        items={[
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true }
        ]}
        defaultValue="tab1"
      />
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  
  it('should announce state changes to screen readers', () => {
    const { getByRole } = render(
      <DepthTabs
        items={[
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true }
        ]}
        defaultValue="tab1"
        aria-live="polite"
      />
    )
    
    const tablist = getByRole('tablist')
    expect(tablist).toHaveAttribute('aria-live', 'polite')
  })
})
```

### Step 6: Integration with Umbrella Page

#### Component Replacement
```tsx
// src/app/umbrella/page.tsx
import { DepthTabs } from '@/components/ui/DepthTabs'

export default function UmbrellaPage() {
  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewSection />
    },
    {
      id: 'features',
      label: 'Features',
      content: <FeaturesSection />
    },
    {
      id: 'disabled',
      label: 'Premium Features',
      content: <PremiumSection />,
      disabled: true // This tab is disabled
    },
    {
      id: 'implementation',
      label: 'Implementation',
      content: <ImplementationSection />
    }
  ]
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Umbrella Documentation</h1>
      
      <DepthTabs
        items={tabItems}
        defaultValue="overview"
        className="w-full"
      />
      
      {/* Table of Contents */}
      <TableOfContents items={tabItems} />
    </div>
  )
}
```

### Step 7: Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
pnpm --filter @sba/app build
pnpm --filter @sba/app analyze

# Check for unused code
pnpm --filter @sba/app test:coverage
```

#### Performance Metrics
```typescript
// src/lib/performance/metrics.ts
export const trackTabPerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    // Track tab switching performance
    performance.mark('tab-switch-start')
    
    // Measure after tab content renders
    requestAnimationFrame(() => {
      performance.mark('tab-switch-end')
      performance.measure('tab-switch', 'tab-switch-start', 'tab-switch-end')
      
      const measure = performance.getEntriesByName('tab-switch')[0]
      console.log(`Tab switch took ${measure.duration}ms`)
    })
  }
}
```

## Validation Checklist

### Code Quality ✅
- [ ] TypeScript strict mode enabled
- [ ] ESLint rules passing
- [ ] Prettier formatting applied
- [ ] No console.log statements
- [ ] Error boundaries implemented

### Testing Coverage ✅
- [ ] Unit tests ≥90% coverage
- [ ] Integration tests passing
- [ ] E2E tests for critical paths
- [ ] Accessibility tests passing
- [ ] Visual regression tests

### Performance ✅
- [ ] Bundle size < 5KB gzipped
- [ ] No performance regression
- [ ] Lazy loading implemented
- [ ] Code splitting optimized
- [ ] CDN configuration verified

### Accessibility ✅
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation working
- [ ] Screen reader tested
- [ ] Color contrast validated
- [ ] Focus management correct

### Documentation ✅
- [ ] API documentation complete
- [ ] Usage examples provided
- [ ] Migration guide updated
- [ ] Architecture docs updated
- [ ] FAQ section added

## Deployment Readiness

### Pre-deployment Checklist
1. **Code Review**: 2 approvers minimum
2. **Testing**: All tests passing
3. **Performance**: Metrics validated
4. **Security**: Audit completed
5. **Documentation**: Complete and reviewed

### Rollback Plan
1. **Feature Flag**: Toggle disabled state feature
2. **Version Control**: Git revert capability
3. **Monitoring**: Error tracking enabled
4. **Communication**: Stakeholder notification

## Success Metrics

### Technical Metrics
- Test Coverage: ≥90%
- Performance: No regression
- Bundle Size: < 5KB increase
- Accessibility: Zero violations

### Business Metrics
- User Experience: Improved navigation
- Accessibility: WCAG compliance
- Developer Experience: Better documentation
- Maintenance: Reduced complexity

---

**Ready for Implementation** ✅
**Estimated Time**: 2-3 weeks
**Risk Level**: Low
**Dependencies**: None