# **TESTING & VERIFICATION CHECKLIST - `apps/app` (SBA-Agentic)**

**Comprehensive Quality Assurance Document dengan Detailed Test Criteria, Pass/Fail Standards, dan Verification Procedures**

---

## **1. TESTING STRATEGY OVERVIEW**

### **1.1 Testing Pyramid - Comprehensive Coverage**

```
                    🎯 E2E Tests (10%)
                       - User Journeys
                       - Cross-browser
                       - Accessibility
                       - Performance
                    
                    🔧 Integration Tests (30%)
                       - API Integration
                       - Component Integration
                       - State Management
                       - Real-time Features
                    
                    ⚡ Unit Tests (60%)
                       - Component Logic
                       - Utility Functions
                       - Type Safety
                       - Error Handling
```

### **1.2 Testing Categories & Coverage Targets**

| Test Category | Coverage Target | Tools | Success Criteria |
|---------------|-----------------|--------|------------------|
| **Unit Tests** | 85% line coverage | Vitest, React Testing Library | All tests pass, no regressions |
| **Integration Tests** | 80% function coverage | Vitest, MSW | API contracts honored |
| **E2E Tests** | 100% critical paths | Playwright | All user flows functional |
| **Accessibility** | WCAG 2.1 AA | axe-core, Lighthouse | Zero violations, score > 90 |
| **Performance** | Core Web Vitals | Lighthouse, WebPageTest | All metrics in "Good" range |
| **Security** | OWASP Top 10 | Security scanners | Zero critical vulnerabilities |

---

## **2. UNIT TESTING CRITERIA - DETAILED SPECIFICATIONS**

### **2.1 Component Testing Standards**

#### **✅ PASSING CRITERIA - UI Components**

**Button Component Tests:**
```typescript
describe('Button Component - Accessibility & UX', () => {
  // ✅ Must Pass: Basic rendering
  test('renders with correct text and attributes', () => {
    render(<Button ariaLabel="Submit form">Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Submit');
  });
  
  // ✅ Must Pass: Click handling
  test('handles click events correctly', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  // ✅ Must Pass: Loading state
  test('shows loading state with proper ARIA', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  // ✅ Must Pass: Disabled state
  test('properly handles disabled state', () => {
    render(<Button disabled>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
  
  // ✅ Must Pass: Keyboard navigation
  test('is keyboard accessible', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
    
    button.focus();
    expect(document.activeElement).toBe(button);
  });
  
  // ✅ Must Pass: Focus management
  test('has visible focus indicator', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-offset-2');
  });
});
```

#### **✅ PASSING CRITERIA - Form Components**

**Input Component Tests:**
```typescript
describe('Input Component - Validation & UX', () => {
  // ✅ Must Pass: Value binding
  test('binds value correctly and handles changes', () => {
    const handleChange = vi.fn();
    render(
      <Input 
        value="test value" 
        onChange={handleChange}
        ariaLabel="Email input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledWith('new value');
  });
  
  // ✅ Must Pass: Error state display
  test('displays error message with proper ARIA', () => {
    render(
      <Input 
        value="" 
        error="Email is required"
        ariaLabel="Email input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedBy', 'email-error');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
  
  // ✅ Must Pass: Success state
  test('shows success state when valid', () => {
    render(
      <Input 
        value="valid@email.com" 
        success={true}
        ariaLabel="Email input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input.parentElement).toHaveClass('border-green-500');
  });
  
  // ✅ Must Pass: Required field indication
  test('indicates required fields properly', () => {
    render(
      <Input 
        value="" 
        required
        ariaLabel="Email input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  });
});
```

### **2.2 Business Logic Testing**

#### **✅ PASSING CRITERIA - State Management**

**Zustand Store Tests:**
```typescript
describe('User Store - Authentication State', () => {
  // ✅ Must Pass: Initial state
  test('has correct initial state', () => {
    const { result } = renderHook(() => useUserStore());
    
    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.permissions).toEqual([]);
  });
  
  // ✅ Must Pass: Login functionality
  test('handles user login correctly', () => {
    const { result } = renderHook(() => useUserStore());
    const mockUser = { id: '1', email: 'test@example.com' };
    
    act(() => {
      result.current.login(mockUser);
    });
    
    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  // ✅ Must Pass: Permission checking
  test('correctly checks user permissions', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.setPermissions(['read:tasks', 'write:tasks']);
    });
    
    expect(result.current.hasPermission('read:tasks')).toBe(true);
    expect(result.current.hasPermission('admin:users')).toBe(false);
  });
  
  // ✅ Must Pass: Logout cleanup
  test('cleans up state on logout', () => {
    const { result } = renderHook(() => useUserStore());
    
    // First login
    act(() => {
      result.current.login({ id: '1', email: 'test@example.com' });
    });
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.permissions).toEqual([]);
  });
});
```

### **2.3 API Client Testing**

#### **✅ PASSING CRITERIA - HTTP Requests**

**SBA SDK Tests:**
```typescript
describe('SBA SDK - API Integration', () => {
  // ✅ Must Pass: Successful agent fetch
  test('fetches agents successfully', async () => {
    const mockAgents = [
      { id: '1', name: 'Test Agent', status: 'active' }
    ];
    
    server.use(
      rest.get('/api/agents', (req, res, ctx) => {
        return res(ctx.json(mockAgents));
      })
    );
    
    const agents = await sbaClient.getAgents('tenant-1');
    expect(agents).toEqual(mockAgents);
  });
  
  // ✅ Must Pass: Error handling
  test('handles API errors appropriately', async () => {
    server.use(
      rest.get('/api/agents', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      })
    );
    
    await expect(sbaClient.getAgents('tenant-1'))
      .rejects
      .toThrow('Internal server error');
  });
  
  // ✅ Must Pass: Request headers
  test('includes proper authentication headers', async () => {
    const token = 'test-token-123';
    setAuthToken(token);
    
    let capturedRequest: any;
    server.use(
      rest.get('/api/agents', (req, res, ctx) => {
        capturedRequest = req;
        return res(ctx.json([]));
      })
    );
    
    await sbaClient.getAgents('tenant-1');
    expect(capturedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });
  
  // ✅ Must Pass: Retry mechanism
  test('retries failed requests', async () => {
    let attemptCount = 0;
    
    server.use(
      rest.get('/api/agents', (req, res, ctx) => {
        attemptCount++;
        if (attemptCount < 3) {
          return res(ctx.status(503)); // Service unavailable
        }
        return res(ctx.json([{ id: '1', name: 'Agent' }]));
      })
    );
    
    const agents = await sbaClient.getAgents('tenant-1');
    expect(agents).toHaveLength(1);
    expect(attemptCount).toBe(3);
  });
});
```

---

## **3. INTEGRATION TESTING CRITERIA - SYSTEM LEVEL**

### **3.1 Component Integration Testing**

#### **✅ PASSING CRITERIA - Feature Integration**

**Dashboard Integration Tests:**
```typescript
describe('Dashboard Feature - Full Integration', () => {
  // ✅ Must Pass: Data loading integration
  test('loads and displays dashboard data correctly', async () => {
    const mockData = {
      stats: { totalTasks: 42, completedTasks: 30 },
      recentTasks: [
        { id: '1', title: 'Task 1', status: 'completed' },
        { id: '2', title: 'Task 2', status: 'pending' }
      ]
    };
    
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.json(mockData));
      })
    );
    
    render(<Dashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });
  
  // ✅ Must Pass: User interaction integration
  test('handles user interactions across components', async () => {
    const user = userEvent.setup();
    
    render(<Dashboard />);
    
    // Click on task filter
    const filterButton = screen.getByRole('button', { name: /filter tasks/i });
    await user.click(filterButton);
    
    // Select filter option
    const completedFilter = screen.getByRole('checkbox', { name: /completed/i });
    await user.click(completedFilter);
    
    // Verify filter applied
    await waitFor(() => {
      expect(screen.getByText('Showing completed tasks')).toBeInTheDocument();
    });
  });
  
  // ✅ Must Pass: Error state integration
  test('handles errors gracefully across components', async () => {
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Failed to load' }));
      })
    );
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
    });
  });
});
```

### **3.2 Real-time Features Testing**

#### **✅ PASSING CRITERIA - WebSocket Integration**

**WebSocket Connection Tests:**
```typescript
describe('Real-time Features - WebSocket Integration', () => {
  // ✅ Must Pass: Connection establishment
  test('establishes WebSocket connection successfully', async () => {
    const mockServer = new WS('ws://localhost:8080');
    
    render(<AgentConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
    
    mockServer.close();
  });
  
  // ✅ Must Pass: Message handling
  test('receives and processes real-time messages', async () => {
    const mockServer = new WS('ws://localhost:8080');
    
    render(<AgentConsole />);
    
    // Send mock message
    await mockServer.connected;
    mockServer.send(JSON.stringify({
      type: 'agent_event',
      data: { message: 'New task created' }
    }));
    
    await waitFor(() => {
      expect(screen.getByText('New task created')).toBeInTheDocument();
    });
    
    mockServer.close();
  });
  
  // ✅ Must Pass: Reconnection logic
  test('handles connection drops and reconnects', async () => {
    const mockServer = new WS('ws://localhost:8080');
    
    render(<AgentConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
    
    // Simulate connection drop
    mockServer.close();
    
    await waitFor(() => {
      expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
    });
    
    // Reconnect
    const newMockServer = new WS('ws://localhost:8080');
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
    
    newMockServer.close();
  });
});
```

---

## **4. END-TO-END TESTING CRITERIA - USER JOURNEYS**

### **4.1 Critical User Flows**

#### **✅ PASSING CRITERIA - Authentication Flow**

**Complete Login Journey:**
```typescript
test.describe('Authentication Flow - E2E', () => {
  // ✅ Must Pass: Successful login
  test('user can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });
  
  // ✅ Must Pass: Login error handling
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.getByRole('alert')).toContainText(/invalid credentials/i);
    
    // Verify stayed on login page
    expect(page.url()).toContain('/login');
  });
  
  // ✅ Must Pass: Logout functionality
  test('user can log out successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Logout
    await page.click('button[aria-label="Logout"]');
    
    // Verify redirect to login
    await page.waitForURL('/login');
    
    // Verify cannot access protected route
    await page.goto('/dashboard');
    await page.waitForURL('/login');
  });
});
```

#### **✅ PASSING CRITERIA - Agent Console Flow**

**Agent Interaction Journey:**
```typescript
test.describe('Agent Console Flow - E2E', () => {
  // ✅ Must Pass: Agent selection and interaction
  test('user can select agent and send message', async ({ page }) => {
    // Login and navigate to agent console
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    await page.click('nav a[href="/agui"]');
    await page.waitForURL('/agui');
    
    // Select agent
    await page.click('button[aria-label="Select agent"]');
    await page.click('option[value="agent-1"]');
    
    // Send message
    await page.fill('textarea[aria-label="Message input"]', 'Hello, can you help me?');
    await page.click('button[aria-label="Send message"]');
    
    // Verify message sent
    await expect(page.getByText('Hello, can you help me?')).toBeVisible();
    
    // Wait for agent response
    await expect(page.getByRole('log')).toContainText(/agent response/i, { timeout: 10000 });
  });
  
  // ✅ Must Pass: Tool execution
  test('agent can execute tools and show results', async ({ page }) => {
    // Navigate to agent console and select agent
    await page.goto('/agui');
    await page.click('button[aria-label="Select agent"]');
    await page.click('option[value="agent-1"]');
    
    // Request tool execution
    await page.fill('textarea[aria-label="Message input"]', 'Create a task for me');
    await page.click('button[aria-label="Send message"]');
    
    // Verify tool execution
    await expect(page.getByText('Creating task...')).toBeVisible();
    await expect(page.getByRole('status')).toBeVisible(); // Loading indicator
    
    // Verify result
    await expect(page.getByText('Task created successfully')).toBeVisible({ timeout: 10000 });
  });
  
  // ✅ Must Pass: Error handling in chat
  test('handles errors during agent interaction', async ({ page }) => {
    await page.goto('/agui');
    
    // Simulate network error
    await page.route('**/api/agent/**', (route) => {
      route.abort('failed');
    });
    
    // Try to send message
    await page.fill('textarea[aria-label="Message input"]', 'Test message');
    await page.click('button[aria-label="Send message"]');
    
    // Verify error message
    await expect(page.getByRole('alert')).toContainText(/failed to send message/i);
    
    // Verify retry option
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
  });
});
```

### **4.2 Cross-Browser Testing**

#### **✅ PASSING CRITERIA - Browser Compatibility**

**Multi-Browser Test Matrix:**
```typescript
// playwright.config.ts
const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
};

test.describe('Cross-Browser Compatibility', () => {
  // ✅ Must Pass: Chrome compatibility
  test('works correctly in Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    
    await page.goto('/dashboard');
    
    // Verify all interactive elements work
    await page.click('button[aria-label="Create new task"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Verify CSS Grid/Flexbox layouts
    const gridContainer = page.locator('.dashboard-grid');
    const gridStyles = await gridContainer.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    expect(gridStyles).toBe('grid');
  });
  
  // ✅ Must Pass: Firefox compatibility
  test('works correctly in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    
    await page.goto('/dashboard');
    
    // Verify CSS custom properties work
    const header = page.locator('header');
    const headerColor = await header.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('--header-bg');
    });
    expect(headerColor).toBeTruthy();
  });
  
  // ✅ Must Pass: Safari compatibility
  test('works correctly in Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    
    await page.goto('/dashboard');
    
    // Verify backdrop-filter works
    const modal = page.locator('.modal-backdrop');
    const backdropFilter = await modal.evaluate((el) => {
      return window.getComputedStyle(el).backdropFilter;
    });
    expect(backdropFilter).toContain('blur');
  });
});
```

---

## **5. ACCESSIBILITY TESTING CRITERIA - WCAG 2.1 AA**

### **5.1 Automated Accessibility Testing**

#### **✅ PASSING CRITERIA - axe-core Tests**

**Automated Accessibility Scans:**
```typescript
test.describe('Automated Accessibility - axe-core', () => {
  // ✅ Must Pass: No violations on main pages
  test('dashboard has no accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Inject axe-core
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js'
    });
    
    // Run accessibility scan
    const violations = await page.evaluate(async () => {
      const results = await axe.run();
      return results.violations;
    });
    
    // Report violations
    if (violations.length > 0) {
      console.error('Accessibility violations:', violations);
    }
    
    expect(violations.length).toBe(0);
  });
  
  // ✅ Must Pass: Color contrast compliance
  test('meets color contrast requirements', async ({ page }) => {
    await page.goto('/dashboard');
    
    const contrastViolations = await page.evaluate(async () => {
      const results = await axe.run(document, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      return results.violations.filter(v => v.id === 'color-contrast');
    });
    
    expect(contrastViolations.length).toBe(0);
  });
  
  // ✅ Must Pass: Keyboard navigation
  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/dashboard');
    
    const keyboardViolations = await page.evaluate(async () => {
      const results = await axe.run(document, {
        rules: {
          'keyboard': { enabled: true },
          'focusable-controls': { enabled: true }
        }
      });
      return results.violations;
    });
    
    expect(keyboardViolations.length).toBe(0);
  });
});
```

### **5.2 Manual Accessibility Testing**

#### **✅ PASSING CRITERIA - Screen Reader Testing**

**NVDA/JAWS Screen Reader Tests:**
```typescript
test.describe('Screen Reader Compatibility', () => {
  // ✅ Must Pass: Proper heading structure
  test('has logical heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard');
    
    const headings = await page.evaluate(() => {
      const h1 = document.querySelectorAll('h1').length;
      const h2 = document.querySelectorAll('h2').length;
      const h3 = document.querySelectorAll('h3').length;
      
      // Should have exactly one h1
      const hasSingleH1 = h1 === 1;
      
      // Should have logical heading order
      const headingsInOrder = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
        .every((heading, index, arr) => {
          if (index === 0) return true;
          const prevLevel = parseInt(arr[index - 1].tagName.charAt(1));
          const currLevel = parseInt(heading.tagName.charAt(1));
          return currLevel <= prevLevel + 1;
        });
      
      return { hasSingleH1, headingsInOrder, h1, h2, h3 };
    });
    
    expect(headings.hasSingleH1).toBe(true);
    expect(headings.headingsInOrder).toBe(true);
    expect(headings.h1).toBeGreaterThan(0);
  });
  
  // ✅ Must Pass: Form labels and instructions
  test('forms have proper labels and instructions', async ({ page }) => {
    await page.goto('/tasks/new');
    
    const formElements = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      
      return inputs.map(input => ({
        hasLabel: input.id ? document.querySelector(`label[for="${input.id}"]`) !== null : false,
        hasAriaLabel: input.hasAttribute('aria-label'),
        hasAriaDescribedBy: input.hasAttribute('aria-describedby'),
        isRequired: input.hasAttribute('required'),
        hasAriaRequired: input.getAttribute('aria-required') === 'true'
      }));
    });
    
    // All form elements should have labels
    const allHaveLabels = formElements.every(el => el.hasLabel || el.hasAriaLabel);
    expect(allHaveLabels).toBe(true);
    
    // Required fields should be properly marked
    const requiredFields = formElements.filter(el => el.isRequired);
    const allRequiredHaveAria = requiredFields.every(el => el.hasAriaRequired);
    expect(allRequiredHaveAria).toBe(true);
  });
});
```

---

## **6. PERFORMANCE TESTING CRITERIA - CORE WEB VITALS**

### **6.1 Loading Performance**

#### **✅ PASSING CRITERIA - Lighthouse Metrics**

**Core Web Vitals Targets:**
```typescript
const PERFORMANCE_TARGETS = {
  FIRST_CONTENTFUL_PAINT: 1500,      // < 1.5s (Good)
  LARGEST_CONTENTFUL_PAINT: 2500,    // < 2.5s (Good)
  FIRST_INPUT_DELAY: 100,            // < 100ms (Good)
  CUMULATIVE_LAYOUT_SHIFT: 0.1,      // < 0.1 (Good)
  SPEED_INDEX: 3400,                 // < 3.4s (Good)
  TOTAL_BLOCKING_TIME: 200,          // < 200ms (Good)
};

test.describe('Performance Metrics - Core Web Vitals', () => {
  // ✅ Must Pass: First Contentful Paint
  test('achieves target First Contentful Paint', async ({ page }) => {
    await page.goto('/dashboard');
    
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          resolve({ fcp: fcp?.startTime });
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_TARGETS.FIRST_CONTENTFUL_PAINT);
  });
  
  // ✅ Must Pass: Largest Contentful Paint
  test('achieves target Largest Contentful Paint', async ({ page }) => {
    await page.goto('/dashboard');
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry?.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(PERFORMANCE_TARGETS.LARGEST_CONTENTFUL_PAINT);
  });
  
  // ✅ Must Pass: Cumulative Layout Shift
  test('maintains low Cumulative Layout Shift', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for all images and fonts to load
    await page.waitForLoadState('networkidle');
    
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after a delay to capture all shifts
        setTimeout(() => resolve(clsValue), 1000);
      });
    });
    
    expect(cls).toBeLessThan(PERFORMANCE_TARGETS.CUMULATIVE_LAYOUT_SHIFT);
  });
});
```

### **6.2 Runtime Performance**

#### **✅ PASSING CRITERIA - Memory & CPU Usage**

**Memory Leak Detection:**
```typescript
test.describe('Runtime Performance - Memory Management', () => {
  // ✅ Must Pass: No memory leaks on navigation
  test('does not leak memory on route navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Navigate between pages multiple times
    for (let i = 0; i < 10; i++) {
      await page.goto('/tasks');
      await page.goto('/documents');
      await page.goto('/dashboard');
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if (window.gc) {
        window.gc();
      }
    });
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Memory should not increase by more than 10MB
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
  
  // ✅ Must Pass: Smooth animations (60 FPS)
  test('maintains 60 FPS during animations', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Start performance measurement
    await page.evaluate(() => {
      window.frameCount = 0;
      window.startTime = performance.now();
      
      const countFrames = () => {
        window.frameCount++;
        if (performance.now() - window.startTime < 1000) {
          requestAnimationFrame(countFrames);
        }
      };
      
      requestAnimationFrame(countFrames);
    });
    
    // Trigger animation
    await page.click('button[aria-label="Toggle sidebar"]');
    
    // Wait for measurement to complete
    await page.waitForTimeout(1000);
    
    const frameData = await page.evaluate(() => ({
      frameCount: window.frameCount,
      duration: performance.now() - window.startTime
    }));
    
    const fps = frameData.frameCount / (frameData.duration / 1000);
    expect(fps).toBeGreaterThan(55); // Allow small margin below 60 FPS
  });
});
```

---

## **7. SECURITY TESTING CRITERIA - ENTERPRISE GRADE**

### **7.1 Authentication Security**

#### **✅ PASSING CRITERIA - Auth Security**

**JWT Token Security:**
```typescript
test.describe('Authentication Security - Token Management', () => {
  // ✅ Must Pass: Token storage security
  test('stores tokens securely without XSS vulnerability', async ({ page }) => {
    await page.goto('/login');
    
    // Login successfully
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Check that token is not accessible via XSS
    const tokenFromWindow = await page.evaluate(() => {
      // Try to access token from window object
      return (window as any).accessToken || 
             (window as any).localStorage.getItem('accessToken') ||
             (window as any).sessionStorage.getItem('accessToken');
    });
    
    // Token should not be directly accessible
    expect(tokenFromWindow).toBeFalsy();
  });
  
  // ✅ Must Pass: Token refresh mechanism
  test('automatically refreshes expired tokens', async ({ page }) => {
    await page.goto('/login');
    
    // Mock token expiration
    await page.route('**/api/**', async (route, request) => {
      // First request returns 401 (unauthorized)
      if (request.url().includes('/api/dashboard') && !request.url().includes('retry')) {
        return route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Token expired' })
        });
      }
      
      // Token refresh endpoint
      if (request.url().includes('/api/auth/refresh')) {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ 
            accessToken: 'new-token',
            refreshToken: 'new-refresh-token'
          })
        });
      }
      
      // Retry original request
      return route.continue({ url: request.url() + '?retry=1' });
    });
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to trigger API call
    await page.goto('/tasks');
    
    // Should not show login page (token refreshed successfully)
    expect(page.url()).not.toContain('/login');
  });
  
  // ✅ Must Pass: Session timeout
  test('handles session timeout appropriately', async ({ page }) => {
    await page.goto('/login');
    
    // Login with short-lived token
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Wait for token expiration (mock)
    await page.waitForTimeout(2000);
    
    // Try to access protected resource
    await page.reload();
    
    // Should redirect to login
    await page.waitForURL('/login');
    
    // Should show appropriate message
    await expect(page.getByRole('alert')).toContainText(/session expired/i);
  });
});
```

### **7.2 Input Validation Security**

#### **✅ PASSING CRITERIA - XSS Prevention**

**Input Sanitization Tests:**
```typescript
test.describe('Input Security - XSS Prevention', () => {
  // ✅ Must Pass: Script injection prevention
  test('prevents script injection in form inputs', async ({ page }) => {
    await page.goto('/tasks/new');
    
    // Try to inject script
    const maliciousInput = '<script>alert("XSS")</script>';
    await page.fill('input[name="title"]', maliciousInput);
    await page.click('button[type="submit"]');
    
    // Wait for submission
    await page.waitForTimeout(1000);
    
    // Check that script is not executed
    const alertDialog = page.locator('dialog');
    expect(await alertDialog.count()).toBe(0);
    
    // Check that input is properly escaped in DOM
    const displayedValue = await page.locator('input[name="title"]').inputValue();
    expect(displayedValue).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });
  
  // ✅ Must Pass: SQL injection prevention
  test('prevents SQL injection attempts', async ({ page }) => {
    await page.goto('/login');
    
    // Try SQL injection
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', "' OR '1'='1");
    await page.click('button[type="submit"]');
    
    // Should not grant access
    await expect(page.getByRole('alert')).toContainText(/invalid credentials/i);
    expect(page.url()).toContain('/login');
  });
  
  // ✅ Must Pass: HTML entity handling
  test('handles HTML entities correctly', async ({ page }) => {
    await page.goto('/tasks/new');
    
    // Input with HTML entities
    await page.fill('input[name="title"]', 'Task &amp; More &lt;script&gt;');
    await page.click('button[type="submit"]');
    
    // Should preserve entities without execution
    await page.waitForURL('/tasks/**');
    
    const taskTitle = await page.locator('h1').textContent();
    expect(taskTitle).toContain('Task &amp; More &lt;script&gt;');
  });
});
```

---

## **8. VERIFICATION CHECKLIST - PRE-LAUNCH**

### **8.1 Pre-Deployment Verification**

#### **✅ MANDATORY CHECKS - All Must Pass**

**Final Verification Checklist:**
```markdown
## 🚀 PRE-LAUNCH VERIFICATION CHECKLIST

### ✅ CODE QUALITY (100% Required)
- [ ] All unit tests passing (85%+ coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] No console.log statements in production code
- [ ] All TODO/FIXME comments resolved

### ✅ UI/UX QUALITY (100% Required)
- [ ] Design system consistently applied
- [ ] All interactive elements have hover/focus states
- [ ] Loading states implemented for all async operations
- [ ] Error states implemented for all failure scenarios
- [ ] Empty states implemented for zero-data scenarios
- [ ] Responsive design tested on all breakpoints
- [ ] Animations are smooth (60 FPS)

### ✅ ACCESSIBILITY (100% Required)
- [ ] WCAG 2.1 Level AA compliance verified
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] Screen reader testing completed
- [ ] Color contrast ratios verified
- [ ] Semantic HTML structure validated
- [ ] ARIA labels and roles properly implemented

### ✅ PERFORMANCE (100% Required)
- [ ] Core Web Vitals in "Good" range
- [ ] Lighthouse performance score > 90
- [ ] Bundle size within budget (< 500KB main)
- [ ] No memory leaks detected
- [ ] Images optimized with proper formats
- [ ] Code splitting implemented
- [ ] Caching strategies configured

### ✅ SECURITY (100% Required)
- [ ] Authentication flow secure
- [ ] Authorization properly enforced
- [ ] Input validation comprehensive
- [ ] XSS prevention verified
- [ ] CSRF protection implemented
- [ ] No sensitive data in client code
- [ ] Security headers configured

### ✅ CROSS-BROWSER (100% Required)
- [ ] Chrome (latest 2 versions) ✅
- [ ] Firefox (latest 2 versions) ✅
- [ ] Safari (latest 2 versions) ✅
- [ ] Edge (latest 2 versions) ✅
- [ ] Mobile Chrome (Android) ✅
- [ ] Mobile Safari (iOS) ✅

### ✅ TESTING COVERAGE (100% Required)
- [ ] Unit test coverage > 85%
- [ ] Integration test coverage > 80%
- [ ] Critical user paths covered 100%
- [ ] Error handling paths tested
- [ ] Edge cases documented and tested
- [ ] Performance benchmarks established
- [ ] Security test cases verified

### ✅ DEPLOYMENT READINESS (100% Required)
- [ ] Environment variables configured
- [ ] Build process optimized
- [ ] Docker image built and tested
- [ ] Health check endpoints working
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented
- [ ] Database migrations tested

### ✅ DOCUMENTATION (100% Required)
- [ ] API documentation complete
- [ ] User documentation updated
- [ ] Deployment guide created
- [ ] Troubleshooting guide available
- [ ] Change log maintained
- [ ] Architecture documentation current
- [ ] Testing documentation complete
```

### **8.2 Sign-off Requirements**

#### **✅ STAKEHOLDER APPROVAL MATRIX**

| Role | Responsibility | Approval Required |
|------|----------------|-------------------|
| **Tech Lead** | Code quality, architecture | ✅ MANDATORY |
| **QA Lead** | Testing completeness | ✅ MANDATORY |
| **UX Designer** | UI/UX consistency | ✅ MANDATORY |
| **Security Lead** | Security compliance | ✅ MANDATORY |
| **Product Owner** | Feature completeness | ✅ MANDATORY |
| **DevOps Engineer** | Deployment readiness | ✅ MANDATORY |

---

## **9. POST-LAUNCH MONITORING**

### **9.1 Real-time Monitoring**

#### **✅ LIVE MONITORING CHECKLIST**

**First 24 Hours Post-Launch:**
```markdown
## 📊 POST-LAUNCH MONITORING (24 Hours)

### 🚨 CRITICAL MONITORING (Every 15 minutes)
- [ ] Application uptime > 99.9%
- [ ] Error rate < 1%
- [ ] Response time < 500ms (p95)
- [ ] Database connection healthy
- [ ] External API dependencies responsive
- [ ] Authentication service operational
- [ ] Real-time features functional

### 📈 PERFORMANCE MONITORING (Every hour)
- [ ] Core Web Vitals remain in "Good" range
- [ ] Memory usage stable (no leaks)
- [ ] CPU usage < 70% average
- [ ] Disk space usage < 80%
- [ ] Network throughput normal
- [ ] CDN performance optimal

### 👥 USER EXPERIENCE MONITORING (Every 2 hours)
- [ ] User registration working
- [ ] Login/logout functional
- [ ] Core workflows operational
- [ ] File uploads/downloads working
- [ ] Real-time notifications delivered
- [ ] Mobile experience smooth

### 🔒 SECURITY MONITORING (Continuous)
- [ ] No unusual authentication patterns
- [ ] No suspicious API activity
- [ ] Rate limiting working properly
- [ ] No injection attempts detected
- [ ] SSL certificates valid
- [ ] Security headers present

### 📋 ESCALATION PROCEDURES
**🟢 Normal:** Continue monitoring
**🟡 Warning:** Investigate within 30 minutes
**🔴 Critical:** Immediate escalation required
```

---

## **10. SUCCESS METRICS & KPIs**

### **10.1 Launch Success Criteria**

#### **✅ SUCCESS METRICS - Post-Launch**

**Week 1 Targets:**
- **Uptime:** > 99.9%
- **Error Rate:** < 0.5%
- **User Satisfaction:** > 4.5/5.0
- **Performance:** All Core Web Vitals in "Good"
- **Security:** Zero critical vulnerabilities

**Month 1 Targets:**
- **User Adoption:** > 80% of target users
- **Feature Usage:** > 70% feature adoption rate
- **Support Tickets:** < 5% of active users
- **Performance:** Maintain Week 1 performance
- **Stability:** Zero major incidents

---

## **11. CONCLUSION**

Testing & Verification Checklist ini memastikan `apps/app` memenuhi standar kualitas tertinggi sebelum launch dengan:

- ✅ **85%+ test coverage** dengan comprehensive test suite
- ✅ **WCAG 2.1 Level AA** accessibility compliance
- ✅ **Core Web Vitals** dalam "Good" range
- ✅ **Zero critical security vulnerabilities**
- ✅ **Cross-browser compatibility** terjamin
- ✅ **Enterprise-grade reliability** dan performance

Dengan memenuhi semua kriteria ini, aplikasi siap untuk production deployment dengan confidence yang tinggi.

---

**Document Status:** ✅ Approved for Implementation  
**Version:** 1.0 Comprehensive  
**Last Updated:** December 2025  
**Next Review:**