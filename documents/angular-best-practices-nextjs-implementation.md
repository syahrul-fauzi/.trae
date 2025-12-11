# Angular Best Practices Implementation in Next.js

## Introduction

This document outlines how to implement Angular-inspired best practices in a Next.js application, focusing on maintainability, scalability, and developer experience. While Next.js and Angular have different architectures, many Angular patterns can be successfully adapted to improve code organization and quality.

## Core Principles

### 1. Domain-Driven Design (DDD)

**Angular Approach**: Angular applications typically organize code by feature modules, each containing components, services, and related functionality.

**Next.js Implementation**:
```typescript
// domains/auth/auth.module.ts (Angular-style organization)
// apps/app/src/domains/auth/index.ts (Next.js implementation)

export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
export * from './utils';

// Create a domain barrel export
export { AuthProvider } from './components/AuthProvider';
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';
export type { User, AuthState } from './types/auth.types';
```

### 2. Separation of Concerns

**Angular Approach**: Clear separation between components, services, and directives.

**Next.js Implementation**:
```typescript
// Component - Presentational only
// apps/app/src/domains/analytics/components/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function MetricCard({ title, value, trend, className }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(value)}</div>
        {trend && <TrendIndicator trend={trend} />}
      </CardContent>
    </Card>
  );
}

// Service - Business logic
// apps/app/src/domains/analytics/services/analyticsService.ts
export const analyticsService = {
  async getMetrics(dateRange: DateRange): Promise<AnalyticsMetrics> {
    const response = await apiClient.get('/analytics/metrics', {
      params: { startDate: dateRange.start, endDate: dateRange.end }
    });
    return this.processMetrics(response.data);
  },
  
  processMetrics(rawData: any): AnalyticsMetrics {
    // Business logic for processing metrics
    return {
      overview: this.calculateOverviewMetrics(rawData),
      trends: this.calculateTrends(rawData),
      insights: this.generateInsights(rawData)
    };
  }
};

// Hook - State management and side effects
// apps/app/src/domains/analytics/hooks/useAnalytics.ts
export function useAnalytics(dateRange: DateRange) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getMetrics(dateRange);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);
  
  return { metrics, loading, error, refetch: loadMetrics };
}
```

## Component Architecture

### 1. Smart vs Dumb Components

**Angular Approach**: Container components (smart) and presentational components (dumb).

**Next.js Implementation**:
```typescript
// Smart Component (Container)
// apps/app/src/domains/workspace/components/WorkspaceManager.tsx
export function WorkspaceManager() {
  const { currentWorkspace, workspaces, createWorkspace, switchWorkspace } = useWorkspaces();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const handleCreateWorkspace = async (data: CreateWorkspaceData) => {
    try {
      await createWorkspace(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <WorkspaceHeader 
        currentWorkspace={currentWorkspace}
        onCreateNew={() => setShowCreateDialog(true)}
      />
      <WorkspaceList 
        workspaces={workspaces}
        currentWorkspaceId={currentWorkspace?.id}
        onSwitchWorkspace={switchWorkspace}
      />
      <CreateWorkspaceDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
}

// Dumb Component (Presentational)
// apps/app/src/domains/workspace/components/WorkspaceList.tsx
interface WorkspaceListProps {
  workspaces: Workspace[];
  currentWorkspaceId?: string;
  onSwitchWorkspace: (workspace: Workspace) => void;
}

export function WorkspaceList({ workspaces, currentWorkspaceId, onSwitchWorkspace }: WorkspaceListProps) {
  return (
    <div className="space-y-2">
      {workspaces.map(workspace => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          isActive={workspace.id === currentWorkspaceId}
          onClick={() => onSwitchWorkspace(workspace)}
        />
      ))}
    </div>
  );
}
```

### 2. Component Composition

**Angular Approach**: Content projection and component composition.

**Next.js Implementation**:
```typescript
// Layout Component
// apps/app/src/shared/components/layouts/CardLayout.tsx
interface CardLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CardLayout({ header, footer, children, className }: CardLayoutProps) {
  return (
    <Card className={className}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

// Usage with composition
// apps/app/src/domains/analytics/components/AnalyticsWidget.tsx
export function AnalyticsWidget({ title, data }: AnalyticsWidgetProps) {
  return (
    <CardLayout
      header={
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <AnalyticsWidgetActions />
        </div>
      }
      footer={
        <Button variant="ghost" size="sm" className="w-full">
          View Details
        </Button>
      }
    >
      <AnalyticsChart data={data} />
    </CardLayout>
  );
}
```

### 3. Content Projection Patterns

```typescript
// Modal Component with Content Projection
// apps/app/src/shared/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={cn("relative bg-white rounded-lg shadow-xl", getModalSize(size))}>
        {title && (
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t bg-gray-50">{footer}</div>}
      </div>
    </div>
  );
}

// Usage
export function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      footer={
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      }
    >
      <UserProfileForm user={user} />
    </Modal>
  );
}
```

## Dependency Injection Pattern

**Angular Approach**: Built-in dependency injection system.

**Next.js Implementation**:
```typescript
// Service Registry
// apps/app/src/shared/services/serviceRegistry.ts
interface ServiceRegistry {
  [key: string]: any;
}

class ServiceContainer {
  private services: ServiceRegistry = {};
  
  register<T>(name: string, service: T): void {
    this.services[name] = service;
  }
  
  resolve<T>(name: string): T {
    const service = this.services[name];
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }
    return service;
  }
  
  clear(): void {
    this.services = {};
  }
}

export const serviceContainer = new ServiceContainer();

// Service Factory
// apps/app/src/shared/services/serviceFactory.ts
export function createApiClient(): ApiClient {
  return new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    retries: 3,
  });
}

export function createAuthService(apiClient: ApiClient): AuthService {
  return new AuthService(apiClient);
}

// Dependency Provider
// apps/app/src/shared/providers/ServiceProvider.tsx
interface ServiceProviderProps {
  children: React.ReactNode;
  services?: Partial<ServiceRegistry>;
}

export function ServiceProvider({ children, services = {} }: ServiceProviderProps) {
  useEffect(() => {
    // Register default services
    const apiClient = createApiClient();
    serviceContainer.register('apiClient', apiClient);
    serviceContainer.register('authService', createAuthService(apiClient));
    
    // Register custom services
    Object.entries(services).forEach(([name, service]) => {
      serviceContainer.register(name, service);
    });
    
    return () => {
      serviceContainer.clear();
    };
  }, [services]);
  
  return <>{children}</>;
}

// Hook for accessing services
// apps/app/src/shared/hooks/useService.ts
export function useService<T>(name: string): T {
  return useMemo(() => serviceContainer.resolve<T>(name), [name]);
}

// Usage
export function UserProfile({ userId }: UserProfileProps) {
  const authService = useService<AuthService>('authService');
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    authService.getUser(userId).then(setUser);
  }, [userId, authService]);
  
  return user ? <UserCard user={user} /> : <LoadingSpinner />;
}
```

## Reactive Programming Patterns

### 1. Observable Pattern

**Angular Approach**: RxJS Observables.

**Next.js Implementation**:
```typescript
// Simple Observable Implementation
// apps/app/src/shared/lib/observable.ts
interface Observer<T> {
  next: (value: T) => void;
  error?: (error: any) => void;
  complete?: () => void;
}

type Unsubscribe = () => void;

export class Observable<T> {
  private observers: Observer<T>[] = [];
  
  constructor(private producer?: (observer: Observer<T>) => Unsubscribe | void) {}
  
  subscribe(observer: Observer<T>): Unsubscribe {
    this.observers.push(observer);
    
    let unsubscribe: Unsubscribe | void;
    if (this.producer) {
      unsubscribe = this.producer(observer);
    }
    
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }
  
  next(value: T): void {
    this.observers.forEach(observer => observer.next(value));
  }
  
  error(error: any): void {
    this.observers.forEach(observer => observer.error?.(error));
  }
  
  complete(): void {
    this.observers.forEach(observer => observer.complete?.());
  }
}

// Usage in Service
// apps/app/src/domains/analytics/services/realtimeAnalyticsService.ts
export class RealtimeAnalyticsService {
  private metricsSubject = new Observable<AnalyticsMetrics>();
  
  subscribeToMetrics(observer: Observer<AnalyticsMetrics>): Unsubscribe {
    return this.metricsSubject.subscribe(observer);
  }
  
  updateMetrics(metrics: AnalyticsMetrics): void {
    this.metricsSubject.next(metrics);
  }
}

// Usage in Component
export function RealtimeAnalyticsWidget() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const analyticsService = useService<RealtimeAnalyticsService>('realtimeAnalyticsService');
  
  useEffect(() => {
    const unsubscribe = analyticsService.subscribeToMetrics({
      next: (newMetrics) => setMetrics(newMetrics),
      error: (error) => console.error('Metrics error:', error)
    });
    
    return unsubscribe;
  }, [analyticsService]);
  
  return metrics ? <AnalyticsDisplay metrics={metrics} /> : <LoadingSpinner />;
}
```

### 2. State Management with RxJS-like Behavior

```typescript
// Behavior Subject-like implementation
// apps/app/src/shared/lib/state.ts
export class BehaviorSubject<T> {
  private value: T;
  private observers: Observer<T>[] = [];
  
  constructor(initialValue: T) {
    this.value = initialValue;
  }
  
  next(value: T): void {
    this.value = value;
    this.observers.forEach(observer => observer.next(value));
  }
  
  subscribe(observer: Observer<T>): Unsubscribe {
    // Send current value immediately
    observer.next(this.value);
    this.observers.push(observer);
    
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }
  
  getValue(): T {
    return this.value;
  }
}

// Global State Management
// apps/app/src/shared/store/globalStore.ts
interface GlobalState {
  user: User | null;
  workspace: Workspace | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

const initialState: GlobalState = {
  user: null,
  workspace: null,
  theme: 'light',
  sidebarCollapsed: false,
};

export class GlobalStore {
  private state = new BehaviorSubject<GlobalState>(initialState);
  
  select<K extends keyof GlobalState>(key: K): Observable<GlobalState[K]> {
    return new Observable<GlobalState[K]>(observer => {
      const unsubscribe = this.state.subscribe({
        next: (state) => observer.next(state[key])
      });
      return unsubscribe;
    });
  }
  
  setState<K extends keyof GlobalState>(key: K, value: GlobalState[K]): void {
    const currentState = this.state.getValue();
    this.state.next({ ...currentState, [key]: value });
  }
  
  getState(): GlobalState {
    return this.state.getValue();
  }
}

export const globalStore = new GlobalStore();

// Hook for using global state
// apps/app/src/shared/hooks/useGlobalState.ts
export function useGlobalState<K extends keyof GlobalState>(key: K): [
  GlobalState[K],
  (value: GlobalState[K]) => void
] {
  const [value, setValue] = useState<GlobalState[K]>(() => globalStore.getState()[key]);
  
  useEffect(() => {
    const unsubscribe = globalStore.select(key).subscribe({
      next: (newValue) => setValue(newValue)
    });
    
    return unsubscribe;
  }, [key]);
  
  const setGlobalValue = useCallback((newValue: GlobalState[K]) => {
    globalStore.setState(key, newValue);
  }, [key]);
  
  return [value, setGlobalValue];
}
```

## Module Federation Pattern

**Angular Approach**: Lazy loading and module federation.

**Next.js Implementation**:
```typescript
// Dynamic Import with Preloading
// apps/app/src/shared/lib/dynamicImport.ts
interface ModulePreloadOptions {
  prefetch?: boolean;
  preload?: boolean;
}

export function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  options: ModulePreloadOptions = {}
): () => Promise<T> {
  const { prefetch = false, preload = false } = options;
  
  let modulePromise: Promise<T> | null = null;
  
  const loadModule = async (): Promise<T> => {
    if (!modulePromise) {
      modulePromise = importFn().then(m => m.default);
    }
    return modulePromise;
  };
  
  // Preload strategies
  if (preload) {
    // Load immediately
    loadModule().catch(console.error);
  } else if (prefetch) {
    // Load when browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadModule().catch(console.error);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadModule().catch(console.error);
      }, 0);
    }
  }
  
  return loadModule;
}

// Feature Module Loading
// apps/app/src/domains/dashboard/components/DashboardWidgets.tsx
const AnalyticsWidget = dynamicImport(() => 
  import('@/domains/analytics/components/AnalyticsWidget').then(m => ({ default: m.AnalyticsWidget }))
);

const WorkspaceWidget = dynamicImport(() => 
  import('@/domains/workspace/components/WorkspaceWidget').then(m => ({ default: m.WorkspaceWidget }))
);

export function DashboardWidgets() {
  const [AnalyticsComponent, setAnalyticsComponent] = useState<React.ComponentType<any> | null>(null);
  const [WorkspaceComponent, setWorkspaceComponent] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    // Load widgets on mount
    Promise.all([
      AnalyticsWidget(),
      WorkspaceWidget()
    ]).then(([Analytics, Workspace]) => {
      setAnalyticsComponent(() => Analytics);
      setWorkspaceComponent(() => Workspace);
    });
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {AnalyticsComponent && <AnalyticsComponent />}
      {WorkspaceComponent && <WorkspaceComponent />}
    </div>
  );
}
```

## Error Handling Patterns

### 1. Global Error Boundary

```typescript
// apps/app/src/shared/components/errors/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Send to error tracking service
    errorTrackingService.captureException(error, {
      extra: errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false })} />;
    }
    
    return this.props.children;
  }
}

// Error Fallback Component
// apps/app/src/shared/components/errors/ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <div className="text-red-500">
          <AlertTriangle className="h-16 w-16 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="text-gray-600 max-w-md">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onReset}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 2. Error Handling Service

```typescript
// apps/app/src/shared/services/errorHandlingService.ts
interface ErrorContext {
  userId?: string;
  workspaceId?: string;
  route?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class ErrorHandlingService {
  private context: ErrorContext = {
    timestamp: new Date()
  };
  
  setContext(context: Partial<ErrorContext>): void {
    this.context = { ...this.context, ...context };
  }
  
  async handleError(error: Error | unknown, additionalContext?: Record<string, any>): Promise<void> {
    const errorInfo = this.processError(error);
    const fullContext = { ...this.context, ...additionalContext };
    
    console.error('Handled error:', errorInfo);
    
    // Send to external error tracking
    try {
      await this.sendToErrorTracking(errorInfo, fullContext);
    } catch (trackingError) {
      console.error('Failed to send error to tracking service:', trackingError);
    }
    
    // Show user-friendly error notification
    this.showErrorNotification(errorInfo);
  }
  
  private processError(error: Error | unknown): ProcessedError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
        type: 'javascript-error'
      };
    }
    
    if (typeof error === 'string') {
      return {
        message: error,
        type: 'string-error'
      };
    }
    
    return {
      message: 'Unknown error occurred',
      type: 'unknown-error'
    };
  }
  
  private async sendToErrorTracking(error: ProcessedError, context: Record<string, any>): Promise<void> {
    // Implementation for sending to Sentry, LogRocket, etc.
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, context })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send error to tracking service');
    }
  }
  
  private showErrorNotification(error: ProcessedError): void {
    // Implementation for showing toast notification
    toast.error(error.message || 'An unexpected error occurred');
  }
}

export const errorHandlingService = new ErrorHandlingService();
```

## Performance Optimization Patterns

### 1. Memoization Strategy

```typescript
// apps/app/src/shared/hooks/useMemoWithTTL.ts
export function useMemoWithTTL<T>(
  factory: () => T,
  dependencies: any[],
  ttl: number = 60000 // 1 minute default
): T {
  const [value, setValue] = useState<T>(() => factory());
  const [timestamp, setTimestamp] = useState(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const shouldRecalculate = now - timestamp > ttl || 
      dependencies.some((dep, i) => dep !== dependencies[i]);
    
    if (shouldRecalculate) {
      setValue(factory());
      setTimestamp(now);
    }
  }, [factory, dependencies, ttl, timestamp]);
  
  return value;
}

// Usage
export function ExpensiveComponent({ data, filter }: ExpensiveComponentProps) {
  const filteredData = useMemoWithTTL(
    () => processDataExpensively(data, filter),
    [data, filter],
    30000 // 30 seconds TTL
  );
  
  return <DataVisualization data={filteredData} />;
}
```

### 2. Virtual Scrolling for Large Lists

```typescript
// apps/app/src/shared/components/data/VirtualList.tsx
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  keyExtractor
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="overflow-auto relative"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={keyExtractor(item)} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Testing Patterns

### 1. Component Testing with Angular-like Structure

```typescript
// apps/app/src/domains/auth/components/__tests__/LoginForm.test.tsx
describe('LoginForm Component', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<NextRouter>;
  
  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn()
    } as any;
    
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    } as any;
    
    // Mock service container
    jest.spyOn(serviceContainer, 'resolve').mockImplementation((name) => {
      if (name === 'authService') return mockAuthService;
      throw new Error(`Service ${name} not mocked`);
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('should handle successful login', async () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test User' };
    mockAuthService.login.mockResolvedValueOnce({ user, token: 'mock-token' });
    
    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('should display error message on login failure', async () => {
    mockAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### 2. Service Testing

```typescript
// apps/app/src/domains/analytics/services/__tests__/analyticsService.test.ts
describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let mockApiClient: jest.Mocked<ApiClient>;
  
  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as any;
    
    analyticsService = new AnalyticsService(mockApiClient);
  });
  
  describe('getMetrics', () => {
    it('should fetch and process metrics correctly', async () => {
      const dateRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31')
      };
      
      const mockResponse = {
        data: {
          rawMetrics: [
            { date: '2024-01-01', value: 100 },
            { date: '2024-01-02', value: 150 }
          ]
        }
      };
      
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      
      const result = await analyticsService.getMetrics(dateRange);
      
      expect(mockApiClient.get).toHaveBeenCalledWith('/analytics/metrics', {
        params: { startDate: dateRange.start, endDate: dateRange.end }
      });
      
      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('trends');
      expect(result).toHaveProperty('insights');
    });
    
    it('should handle API errors gracefully', async () => {
      const dateRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31')
      };
      
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(analyticsService.getMetrics(dateRange)).rejects.toThrow('API Error');
    });
  });
});
```

## Code Quality Patterns

### 1. TypeScript Strict Mode Configuration

```json
// apps/app/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/domains/*": ["./src/domains/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. ESLint Configuration for Angular-like Patterns

```javascript
// apps/app/.eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    // Import organization
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/domains/**',
            group: 'internal',
            position: 'after'
          },
          {
            pattern: '@/features/**',
            group: 'internal',
            position: 'after'
          },
          {
            pattern: '@/shared/**',
            group: 'internal',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': 'off', // Handled by unused-imports
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    // React specific
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

## Conclusion

These Angular-inspired patterns provide a solid foundation for building maintainable, scalable Next.js applications. The key is to adapt Angular's architectural patterns to React's component-based model while leveraging Next.js's strengths in server-side rendering and routing.

The patterns covered in this document include:

1. **Domain-Driven Design** for clear code organization
2. **Component Architecture** with smart/dumb component separation
3. **Dependency Injection** for better testability
4. **Reactive Programming** for responsive UIs
5. **Error Handling** for robust applications
6. **Performance Optimization** for better user experience
7. **Testing Patterns** for reliable code
8. **Code Quality** tools and configurations

By implementing these patterns, development teams can create Next.js applications that are as well-organized and maintainable as Angular applications while benefiting from React's flexibility and Next.js's performance optimizations.