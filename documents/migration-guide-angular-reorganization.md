# Migration Guide: Angular-Inspired Reorganization

## Overview

This guide provides step-by-step instructions for migrating the current Next.js application structure to an Angular-inspired, domain-driven architecture. The migration is designed to be incremental, minimizing risk while maximizing benefits.

## Migration Strategy

### Phase 1: Foundation Setup (Week 1)

#### Step 1.1: Create New Directory Structure

```bash
# Create the new directory structure
mkdir -p apps/app/src/{domains,features,shared,infrastructure,processes,widgets}

# Create domain directories
mkdir -p apps/app/src/domains/{auth,analytics,workspace,discovery,onboarding,admin}

# Create feature directories
mkdir -p apps/app/src/features/{agui,run-controls,knowledge-base,notifications}

# Create shared directories
mkdir -p apps/app/src/shared/{components,hooks,services,types,utils,config,constants}

# Create infrastructure directories
mkdir -p apps/app/src/infrastructure/{api,supabase,websocket,monitoring}
```

#### Step 1.2: Set Up Path Aliases

Update `apps/app/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/domains/*": ["./src/domains/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/processes/*": ["./src/processes/*"],
      "@/widgets/*": ["./src/widgets/*"]
    }
  }
}
```

#### Step 1.3: Create Migration Utilities

Create `apps/app/src/shared/lib/migration.ts`:

```typescript
export interface MigrationConfig {
  from: string;
  to: string;
  dependencies?: string[];
  testFiles?: string[];
}

export class MigrationHelper {
  static async moveFile(from: string, to: string): Promise<void> {
    // Implementation for safe file moving
    console.log(`Moving ${from} to ${to}`);
  }
  
  static async updateImports(filePath: string, importMap: Record<string, string>): Promise<void> {
    // Implementation for updating import statements
    console.log(`Updating imports in ${filePath}`);
  }
  
  static validateMigration(config: MigrationConfig): boolean {
    // Implementation for validation
    return true;
  }
}
```

### Phase 2: Shared Code Migration (Week 1-2)

#### Step 2.1: Migrate Shared Components

**Current Location**: `apps/app/src/shared/ui/`
**New Location**: `apps/app/src/shared/components/`

```bash
# Create component subdirectories
mkdir -p apps/app/src/shared/components/{ui,layout,forms,data-display,feedback,navigation}

# Move UI components
mv apps/app/src/shared/ui/index.ts apps/app/src/shared/components/ui/
```

**Update component exports**:

```typescript
// apps/app/src/shared/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Table } from './Table';
export { Dialog } from './Dialog';
export { Badge } from './Badge';
export { Avatar } from './Avatar';
```

#### Step 2.2: Migrate Shared Hooks

**Current Location**: Scattered in components
**New Location**: `apps/app/src/shared/hooks/`

```bash
# Create hooks directory structure
mkdir -p apps/app/src/shared/hooks/{data,ui,utils}

# Create common hooks
```

**Create shared hooks**:

```typescript
// apps/app/src/shared/hooks/data/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/infrastructure/api/client';

export function useApi<T>(endpoint: string, options?: RequestOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<T>(endpoint, options);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
}

// apps/app/src/shared/hooks/ui/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### Step 2.3: Migrate Shared Types

**New Location**: `apps/app/src/shared/types/`

```bash
mkdir -p apps/app/src/shared/types/{api,ui,data}
```

**Create shared types**:

```typescript
// apps/app/src/shared/types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// apps/app/src/shared/types/ui.ts
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}
```

### Phase 3: Domain Migration (Week 2-3)

#### Step 3.1: Authentication Domain

**Create domain structure**:

```bash
mkdir -p apps/app/src/domains/auth/{components,hooks,services,types,utils}
```

**Migrate authentication logic**:

```typescript
// apps/app/src/domains/auth/types/auth.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// apps/app/src/domains/auth/services/authService.ts
import { apiClient } from '@/infrastructure/api/client';
import { User } from '../types/auth.types';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
  
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  async refreshToken(): Promise<string> {
    const response = await apiClient.post('/auth/refresh');
    return response.data.token;
  }
};
```

**Create auth hooks**:

```typescript
// apps/app/src/domains/auth/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, token } = await authService.login(email, password);
      setUser(user);
      localStorage.setItem('auth_token', token);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('auth_token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const user = await authService.getCurrentUser();
          setUser(user);
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}
```

#### Step 3.2: Analytics Domain

**Create analytics domain structure**:

```bash
mkdir -p apps/app/src/domains/analytics/{components,hooks,services,types,utils}
```

**Create analytics types**:

```typescript
// apps/app/src/domains/analytics/types/analytics.types.ts
export interface AnalyticsMetric {
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartDataPoint[];
  options?: ChartOptions;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
  category?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}
```

**Create analytics service**:

```typescript
// apps/app/src/domains/analytics/services/analyticsService.ts
import { apiClient } from '@/infrastructure/api/client';
import { AnalyticsMetric, AnalyticsChart, DateRange } from '../types/analytics.types';

export const analyticsService = {
  async getMetrics(dateRange: DateRange): Promise<{
    overview: AnalyticsMetric[];
    charts: AnalyticsChart[];
    detailedData: any[];
  }> {
    const response = await apiClient.get('/analytics/metrics', {
      params: { startDate: dateRange.start, endDate: dateRange.end }
    });
    return response.data;
  },
  
  async getHeatmapData(dateRange: DateRange): Promise<any> {
    const response = await apiClient.get('/analytics/heatmap', {
      params: { startDate: dateRange.start, endDate: dateRange.end }
    });
    return response.data;
  },
  
  async exportData(format: 'csv' | 'json', dateRange: DateRange): Promise<Blob> {
    const response = await apiClient.get('/analytics/export', {
      params: { format, startDate: dateRange.start, endDate: dateRange.end },
      responseType: 'blob'
    });
    return response.data;
  }
};
```

### Phase 4: Feature Migration (Week 3-4)

#### Step 4.1: AGUI Feature

**Create AGUI feature structure**:

```bash
mkdir -p apps/app/src/features/agui/{components,hooks,services,types,utils}
```

**Create AGUI types**:

```typescript
// apps/app/src/features/agui/types/agui.types.ts
export interface AGUIConfig {
  id: string;
  name: string;
  description?: string;
  settings: AGUISettings;
  components: AGUIComponent[];
}

export interface AGUISettings {
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  animations: boolean;
  shortcuts: boolean;
}

export interface AGUIComponent {
  id: string;
  type: 'chart' | 'table' | 'form' | 'metric';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}
```

**Create AGUI service**:

```typescript
// apps/app/src/features/agui/services/aguiService.ts
import { apiClient } from '@/infrastructure/api/client';
import { AGUIConfig } from '../types/agui.types';

export const aguiService = {
  async getConfig(configId: string): Promise<AGUIConfig> {
    const response = await apiClient.get(`/agui/config/${configId}`);
    return response.data;
  },
  
  async saveConfig(config: AGUIConfig): Promise<AGUIConfig> {
    const response = await apiClient.post('/agui/config', config);
    return response.data;
  },
  
  async getAvailableComponents(): Promise<any[]> {
    const response = await apiClient.get('/agui/components');
    return response.data;
  }
};
```

#### Step 4.2: Run Controls Feature

**Create run controls structure**:

```bash
mkdir -p apps/app/src/features/run-controls/{components,hooks,services,types,utils}
```

**Create run controls types**:

```typescript
// apps/app/src/features/run-controls/types/runControls.types.ts
export interface RunControl {
  id: string;
  runId: string;
  type: 'start' | 'stop' | 'pause' | 'resume';
  status: 'pending' | 'executing' | 'completed' | 'failed';
  parameters: Record<string, any>;
  result?: any;
  createdAt: Date;
  executedAt?: Date;
  completedAt?: Date;
}

export interface RunStatus {
  runId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStep?: string;
  error?: string;
  metrics: RunMetrics;
}

export interface RunMetrics {
  duration: number;
  cpuUsage: number;
  memoryUsage: number;
  stepCount: number;
  errorCount: number;
}
```

### Phase 5: Route Restructuring (Week 4-5)

#### Step 5.1: Create Route Groups

**Current structure**:
```
apps/app/src/app/
├── (authenticated)/
├── (public)/
├── (dashboard)/
├── [locale]/
```

**New structure**:
```
apps/app/src/app/
├── (auth)/                     # Authentication routes
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/                # Main dashboard
│   ├── analytics/
│   ├── insights/
│   ├── monitoring/
│   └── hub/
├── (workspace)/                # Workspace management
│   ├── [workspace]/
│   └── settings/
├── (discovery)/                # Discovery and agents
│   ├── agents/
│   ├── runs/
│   └── controls/
├── (admin)/                    # Admin panel
│   ├── users/
│   ├── tenants/
│   └── ux-heatmap/
└── (public)/                   # Public pages
    ├── about/
    ├── pricing/
    └── docs/
```

#### Step 5.2: Create Layout Components

**Create auth layout**:

```typescript
// apps/app/src/app/(auth)/layout.tsx
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

**Create dashboard layout**:

```typescript
// apps/app/src/app/(dashboard)/layout.tsx
import { ReactNode } from 'react';
import { Sidebar } from '@/domains/dashboard/components/Sidebar';
import { Header } from '@/domains/dashboard/components/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Phase 6: Testing & Validation (Week 5-6)

#### Step 6.1: Create Migration Tests

**Create migration test suite**:

```typescript
// apps/app/src/__tests__/migration/migration.test.ts
describe('Migration Tests', () => {
  describe('File Structure', () => {
    it('should have all domain directories', () => {
      const domains = ['auth', 'analytics', 'workspace', 'discovery', 'onboarding', 'admin'];
      domains.forEach(domain => {
        expect(fs.existsSync(`apps/app/src/domains/${domain}`)).toBe(true);
      });
    });
    
    it('should have all feature directories', () => {
      const features = ['agui', 'run-controls', 'knowledge-base', 'notifications'];
      features.forEach(feature => {
        expect(fs.existsSync(`apps/app/src/features/${feature}`)).toBe(true);
      });
    });
  });
  
  describe('Import Paths', () => {
    it('should resolve new import paths correctly', () => {
      const testImports = [
        '@/domains/auth/hooks/useAuth',
        '@/features/agui/services/aguiService',
        '@/shared/components/ui/Button'
      ];
      
      testImports.forEach(importPath => {
        expect(() => require(importPath)).not.toThrow();
      });
    });
  });
});
```

#### Step 6.2: Create Integration Tests

**Test domain integration**:

```typescript
// apps/app/src/domains/auth/__tests__/integration.test.ts
describe('Auth Domain Integration', () => {
  it('should authenticate user successfully', async () => {
    const { login, user, isAuthenticated } = renderHook(() => useAuth()).result.current;
    
    await act(async () => {
      await login('test@example.com', 'password123');
    });
    
    expect(user).toBeDefined();
    expect(isAuthenticated).toBe(true);
    expect(user.email).toBe('test@example.com');
  });
  
  it('should handle authentication errors', async () => {
    const { login, user, isAuthenticated } = renderHook(() => useAuth()).result.current;
    
    await expect(
      act(async () => {
        await login('test@example.com', 'wrong-password');
      })
    ).rejects.toThrow('Invalid credentials');
    
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
```

## Validation Checklist

### Structure Validation
- [ ] All domain directories created with proper subdirectories
- [ ] All feature directories created with proper subdirectories
- [ ] Shared utilities properly organized
- [ ] Infrastructure layer properly structured
- [ ] Route groups created and organized

### Code Quality Validation
- [ ] All imports updated to use new path aliases
- [ ] TypeScript compilation successful
- [ ] ESLint passes without errors
- [ ] Prettier formatting applied consistently
- [ ] No circular dependencies introduced

### Functionality Validation
- [ ] Authentication flows work correctly
- [ ] Dashboard displays properly
- [ ] Analytics data loads correctly
- [ ] Agent controls function properly
- [ ] Workspace management works
- [ ] All existing APIs continue to function

### Performance Validation
- [ ] Bundle size not significantly increased
- [ ] Page load times maintained or improved
- [ ] No memory leaks introduced
- [ ] Caching mechanisms work properly

### Testing Validation
- [ ] All existing tests pass
- [ ] New domain tests created and passing
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Test coverage maintained or improved

## Rollback Plan

### Immediate Rollback (0-1 hour)
1. **Git Revert**: `git revert HEAD` to undo the latest migration commit
2. **Branch Switch**: Switch back to pre-migration branch
3. **Dependency Restore**: Restore previous package versions if needed

### Gradual Rollback (1-4 hours)
1. **Feature Flag**: Disable new structure via feature flags
2. **Route Fallback**: Route traffic to old structure
3. **Service Isolation**: Isolate new services from production

### Complete Rollback (4-24 hours)
1. **Database Rollback**: Restore database schema if modified
2. **Infrastructure Rollback**: Revert infrastructure changes
3. **Full System Restore**: Complete system restoration from backup

## Post-Migration Optimization

### Week 7-8: Performance Optimization
- Implement lazy loading for heavy components
- Optimize bundle splitting strategy
- Add performance monitoring
- Implement advanced caching strategies

### Week 9-10: Developer Experience
- Create development tools and scripts
- Improve error handling and logging
- Add development documentation
- Create component development guidelines

### Week 11-12: Advanced Features
- Implement advanced state management patterns
- Add real-time features using WebSocket
- Implement advanced analytics and monitoring
- Create automated testing pipelines

## Conclusion

This migration guide provides a comprehensive roadmap for reorganizing the Next.js application using Angular-inspired architectural patterns. The phased approach minimizes risk while ensuring a smooth transition to the new structure.

Success depends on careful planning, thorough testing, and gradual implementation. Regular monitoring and adjustment of the migration strategy will ensure the best possible outcome for the development team and application users.